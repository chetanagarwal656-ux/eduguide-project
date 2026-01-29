import { Check, X } from "lucide-react";

interface ExamOption {
  id: string;
  name: string;
  icon: string;
}

const examOptions: ExamOption[] = [
  { id: "jee", name: "JEE", icon: "📘" },
  { id: "neet", name: "NEET", icon: "🩺" },
  { id: "upsc", name: "UPSC", icon: "🏛️" },
];

interface ExamSelectorModalProps {
  isOpen: boolean;
  currentExam: string;
  onSelect: (exam: string) => void;
  onClose: () => void;
}

const ExamSelectorModal = ({
  isOpen,
  currentExam,
  onSelect,
  onClose,
}: ExamSelectorModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-sm animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Select Exam</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {examOptions.map((exam) => (
            <button
              key={exam.id}
              onClick={() => {
                onSelect(exam.id);
                onClose();
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                currentExam === exam.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted"
              }`}
            >
              <span className="text-2xl">{exam.icon}</span>
              <span className="font-medium text-foreground">{exam.name}</span>
              {currentExam === exam.id && (
                <Check className="w-5 h-5 text-primary ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamSelectorModal;
