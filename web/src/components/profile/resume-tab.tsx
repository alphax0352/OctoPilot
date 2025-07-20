import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { TabsContent } from '../ui/tabs'
import { Label } from '../ui/label'
import { EducationInfo, EmploymentHistory, PersonalInfo } from '@/types/client'
import { Textarea } from '../ui/textarea'

export function ResumeTab({
  personalInfo,
  employmentHistory,
  educationInfo,
  handlePersonalInfoChange,
  handleEmploymentHistoryChange,
  handleEducationInfoChange,
}: {
  personalInfo: PersonalInfo
  employmentHistory: EmploymentHistory[]
  educationInfo: EducationInfo
  handlePersonalInfoChange: (field: string, value: string) => void
  handleEmploymentHistoryChange: (index: number, field: string, value: string) => void
  handleEducationInfoChange: (field: string, value: string) => void
}) {
  return (
    <TabsContent value="resume" className="flex gap-4">
      <div className="flex flex-col gap-4 w-1/3">
        <Card>
          <CardHeader>
            <CardTitle>Personal Info</CardTitle>
            <CardDescription>Manage your main information for resume generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name*</Label>
                <Input
                  value={personalInfo?.name || ''}
                  placeholder="Name*"
                  onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  value={personalInfo?.email || ''}
                  placeholder="Email*"
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone*</Label>
                <Input
                  value={personalInfo?.phone || ''}
                  placeholder="Phone"
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Address*</Label>
                <Input
                  value={personalInfo?.address || ''}
                  placeholder="Address*"
                  onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="linkedin">LinkedIn*</Label>
                <Input
                  value={personalInfo?.linkedin || ''}
                  placeholder="LinkedIn*"
                  onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Education Info</CardTitle>
            <CardDescription>
              Manage your education information for resume generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="university">University*</Label>
                <Input
                  value={educationInfo?.school || ''}
                  placeholder="University"
                  onChange={(e) => handleEducationInfoChange('school', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="degree">Degree*</Label>
                <Input
                  value={educationInfo?.degree || ''}
                  placeholder="Degree"
                  onChange={(e) => handleEducationInfoChange('degree', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">From</Label>
                <Input
                  value={educationInfo?.from || ''}
                  placeholder="From Month"
                  onChange={(e) => handleEducationInfoChange('from', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">To</Label>
                <Input
                  value={educationInfo?.to || ''}
                  placeholder="To Month"
                  onChange={(e) => handleEducationInfoChange('to', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Location*</Label>
                <Input
                  value={educationInfo?.location || ''}
                  placeholder="Location"
                  onChange={(e) => handleEducationInfoChange('location', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="w-2/3">
        <CardHeader>
          <CardTitle>Employment History</CardTitle>
          <CardDescription>Manage your employment history for resume generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="flex flex-col gap-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-150 dark:bg-gray-800/50"
            >
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="company">Company{index + 1}*</Label>
                  <Input
                    value={employmentHistory[index]?.company || ''}
                    placeholder="Company"
                    onChange={(e) =>
                      handleEmploymentHistoryChange(index, 'company', e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="linkedin">Position*</Label>
                  <Input
                    value={employmentHistory[index]?.title || ''}
                    placeholder="Job Title"
                    onChange={(e) => handleEmploymentHistoryChange(index, 'title', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <Label className="text-sm font-medium">From*</Label>
                  <Input
                    value={employmentHistory[index]?.from || ''}
                    placeholder="MM/YYYY"
                    onChange={(e) => handleEmploymentHistoryChange(index, 'from', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label className="text-sm font-medium">To*</Label>
                  <Input
                    value={employmentHistory[index]?.to || ''}
                    placeholder="MM/YYYY"
                    onChange={(e) => handleEmploymentHistoryChange(index, 'to', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Location*</Label>
                <Input
                  value={employmentHistory[index]?.location || ''}
                  placeholder="Location"
                  onChange={(e) => handleEmploymentHistoryChange(index, 'location', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Description</Label>
                <Textarea
                  value={employmentHistory[index]?.description || ''}
                  placeholder="About the company"
                  onChange={(e) =>
                    handleEmploymentHistoryChange(index, 'description', e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </TabsContent>
  )
}
