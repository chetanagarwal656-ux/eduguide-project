import { Download, RefreshCw, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubjectScore {
  name: string;
  obtained: number;
  total: number;
  percentage: number;
}

interface DifficultyBreakdown {
  easy: { correct: number; total: number };
  medium: { correct: number; total: number };
  hard: { correct: number; total: number };
}

interface WeakTopic {
  topic: string;
  accuracy: number;
  recommendation: string;
}

interface AnalysisResultProps {
  exam: string;
  score: {
    obtained: number;
    total: number;
    percentage: number;
  };
  subjectScores: SubjectScore[];
  difficultyBreakdown: DifficultyBreakdown;
  weakTopics: WeakTopic[];
  aiSuggestions: string[];
  onReset: () => void;
}

const AnalysisResult = ({
  exam,
  score,
  subjectScores,
  difficultyBreakdown,
  weakTopics,
  aiSuggestions,
  onReset,
}: AnalysisResultProps) => {
  const handleDownloadPdf = () => {
    alert("PDF download will be implemented with backend integration");
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-secondary";
    if (percentage >= 60) return "text-primary";
    if (percentage >= 40) return "text-accent";
    return "text-destructive";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-secondary";
    if (percentage >= 60) return "bg-primary";
    if (percentage >= 40) return "bg-accent";
    return "bg-destructive";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Score Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">{exam} Mock Test Analysis</p>
            <div className={`text-5xl font-bold ${getScoreColor(score.percentage)}`}>
              {score.obtained}/{score.total}
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className={`text-2xl font-semibold ${getScoreColor(score.percentage)}`}>
                {score.percentage}%
              </span>
              {score.percentage >= 60 ? (
                <TrendingUp className="w-5 h-5 text-secondary" />
              ) : (
                <TrendingDown className="w-5 h-5 text-destructive" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise Scores */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Subject-wise Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjectScores.map((subject, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-foreground">{subject.name}</span>
                <span className={`font-semibold ${getScoreColor(subject.percentage)}`}>
                  {subject.obtained}/{subject.total} ({subject.percentage}%)
                </span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getProgressColor(subject.percentage)}`}
                  style={{ width: `${subject.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Difficulty Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Difficulty Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-secondary/10 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Easy</p>
              <p className="text-lg font-bold text-secondary">
                {difficultyBreakdown.easy.correct}/{difficultyBreakdown.easy.total}
              </p>
              <p className="text-xs text-muted-foreground">
                {Math.round((difficultyBreakdown.easy.correct / difficultyBreakdown.easy.total) * 100)}%
              </p>
            </div>
            <div className="text-center p-3 bg-accent/10 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Medium</p>
              <p className="text-lg font-bold text-accent">
                {difficultyBreakdown.medium.correct}/{difficultyBreakdown.medium.total}
              </p>
              <p className="text-xs text-muted-foreground">
                {Math.round((difficultyBreakdown.medium.correct / difficultyBreakdown.medium.total) * 100)}%
              </p>
            </div>
            <div className="text-center p-3 bg-destructive/10 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Hard</p>
              <p className="text-lg font-bold text-destructive">
                {difficultyBreakdown.hard.correct}/{difficultyBreakdown.hard.total}
              </p>
              <p className="text-xs text-muted-foreground">
                {Math.round((difficultyBreakdown.hard.correct / difficultyBreakdown.hard.total) * 100)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weak Topics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent" />
            Areas to Improve
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weakTopics.map((topic, index) => (
            <div
              key={index}
              className="p-3 bg-accent/5 border border-accent/20 rounded-lg"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-foreground">{topic.topic}</span>
                <span className="text-sm text-destructive font-semibold">
                  {topic.accuracy}% accuracy
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                💡 {topic.recommendation}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            🤖 AI Study Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {aiSuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-primary mt-0.5">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={handleDownloadPdf}
          className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          <Download className="w-4 h-4 mr-2" />
          📄 Download PDF Report
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="flex-1"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          🔄 Analyze Another Test
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResult;
