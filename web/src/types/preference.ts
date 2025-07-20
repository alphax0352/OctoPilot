import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email('Invalid email address'),
  image: z.string().url('Invalid image url').optional(),
  lastActiveAt: z.date(),
})

export const pumperSchema = z.object({
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

export const selfIdentificatonSchema = z.object({
  gender: z.string(),
  pronouns: z.string(),
  veteran: z.string(),
  disability: z.string(),
  ethnicity: z.string(),
})

export const legalAuthorizationSchema = z.object({
  us_work_authorization: z.string(),
  eu_work_authorization: z.string(),
  requires_us_visa: z.string(),
  requires_eu_visa: z.string(),
  requires_uk_visa: z.string(),
  requires_us_sponsorship: z.string(),
  requires_eu_sponsorship: z.string(),
  requires_uk_sponsorship: z.string(),
})

export const workPreferenceSchema = z.object({
  notice_period: z.string(),
  salary_range_usd: z.string(),
  remote_work: z.string(),
  in_person_work: z.string(),
  open_to_relocation: z.string(),
  willing_to_complete_assessments: z.string(),
  willing_to_undergo_drug_tests: z.string(),
  willing_to_undergo_background_checks: z.string(),
})

export type User = z.infer<typeof userSchema>
export type Pumper = z.infer<typeof pumperSchema>
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>
export type Application = z.infer<typeof applicationSchema>
export type SavedPilot = Pumper & {
  id: string
}
export type SelfIdentification = z.infer<typeof selfIdentificatonSchema>
export type WorkPreference = z.infer<typeof workPreferenceSchema>
export type LegalAuthorization = z.infer<typeof legalAuthorizationSchema>
