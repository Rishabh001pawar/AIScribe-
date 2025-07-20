import { useState, useRef, useEffect } from "react";
import { 
  MessageCircleIcon, 
  SendIcon, 
  XIcon, 
  BotIcon, 
  UserIcon,
  LoaderIcon,
  SparklesIcon,
  Wand2Icon
} from "lucide-react";
import api from "../lib/axios";
import toast from "react-hot-toast";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "Help me organize my thoughts",
    "Generate ideas for a project note",
    "Improve my writing",
    "Summarize my recent notes",
    "Give me productivity tips"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim() || isLoading) return;

    const userMessage = { role: "user", content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = await api.post("/chat/chat", {
        message: message,
        context: message.toLowerCase().includes("note") ? "notes" : null
      });

      const aiMessage = {
        role: "assistant",
        content: response.data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      let errorMessage = "Sorry, I'm having trouble responding right now. Please try again later.";
      
      if (error.response?.status === 503) {
        errorMessage = "AI features are currently unavailable. Please configure the OpenAI API key in the backend.";
      }
      
      const aiErrorMessage = {
        role: "assistant",
        content: errorMessage,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, aiErrorMessage]);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const clearChat = () => {
    setMessages([]);
    setShowSuggestions(true);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 btn btn-primary btn-circle btn-lg shadow-lg z-50 hover:scale-110 transition-transform"
        aria-label="Open AI Assistant"
      >
        <BotIcon className="size-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-base-100 rounded-lg shadow-2xl border border-base-300 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-300 bg-primary text-primary-content rounded-t-lg">
        <div className="flex items-center gap-2">
          <BotIcon className="size-5" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="btn btn-ghost btn-xs text-primary-content hover:bg-primary-focus"
            title="Clear chat"
          >
            <SparklesIcon className="size-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="btn btn-ghost btn-xs text-primary-content hover:bg-primary-focus"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && showSuggestions && (
          <div className="space-y-3">
            <div className="text-center text-base-content/70 text-sm">
              <BotIcon className="size-8 mx-auto mb-2 text-primary" />
              Hi! I'm your AI assistant. How can I help you today?
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-2 text-sm bg-base-200 hover:bg-base-300 rounded-lg transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0">
                <BotIcon className="size-6 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-primary text-primary-content"
                  : message.isError
                  ? "bg-error text-error-content"
                  : "bg-base-200 text-base-content"
              }`}
            >
              <div className="text-sm">{message.content}</div>
              <div className="text-xs opacity-70 mt-1">
                {formatTime(message.timestamp)}
              </div>
            </div>
            {message.role === "user" && (
              <div className="flex-shrink-0">
                <UserIcon className="size-6 text-base-content" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 justify-start">
            <BotIcon className="size-6 text-primary" />
            <div className="bg-base-200 text-base-content p-3 rounded-lg">
              <LoaderIcon className="size-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-base-300">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 input input-bordered input-sm"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            className="btn btn-primary btn-sm"
          >
            <SendIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
