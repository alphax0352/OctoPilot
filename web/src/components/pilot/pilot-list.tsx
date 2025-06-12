"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Pencil,
  Loader2Icon,
  Mail,
  Layers,
  WholeWord,
  Play,
} from "lucide-react";
import { EditPilotDialog } from "./edit-pilot-dialog";
import { useToast } from "@/hooks/use-toast";
import { SavedPilot } from "@/types/client";
import { useDeletePilot, useGetPilotsInfinite } from "@/hooks/use-pilot";
import { useTotalCount } from "@/store/total-count";
import { Skeleton } from "../ui/skeleton";

export function PilotList() {
  const { toast } = useToast();
  const [editingPilot, setEditingPilot] = useState<SavedPilot | null>(null);
  const { total } = useTotalCount();

  const LIMIT = 5;

  const {
    data: pilotsData,
    fetchNextPage,
    isFetching,
    isLoading,
  } = useGetPilotsInfinite(LIMIT);
  const {
    mutate: deletePilot,
    isSuccess: pilotHasBeenDeleted,
    isPending: isDeletingPilot,
    isError: deletePilotError,
  } = useDeletePilot();

  useEffect(() => {
    if (pilotHasBeenDeleted) {
      toast({
        title: "Pilot deleted",
        description: "Your pilot has been deleted.",
      });
    }
  }, [pilotHasBeenDeleted]);

  useEffect(() => {
    if (deletePilotError) {
      toast({
        title: "Error",
        description: "There was an error deleting your pilot.",
      });
    }
  }, [deletePilotError]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[300px]" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-[150px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const pilots = pilotsData?.pages.flatMap((page) => page) || [];

  if (pilots.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">No pilots scheduled</h3>
        <p className="text-muted-foreground">
          Create your first pilot to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {pilotsData?.pages.map((page) => {
          return page.map((pilot) => {
            return (
              <Card key={pilot.id}>
                <div className="flex items-center gap-4">
                  <Button className="w-full h-full">
                    <Play className="w-6 h-6 text-primary-foreground" />
                  </Button>
                  <div className="flex-1">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle>{pilot.platform}</CardTitle>
                        <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-6">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {pilot.email}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingPilot(pilot)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {isDeletingPilot ? (
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 cursor-not-allowed"
                            disabled
                          >
                            <Loader2Icon className="h-4 w-4 animate-spin" />
                          </Button>
                        ) : (
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deletePilot(pilot.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <span className="flex items-center gap-1">
                        <Layers className="h-3 w-3" /> {pilot.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <WholeWord className="h-3 w-3" /> {pilot.keywords}
                      </span>
                    </CardContent>
                  </div>
                </div>
              </Card>
            );
          });
        })}
      </div>

      {(pilotsData?.pages.flat().length ?? 0) < total ? (
        isFetching ? (
          <div>Loading...</div>
        ) : (
          <div className="flex justify-between items-center">
            <span>
              Showing {pilotsData?.pages.flat().length} of {total} results
            </span>
            <Button
              variant="outline"
              onClick={() => {
                fetchNextPage();
              }}
            >
              Show More
            </Button>
          </div>
        )
      ) : (
        <div>
          Showing {pilotsData?.pages.flat().length} of {total} results
        </div>
      )}
      {editingPilot && (
        <EditPilotDialog
          pilot={editingPilot}
          open={!!editingPilot}
          onOpenChange={(open) => !open && setEditingPilot(null)}
        />
      )}
    </>
  );
}
