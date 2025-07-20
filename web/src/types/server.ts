import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email('Invalid email address'),
  image: z.string().url('Invalid image url').optional(),
  lastActiveAt: z.date(),
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

export const generatedContentSchema = z.object({
  headline: z.string(),
  summary: z.string(),
  skills: z.string(),
  bullets_first_company: z.array(z.string()),
  bullets_second_company: z.array(z.string()),
  bullets_third_company: z.array(z.string()),
})

export const extractedContentSchema = z.object({
  title: z.string(),
  company: z.string(),
  description: z.string(),
})

export const coverLetterSchema = z.object({
  coverLetter: z.string(),
})

export const profileDataSchema = z.object({
  name: z.string(),
  location: z.string(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
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
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>
export type Application = z.infer<typeof applicationSchema>
export type GeneratedContent = z.infer<typeof generatedContentSchema>
export type ExtractedContent = z.infer<typeof extractedContentSchema>
export type CoverLetter = z.infer<typeof coverLetterSchema>
export type ProfileData = z.infer<typeof profileDataSchema>
export type EmploymentHistory = z.infer<typeof employmentHistorySchema>
export type EducationInfo = z.infer<typeof educationInfoSchema>
