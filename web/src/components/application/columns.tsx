'use client'

import { Application, ApplicationStatus, applicationStatusSchema } from '@/types/client'
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '../ui/checkbox'
import { DataTableColumnHeader } from './column-header'
import { JobDescription } from './job-description'
import { CoverLetter } from './cover-letter'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface ColumnProps {
  onStatusChange?: (id: number, status: ApplicationStatus) => void
}

export const createColumns = ({ onStatusChange }: ColumnProps = {}): ColumnDef<Application>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => {
      return <div className="text-left font-medium">{row.getValue('id')}</div>
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium line-clamp-1 min-w-48">{row.getValue('title')}</div>
      )
    },
  },
  {
    accessorKey: 'company',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Company" />,
    cell: ({ row }) => {
      return <div className="text-left font-medium">{row.getValue('company')}</div>
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      return (
        <JobDescription
          company={row.getValue('company')}
          title={row.getValue('title')}
          description={row.getValue('description')}
        />
      )
    },
  },
  {
    accessorKey: 'coverLetter',
    header: 'Cover Letter',
    cell: ({ row }) => {
      return row.getValue('coverLetter') ? (
        <CoverLetter coverLetter={row.getValue('coverLetter')} />
      ) : (
        <div className="text-left font-medium">N/A</div>
      )
    },
  },
  {
    accessorKey: 'resumePath',
    header: 'Resume',
    cell: ({ row }) => {
      return row.getValue('resumePath') ? (
        <Link href={row.getValue('resumePath')} target="_blank">
          <div className="line-clamp-1 underline">View</div>
        </Link>
      ) : (
        <div className="text-left font-medium">N/A</div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Applied At" />,
    cell: ({ row }) => {
      return <div className="text-left font-medium">{row.getValue('createdAt')}</div>
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
    cell: ({ row }) => {
      return <div className="text-left font-medium">{row.getValue('updatedAt')}</div>
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      return (
        <Select
          defaultValue={row.getValue('status')}
          onValueChange={(value) => {
            onStatusChange?.(row.original.id, value as ApplicationStatus)
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {applicationStatusSchema.options.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
  },
]
