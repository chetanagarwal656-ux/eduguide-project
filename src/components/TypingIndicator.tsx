import { Sparkles } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex gap-3 max-w-[65%]">
        {/* AI Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        
        <div className="bg-muted rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span 
                className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"
                style={{ animationDelay: '0ms', animationDuration: '1s' }}
              />
              <span 
                className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"
                style={{ animationDelay: '150ms', animationDuration: '1s' }}
              />
              <span 
                className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"
                style={{ animationDelay: '300ms', animationDuration: '1s' }}
              />
            </div>
            <span className="text-xs text-muted-foreground">AI is typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
