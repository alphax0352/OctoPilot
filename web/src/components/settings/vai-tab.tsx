import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { TabsContent } from '../ui/tabs'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { FileUpload } from '../ui/file-upload'

interface VaiTabProps {
  resumeWriterPrompt: string
  coverLetterPrompt: string
  resumeTemplatePath: string
  setResumeWriterPrompt: (value: string) => void
  setCoverLetterPrompt: (value: string) => void
  setResumeTemplatePath: (value: string) => void
}

export default function VaiTab({
  resumeWriterPrompt,
  coverLetterPrompt,
  resumeTemplatePath,
  setResumeWriterPrompt,
  setCoverLetterPrompt,
  setResumeTemplatePath,
}: VaiTabProps) {
  return (
    <TabsContent value="vai" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Resume Template</CardTitle>
          <CardDescription>Upload a .docx template file for your resume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label>Template File</Label>
              <FileUpload
                value={resumeTemplatePath}
                onChange={setResumeTemplatePath}
                accept=".docx"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-4 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Resume Writer Prompt</CardTitle>
            <CardDescription>Customize the prompt used for generating your resume</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={resumeWriterPrompt}
              onChange={(e) => setResumeWriterPrompt(e.target.value)}
              placeholder="Enter your resume writer prompt..."
              className="min-h-[300px]"
            />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Cover Letter Prompt</CardTitle>
            <CardDescription>
              Customize the prompt used for generating your cover letters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={coverLetterPrompt}
              onChange={(e) => setCoverLetterPrompt(e.target.value)}
              placeholder="Enter your cover letter prompt..."
              className="min-h-[300px]"
            />
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )
}
