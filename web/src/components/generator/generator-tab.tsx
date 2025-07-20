import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { TabsContent } from '../ui/tabs'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Checkbox } from '../ui/checkbox'

interface IGeneratorTab {
  jobDescription: string
  selectedOptions: {
    resume: boolean
    coverLetter: boolean
    ignoreConflicts: boolean
  }
  isGenerating: boolean
  elapsedTime: number | null
  setJobDescription: (value: string) => void

  setSelectedOptions: (value: {
    resume: boolean
    coverLetter: boolean
    ignoreConflicts: boolean
  }) => void
  handleGenerate: () => Promise<void>
}
export function GeneratorTab({
  jobDescription,
  selectedOptions,
  isGenerating,
  elapsedTime,
  setJobDescription,
  setSelectedOptions,
  handleGenerate,
}: IGeneratorTab) {
  return (
    <TabsContent value="generator" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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

          <div className="flex items-center justify-between space-y-4">
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
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
