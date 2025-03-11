
import { Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TravelPlanProps {
  plan: string;
}

export function TravelPlan({ plan }: TravelPlanProps) {
  const sections = plan.split('\n\n');

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 backdrop-blur-xl bg-gradient-to-br from-blue-400/10 to-blue-600/10 border-blue-200/20 shadow-lg animate-fade-in hover:shadow-blue-200/20 transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-2 border-b border-blue-200/20">
        <Bot className="w-6 h-6 text-blue-600 animate-bounce" />
        <CardTitle className="text-2xl text-center text-blue-900">AI Travel Plan</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-blue max-w-none p-0">
        {sections.map((section, index) => (
          <div
            key={index}
            className={cn(
              "p-6 transition-all duration-300",
              index % 2 === 0 
                ? "bg-white/40 hover:bg-white/50" 
                : "bg-blue-50/40 hover:bg-blue-50/50"
            )}
          >
            <div className="whitespace-pre-wrap text-lg text-blue-800">{section}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
