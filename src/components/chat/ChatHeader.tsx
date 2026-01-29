import { MoreVertical, Trash2, RefreshCw, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  selectedExam: string;
  examNames: Record<string, string>;
  onOpenModal: () => void;
  onClearChat: () => void;
  onShowDisclaimer: () => void;
}

const ChatHeader = ({ selectedExam, examNames, onOpenModal, onClearChat, onShowDisclaimer }: ChatHeaderProps) => {
  return (
    <header className="h-[50px] bg-background border-b border-border flex items-center justify-between px-4">
      {/* Left - Title */}
      <span className="text-sm font-medium text-foreground">Motivation Chat</span>
      
      {/* Center - Exam Badge */}
      <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
        {examNames[selectedExam] || "Select Exam"}
      </span>
      
      {/* Right - Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onOpenModal} className="cursor-pointer">
            <RefreshCw className="w-4 h-4 mr-2" />
            Change Exam
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onClearChat} className="cursor-pointer">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Chat
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onShowDisclaimer} className="cursor-pointer">
            <Info className="w-4 h-4 mr-2" />
            View Disclaimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default ChatHeader;
