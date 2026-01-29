import { useState, useEffect } from "react";
import { AlertTriangle, Info, X, ChevronDown } from "lucide-react";

const DISCLAIMER_MINIMIZED_KEY = "eduguide_disclaimer_minimized";

const DisclaimerBanner = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHelplines, setShowHelplines] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(DISCLAIMER_MINIMIZED_KEY);
    if (saved === "true") {
      setIsMinimized(true);
    }
  }, []);

  const handleMinimize = () => {
    setIsMinimized(true);
    localStorage.setItem(DISCLAIMER_MINIMIZED_KEY, "true");
  };

  const handleExpand = () => {
    setIsMinimized(false);
    localStorage.setItem(DISCLAIMER_MINIMIZED_KEY, "false");
  };

  if (isMinimized) {
    return (
      <button
        onClick={handleExpand}
        className="w-full bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200/50 dark:border-amber-800/30 px-4 py-1.5 flex items-center justify-center gap-2 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
      >
        <AlertTriangle className="w-3 h-3" />
        <span>AI guidance disclaimer</span>
        <ChevronDown className="w-3 h-3" />
      </button>
    );
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200/50 dark:border-amber-800/30">
      <div className="max-w-lg mx-auto px-4 py-2">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="flex-1 text-xs text-amber-800 dark:text-amber-300">
            AI guidance for motivation. Not a substitute for professional counseling.
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowHelplines(!showHelplines)}
              className="p-1.5 rounded-full hover:bg-amber-200/50 dark:hover:bg-amber-800/30 transition-colors"
              aria-label="Show helplines"
            >
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </button>
            <button
              onClick={handleMinimize}
              className="p-1.5 rounded-full hover:bg-amber-200/50 dark:hover:bg-amber-800/30 transition-colors"
              aria-label="Minimize disclaimer"
            >
              <X className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </button>
          </div>
        </div>
        
        {showHelplines && (
          <div className="mt-2 pt-2 border-t border-amber-200/50 dark:border-amber-800/30 animate-fade-in">
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-1">
              Emergency Helplines:
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-amber-700 dark:text-amber-400">
              <span>NIMHANS: 080-46110007</span>
              <span>iCALL: 9152987821</span>
              <span>Vandrevala: 1860-2662-345</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisclaimerBanner;
