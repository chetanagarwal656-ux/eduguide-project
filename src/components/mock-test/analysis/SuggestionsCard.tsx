import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface SuggestionsCardProps {
  suggestions: string[];
}

const SuggestionsCard = ({ suggestions }: SuggestionsCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Personalized Improvement Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                {index + 1}
              </span>
              <span className="text-sm text-foreground leading-relaxed">{suggestion}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};

export default SuggestionsCard;
