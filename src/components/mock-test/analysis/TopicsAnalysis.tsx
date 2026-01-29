import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface TopicsAnalysisProps {
  weakTopics: string[];
  strongTopics: string[];
}

const TopicsAnalysis = ({ weakTopics, strongTopics }: TopicsAnalysisProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      {/* Weak Topics */}
      <Card className="border-accent/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-accent">
            <AlertTriangle className="w-5 h-5" />
            Need Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {weakTopics.length > 0 ? (
              weakTopics.map((topic, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-full text-sm bg-accent/10 text-accent border border-accent/30"
                >
                  {topic}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No weak topics identified!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Strong Topics */}
      <Card className="border-secondary/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-secondary">
            <CheckCircle className="w-5 h-5" />
            Strong Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {strongTopics.length > 0 ? (
              strongTopics.map((topic, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-full text-sm bg-secondary/10 text-secondary border border-secondary/30"
                >
                  {topic}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Keep practicing to identify strengths!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopicsAnalysis;
