import { ChevronDown } from "lucide-react";

interface ScrollToBottomButtonProps {
  onClick: () => void;
  visible: boolean;
}

const ScrollToBottomButton = ({ onClick, visible }: ScrollToBottomButtonProps) => {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="absolute bottom-4 right-4 w-10 h-10 bg-card rounded-full shadow-lg border border-border flex items-center justify-center hover:bg-muted transition-all duration-200 animate-fade-in z-10"
      aria-label="Scroll to bottom"
    >
      <ChevronDown className="w-5 h-5 text-muted-foreground" />
    </button>
  );
};

export default ScrollToBottomButton;
