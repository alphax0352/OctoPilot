'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { UpworkTask } from '@/components/upwork/upwork-task'

export default function UpworkPage() {
  const [jobDescription, setJobDescription] = useState('')
  const { toast } = useToast()

  const handleAddTask = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: 'Warning',
        description: 'Please enter a job description',
        variant: 'destructive',
      })
      return
    }
    try {
      const response = await fetch('/api/upwork-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to add task')
      toast({
        title: 'Success',
        description: `Task added successfully (#${data.number})`,
      })
      setJobDescription('')
    } catch (error: unknown) {
      let message = 'Failed to add task'
      if (error instanceof Error) message = error.message
      else if (typeof error === 'string') message = error
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container space-y-4 py-8">
      <UpworkTask
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
        handleAddTask={handleAddTask}
      />
    </div>
  )
}
