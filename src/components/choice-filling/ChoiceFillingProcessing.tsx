import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Search, Globe, BarChart3, Bot, FileText, Check } from "lucide-react";

interface ProcessingStep {
  id: number;
  icon: React.ReactNode;
  text: string;
  duration: number;
}

const PROCESSING_STEPS: ProcessingStep[] = [
  { id: 1, icon: <Search className="w-5 h-5" />, text: "Analyzing your profile...", duration: 8000 },
  { id: 2, icon: <Globe className="w-5 h-5" />, text: "Searching latest cutoff data from official sources...", duration: 12000 },
  { id: 3, icon: <BarChart3 className="w-5 h-5" />, text: "Comparing 1000+ college-branch combinations...", duration: 15000 },
  { id: 4, icon: <Bot className="w-5 h-5" />, text: "Generating personalized strategy...", duration: 12000 },
  { id: 5, icon: <FileText className="w-5 h-5" />, text: "Creating detailed reports...", duration: 8000 }
];

const TOTAL_DURATION = PROCESSING_STEPS.reduce((acc, step) => acc + step.duration, 0);

const ChoiceFillingProcessing = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 200;
      
      // Calculate which step we're on
      let stepElapsed = 0;
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        stepElapsed += PROCESSING_STEPS[i].duration;
        if (elapsed <= stepElapsed) {
          setCurrentStep(i);
          break;
        }
      }

      // Update progress (max 95% to show we're waiting for API)
      const progressPercent = Math.min((elapsed / TOTAL_DURATION) * 100, 95);
      setProgress(progressPercent);

    }, 200);

    return () => clearInterval(interval);
  }, []);

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "active";
    return "pending";
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-8 pb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h2 className="text-xl font-bold mb-2">Generating Your Strategy</h2>
          <p className="text-sm text-muted-foreground">
            Please don't close this window
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <p className="text-center text-sm text-muted-foreground mt-2">
            This may take 45-60 seconds
          </p>
        </div>

        {/* Processing Steps */}
        <div className="space-y-3">
          {PROCESSING_STEPS.map((step, index) => {
            const status = getStepStatus(index);
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  status === "active"
                    ? "bg-primary/10 border border-primary/30"
                    : status === "completed"
                    ? "bg-secondary/10"
                    : "bg-muted/30"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    status === "active"
                      ? "bg-primary text-primary-foreground"
                      : status === "completed"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {status === "completed" ? (
                    <Check className="w-4 h-4" />
                  ) : status === "active" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={`text-sm ${
                    status === "active"
                      ? "text-foreground font-medium"
                      : status === "completed"
                      ? "text-secondary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.text}
                </span>
                {status === "active" && (
                  <span className="ml-auto text-xs text-primary">⏳</span>
                )}
                {status === "completed" && (
                  <span className="ml-auto text-xs text-secondary">✓</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-1 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChoiceFillingProcessing;
