import { Home, MessageCircle, FileText, ListChecks } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: "/", label: "Home", icon: Home },
  { path: "/chat", label: "Motivation", icon: MessageCircle },
  { path: "/mock-test", label: "Mock Test", icon: FileText },
  { path: "/choice-filling", label: "Counselling", icon: ListChecks },
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card shadow-nav border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                {isActive && (
                  <div className="absolute inset-0 bg-primary/20 rounded-full scale-150 animate-pulse-ring" />
                )}
                <Icon
                  className={`w-6 h-6 transition-transform duration-200 ${
                    isActive ? "scale-110" : ""
                  }`}
                />
              </div>
              <span
                className={`text-xs mt-1 font-medium transition-all duration-200 ${
                  isActive ? "opacity-100" : "opacity-70"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
