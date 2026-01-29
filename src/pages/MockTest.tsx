import { useState, useEffect } from "react";
import { FileText, BarChart3, FileSearch, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/mock-test/FileUpload";
import ProcessingIndicator from "@/components/mock-test/ProcessingIndicator";
import AnalysisProcessingIndicator from "@/components/mock-test/AnalysisProcessingIndicator";
import SolutionsResult from "@/components/mock-test/SolutionsResult";
import AnalysisDashboard from "@/components/mock-test/analysis/AnalysisDashboard";
import { usePdfToImages } from "@/hooks/usePdfToImages";

type Screen = "initial" | "solutions-upload" | "analysis-upload" | "solutions-processing" | "analysis-processing" | "solutions-result" | "analysis-result";
type Exam = "JEE" | "NEET" | "UPSC";

const STORAGE_KEY = "eduguide_selected_exam";
const SOLUTIONS_API = "https://abcdef123456.app.n8n.cloud/webhook/webhook/mock-test-vision-test";
const ANALYSIS_API = "https://abcdef123456.app.n8n.cloud/webhook/webhook/mock-test-analysis-vision-test";

// Helper to clean base64 data
const cleanBase64 = (dataUrl: string): string => {
  // Remove data URI prefix if present
  const base64Match = dataUrl.match(/^data:[^;]+;base64,(.+)$/);
  return base64Match ? base64Match[1] : dataUrl.replace(/\s/g, '');
};

const MockTest = () => {
  const [screen, setScreen] = useState<Screen>("initial");
  const [selectedExam, setSelectedExam] = useState<Exam>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved as Exam) || "JEE";
  });
  const [testFile, setTestFile] = useState<File | null>(null);
  const [testPreview, setTestPreview] = useState<string | null>(null);
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [answerPreview, setAnswerPreview] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<"extracting" | "analyzing" | "complete">("extracting");
  const [error, setError] = useState<string | null>(null);

  // Mock result states
  const [solutionsData, setSolutionsData] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const { convertPdfToImages, isConverting, currentPage, totalPages } = usePdfToImages();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, selectedExam);
  }, [selectedExam]);

  const handleFileSelect = async (file: File | null, type: "test" | "answer") => {
    if (!file) {
      if (type === "test") {
        setTestFile(null);
        setTestPreview(null);
      } else {
        setAnswerFile(null);
        setAnswerPreview(null);
      }
      return;
    }

    // Generate preview
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        if (type === "test") {
          setTestFile(file);
          setTestPreview(preview);
        } else {
          setAnswerFile(file);
          setAnswerPreview(preview);
        }
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      if (type === "test") {
        setTestFile(file);
        setTestPreview("pdf");
      } else {
        setAnswerFile(file);
        setAnswerPreview("pdf");
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGenerateSolutions = async () => {
    if (!testFile) return;
    
    setScreen("solutions-processing");
    setProcessingStatus("extracting");
    setError(null);

    try {
      let testImageBase64: string;

      if (testFile.type === "application/pdf") {
        const result = await convertPdfToImages(testFile);
        // Use first page image for now
        testImageBase64 = cleanBase64(result.images[0]);
      } else {
        const base64 = await fileToBase64(testFile);
        testImageBase64 = cleanBase64(base64);
      }

      setProcessingStatus("analyzing");

      const response = await fetch(SOLUTIONS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam: selectedExam,
          testImage: testImageBase64,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Analysis failed. Please try again.");
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to process the image. Please try again.");
      }

      // Transform API response to match component expectations
      const transformedData = {
        questions: data.questions.map((q: any) => ({
          questionNumber: q.questionNumber,
          topic: q.concept || "General",
          question: q.question,
          correctAnswer: q.correctAnswer,
          solution: q.solution,
          concept: q.concept,
        })),
        totalQuestions: data.totalQuestions,
        exam: data.exam,
      };

      setSolutionsData(transformedData);
      setProcessingStatus("complete");
      setScreen("solutions-result");
    } catch (err) {
      console.error("Solutions API error:", err);
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
      // Stay on processing screen but show error
      setProcessingStatus("extracting");
      setScreen("solutions-upload");
    }
  };

  const handleGenerateAnalysis = async () => {
    if (!testFile || !answerFile) return;
    
    setScreen("analysis-processing");
    setProcessingStatus("extracting");
    setError(null);

    try {
      const testBase64Raw = await fileToBase64(testFile);
      const answerBase64Raw = await fileToBase64(answerFile);
      
      // Clean base64 data (remove data URI prefix)
      const testBase64 = cleanBase64(testBase64Raw);
      const answerBase64 = cleanBase64(answerBase64Raw);

      setProcessingStatus("analyzing");

      const response = await fetch(ANALYSIS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam: selectedExam,
          testImage: testBase64,
          answerImage: answerBase64,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Analysis failed. Please try again.");
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to analyze images. Please ensure images are clear and well-lit.");
      }

      // Transform API response to match dashboard expectations
      const transformedData = {
        analysis: {
          ...data.analysis,
          questionAnalysis: data.analysis.questionAnalysis?.map((q: any) => ({
            questionNumber: q.questionNumber,
            topic: q.topic,
            yourAnswer: q.studentAnswer || q.yourAnswer || "",
            correctAnswer: q.correctAnswer,
            isCorrect: q.isCorrect,
            isAttempted: q.studentAnswer !== "" && q.studentAnswer !== undefined && q.studentAnswer !== null,
            marksObtained: q.marks || 0,
            maxMarks: 4,
            difficulty: q.difficulty || "Medium",
            feedback: q.feedback || "",
          })) || [],
        },
        validation: data.validation || { status: "PASS", warnings: [] },
      };

      setAnalysisData(transformedData);
      setProcessingStatus("complete");
      setScreen("analysis-result");
    } catch (err) {
      console.error("Analysis API error:", err);
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
      setScreen("analysis-upload");
    }
  };

  const handleReset = () => {
    setScreen("initial");
    setTestFile(null);
    setTestPreview(null);
    setAnswerFile(null);
    setAnswerPreview(null);
    setSolutionsData(null);
    setAnalysisData(null);
    setError(null);
  };

  const renderInitialScreen = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Exam Selector */}
      <Card>
        <CardContent className="pt-6">
          <Label className="text-sm font-medium mb-3 block">Select Your Exam</Label>
          <RadioGroup
            value={selectedExam}
            onValueChange={(value) => setSelectedExam(value as Exam)}
            className="flex gap-6"
          >
            {(["JEE", "NEET", "UPSC"] as Exam[]).map((exam) => (
              <div key={exam} className="flex items-center space-x-2">
                <RadioGroupItem value={exam} id={exam} />
                <Label htmlFor={exam} className="cursor-pointer font-medium">
                  {exam}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Option Cards */}
      <div className="space-y-4">
        <Card
          className="cursor-pointer hover:shadow-card-hover transition-all border-2 hover:border-primary/50"
          onClick={() => setScreen("solutions-upload")}
        >
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                📝
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-1">Get Solutions</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload mock test paper to get detailed solutions for all questions
                </p>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Select This
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-card-hover transition-all border-2 hover:border-secondary/50"
          onClick={() => setScreen("analysis-upload")}
        >
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center text-2xl">
                📊
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-1">Performance Analysis</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload mock test + your answer sheet to get detailed performance report
                </p>
                <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Select This
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium">AI-Powered Analysis</p>
            <p className="text-xs text-muted-foreground mt-1">
              Results are AI-generated for guidance only. Please verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSolutionsUpload = () => (
    <div className="space-y-6 animate-fade-in">
      <Button
        variant="ghost"
        onClick={handleReset}
        className="mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* AI Vision Badge */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-3 text-center">
        <p className="text-sm font-medium text-foreground">
          ✨ Powered by AI Vision - 100% Accurate Math Notation
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-destructive font-medium">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setError(null)}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      <FileUpload
        label="Upload Mock Test Paper"
        icon={<FileSearch className="w-5 h-5" />}
        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        maxSize={10}
        file={testFile}
        onFileSelect={(f) => handleFileSelect(f, "test")}
        preview={testPreview}
      />

      {testFile && (
        <Button
          onClick={handleGenerateSolutions}
          className="w-full h-14 text-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          📖 GENERATE SOLUTIONS
        </Button>
      )}
    </div>
  );

  const renderAnalysisUpload = () => (
    <div className="space-y-6 animate-fade-in">
      <Button
        variant="ghost"
        onClick={handleReset}
        className="mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* AI Vision Badge */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-3 text-center">
        <p className="text-sm font-medium text-foreground">
          ✨ Powered by AI Vision - 95%+ Accurate Answer Comparison
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-destructive font-medium">{error}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tip: Make sure images are clear and well-lit for better accuracy.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setError(null)}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      <FileUpload
        label="📄 Upload Test Paper (Questions)"
        icon={<FileText className="w-5 h-5" />}
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        maxSize={10}
        file={testFile}
        onFileSelect={(f) => handleFileSelect(f, "test")}
        preview={testPreview}
      />

      <FileUpload
        label="✍️ Upload Answer Sheet (Your Answers)"
        icon={<FileText className="w-5 h-5" />}
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        maxSize={10}
        disabled={!testFile}
        file={answerFile}
        onFileSelect={(f) => handleFileSelect(f, "answer")}
        preview={answerPreview}
      />

      {/* Helper Text */}
      <div className="bg-muted/30 rounded-lg p-3 text-center">
        <p className="text-xs text-muted-foreground">
          📸 Make sure images are <strong>clear and well-lit</strong> for best results
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supported formats: JPG, PNG (max 10MB each)
        </p>
      </div>

      {testFile && answerFile && (
        <Button
          onClick={handleGenerateAnalysis}
          className="w-full h-14 text-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          📊 ANALYZE PERFORMANCE
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="gradient-primary text-primary-foreground px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              {screen === "analysis-result" ? (
                <BarChart3 className="w-7 h-7" />
              ) : (
                <FileText className="w-7 h-7" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Mock Test Analysis</h1>
              <p className="text-sm opacity-90">
                {screen === "initial" && "Get solutions or analyze performance"}
                {screen === "solutions-upload" && "Upload your test paper"}
                {screen === "analysis-upload" && "Upload test & answer sheet"}
                {(screen === "solutions-processing" || screen === "analysis-processing") && "Processing your files..."}
                {screen === "solutions-result" && "Your solutions are ready"}
                {screen === "analysis-result" && "Your analysis is ready"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 max-w-lg mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm">
            ⚠️ {error}
          </div>
        )}

        {screen === "initial" && renderInitialScreen()}
        {screen === "solutions-upload" && renderSolutionsUpload()}
        {screen === "analysis-upload" && renderAnalysisUpload()}
        {screen === "solutions-processing" && (
          <ProcessingIndicator
            isPdf={testFile?.type === "application/pdf"}
            currentPage={currentPage}
            totalPages={totalPages}
            status={processingStatus}
          />
        )}
        {screen === "analysis-processing" && (
          <AnalysisProcessingIndicator
            status={processingStatus}
          />
        )}
        {screen === "solutions-result" && solutionsData && (
          <SolutionsResult
            exam={solutionsData.exam || selectedExam}
            solutions={solutionsData.questions || solutionsData.solutions || []}
            onReset={handleReset}
          />
        )}
        {screen === "analysis-result" && analysisData && (
          <AnalysisDashboard
            exam={selectedExam}
            analysis={analysisData.analysis || analysisData}
            validation={analysisData.validation}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
};

export default MockTest;
