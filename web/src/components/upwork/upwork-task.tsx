import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

interface IUpworkTask {
  jobDescription: string
  setJobDescription: (value: string) => void
  handleAddTask: () => Promise<void>
}
export function UpworkTask({ jobDescription, setJobDescription, handleAddTask }: IUpworkTask) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Description</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            id="task-description"
            placeholder="Paste your task description here..."
            value={jobDescription}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setJobDescription(e.target.value)
            }
            className="min-h-[440px] resize-none"
          />
        </div>

        <div className="flex items-center justify-between space-y-4">
          <div className="flex items-center gap-4"></div>

          <div className="flex gap-4 items-center">
            <Button
              onClick={handleAddTask}
              disabled={!jobDescription.trim()}
              className="w-full sm:w-auto"
            >
              {'Add Task'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
