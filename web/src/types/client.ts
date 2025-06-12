import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email('Invalid email address'),
  image: z.string().url('Invalid image url').optional(),
  lastActiveAt: z.date(),
})

export const pilotSchema = z.object({
  platform: z.enum(['indeed', 'linkedin', 'glassdoor', 'adzuna']),
  email: z.string().email('Invalid email address'),
  password: z.string(),
  category: z.enum([
    'full-stack-engineer',
    'frontend-engineer',
    'backend-engineer',
    'software-engineer',
    'ai-engineer',
    'data-scientist',
    'devops-engineer',
  ]),
  keywords: z.string(),
})

export const applicationStatusSchema = z.enum([
  'APPLIED',
  'INTRO',
  'STEP_2',
  'STEP_3',
  'STEP_4',
  'STEP_5',
  'STEP_6',
  'FINAL',
  'ONBOARDING',
  'REJECTED',
])

export const applicationSchema = z.object({
  id: z.number(),
  title: z.string(),
  company: z.string(),
  description: z.string(),
  resumePath: z.string().nullable(),
  coverLetter: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: applicationStatusSchema,
})

export const mainInfoSchema = z.object({
  name: z.string(),
  email: z.string().email('Invalid email address'),
  phone: z.string(),
  location: z.string(),
  linkedin: z.string(),
})

export const employmentHistorySchema = z.object({
  company: z.string(),
  title: z.string(),
  from: z.string(),
  to: z.string(),
  location: z.string(),
  description: z.string(),
  // projects: z.string().optional(),
})

export const educationInfoSchema = z.object({
  school: z.string(),
  degree: z.string(),
  from: z.string(),
  to: z.string(),
  location: z.string(),
})

export type User = z.infer<typeof userSchema>
export type Pilot = z.infer<typeof pilotSchema>
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>
export type Application = z.infer<typeof applicationSchema>
export type SavedPilot = Pilot & {
  id: string
}
export type MainInfo = z.infer<typeof mainInfoSchema>
export type EmploymentHistory = z.infer<typeof employmentHistorySchema>
export type EducationInfo = z.infer<typeof educationInfoSchema>
