"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Pilot } from "@/types/client";
import { useToast } from "@/hooks/use-toast";
import { pilotSchema } from "@/types/client";
import { useNewPilot } from "@/hooks/use-pilot";
import { Loader2Icon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function PilotForm() {
  const { toast } = useToast();
  const {
    mutate: addPilot,
    isSuccess: pilotHasBeenAdded,
    isPending: isAddingPilot,
    isError: addPilotError,
    error: addPilotErrorData,
  } = useNewPilot();

  const form = useForm<Pilot>({
    resolver: zodResolver(pilotSchema),
    defaultValues: {
      platform: "indeed",
      email: "",
      password: "",
      category: "full-stack-engineer",
      keywords: "",
    },
  });

  useEffect(() => {
    if (pilotHasBeenAdded) {
      toast({
        title: "Pilot scheduled",
        description: "Your pilot has been scheduled.",
      });
      form.reset();
    }
  }, [pilotHasBeenAdded]);

  useEffect(() => {
    if (addPilotError) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          addPilotErrorData instanceof Error
            ? addPilotErrorData.message
            : String(addPilotErrorData),
      });
    }
  }, [addPilotError]);

  function onSubmit(data: Pilot) {
    try {
      addPilot(data);
    } catch (error) {
      console.log("💥", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to schedule pilot. Please try again.",
      });
    }
  }

  return (
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
                        <SelectItem value="ai-engineer">AI Engineer</SelectItem>
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

        {isAddingPilot ? (
          <Button
            type="submit"
            className="cursor-not-allowed flex gap-2"
            disabled
          >
            <Loader2Icon className="h-6 w-6 animate-spin" />
            <span>Creating Pilot...</span>
          </Button>
        ) : (
          <Button type="submit" className="w-full">
            Schedule Pilot
          </Button>
        )}
      </form>
    </Form>
  );
}
