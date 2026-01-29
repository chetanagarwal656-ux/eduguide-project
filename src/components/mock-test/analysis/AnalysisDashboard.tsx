import { Download, RefreshCw, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ScoreHeroCard from "./ScoreHeroCard";
import SubjectBreakdown from "./SubjectBreakdown";
import QuestionAnalysis from "./QuestionAnalysis";
import TopicsAnalysis from "./TopicsAnalysis";
import SuggestionsCard from "./SuggestionsCard";
import ValidationBadge from "./ValidationBadge";

interface AnalysisData {
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  score: string;
  percentage: string;
  questionAnalysis: Array<{
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
  }>;
  subjectBreakdown: Record<string, {
    correct: number;
    total: number;
    percentage: string;
  }>;
  weakTopics: string[];
  strongTopics: string[];
  suggestions: string[];
}

interface ValidationData {
  status: "PASS" | "WARN" | "FAIL";
  warnings?: string[];
}

interface AnalysisDashboardProps {
  exam: string;
  analysis: AnalysisData;
  validation?: ValidationData;
  onReset: () => void;
}

const AnalysisDashboard = ({ exam, analysis, validation, onReset }: AnalysisDashboardProps) => {
  const navigate = useNavigate();

  const handleDownloadPdf = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${exam} Performance Analysis Report</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; color: #1F2937; line-height: 1.6; }
          h1 { color: #2196F3; border-bottom: 3px solid #2196F3; padding-bottom: 10px; margin-bottom: 20px; }
          h2 { color: #374151; margin: 25px 0 15px; padding-bottom: 8px; border-bottom: 2px solid #E5E7EB; }
          .header { text-align: center; margin-bottom: 30px; }
          .score-box { background: linear-gradient(135deg, #EFF6FF, #DBEAFE); border-radius: 12px; padding: 30px; text-align: center; margin: 20px 0; }
          .score-value { font-size: 48px; font-weight: bold; color: #2196F3; }
          .percentage { font-size: 24px; color: #6B7280; margin-top: 5px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
          .stat-card { padding: 15px; border-radius: 8px; text-align: center; }
          .stat-card.total { background: #F3F4F6; }
          .stat-card.attempted { background: #DBEAFE; }
          .stat-card.correct { background: #D1FAE5; }
          .stat-card.incorrect { background: #FEE2E2; }
          .stat-value { font-size: 24px; font-weight: bold; }
          .stat-label { font-size: 12px; color: #6B7280; }
          .subject-item { margin: 10px 0; padding: 12px; background: #F9FAFB; border-radius: 8px; }
          .subject-name { font-weight: 600; margin-bottom: 5px; }
          .progress-bar { height: 8px; background: #E5E7EB; border-radius: 4px; overflow: hidden; margin-top: 8px; }
          .progress-fill { height: 100%; background: #4CAF50; border-radius: 4px; }
          .topic-section { display: flex; gap: 20px; margin: 20px 0; }
          .topic-col { flex: 1; padding: 15px; border-radius: 8px; }
          .topic-col.weak { background: #FEF3C7; border: 1px solid #F59E0B; }
          .topic-col.strong { background: #D1FAE5; border: 1px solid #10B981; }
          .topic-tag { display: inline-block; padding: 5px 12px; margin: 4px; border-radius: 20px; font-size: 13px; }
          .topic-tag.weak { background: #FBBF24; color: #78350F; }
          .topic-tag.strong { background: #34D399; color: #064E3B; }
          .suggestion-list { list-style: none; }
          .suggestion-item { padding: 10px 15px; margin: 8px 0; background: #EFF6FF; border-left: 4px solid #2196F3; border-radius: 0 8px 8px 0; }
          .question-card { border: 1px solid #E5E7EB; border-radius: 8px; margin: 10px 0; padding: 15px; page-break-inside: avoid; }
          .question-card.correct { border-left: 4px solid #10B981; }
          .question-card.incorrect { border-left: 4px solid #EF4444; }
          .question-card.unattempted { border-left: 4px solid #9CA3AF; }
          .question-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .answer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0; }
          .answer-box { padding: 10px; border-radius: 6px; font-size: 14px; }
          .answer-box.your { background: #F3F4F6; }
          .answer-box.correct { background: #D1FAE5; }
          .feedback { background: #EFF6FF; padding: 10px; border-radius: 6px; font-size: 13px; margin-top: 10px; }
          @media print { body { margin: 15mm; } .question-card { page-break-inside: avoid; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 ${exam} Performance Analysis Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
        </div>

        <div class="score-box">
          <div class="score-value">${analysis.score}</div>
          <div class="percentage">${analysis.percentage}</div>
        </div>

        <div class="stats-grid">
          <div class="stat-card total">
            <div class="stat-value">${analysis.totalQuestions}</div>
            <div class="stat-label">Total Questions</div>
          </div>
          <div class="stat-card attempted">
            <div class="stat-value">${analysis.attempted}</div>
            <div class="stat-label">Attempted</div>
          </div>
          <div class="stat-card correct">
            <div class="stat-value">${analysis.correct}</div>
            <div class="stat-label">Correct</div>
          </div>
          <div class="stat-card incorrect">
            <div class="stat-value">${analysis.incorrect}</div>
            <div class="stat-label">Incorrect</div>
          </div>
        </div>

        <h2>📈 Subject-wise Performance</h2>
        ${Object.entries(analysis.subjectBreakdown).map(([subject, data]) => `
          <div class="subject-item">
            <div class="subject-name">${subject}</div>
            <div>${data.correct} out of ${data.total} correct (${data.percentage})</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${data.percentage}"></div>
            </div>
          </div>
        `).join('')}

        <h2>🎯 Topics Analysis</h2>
        <div class="topic-section">
          <div class="topic-col weak">
            <strong>⚠️ Need Improvement</strong><br/><br/>
            ${analysis.weakTopics.map(t => `<span class="topic-tag weak">${t}</span>`).join('')}
          </div>
          <div class="topic-col strong">
            <strong>✅ Strong Areas</strong><br/><br/>
            ${analysis.strongTopics.map(t => `<span class="topic-tag strong">${t}</span>`).join('')}
          </div>
        </div>

        <h2>💡 Personalized Improvement Plan</h2>
        <ol class="suggestion-list">
          ${analysis.suggestions.map((s, i) => `<li class="suggestion-item">${i + 1}. ${s}</li>`).join('')}
        </ol>

        <h2>📝 Question-by-Question Analysis</h2>
        ${analysis.questionAnalysis.map(q => `
          <div class="question-card ${q.isCorrect ? 'correct' : q.isAttempted ? 'incorrect' : 'unattempted'}">
            <div class="question-header">
              <strong>Q${q.questionNumber} - ${q.topic}</strong>
              <span>${q.isCorrect ? '✅' : q.isAttempted ? '❌' : '⬜'} ${q.marksObtained > 0 ? '+' : ''}${q.marksObtained} marks</span>
            </div>
            <div class="answer-grid">
              <div class="answer-box your">
                <small>Your Answer</small><br/>
                <strong>${q.isAttempted ? q.yourAnswer : 'Not Attempted'}</strong>
              </div>
              <div class="answer-box correct">
                <small>Correct Answer</small><br/>
                <strong>${q.correctAnswer}</strong>
              </div>
            </div>
            <div class="feedback">💡 ${q.feedback}</div>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => printWindow.print();
    } else {
      alert('Please allow popups to download PDF.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* AI Vision Badge */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-3 text-center">
        <p className="text-sm font-medium text-foreground">
          ✨ Powered by AI Vision - 95%+ Accurate Answer Comparison
        </p>
      </div>

      {/* Validation Status */}
      {validation && (
        <ValidationBadge status={validation.status} warnings={validation.warnings} />
      )}

      {/* Score Hero Card */}
      <ScoreHeroCard
        score={analysis.score}
        percentage={analysis.percentage}
        totalQuestions={analysis.totalQuestions}
        attempted={analysis.attempted}
        correct={analysis.correct}
        incorrect={analysis.incorrect}
      />

      {/* Subject Breakdown */}
      {analysis.subjectBreakdown && Object.keys(analysis.subjectBreakdown).length > 0 && (
        <SubjectBreakdown subjects={analysis.subjectBreakdown} />
      )}

      {/* Topics Analysis */}
      <TopicsAnalysis
        weakTopics={analysis.weakTopics || []}
        strongTopics={analysis.strongTopics || []}
      />

      {/* Question Analysis */}
      {analysis.questionAnalysis && analysis.questionAnalysis.length > 0 && (
        <QuestionAnalysis questions={analysis.questionAnalysis} />
      )}

      {/* AI Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <SuggestionsCard suggestions={analysis.suggestions} />
      )}

      {/* Disclaimer Banner */}
      <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium">AI-Generated Analysis</p>
            <p className="text-xs text-muted-foreground mt-1">
              This analysis is based on image comparison. Please verify important details independently.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={handleDownloadPdf}
          className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="flex-1"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Analyze Another
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex-1"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
