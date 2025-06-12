"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2 } from "lucide-react";

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import { DataTablePagination } from "./pagination";
import { DataTableViewOptions } from "./column-toggle";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Application,
  ApplicationStatus,
  applicationStatusSchema,
} from "@/types/client";
import { AxiosInstance } from "@/lib/axios-instance";
import { createColumns } from "./columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Filters {
  company: string;
  status: string;
}

interface DataTableProps {
  data: Application[];
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
  onStatusChange?: (id: number, status: ApplicationStatus) => void;
  onDataChange?: (data: Application[]) => void;
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export function DataTable({
  data,
  pagination,
  onPageChange,
  onLimitChange,
  isLoading = false,
  onStatusChange,
  onDataChange,
  filters,
  onFilterChange,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [hasStatusChanges, setHasStatusChanges] = useState(false);
  const [statusChanges, setStatusChanges] = useState<
    Map<number, ApplicationStatus>
  >(new Map());
  const router = useRouter();
  const { toast } = useToast();

  const columns = createColumns({
    onStatusChange: (id, status) => {
      onStatusChange?.(id, status);
      setStatusChanges((prev) => {
        const next = new Map(prev);
        next.set(id, status);
        return next;
      });
      setHasStatusChanges(true);
    },
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    pageCount: pagination.totalPages,
    manualPagination: true,
  });

  const handleSaveStatus = async () => {
    try {
      const updates = Array.from(statusChanges.entries()).map(
        ([id, status]) => ({
          id,
          status,
        }),
      );

      await AxiosInstance.put("/api/application", updates);

      setHasStatusChanges(false);
      setStatusChanges(new Map());
      router.refresh();
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch (error) {
      console.error("Error saving status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const selectedRows = table.getSelectedRowModel().rows;
      const ids = selectedRows.map((row) => row.original.id);

      await AxiosInstance.delete(`/api/application?ids=${ids.join(",")}`);

      // Update local data state
      const updatedData = data.filter((app) => !ids.includes(app.id));
      onDataChange?.(updatedData);

      setRowSelection({});
      toast({
        title: "Success",
        description: "Applications deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting applications:", error);
      toast({
        title: "Error",
        description: "Failed to delete applications",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter Companies..."
            value={filters.company}
            onChange={(event) =>
              onFilterChange({ ...filters, company: event.target.value })
            }
            className="max-w-sm"
          />
          <Select
            value={filters.status || "all"}
            onValueChange={(value) =>
              onFilterChange({
                ...filters,
                status: value === "all" ? "" : value,
              })
            }
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {applicationStatusSchema.options.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {hasStatusChanges && (
            <Button
              variant="outline"
              size="sm"
              className="text-green-600"
              onClick={handleSaveStatus}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          )}
          {Object.keys(rowSelection).length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </Button>
          )}
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pagination.limit }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        pagination={pagination}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}
