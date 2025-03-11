
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getGeminiResponse } from "@/lib/gemini";
import { cn } from "@/lib/utils";

interface TravelChatProps {
  travelPlan: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function TravelChat({ travelPlan }: TravelChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = newMessage;
    setNewMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const prompt = `Given this travel plan:
${travelPlan}

User question: ${userMessage}

Please provide a helpful and concise response to the user's question about the travel plan. Focus on being informative and specific.`;

      const response = await getGeminiResponse(prompt);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error getting response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 backdrop-blur-xl bg-gradient-to-br from-blue-400/10 to-blue-600/10 border-blue-200/20 shadow-lg">
      <div className="h-[400px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "max-w-[80%] rounded-lg p-4 animate-fade-in",
                message.role === "user"
                  ? "ml-auto bg-blue-500 text-white"
                  : "bg-white/50 text-blue-900"
              )}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="bg-white/50 text-blue-900 max-w-[80%] rounded-lg p-4">
              Thinking...
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t border-blue-200/20">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask a question about your travel plan..."
              className="flex-1 bg-white/40 border-blue-200/20 focus:border-blue-400/30"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
