import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { TabsContent } from "../ui/tabs";
import { Label } from "../ui/label";
import { EducationInfo, EmploymentHistory, MainInfo } from "@/types/client";
import { Textarea } from "../ui/textarea";

export default function ResumeTab({
  mainInfo,
  employmentHistory,
  educationInfo,
  handleMainInfoChange,
  handleEmploymentHistoryChange,
  handleEducationInfoChange,
}: {
  mainInfo: MainInfo;
  employmentHistory: EmploymentHistory[];
  educationInfo: EducationInfo;
  handleMainInfoChange: (field: string, value: string) => void;
  handleEmploymentHistoryChange: (
    index: number,
    field: string,
    value: string,
  ) => void;
  handleEducationInfoChange: (field: string, value: string) => void;
}) {
  return (
    <TabsContent value="resume" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Main</CardTitle>
          <CardDescription>
            Manage your main information for resume generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              value={mainInfo?.name || ""}
              placeholder="Name*"
              onChange={(e) => handleMainInfoChange("name", e.target.value)}
            />
            <Input
              value={mainInfo?.email || ""}
              placeholder="Email*"
              onChange={(e) => handleMainInfoChange("email", e.target.value)}
            />
            <Input
              value={mainInfo?.phone || ""}
              placeholder="Phone"
              onChange={(e) => handleMainInfoChange("phone", e.target.value)}
            />
            <Input
              value={mainInfo?.location || ""}
              placeholder="Location*"
              onChange={(e) => handleMainInfoChange("location", e.target.value)}
            />
            <Input
              value={mainInfo?.linkedin || ""}
              placeholder="LinkedIn*"
              onChange={(e) => handleMainInfoChange("linkedin", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Employment History</CardTitle>
          <CardDescription>
            Manage your employment history for resume generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-4">
              <div className="flex gap-4 items-center">
                <Input
                  value={employmentHistory[index]?.company || ""}
                  placeholder="Company"
                  onChange={(e) =>
                    handleEmploymentHistoryChange(
                      index,
                      "company",
                      e.target.value,
                    )
                  }
                />
                <Input
                  value={employmentHistory[index]?.title || ""}
                  placeholder="Job Title"
                  onChange={(e) =>
                    handleEmploymentHistoryChange(
                      index,
                      "title",
                      e.target.value,
                    )
                  }
                />
                <Label className="text-sm font-medium">From</Label>
                <Input
                  value={employmentHistory[index]?.from || ""}
                  placeholder="MM/YYYY"
                  onChange={(e) =>
                    handleEmploymentHistoryChange(index, "from", e.target.value)
                  }
                />
                <Label className="text-sm font-medium">To</Label>
                <Input
                  value={employmentHistory[index]?.to || ""}
                  placeholder="MM/YYYY"
                  onChange={(e) =>
                    handleEmploymentHistoryChange(index, "to", e.target.value)
                  }
                />
                <Input
                  value={employmentHistory[index]?.location || ""}
                  placeholder="Location"
                  onChange={(e) =>
                    handleEmploymentHistoryChange(
                      index,
                      "location",
                      e.target.value,
                    )
                  }
                />
              </div>
              <Textarea
                value={employmentHistory[index]?.description || ""}
                placeholder="About the company"
                onChange={(e) =>
                  handleEmploymentHistoryChange(
                    index,
                    "description",
                    e.target.value,
                  )
                }
              />
              {/* <Textarea
                value={employmentHistory[index]?.projects || ""}
                placeholder="Projects separated by new lines"
                onChange={(e) =>
                  handleEmploymentHistoryChange(
                    index,
                    "projects",
                    e.target.value
                  )
                }
              /> */}
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
          <CardDescription>
            Manage your education information for resume generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <Input
              value={educationInfo?.school || ""}
              placeholder="University"
              onChange={(e) =>
                handleEducationInfoChange("school", e.target.value)
              }
            />
            <Input
              value={educationInfo?.degree || ""}
              placeholder="Degree"
              onChange={(e) =>
                handleEducationInfoChange("degree", e.target.value)
              }
            />
            <Label className="text-sm font-medium">From</Label>
            <Input
              value={educationInfo?.from || ""}
              placeholder="From Month"
              onChange={(e) =>
                handleEducationInfoChange("from", e.target.value)
              }
            />
            <Label className="text-sm font-medium">To</Label>
            <Input
              value={educationInfo?.to || ""}
              placeholder="To Month"
              onChange={(e) => handleEducationInfoChange("to", e.target.value)}
            />
            <Input
              value={educationInfo?.location || ""}
              placeholder="Location"
              onChange={(e) =>
                handleEducationInfoChange("location", e.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
