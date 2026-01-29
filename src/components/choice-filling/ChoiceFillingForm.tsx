import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, ChevronRight, Save, Sparkles, GripVertical, AlertCircle } from "lucide-react";
import { ChoiceFillingFormData } from "@/pages/ChoiceFilling";

interface ChoiceFillingFormProps {
  initialData: ChoiceFillingFormData | null;
  onSubmit: (data: ChoiceFillingFormData) => void;
  onSaveDraft: (data: ChoiceFillingFormData) => void;
  error: string | null;
}

const CATEGORIES = ["General", "OBC-NCL", "SC", "ST", "EWS", "PwD"];
const GENDERS = ["Male", "Female", "Other"];
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal"
];

const BRANCHES = [
  "Computer Science & Engineering",
  "Electronics & Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Aerospace Engineering",
  "Biotechnology",
  "Metallurgical Engineering",
  "Other branches"
];

const COLLEGE_TYPES = [
  { id: "IIT", label: "IITs (Indian Institutes of Technology)" },
  { id: "NIT", label: "NITs (National Institutes of Technology)" },
  { id: "IIIT", label: "IIITs (Indian Institutes of Information Technology)" },
  { id: "GFTI", label: "GFTIs (Government Funded Technical Institutes)" }
];

const PRIORITIES = [
  "Placement record",
  "College reputation/ranking",
  "Branch preference",
  "Location/proximity to home"
];

const REGIONS = ["North", "South", "East", "West"];

const defaultFormData: ChoiceFillingFormData = {
  mainRank: "",
  advancedRank: "",
  category: "",
  gender: "",
  homeState: "",
  branches: [],
  collegeTypes: ["IIT", "NIT", "IIIT", "GFTI"],
  locationPreference: "any",
  preferredRegion: "",
  strategy: "Balanced",
  priorities: ["Placement record", "Branch preference", "College reputation/ranking", "Location/proximity to home"]
};

