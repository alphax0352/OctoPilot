import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { TabsContent } from '../ui/tabs'
import { Label } from '../ui/label'
import { SelfIdentification, LegalAuthorization, WorkPreference } from '@/types/preference'
interface IPreferenceTab {
  selfIdentification: SelfIdentification
  legalAuthorization: LegalAuthorization
  workPreference: WorkPreference
  handleSelfIdentificationChange: (field: string, value: string) => void
  handleLegalAuthorizationChange: (field: string, value: string) => void
  handleWorkPreferenceChange: (field: string, value: string) => void
}

export function PreferenceTab({
  selfIdentification,
  legalAuthorization,
  workPreference,
  handleSelfIdentificationChange,
  handleLegalAuthorizationChange,
  handleWorkPreferenceChange,
}: IPreferenceTab) {
  return (
    <TabsContent value="preference" className="flex w-full gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Self Identification</CardTitle>
          <CardDescription>Manage your self identification information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="gender">Gender*</Label>
              <Input
                value={selfIdentification?.gender || ''}
                placeholder="Gender*"
                onChange={(e) => handleSelfIdentificationChange('gender', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="gender">Pronouns*</Label>
              <Input
                value={selfIdentification?.pronouns || ''}
                placeholder="Pronouns*"
                onChange={(e) => handleSelfIdentificationChange('pronouns', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="gender">Veteran*</Label>
              <Input
                value={selfIdentification?.veteran || ''}
                placeholder="Veteran*"
                onChange={(e) => handleSelfIdentificationChange('veteran', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="gender">Disability*</Label>
              <Input
                value={selfIdentification?.disability || ''}
                placeholder="Disability*"
                onChange={(e) => handleSelfIdentificationChange('disability', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="gender">Ethnicity*</Label>
              <Input
                value={selfIdentification?.ethnicity || ''}
                placeholder="Ethnicity*"
                onChange={(e) => handleSelfIdentificationChange('ethnicity', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Legal Authorization</CardTitle>
          <CardDescription>Manage your Legal Authorization for auto apply</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="us_work_authorization">US Work Authorization*</Label>
              <Input
                value={legalAuthorization?.us_work_authorization || ''}
                placeholder="US Work Authorization*"
                onChange={(e) =>
                  handleLegalAuthorizationChange('us_work_authorization', e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="eu_work_authorization">EU Work Authorizaton*</Label>
              <Input
                value={legalAuthorization?.eu_work_authorization || ''}
                placeholder="EU Work Authorization*"
                onChange={(e) =>
                  handleLegalAuthorizationChange('eu_work_authorization', e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="Requires US Visa">Require US Visa*</Label>
              <Input
                value={legalAuthorization?.requires_us_visa || ''}
                placeholder="Require US Visa*"
                onChange={(e) => handleLegalAuthorizationChange('requires_us_visa', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="Requires EU Visa">Requires EU Visa*</Label>
              <Input
                value={legalAuthorization?.requires_eu_visa || ''}
                placeholder="Reguire EU Visa*"
                onChange={(e) => handleLegalAuthorizationChange('requires_eu_visa', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="Requires UK Visa">Requires UK Visa*</Label>
              <Input
                value={legalAuthorization?.requires_uk_visa || ''}
                placeholder="Reguire UK Visa*"
                onChange={(e) => handleLegalAuthorizationChange('requires_uk_visa', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="requires_us_sponsorship">Requires US Sponsorship*</Label>
              <Input
                value={legalAuthorization?.requires_us_sponsorship || ''}
                placeholder="Require US Sponsorship*"
                onChange={(e) =>
                  handleLegalAuthorizationChange('requires_us_sponsorship', e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="requires_eu_sponsorship">Rerquires EU Sponsorship*</Label>
              <Input
                value={legalAuthorization?.requires_eu_sponsorship || ''}
                placeholder="Require EU Sponsorship*"
                onChange={(e) =>
                  handleLegalAuthorizationChange('requires_eu_sponsorship', e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="requires_uk_sponsorship">Requires UK Sponsorship*</Label>
              <Input
                value={legalAuthorization?.requires_uk_sponsorship || ''}
                placeholder="Require UK Sponsoship*"
                onChange={(e) =>
                  handleLegalAuthorizationChange('requires_uk_sponsorship', e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Work Preference</CardTitle>
          <CardDescription>Manage your Work Preference for auto apply</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="notice_period">Notice Period*</Label>
              <Input
                value={workPreference?.notice_period || ''}
                placeholder="Notice Period*"
                onChange={(e) => handleWorkPreferenceChange('notice_period', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="salary_range_usd">Salary Range USD*</Label>
              <Input
                value={workPreference?.salary_range_usd || ''}
                placeholder="Salary Range USD*"
                onChange={(e) => handleWorkPreferenceChange('salary_range_usd', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="remote_work">Remote Work*</Label>
              <Input
                value={workPreference?.remote_work || ''}
                placeholder="Remote Work*"
                onChange={(e) => handleWorkPreferenceChange('remote_work', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="in_person_work">In Person Work*</Label>
              <Input
                value={workPreference?.in_person_work || ''}
                placeholder="In Person Work*"
                onChange={(e) => handleWorkPreferenceChange('in_person_work', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="open_to_relocation">Open To Relocation*</Label>
              <Input
                value={workPreference?.open_to_relocation || ''}
                placeholder="Open To Relocation*"
                onChange={(e) => handleWorkPreferenceChange('open_to_relocation', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="willing_to_complete_assessments">
                Willing To Complte Assessments*
              </Label>
              <Input
                value={workPreference?.willing_to_complete_assessments || ''}
                placeholder="Willing to Complete Assessments*"
                onChange={(e) =>
                  handleWorkPreferenceChange('willing_to_complete_assessments', e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="willing_to_undergo_drug_tests">Willing To Undergo Drug Tests*</Label>
              <Input
                value={workPreference?.willing_to_undergo_drug_tests || ''}
                placeholder="Willing to Undergo Drug Tests*"
                onChange={(e) =>
                  handleWorkPreferenceChange('willing_to_undergo_drug_tests', e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="willing_to_undergo_background_checks">
                Willing To Undergo Background Checks*
              </Label>
              <Input
                value={workPreference?.willing_to_undergo_background_checks || ''}
                placeholder="Willing to Undergo Background Checks*"
                onChange={(e) =>
                  handleWorkPreferenceChange('willing_to_undergo_background_checks', e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
