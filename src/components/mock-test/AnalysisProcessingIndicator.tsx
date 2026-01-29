import { useState, useEffect } from "react";
import { Check, Loader2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Step = "reading-test" | "reading-answer" | "comparing" | "generating";

interface AnalysisProcessingIndicatorProps {
  status: "extracting" | "analyzing" | "complete";
}

const AnalysisProcessingIndicator = ({ status }: AnalysisProcessingIndicatorProps) => {
  const [currentStep, setCurrentStep] = useState<Step>("reading-test");
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);

  useEffect(() => {
    if (status === "extracting") {
      setCurrentStep("reading-test");
      setCompletedSteps([]);
      
      const timer1 = setTimeout(() => {
        setCompletedSteps(["reading-test"]);
        setCurrentStep("reading-answer");
      }, 3000);

      const timer2 = setTimeout(() => {
        setCompletedSteps(["reading-test", "reading-answer"]);
        setCurrentStep("comparing");
      }, 7000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else if (status === "analyzing") {
      setCompletedSteps(["reading-test", "reading-answer"]);
      setCurrentStep("comparing");

      const timer = setTimeout(() => {
        setCompletedSteps(["reading-test", "reading-answer", "comparing"]);
        setCurrentStep("generating");
      }, 5000);

      return () => clearTimeout(timer);
    } else if (status === "complete") {
      setCompletedSteps(["reading-test", "reading-answer", "comparing", "generating"]);
    }
  }, [status]);

  const steps: { key: Step; label: string }[] = [
    { key: "reading-test", label: "Reading test paper questions..." },
    { key: "reading-answer", label: "Reading your answer sheet..." },
    { key: "comparing", label: "Comparing answers..." },
    { key: "generating", label: "Generating detailed report..." },
  ];

  const getStepStatus = (step: Step) => {
    if (completedSteps.includes(step)) return "completed";
    if (currentStep === step) return "current";
    return "pending";
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
      {/* AI Vision Badge */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl px-4 py-2 mb-6">
        <p className="text-sm font-medium text-foreground">
          ✨ Powered by AI Vision - 95%+ Accuracy
        </p>
      </div>

      {/* Main Processing Card */}
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl">🔍</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              AI is analyzing both images...
            </h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we process your test papers
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-3 mb-6">
            {steps.map((step, index) => {
              const stepStatus = getStepStatus(step.key);
              return (
                <div
                  key={step.key}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    stepStatus === "completed"
                      ? "bg-secondary/10 border border-secondary/30"
                      : stepStatus === "current"
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-muted/30 border border-transparent"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      stepStatus === "completed"
                        ? "bg-secondary text-secondary-foreground"
                        : stepStatus === "current"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stepStatus === "completed" ? (
                      <Check className="w-4 h-4" />
                    ) : stepStatus === "current" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      stepStatus === "completed"
                        ? "text-secondary font-medium"
                        : stepStatus === "current"
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Time Estimate */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
            <Clock className="w-4 h-4" />
            <span>This may take 45-60 seconds</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisProcessingIndicator;
