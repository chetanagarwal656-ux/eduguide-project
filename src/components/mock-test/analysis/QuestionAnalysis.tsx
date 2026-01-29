import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Check, X, Minus, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuestionData {
  questionNumber: number;
  topic: string;
  yourAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  isAttempted: boolean;
  marksObtained: number;
  maxMarks: number;
  difficulty: "Easy" | "Medium" | "Hard";
  feedback: string;
}

interface QuestionAnalysisProps {
  questions: QuestionData[];
}

const QuestionAnalysis = ({ questions }: QuestionAnalysisProps) => {
  const getStatusIcon = (isCorrect: boolean, isAttempted: boolean) => {
    if (!isAttempted) return <Minus className="w-4 h-4 text-muted-foreground" />;
    if (isCorrect) return <Check className="w-4 h-4 text-secondary" />;
    return <X className="w-4 h-4 text-destructive" />;
  };

  const getStatusBg = (isCorrect: boolean, isAttempted: boolean) => {
    if (!isAttempted) return "bg-muted/50";
    if (isCorrect) return "bg-secondary/10 border-secondary/30";
    return "bg-destructive/10 border-destructive/30";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-secondary/20 text-secondary border-secondary/30";
      case "Medium": return "bg-accent/20 text-accent border-accent/30";
      case "Hard": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Detailed Question Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-2">
          {questions.map((q, index) => (
            <AccordionItem 
              key={q.questionNumber} 
              value={`question-${q.questionNumber}`}
              className={`border rounded-lg px-4 ${getStatusBg(q.isCorrect, q.isAttempted)}`}
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-3 text-left w-full pr-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    q.isCorrect ? "bg-secondary/20" : q.isAttempted ? "bg-destructive/20" : "bg-muted"
                  }`}>
                    {getStatusIcon(q.isCorrect, q.isAttempted)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">Q{q.questionNumber}</span>
                      <span className="text-sm text-muted-foreground truncate">
                        - {q.topic}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getDifficultyColor(q.difficulty)}>
                      {q.difficulty}
                    </Badge>
                    <span className={`text-sm font-semibold ${
                      q.marksObtained > 0 ? "text-secondary" : 
                      q.marksObtained < 0 ? "text-destructive" : "text-muted-foreground"
                    }`}>
                      {q.marksObtained > 0 ? `+${q.marksObtained}` : q.marksObtained}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                <div className="space-y-3 pl-11">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-background">
                      <p className="text-xs text-muted-foreground mb-1">Your Answer</p>
                      <p className={`font-medium ${
                        !q.isAttempted ? "text-muted-foreground" : 
                        q.isCorrect ? "text-secondary" : "text-destructive"
                      }`}>
                        {q.isAttempted ? q.yourAnswer : "Not Attempted"}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/10">
                      <p className="text-xs text-muted-foreground mb-1">Correct Answer</p>
                      <p className="font-medium text-secondary">{q.correctAnswer}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs text-primary mb-1 font-medium">💡 AI Feedback</p>
                    <p className="text-sm text-foreground">{q.feedback}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default QuestionAnalysis;
