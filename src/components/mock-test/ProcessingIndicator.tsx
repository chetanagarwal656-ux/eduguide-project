import { Loader2, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProcessingIndicatorProps {
  isPdf?: boolean;
  currentPage?: number;
  totalPages?: number;
  status: "extracting" | "analyzing" | "complete";
}

const ProcessingIndicator = ({
  isPdf = false,
  currentPage = 0,
  totalPages = 0,
  status,
}: ProcessingIndicatorProps) => {
  const getStatusText = () => {
    switch (status) {
      case "extracting":
        return "🔍 Reading image with AI Vision...";
      case "analyzing":
        return "✨ Generating solutions with perfect math notation...";
      case "complete":
        return "✓ Analysis complete!";
      default:
        return "⚙️ Processing...";
    }
  };

  const progressValue = isPdf && totalPages > 0 
    ? (currentPage / totalPages) * 100 
    : status === "extracting" ? 40 : status === "analyzing" ? 80 : 100;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 animate-fade-in">
      {/* AI Vision Badge */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">AI Vision Processing</span>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        {isPdf ? `⚙️ Processing Page ${currentPage} of ${totalPages}...` : "⚙️ Analyzing..."}
      </h3>

      <div className="w-full max-w-xs mb-4">
        <Progress value={progressValue} className="h-2" />
      </div>

      <p className="text-sm text-muted-foreground text-center">
        {getStatusText()}
      </p>

      <p className="text-xs text-muted-foreground mt-4 text-center max-w-xs">
        Processing may take 30-45 seconds. Please don't close this page.
      </p>

      <div className="mt-6 text-center">
        <p className="text-xs text-primary/80">
          ✨ Using Gemini Vision for 100% accurate math extraction
        </p>
      </div>
    </div>
  );
};

export default ProcessingIndicator;
