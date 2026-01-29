import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface SubjectData {
  correct: number;
  total: number;
  percentage: string;
}

interface SubjectBreakdownProps {
  subjects: Record<string, SubjectData>;
}

const SubjectBreakdown = ({ subjects }: SubjectBreakdownProps) => {
  const subjectEntries = Object.entries(subjects);

  const getBarColor = (percentage: number) => {
    if (percentage >= 70) return "bg-secondary";
    if (percentage >= 50) return "bg-primary";
    if (percentage >= 30) return "bg-accent";
    return "bg-destructive";
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Subject Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subjectEntries.map(([subject, data], index) => {
          const percentValue = parseFloat(data.percentage.replace("%", ""));
          return (
            <div 
              key={subject} 
              className="space-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">{subject}</span>
                <span className="text-sm text-muted-foreground">
                  {data.correct}/{data.total} ({data.percentage})
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${getBarColor(percentValue)} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${percentValue}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SubjectBreakdown;
