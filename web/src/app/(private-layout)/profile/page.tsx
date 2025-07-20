'use client'

import { useState, useEffect } from 'react'
import { Save, Download, Upload } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { PersonalInfo, EducationInfo, EmploymentHistory } from '@/types/client'
import { AxiosInstance } from '@/lib/axios-instance'
// import { encodeBase64, decodeBase64 } from '@/lib/base64'
import { ResumeTab } from '@/components/profile/resume-tab'
import { PreferenceTab } from '@/components/profile/preference-tab'
import { LegalAuthorization, SelfIdentification, WorkPreference } from '@/types/preference'

export default function ProfilePage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
  })
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistory[]>([])
  const [educationInfo, setEducationInfo] = useState<EducationInfo>({
    school: '',
    degree: '',
    from: '',
    to: '',
    location: '',
  })
  const [selfIdentificationInfo, setSelfIdentificationInfo] = useState<SelfIdentification>({
    gender: '',
    pronouns: '',
    veteran: '',
    disability: '',
    ethnicity: '',
  })
  const [legalAuthorizationInfo, setLegalAuthorizationInfo] = useState<LegalAuthorization>({
    us_work_authorization: '',
    eu_work_authorization: '',
    requires_us_visa: '',
    requires_eu_visa: '',
    requires_uk_visa: '',
    requires_us_sponsorship: '',
    requires_eu_sponsorship: '',
    requires_uk_sponsorship: '',
  })
  const [workPreferenceInfo, setWorkPreferenceInfo] = useState<WorkPreference>({
    notice_period: '',
    salary_range_usd: '',
    remote_work: '',
    in_person_work: '',
    open_to_relocation: '',
    willing_to_complete_assessments: '',
    willing_to_undergo_drug_tests: '',
    willing_to_undergo_background_checks: '',
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const [initialData, setInitialData] = useState<{
    personalInfo: PersonalInfo
    employmentHistory: EmploymentHistory[]
    educationInfo: EducationInfo
    selfIdentificationInfo: SelfIdentification
    legalAuthorizationIfo: LegalAuthorization
    workPreferenceInfo: WorkPreference
    // resumeWriterPrompt: string
    // coverLetterPrompt: string
    // resumeTemplatePath: string
  }>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
    },
    employmentHistory: [],
    educationInfo: {
      school: '',
      degree: '',
      from: '',
      to: '',
      location: '',
    },
    selfIdentificationInfo: {
      gender: '',
      pronouns: '',
      veteran: '',
      disability: '',
      ethnicity: '',
    },
    legalAuthorizationIfo: {
      us_work_authorization: '',
      eu_work_authorization: '',
      requires_us_visa: '',
      requires_eu_visa: '',
      requires_uk_visa: '',
      requires_us_sponsorship: '',
      requires_eu_sponsorship: '',
      requires_uk_sponsorship: '',
    },
    workPreferenceInfo: {
      notice_period: '',
      salary_range_usd: '',
      remote_work: '',
      in_person_work: '',
      open_to_relocation: '',
      willing_to_complete_assessments: '',
      willing_to_undergo_background_checks: '',
      willing_to_undergo_drug_tests: '',
    },
    // resumeWriterPrompt: '',
    // coverLetterPrompt: '',
    // resumeTemplatePath: '',
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await AxiosInstance.get('/api/profile')

        // Format dates for employment history
        const initialEmploymentHistory = data.employmentHistory || []

        // Format dates for education info
        const formattedEducationInfo = data.educationInfo
          ? {
              ...data.educationInfo,
              from: data.educationInfo.from,
              to: data.educationInfo.to,
            }
          : {
              school: '',
              degree: '',
              from: '',
              to: '',
              location: '',
            }

        const initialPersonalInfo = data.personalInfo || {
          name: '',
          email: '',
          phone: '',
          address: '',
          linkedin: '',
        }

        const initialSelfIdentificationInfo = data.selfIdentificationInfo || {
          gender: '',
          pronouns: '',
          veteran: '',
          disability: '',
          ethnicity: '',
        }

        const initialLegalAuthorizationInfo = data.legalAuthorizationInfo || {
          us_work_authorization: '',
          eu_work_authorization: '',
          requires_us_visa: '',
          requires_eu_visa: '',
          requires_uk_visa: '',
          requires_us_sponsorship: '',
          requires_eu_sponsorship: '',
          requires_uk_sponsorship: '',
        }

        const initialWorkPreferenceInfo = data.workPreferenceInfo || {
          notice_period: '',
          salary_range_usd: '',
          remote_work: '',
          in_person_work: '',
          open_to_relocation: '',
          willing_to_complete_assessments: '',
          willing_to_undergo_background_checks: '',
          willing_to_undergo_drug_tests: '',
        }

        setPersonalInfo(initialPersonalInfo)
        setEmploymentHistory(initialEmploymentHistory)
        setEducationInfo(formattedEducationInfo)
        setSelfIdentificationInfo(initialSelfIdentificationInfo)
        setLegalAuthorizationInfo(initialLegalAuthorizationInfo)
        setWorkPreferenceInfo(initialWorkPreferenceInfo)
        // setResumeWriterPrompt(data.resumeWriterPrompt || '')
        // setCoverLetterPrompt(data.coverLetterPrompt || '')
        // setResumeTemplatePath(data.resumeTemplatePath || '')

        setInitialData({
          personalInfo: initialPersonalInfo,
          employmentHistory: initialEmploymentHistory,
          educationInfo: formattedEducationInfo,
          selfIdentificationInfo: initialSelfIdentificationInfo,
          legalAuthorizationIfo: initialLegalAuthorizationInfo,
          workPreferenceInfo: initialWorkPreferenceInfo,
          // resumeWriterPrompt: data.resumeWriterPrompt || '',
          // coverLetterPrompt: data.coverLetterPrompt || '',
          // resumeTemplatePath: data.resumeTemplatePath || '',
        })
      } catch (error) {
        console.error('Error fetching settings:', error)
        toast({
          title: 'Error',
          description: 'Failed to load settings. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  useEffect(() => {
    if (!initialData) return

    const hasPersonalInfoChanges =
      JSON.stringify(personalInfo) !== JSON.stringify(initialData.personalInfo)
    const hasEmploymentChanges =
      JSON.stringify(employmentHistory) !== JSON.stringify(initialData.employmentHistory)
    const hasEducationChanges =
      JSON.stringify(educationInfo) !== JSON.stringify(initialData.educationInfo)
    const hasSelfIdentificationInfoChanges =
      JSON.stringify(selfIdentificationInfo) !== JSON.stringify(initialData.selfIdentificationInfo)
    const hasLegalAuthorizationInfoChanges =
      JSON.stringify(legalAuthorizationInfo) !== JSON.stringify(initialData.legalAuthorizationIfo)
    const hasWorkPreferenceInfoChanges =
      JSON.stringify(workPreferenceInfo) !== JSON.stringify(initialData.workPreferenceInfo)

    // const hasResumeWriterPromptChanges = resumeWriterPrompt !== initialData.resumeWriterPrompt
    // const hasCoverLetterPromptChanges = coverLetterPrompt !== initialData.coverLetterPrompt
    // const hasResumeTemplatePathChanges = resumeTemplatePath !== initialData.resumeTemplatePath

    setHasChanges(
      hasPersonalInfoChanges ||
        hasEmploymentChanges ||
        hasEducationChanges ||
        hasSelfIdentificationInfoChanges ||
        hasLegalAuthorizationInfoChanges ||
        hasWorkPreferenceInfoChanges
      // hasResumeWriterPromptChanges ||
      // hasCoverLetterPromptChanges ||
      // hasResumeTemplatePathChanges
    )
  }, [
    personalInfo,
    employmentHistory,
    educationInfo,
    selfIdentificationInfo,
    legalAuthorizationInfo,
    workPreferenceInfo,
    // resumeWriterPrompt,
    // coverLetterPrompt,
    // resumeTemplatePath,
    initialData,
  ])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault() // Prevent browser's default save dialog
        if (hasChanges) {
          handleSave()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasChanges]) // Only re-run if hasChanges changes

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleSelfIdentificationInfoChange = (field: string, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleLegalAuthorizationInfoChange = (field: string, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleWorkPreferenceInfoChange = (field: string, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleEmploymentHistoryChange = (index: number, field: string, value: string) => {
    const newHistory = [...employmentHistory]
    if (!newHistory[index]) {
      newHistory[index] = {
        company: '',
        title: '',
        from: '',
        to: '',
        location: '',
        description: '',
        // projects: "",
      }
    }
    newHistory[index] = { ...newHistory[index], [field]: value }
    setEmploymentHistory(newHistory)
    setHasChanges(true)
  }

  const handleEducationInfoChange = (field: string, value: string) => {
    setEducationInfo((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await AxiosInstance.put('/api/settings', {
        personalInfo,
        employmentHistory: employmentHistory.map((item) => ({
          company: item.company,
          title: item.title,
          from: item.from,
          to: item.to,
          location: item.location,
          description: item.description,
          // projects: item.projects,
        })),
        educationInfo: {
          ...educationInfo,
          from: educationInfo.from,
          to: educationInfo.to,
        },
        // resumeWriterPrompt,
        // coverLetterPrompt,
        // resumeTemplatePath,
      })

      setInitialData({
        personalInfo: { ...personalInfo },
        employmentHistory: [...employmentHistory],
        educationInfo: { ...educationInfo },
        selfIdentificationInfo: { ...selfIdentificationInfo },
        legalAuthorizationIfo: { ...legalAuthorizationInfo },
        workPreferenceInfo: { ...workPreferenceInfo },
        // resumeWriterPrompt,
        // coverLetterPrompt,
        // resumeTemplatePath,
      })
      setHasChanges(false)

      toast({
        title: 'Success',
        description: 'Your settings have been saved successfully.',
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = () => {
    const exportData = {
      personalInfo,
      employmentHistory,
      educationInfo,
      selfIdentificationInfo,
      legalAuthorizationInfo,
      workPreferenceInfo,
      // resumeWriterPrompt: encodeBase64(resumeWriterPrompt),
      // coverLetterPrompt: encodeBase64(coverLetterPrompt),
      // resumeTemplatePath,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'settings.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        // Validate the imported data structure
        if (!data.mainInfo || !data.employmentHistory || !data.educationInfo) {
          throw new Error('Invalid settings file format')
        }

        // Update state with imported data
        setPersonalInfo(data.mainInfo)
        setEmploymentHistory(
          data.employmentHistory.map((item: EmploymentHistory) => ({
            ...item,
            from: item.from,
            to: item.to,
          }))
        )
        setEducationInfo({
          ...data.educationInfo,
          from: data.educationInfo.from,
          to: data.educationInfo.to,
        })
        // setResumeWriterPrompt(decodeBase64(data.resumeWriterPrompt || ''))
        // setCoverLetterPrompt(decodeBase64(data.coverLetterPrompt || ''))
        // setResumeTemplatePath(data.resumeTemplatePath || '')

        toast({
          title: 'Success',
          description: 'Settings imported successfully.',
        })
      } catch (error) {
        console.error('Error importing settings:', error)
        toast({
          title: 'Error',
          description: 'Failed to import settings. Please check the file format.',
          variant: 'destructive',
        })
      }
    }
    reader.readAsText(file)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative container mx-auto mt-4">
      <div className="absolute top-0 right-6 flex gap-2">
        {hasChanges && (
          <Button
            onClick={handleSave}
            variant="outline"
            className="bg-green-600 text-white hover:bg-green-700 hover:text-white"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            ) : (
              <Save className="size-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
        <Button onClick={handleExport} variant="outline">
          <Download className="size-4" />
          Export
        </Button>
        <Button variant="outline" onClick={() => document.getElementById('import-input')?.click()}>
          <Upload className="size-4" />
          Import
        </Button>
        <input
          id="import-input"
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImport}
        />
      </div>
      <Tabs defaultValue="resume" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="preference">Preferences</TabsTrigger>
        </TabsList>

        <ResumeTab
          personalInfo={personalInfo}
          employmentHistory={employmentHistory}
          educationInfo={educationInfo}
          handlePersonalInfoChange={handlePersonalInfoChange}
          handleEmploymentHistoryChange={handleEmploymentHistoryChange}
          handleEducationInfoChange={handleEducationInfoChange}
        />

        <PreferenceTab
          selfIdentification={selfIdentificationInfo}
          legalAuthorization={legalAuthorizationInfo}
          workPreference={workPreferenceInfo}
          handleSelfIdentificationChange={handleSelfIdentificationInfoChange}
          handleLegalAuthorizationChange={handleLegalAuthorizationInfoChange}
          handleWorkPreferenceChange={handleWorkPreferenceInfoChange}
        />
      </Tabs>
    </div>
  )
}
