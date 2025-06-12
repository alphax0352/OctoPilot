"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pilot, SavedPilot, pilotSchema } from "@/types/client";
import { useEditPilot } from "@/hooks/use-pilot";
import { Loader2Icon } from "lucide-react";
import { compareData } from "@/lib/compare-data";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface EditPilotDialogProps {
  pilot: SavedPilot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPilotDialog({
  pilot,
  open,
  onOpenChange,
}: EditPilotDialogProps) {
  const { toast } = useToast();
  const {
    mutate: editPilot,
    isSuccess: pilotHasBeenUpdated,
    isPending: isUpdatingPilot,
    isError: updatePilotError,
    error: updatePilotErrorData,
  } = useEditPilot();

  const form = useForm<Pilot>({
    resolver: zodResolver(pilotSchema),
    defaultValues: {
      platform: pilot.platform,
      email: pilot.email,
      password: pilot.password,
      category: pilot.category,
      keywords: pilot.keywords,
    },
  });

  useEffect(() => {
    if (pilotHasBeenUpdated) {
      toast({
        description: "Pilot updated successfully",
      });
      form.reset();
      onOpenChange(false);
    }
  }, [pilotHasBeenUpdated, onOpenChange, toast]);

  useEffect(() => {
    if (updatePilotError) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          updatePilotErrorData instanceof Error
            ? updatePilotErrorData.message
            : String(updatePilotErrorData),
      });
    }
  }, [updatePilotError, toast]);

  function onSubmit(data: Pilot) {
    try {
      const changedFields = data as Partial<Pilot>;

      Object.keys(data).forEach((key) => {
        const typedKey = key as keyof Pilot;
        if (compareData(pilot[typedKey], data[typedKey])) {
          delete changedFields[typedKey];
        }
      });

      if (Object.keys(changedFields).length > 0) {
        editPilot({
          pilotId: pilot.id,
          updatedPilot: changedFields,
        });
      } else {
        onOpenChange(false);
      }
    } catch (error) {
      console.log("💥", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update pilot. Please try again.",
      });
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Pilot</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-row justify-between">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Platform</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Platforms</SelectLabel>
                            {/* "indeed", "linkedin", "glassdoor", "adzuna" */}
                            <SelectItem value="indeed">Indeed</SelectItem>
                            <SelectItem value="linkedin">Linkedin</SelectItem>
                            <SelectItem value="glassdoor">Glassdoor</SelectItem>
                            <SelectItem value="adzuna">Adzuna</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Category</SelectLabel>
                            {/* [
                          "full-stack-engineer", "frontend-engineer",
                          "backend-engineer", "software-engineer",
                          "ai-engineer", "data-scientist", "devops-engineer", ] */}
                            <SelectItem value="full-stack-engineer">
                              Full Stack Engineer
                            </SelectItem>
                            <SelectItem value="frontend-engineer">
                              Frontend Engineer
                            </SelectItem>
                            <SelectItem value="backend-engineer">
                              Backend Engineer
                            </SelectItem>
                            <SelectItem value="software-engineer">
                              Software Engineer
                            </SelectItem>
                            <SelectItem value="ai-engineer">
                              AI Engineer
                            </SelectItem>
                            <SelectItem value="data-scientist">
                              Data Scientist
                            </SelectItem>
                            <SelectItem value="devops-engineer">
                              DevOps Engineer
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              {isUpdatingPilot ? (
                <Button
                  type="submit"
                  className="cursor-not-allowed flex gap-2 w-full"
                  disabled
                >
                  <Loader2Icon className="h-6 w-6 animate-spin" />
                  <span>Updating Pilot...</span>
                </Button>
              ) : (
                <Button type="submit" className="w-full">
                  Update Pilot
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
