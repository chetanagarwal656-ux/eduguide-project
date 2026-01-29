import { CheckCircle, AlertTriangle } from "lucide-react";

interface ValidationBadgeProps {
  status: "PASS" | "WARN" | "FAIL";
  warnings?: string[];
}

const ValidationBadge = ({ status, warnings = [] }: ValidationBadgeProps) => {
  if (status === "PASS" && warnings.length === 0) {
    return (
      <div className="flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-lg px-3 py-2 text-sm">
        <CheckCircle className="w-4 h-4 text-secondary" />
        <span className="text-secondary font-medium">✓ Analysis Verified</span>
      </div>
    );
  }

  return (
    <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-accent" />
        <span className="text-accent font-medium text-sm">
          {status === "WARN" ? "Analysis completed with warnings" : "Verification issues detected"}
        </span>
      </div>
      {warnings.length > 0 && (
        <ul className="space-y-1 ml-6">
          {warnings.map((warning, index) => (
            <li key={index} className="text-xs text-muted-foreground">
              • {warning}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ValidationBadge;
