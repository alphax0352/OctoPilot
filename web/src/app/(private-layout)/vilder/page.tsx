"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { encodeBase64 } from "@/lib/base64";
import { Checkbox } from "@/components/ui/checkbox";
import { AxiosInstance } from "@/lib/axios-instance";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function VilderPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [generatedContents, setGeneratedContents] = useState<{
    resumePath: string | null;
    coverLetter: string | null;
  }>({
    resumePath: null,
    coverLetter: null,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    resume: true,
    coverLetter: false,
    ignoreConflicts: false,
  });
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Warning",
        description: "Please enter a job description",
      });
      return;
    }

    if (!selectedOptions.resume && !selectedOptions.coverLetter) {
      toast({
        title: "Warning",
        description: "Please select at least one option to generate",
      });
      return;
    }

    setIsGenerating(true);
    setElapsedTime(null);
    const startTime = Date.now();

    try {
      const encodedJobDescription = encodeBase64(jobDescription);
      const { data, status } = await AxiosInstance.post("/api/vilder", {
        jobDescription: encodedJobDescription,
        generateOptions: selectedOptions,
      });

      if (status === 202) {
        setGeneratedContents({
          resumePath: data.resumePath,
          coverLetter: null,
        });
        toast({
          variant: "destructive",
          title: "Warning",
          description: data.message,
        });
        return;
      }

      setGeneratedContents({
        resumePath: data.resumePath,
        coverLetter: data.coverLetter,
      });

      const endTime = Date.now();
      setElapsedTime(endTime - startTime);

      toast({
        title: "Success",
        description: "Document(s) generated successfully",
      });
    } catch (error) {
      setGeneratedContents({
        resumePath: null,
        coverLetter: null,
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: error as string,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string, type: "resume" | "coverLetter") => {
    console.log("🔥🔥", text, type);
    if (!text) return;

    try {
      if (type === "resume") {
        console.log(
          "📋",
          `${process.env.NEXT_PUBLIC_RESUME_BASE_PATH!}${text.split("/").slice(0, -1).join("/")}`,
        );
        await navigator.clipboard.writeText(
          `${process.env.NEXT_PUBLIC_RESUME_BASE_PATH!}${text.split("/").slice(0, -1).join("/")}`,
        );
      } else {
        await navigator.clipboard.writeText(text);
      }
      toast({
        title: "Success",
        description: `${type === "resume" ? "Resume path" : "Cover letter"} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to copy ${type === "resume" ? "resume path" : "cover letter"}`,
      });
      console.error(error);
    }
  };

  return (
    <div className="container space-y-4 py-8">
      <div className="space-y-4">
        <div className="flex justify-between">
          <Label htmlFor="job-description">Job Description</Label>
        </div>
        <Textarea
          id="job-description"
          placeholder="Paste your job description here..."
          value={jobDescription}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setJobDescription(e.target.value)
          }
          className="min-h-[240px] resize-none"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Label>Generate Options:</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="resume"
              checked={selectedOptions.resume}
              onCheckedChange={(checked) =>
                setSelectedOptions({
                  ...selectedOptions,
                  resume: checked as boolean,
                })
              }
              disabled={isGenerating}
            />
            <Label htmlFor="resume">Resume</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="cover-letter"
              checked={selectedOptions.coverLetter}
              onCheckedChange={(checked) =>
                setSelectedOptions({
                  ...selectedOptions,
                  coverLetter: checked as boolean,
                })
              }
              disabled={isGenerating}
            />
            <Label htmlFor="cover-letter">Cover Letter</Label>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-2">
            <Checkbox
              id="ignore-conflicts"
              checked={selectedOptions.ignoreConflicts}
              onCheckedChange={(checked) =>
                setSelectedOptions({
                  ...selectedOptions,
                  ignoreConflicts: checked as boolean,
                })
              }
              disabled={isGenerating}
            />
            <Label htmlFor="ignore-conflicts">Ignore Conflicts</Label>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {elapsedTime !== null && !isGenerating && (
            <div className="text-sm text-muted-foreground">
              Generated in {(elapsedTime / 1000).toFixed(2)} seconds
            </div>
          )}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !jobDescription.trim()}
            className="w-full sm:w-auto"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      {(isGenerating ||
        generatedContents.resumePath ||
        generatedContents.coverLetter) && (
        <div className="space-y-6">
          {selectedOptions.resume && (
            <div className="space-y-2">
              <Label>Generated Resume</Label>
              {isGenerating ? (
                <div className="flex items-center gap-2 px-4 py-2.5 border rounded-lg bg-muted max-w-3xl">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ) : generatedContents.resumePath ? (
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-muted cursor-pointer hover:text-primary"
                    onClick={() =>
                      handleCopy(generatedContents.resumePath!, "resume")
                    }
                  >
                    <Copy className="h-4 w-4" />
                    <span className="flex-1 font-mono text-sm">
                      Resume generated at: {generatedContents.resumePath}
                    </span>
                  </div>
                  <Link
                    href={`/${generatedContents.resumePath!}`}
                    target="_blank"
                    className="p-2.5 border rounded-lg cursor-pointer hover:bg-muted"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              ) : null}
            </div>
          )}

          {selectedOptions.coverLetter && (
            <div className="space-y-2">
              <Label>Generated Cover Letter</Label>
              {isGenerating ? (
                <div className="border rounded-lg bg-muted flex flex-col gap-2 p-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : generatedContents.coverLetter ? (
                <div className="relative p-4 border rounded-lg bg-muted whitespace-pre-wrap text-sm">
                  {generatedContents.coverLetter}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleCopy(generatedContents.coverLetter!, "coverLetter")
                    }
                    className="absolute top-2 right-2 p-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
