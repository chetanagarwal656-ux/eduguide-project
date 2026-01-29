import { useState, useEffect, useRef, useCallback } from "react";
import ExamSelectorModal from "@/components/ExamSelector";
import ChatMessage, { Message } from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ScrollToBottomButton from "@/components/chat/ScrollToBottomButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

const STORAGE_KEY = "eduguide_selected_exam";
const WEBHOOK_URL = "https://abcdef123456.app.n8n.cloud/webhook/1b90d498-d74c-4b65-b3f4-edcbd01cbf20/chat";

const examNames: Record<string, string> = {
  jee: "JEE",
  neet: "NEET",
  upsc: "UPSC",
};

const getWelcomeMessage = (exam: string): string => {
  const examName = examNames[exam] || "exam";
  return `👋 Hello! I'm your ${examName} preparation assistant.

I can help you with motivation, study strategies, and overcoming challenges during your preparation.

How can I assist you today?`;
};

const MotivationChat = () => {
  const [selectedExam, setSelectedExam] = useState<string>("jee");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load selected exam from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSelectedExam(saved);
    }
  }, []);

  // Initialize welcome message when exam changes
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: getWelcomeMessage(selectedExam),
        timestamp: new Date(),
      },
    ]);
  }, [selectedExam]);

  // Auto-scroll to latest message
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Track scroll position for scroll-to-bottom button
  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  }, []);

  const handleExamChange = (exam: string) => {
    setSelectedExam(exam);
    localStorage.setItem(STORAGE_KEY, exam);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: getWelcomeMessage(selectedExam),
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exam: selectedExam,
          chatInput: userMessage.content,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const responseText = data.output;
      
      if (!responseText) {
        throw new Error("No response received from AI");
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorText = error instanceof Error && error.name === 'AbortError'
        ? "Request timed out. Please try again."
        : "Failed to get response. Please try again.";
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: errorText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-muted/30">
      {/* Minimal Header */}
      <ChatHeader
        selectedExam={selectedExam}
        examNames={examNames}
        onOpenModal={() => setIsModalOpen(true)}
        onClearChat={handleClearChat}
        onShowDisclaimer={() => setIsDisclaimerOpen(true)}
      />

      {/* Chat Messages - Main Focus */}
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto relative"
        style={{ paddingBottom: "100px" }}
      >
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Scroll to bottom button */}
        <ScrollToBottomButton 
          visible={showScrollButton} 
          onClick={() => scrollToBottom()} 
        />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-16 left-0 right-0 z-20">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          isTyping={isTyping}
        />
      </div>

      {/* Exam Selector Modal */}
      <ExamSelectorModal
        isOpen={isModalOpen}
        currentExam={selectedExam}
        onSelect={handleExamChange}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Disclaimer Dialog */}
      <Dialog open={isDisclaimerOpen} onOpenChange={setIsDisclaimerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              AI Guidance Disclaimer
            </DialogTitle>
            <DialogDescription className="text-left pt-2">
              This AI provides motivational guidance and study tips only. It is not a substitute for professional counseling or mental health services.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted rounded-lg p-4 mt-2">
            <p className="text-sm font-medium text-foreground mb-2">Emergency Helplines:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>NIMHANS: 080-46110007</p>
              <p>iCALL: 9152987821</p>
              <p>Vandrevala Foundation: 1860-2662-345</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MotivationChat;
