import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChoiceFillingForm from "@/components/choice-filling/ChoiceFillingForm";
import ChoiceFillingProcessing from "@/components/choice-filling/ChoiceFillingProcessing";
import ChoiceFillingResults from "@/components/choice-filling/ChoiceFillingResults";
import { useToast } from "@/hooks/use-toast";

const CHOICE_FILLING_API = "https://abcdef123456.app.n8n.cloud/webhook/webhook/choice-filling";
const DRAFT_STORAGE_KEY = "eduguide_choice_filling_draft";

export interface ChoiceFillingFormData {
  mainRank: string;
  advancedRank: string;
  category: string;
  gender: string;
  homeState: string;
  branches: string[];
  collegeTypes: string[];
  locationPreference: string;
  preferredRegion: string;
  strategy: string;
  priorities: string[];
}

interface ApiResponse {
  success: boolean;
  studentInfo: Record<string, unknown>;
  reports: {
    fullResponse: string;
  };
  timestamp: string;
}

type ViewState = "form" | "processing" | "results";

const ChoiceFilling = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [view, setView] = useState<ViewState>("form");
  const [formData, setFormData] = useState<ChoiceFillingFormData | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (draft) {
      try {
        setFormData(JSON.parse(draft));
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, []);

  const saveDraft = (data: ChoiceFillingFormData) => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
    toast({
      title: "Draft Saved",
      description: "Your progress has been saved.",
    });
  };

  const handleSubmit = async (data: ChoiceFillingFormData) => {
    setFormData(data);
    setView("processing");
    setError(null);

    try {
      const requestBody = {
        mainRank: data.mainRank,
        advancedRank: data.advancedRank || "",
        category: data.category,
        homeState: data.homeState,
        gender: data.gender,
        branches: data.branches,
        locations: data.locationPreference === "region" ? data.preferredRegion : data.locationPreference,
        priorities: data.priorities.join(" > "),
        strategy: data.strategy,
        collegeTypes: data.collegeTypes,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s timeout

      const response = await fetch(CHOICE_FILLING_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (!result.success) {
        throw new Error("API returned unsuccessful response");
      }

      setApiResponse(result);
      setView("results");
      // Clear draft on success
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (err) {
      console.error("Choice filling API error:", err);
      
      let errorMessage = "Something went wrong. Please try again.";
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "Taking longer than expected. Please try again.";
        } else if (err.message.includes("fetch")) {
          errorMessage = "Connection failed. Please check your internet.";
        }
      }
      
      setError(errorMessage);
      setView("form");
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setView("form");
    setApiResponse(null);
    setError(null);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <header className="gradient-primary text-primary-foreground px-4 pt-8 pb-6 rounded-b-2xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="text-lg font-semibold">Choice Filling</span>
          </div>
          <h1 className="text-2xl font-bold">JoSAA Counselling Guide</h1>
          <p className="text-sm opacity-90 mt-1">
            Get personalized college choice list based on your rank
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-lg mx-auto">
        {view === "form" && (
          <ChoiceFillingForm
            initialData={formData}
            onSubmit={handleSubmit}
            onSaveDraft={saveDraft}
            error={error}
          />
        )}

        {view === "processing" && <ChoiceFillingProcessing />}

        {view === "results" && apiResponse && formData && (
          <ChoiceFillingResults
            response={apiResponse}
            formData={formData}
            onReset={handleReset}
            onGoHome={handleGoHome}
          />
        )}
      </main>
    </div>
  );
};

export default ChoiceFilling;
