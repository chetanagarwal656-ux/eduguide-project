import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ScoreHeroCardProps {
  score: string;
  percentage: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
}

const ScoreHeroCard = ({
  score,
  percentage,
  totalQuestions,
  attempted,
  correct,
  incorrect,
}: ScoreHeroCardProps) => {
  const percentValue = parseFloat(percentage.replace("%", ""));
  
  const ringColor = useMemo(() => {
    if (percentValue >= 60) return "stroke-secondary";
    if (percentValue >= 40) return "stroke-accent";
    return "stroke-destructive";
  }, [percentValue]);

  const bgGradient = useMemo(() => {
    if (percentValue >= 60) return "from-secondary/10 to-secondary/5";
    if (percentValue >= 40) return "from-accent/10 to-accent/5";
    return "from-destructive/10 to-destructive/5";
  }, [percentValue]);

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentValue / 100) * circumference;

  return (
    <Card className={`bg-gradient-to-br ${bgGradient} border-none shadow-lg animate-fade-in`}>
      <CardContent className="pt-6 pb-8">
        <div className="flex flex-col items-center">
          {/* Circular Progress */}
          <div className="relative w-48 h-48 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                className="stroke-muted"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                className={`${ringColor} transition-all duration-1000 ease-out`}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-foreground">{score}</span>
              <span className="text-lg font-semibold text-muted-foreground mt-1">
                {percentage}
              </span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-2 w-full mt-4">
            <div className="text-center p-2 rounded-lg bg-background/50">
              <p className="text-xl font-bold text-foreground">{totalQuestions}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-primary/10">
              <p className="text-xl font-bold text-primary">{attempted}</p>
              <p className="text-xs text-muted-foreground">Attempted</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-secondary/10">
              <p className="text-xl font-bold text-secondary">{correct}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-destructive/10">
              <p className="text-xl font-bold text-destructive">{incorrect}</p>
              <p className="text-xs text-muted-foreground">Wrong</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreHeroCard;
