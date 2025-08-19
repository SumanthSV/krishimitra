import React, { useState, useRef, useEffect } from "react";
import VoiceInput from "../components/VoiceInput.tsx";
import ReactMarkdown from "react-markdown";
import { Send, Bot, User, Loader2 } from "lucide-react";
import axios from "axios";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;
}

const ChatPage: React.FC = () => {

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedLanguage, setSelectedLanguage] = useState("en");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when loaded
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      content: message.trim(),
      role: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const query = {
        text: userMessage.content,
        // language: selectedLanguage,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/ask`,
        query
      );

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        content: response.data.llm_response || "Please try again...",
        role: "assistant",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error processing message:", error);

      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        content: "Please try again...",
        role: "assistant",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceResult = (transcript: string) => {
    setMessage(transcript);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Krishimitra
            </h2>
            <p className="text-gray-600 max-w-md mb-6">
              Welcome back to Krishimitra! Ask me anything about farming.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              {[
                "What can I grow in January in Davangere district, Karnataka?",
                "What are the best practices for organic farming?",
                "How can I improve soil health in my farm?",
                "What are the latest agricultural technologies?",
              ].map((query, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(query)}
                  className="p-3 text-gray-400 text-left bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors text-sm"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-start space-x-3 max-w-[85%] sm:max-w-[75%]">
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`${
                      msg.role === "user"
                        ? "bg-green-600 text-white rounded-2xl rounded-br-md"
                        : "bg-gray-200 text-zinc-800 rounded-2xl rounded-br-md"
                    } px-4 py-3 shadow-sm`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    <div
                      className={`text-xs mt-2 ${
                        msg.role === "user" ? "text-green-100" : "text-gray-500"
                      }`}
                    >
                      {formatTimestamp(msg.timestamp)}
                    </div>
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-200 px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                      <span className="text-sm text-gray-600">thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-transparent border-t border-gray-200 p-4 sm:p-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              {/* <div>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="border-2 border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="kn">Kannada</option>
                  <option value="te">Telugu</option>
                  <option value="ta">Tamil</option>
                  <option value="mr">Marathi</option>
                  <option value="bn">Bengali</option>
                </select>
              </div> */}
              <textarea
                ref={inputRef}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 resize-none transition-all duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 placeholder-gray-500"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                rows={1}
                style={{ minHeight: "52px", maxHeight: "120px" }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <VoiceInput onResult={handleVoiceResult} disabled={isLoading} />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                  !message.trim() || isLoading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
