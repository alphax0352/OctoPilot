import { useState } from 'react'
import { Upload, X, Download } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  value?: string
  onChange: (value: string) => void
  className?: string
  accept?: string
}

export function FileUpload({ value, onChange, className, accept = '.docx' }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setError(null)

    const file = e.dataTransfer.files[0]
    if (!file) return

    if (!file.name.endsWith('.docx')) {
      setError('Please upload a .docx file')
      return
    }

    await handleFileUpload(file)
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.docx')) {
      setError('Please upload a .docx file')
      return
    }

    await handleFileUpload(file)
  }

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload file')
      }

      const data = await response.json()
      onChange(data.path)
    } catch (error) {
      console.error('Error uploading file:', error)
      setError('Failed to upload file. Please try again.')
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (value) {
      window.open(value, '_blank')
    }
  }

  return (
    <div
      className={cn(
        'relative px-2 py-1 items-center justify-center border-2 border-dashed rounded-lg transition-colors',
        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {!value && (
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      )}
      <div className="flex flex-col items-center justify-center gap-2">
        {value ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{value.split('/').pop()}</span>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleRemove}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Drag and drop a .docx file here, or click to select
            </span>
          </div>
        )}
      </div>
      {error && <div className="absolute bottom-2 text-sm text-destructive">{error}</div>}
    </div>
  )
}
