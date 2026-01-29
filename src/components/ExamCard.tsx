import { Check } from "lucide-react";

interface ExamCardProps {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  gradientClass: string;
  borderColor: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const ExamCard = ({
  id,
  name,
  subtitle,
  icon,
  gradientClass,
  borderColor,
  isSelected,
  onSelect,
}: ExamCardProps) => {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`relative w-full p-6 rounded-xl transition-all duration-300 ${gradientClass} border-2 ${
        isSelected
          ? `${borderColor} shadow-card-hover scale-[1.02]`
          : "border-transparent shadow-card hover:shadow-card-hover hover:scale-[1.01]"
      }`}
    >
      {/* Selection checkmark */}
      {isSelected && (
        <div
          className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center animate-scale-in ${
            id === "jee"
              ? "bg-primary"
              : id === "neet"
              ? "bg-secondary"
              : "bg-accent"
          }`}
        >
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Icon */}
      <div className="text-4xl mb-3">{icon}</div>

      {/* Content */}
      <h3 className="text-lg font-bold text-foreground mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </button>
  );
};

export default ExamCard;
