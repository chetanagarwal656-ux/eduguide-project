import { useState, useEffect } from "react";
import ExamCard from "@/components/ExamCard";
import { GraduationCap } from "lucide-react";

const STORAGE_KEY = "eduguide_selected_exam";

interface Exam {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  gradientClass: string;
  borderColor: string;
}

const exams: Exam[] = [
  {
    id: "jee",
    name: "JEE",
    subtitle: "Engineering",
    icon: "📘",
    gradientClass: "gradient-card-jee bg-card",
    borderColor: "border-primary",
  },
  {
    id: "neet",
    name: "NEET",
    subtitle: "Medical",
    icon: "🩺",
    gradientClass: "gradient-card-neet bg-card",
    borderColor: "border-secondary",
  },
  {
    id: "upsc",
    name: "UPSC",
    subtitle: "Civil Services",
    icon: "🏛️",
    gradientClass: "gradient-card-upsc bg-card",
    borderColor: "border-accent",
  },
];

const Index = () => {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSelectedExam(saved);
    }
  }, []);

  const handleSelectExam = (id: string) => {
    setSelectedExam(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="gradient-primary text-primary-foreground px-6 pt-12 pb-10 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4 animate-fade-in">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="text-lg font-semibold opacity-90">EduGuide</span>
          </div>

          <h1 className="text-3xl font-bold mb-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Welcome to EduGuide
          </h1>
          <p className="text-lg opacity-90 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Your AI Companion for Exam Success
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 max-w-lg mx-auto">
        {/* Section Title */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-xl font-bold text-foreground mb-1">Select Your Exam</h2>
          <p className="text-muted-foreground text-sm">Choose the exam you're preparing for</p>
        </div>

        {/* Exam Cards Grid */}
        <div className="grid gap-4">
          {exams.map((exam, index) => (
            <div
              key={exam.id}
              className="animate-fade-in"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <ExamCard
                {...exam}
                isSelected={selectedExam === exam.id}
                onSelect={handleSelectExam}
              />
            </div>
          ))}
        </div>

        {/* Info Text */}
        <p
          className="text-center text-sm text-muted-foreground mt-8 animate-fade-in flex items-center justify-center gap-2"
          style={{ animationDelay: "0.7s" }}
        >
          <span className="inline-block animate-bounce-soft">👆</span>
          Tap any card to select your exam
        </p>
      </main>
    </div>
  );
};

export default Index;