const ChoiceFillingForm = ({ initialData, onSubmit, onSaveDraft, error }: ChoiceFillingFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ChoiceFillingFormData>(initialData || defaultFormData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateStep = (currentStep: number): boolean => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.mainRank || isNaN(Number(formData.mainRank))) {
          errors.mainRank = "Please enter a valid JEE Main AIR";
        }
        break;
      case 2:
        if (!formData.category) errors.category = "Please select a category";
        if (!formData.gender) errors.gender = "Please select your gender";
        if (!formData.homeState) errors.homeState = "Please select your home state";
        break;
      case 3:
        if (formData.branches.length === 0) {
          errors.branches = "Please select at least one branch";
        }
        break;
      case 4:
        if (formData.collegeTypes.length === 0) {
          errors.collegeTypes = "Please select at least one college type";
        }
        if (formData.locationPreference === "region" && !formData.preferredRegion) {
          errors.preferredRegion = "Please select a region";
        }
        break;
      case 5:
        if (!formData.strategy) errors.strategy = "Please select a strategy";
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    if (validateStep(step)) {
      onSubmit(formData);
    }
  };

  const updateFormData = (updates: Partial<ChoiceFillingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setValidationErrors({});
  };

  const toggleBranch = (branch: string) => {
    const newBranches = formData.branches.includes(branch)
      ? formData.branches.filter(b => b !== branch)
      : [...formData.branches, branch];
    updateFormData({ branches: newBranches });
  };

  const toggleCollegeType = (type: string) => {
    const newTypes = formData.collegeTypes.includes(type)
      ? formData.collegeTypes.filter(t => t !== type)
      : [...formData.collegeTypes, type];
    updateFormData({ collegeTypes: newTypes });
  };

  const movePriority = (index: number, direction: "up" | "down") => {
    const newPriorities = [...formData.priorities];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newPriorities.length) {
      [newPriorities[index], newPriorities[newIndex]] = [newPriorities[newIndex], newPriorities[index]];
      updateFormData({ priorities: newPriorities });
    }
  };

  const renderProgressBar = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">Step {step} of 5</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSaveDraft(formData)}
          className="text-primary"
        >
          <Save className="w-4 h-4 mr-1" />
          Save Draft
        </Button>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-all ${
              s <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-1">Your Ranks</h2>
        <p className="text-sm text-muted-foreground mb-6">Enter your ranks from the official result</p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="mainRank" className="text-base">
              JEE Main AIR (All India Rank) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="mainRank"
              type="number"
              placeholder="e.g., 14000"
              value={formData.mainRank}
              onChange={(e) => updateFormData({ mainRank: e.target.value })}
              className={`mt-2 ${validationErrors.mainRank ? "border-destructive" : ""}`}
            />
            {validationErrors.mainRank && (
              <p className="text-sm text-destructive mt-1">{validationErrors.mainRank}</p>
            )}
          </div>

          <div>
            <Label htmlFor="advancedRank" className="text-base">
              JEE Advanced AIR <span className="text-muted-foreground text-sm">(optional)</span>
            </Label>
            <Input
              id="advancedRank"
              type="number"
              placeholder="Leave blank if not appeared"
              value={formData.advancedRank}
              onChange={(e) => updateFormData({ advancedRank: e.target.value })}
              className="mt-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-1">Personal Details</h2>
        <p className="text-sm text-muted-foreground mb-6">Help us personalize your recommendations</p>

        <div className="space-y-5">
          <div>
            <Label className="text-base">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.category} onValueChange={(v) => updateFormData({ category: v })}>
              <SelectTrigger className={`mt-2 ${validationErrors.category ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select your category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.category && (
              <p className="text-sm text-destructive mt-1">{validationErrors.category}</p>
            )}
          </div>

          <div>
            <Label className="text-base">
              Gender <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(v) => updateFormData({ gender: v })}
              className="mt-2 flex gap-4"
            >
              {GENDERS.map((g) => (
                <div key={g} className="flex items-center space-x-2">
                  <RadioGroupItem value={g} id={`gender-${g}`} />
                  <Label htmlFor={`gender-${g}`} className="font-normal cursor-pointer">{g}</Label>
                </div>
              ))}
            </RadioGroup>
            {validationErrors.gender && (
              <p className="text-sm text-destructive mt-1">{validationErrors.gender}</p>
            )}
          </div>

          <div>
            <Label className="text-base">
              Home State <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.homeState} onValueChange={(v) => updateFormData({ homeState: v })}>
              <SelectTrigger className={`mt-2 ${validationErrors.homeState ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select your home state" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.homeState && (
              <p className="text-sm text-destructive mt-1">{validationErrors.homeState}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-1">Branch Preferences</h2>
        <p className="text-sm text-muted-foreground mb-6">Select your preferred branches (select multiple)</p>

        <div className="space-y-3">
          {BRANCHES.map((branch) => (
            <div
              key={branch}
              onClick={() => toggleBranch(branch)}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                formData.branches.includes(branch)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Checkbox
                checked={formData.branches.includes(branch)}
                onCheckedChange={() => toggleBranch(branch)}
              />
              <span className="flex-1 text-sm">{branch}</span>
              {formData.branches.includes(branch) && (
                <Badge variant="secondary" className="text-xs">
                  #{formData.branches.indexOf(branch) + 1}
                </Badge>
              )}
            </div>
          ))}
        </div>

        {validationErrors.branches && (
          <p className="text-sm text-destructive mt-3">{validationErrors.branches}</p>
        )}

        {formData.branches.length > 0 && (
          <p className="text-sm text-muted-foreground mt-4">
            {formData.branches.length} branch{formData.branches.length > 1 ? "es" : ""} selected
          </p>
        )}
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-1">College & Location Preferences</h2>
        <p className="text-sm text-muted-foreground mb-6">Choose college types and location preferences</p>

        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">College Types</Label>
            <div className="space-y-2 mt-3">
              {COLLEGE_TYPES.map((type) => (
                <div
                  key={type.id}
                  onClick={() => toggleCollegeType(type.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    formData.collegeTypes.includes(type.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Checkbox
                    checked={formData.collegeTypes.includes(type.id)}
                    onCheckedChange={() => toggleCollegeType(type.id)}
                  />
                  <span className="text-sm">{type.label}</span>
                </div>
              ))}
            </div>
            {validationErrors.collegeTypes && (
              <p className="text-sm text-destructive mt-2">{validationErrors.collegeTypes}</p>
            )}
          </div>

          <div>
            <Label className="text-base font-medium">Location Preference</Label>
            <RadioGroup
              value={formData.locationPreference}
              onValueChange={(v) => updateFormData({ locationPreference: v, preferredRegion: "" })}
              className="mt-3 space-y-2"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border">
                <RadioGroupItem value="any" id="loc-any" />
                <Label htmlFor="loc-any" className="flex-1 cursor-pointer">
                  <span className="font-normal">Any location</span>
                  <Badge variant="secondary" className="ml-2 text-xs">Recommended</Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border">
                <RadioGroupItem value="home" id="loc-home" />
                <Label htmlFor="loc-home" className="font-normal cursor-pointer">Prefer home state</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border">
                <RadioGroupItem value="region" id="loc-region" />
                <Label htmlFor="loc-region" className="font-normal cursor-pointer">Prefer specific region</Label>
              </div>
            </RadioGroup>

            {formData.locationPreference === "region" && (
              <Select
                value={formData.preferredRegion}
                onValueChange={(v) => updateFormData({ preferredRegion: v })}
              >
                <SelectTrigger className={`mt-3 ${validationErrors.preferredRegion ? "border-destructive" : ""}`}>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {validationErrors.preferredRegion && (
              <p className="text-sm text-destructive mt-1">{validationErrors.preferredRegion}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep5 = () => (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-1">Strategy & Priorities</h2>
        <p className="text-sm text-muted-foreground mb-6">Choose your counselling strategy</p>

        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Strategy Type</Label>
            <RadioGroup
              value={formData.strategy}
              onValueChange={(v) => updateFormData({ strategy: v })}
              className="mt-3 space-y-2"
            >
              <div className={`p-4 rounded-lg border cursor-pointer transition-all ${
                formData.strategy === "Conservative" ? "border-primary bg-primary/5" : "border-border"
              }`}>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="Conservative" id="strat-conservative" />
                  <Label htmlFor="strat-conservative" className="flex-1 cursor-pointer">
                    <span className="font-medium">Conservative</span>
                    <p className="text-sm text-muted-foreground font-normal mt-1">
                      Safer choices, minimize risk
                    </p>
                  </Label>
                </div>
              </div>
              <div className={`p-4 rounded-lg border cursor-pointer transition-all ${
                formData.strategy === "Balanced" ? "border-primary bg-primary/5" : "border-border"
              }`}>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="Balanced" id="strat-balanced" />
                  <Label htmlFor="strat-balanced" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Balanced</span>
                      <Badge className="bg-secondary text-secondary-foreground text-xs">RECOMMENDED</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-normal mt-1">
                      Mix of ambitious and safe choices
                    </p>
                  </Label>
                </div>
              </div>
              <div className={`p-4 rounded-lg border cursor-pointer transition-all ${
                formData.strategy === "Aggressive" ? "border-primary bg-primary/5" : "border-border"
              }`}>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="Aggressive" id="strat-aggressive" />
                  <Label htmlFor="strat-aggressive" className="flex-1 cursor-pointer">
                    <span className="font-medium">Aggressive</span>
                    <p className="text-sm text-muted-foreground font-normal mt-1">
                      Aim higher, willing to take risks
                    </p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium">Your Priorities (drag to reorder)</Label>
            <div className="mt-3 space-y-2">
              {formData.priorities.map((priority, index) => (
                <div
                  key={priority}
                  className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="flex-1 text-sm">{priority}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={index === 0}
                      onClick={() => movePriority(index, "up")}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={index === formData.priorities.length - 1}
                      onClick={() => movePriority(index, "down")}
                    >
                      ↓
                    </Button>
                  </div>
                  <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => handleSubmit()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {renderProgressBar()}

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="flex-1"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        {step < 5 ? (
          <Button onClick={handleNext} className="flex-1">
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="flex-1 bg-secondary hover:bg-secondary/90">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Strategy
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChoiceFillingForm;
