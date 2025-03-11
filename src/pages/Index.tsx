
import { useState } from "react";
import { TravelForm, TravelFormData } from "@/components/TravelForm";
import { TravelPlan } from "@/components/TravelPlan";
import { TravelChat } from "@/components/TravelChat";
import { TravelResults } from "@/components/TravelResults";
import { getGeminiResponse } from "@/lib/gemini";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem("GEMINI_API_KEY") || "");
  const [aviationStackApiKey, setAviationStackApiKey] = useState(localStorage.getItem("AVIATION_STACK_API_KEY") || "");
  const [loading, setLoading] = useState(false);
  const [travelPlan, setTravelPlan] = useState<string>("");
  const [formData, setFormData] = useState<TravelFormData | null>(null);
  const { toast } = useToast();

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("GEMINI_API_KEY", apiKey);
    localStorage.setItem("AVIATION_STACK_API_KEY", aviationStackApiKey);
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved successfully.",
    });
  };

  const generatePrompt = (data: TravelFormData) => {
    return `As a travel planning expert, create a detailed travel itinerary for a trip. Format your response in clear sections with regular text (no asterisks or special characters). Include the following details:

Basic Trip Information:
From: ${data.source}
To: ${data.destination}
Dates: ${data.startDate.toLocaleDateString()} to ${data.endDate.toLocaleDateString()}
Budget: ${data.budget}
Number of Travelers: ${data.travelers}
Interests: ${data.interests}

Please structure your response in the following sections:

Flight Details:
[Provide recommended flight options with:
- Suggested airlines
- Estimated flight duration
- Potential layovers
- Price range for flights
- Best time to book
- Airport transfer information]

Transportation Recommendations:
[Provide detailed transport options and suggestions]

Accommodation Suggestions:
[List recommended places to stay within the budget]

Daily Activities and Attractions:
[Break down activities day by day]

Dining Recommendations:
[Suggest local restaurants and cuisine to try]

Estimated Costs Breakdown:
[Provide a detailed budget breakdown]

Local Tips and Cultural Considerations:
[Share important cultural information and local customs]

Weather and Packing Suggestions:
[Include weather forecast and packing recommendations]

Safety Tips:
[Provide relevant safety information]

Please ensure each section is separated by blank lines and avoid using any special characters or formatting symbols.`;
  };

  const handleSubmit = async (data: TravelFormData) => {
    if (!apiKey || !aviationStackApiKey) {
      toast({
        title: "API Keys Required",
        description: "Please enter both Gemini and Aviation Stack API keys first.",
        variant: "destructive",
      });
      return;
    }

    setFormData(data);
    setLoading(true);
    try {
      const prompt = generatePrompt(data);
      console.log("Sending prompt to Gemini:", prompt); // Debug log
      const response = await getGeminiResponse(prompt);
      console.log("Received response from Gemini:", response); // Debug log
      if (!response) {
        throw new Error("Received empty response from Gemini API");
      }
      setTravelPlan(response);
    } catch (error) {
      console.error("Detailed error:", error); // Debug log
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate travel plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 py-12 px-4">
      {(!localStorage.getItem("GEMINI_API_KEY") || !localStorage.getItem("AVIATION_STACK_API_KEY")) && (
        <form onSubmit={handleApiKeySubmit} className="max-w-md mx-auto mb-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Gemini API Key</Label>
            <Input
              id="apiKey"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="bg-white/20 border-none"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aviationStackApiKey">Aviation Stack API Key</Label>
            <Input
              id="aviationStackApiKey"
              type="text"
              value={aviationStackApiKey}
              onChange={(e) => setAviationStackApiKey(e.target.value)}
              placeholder="Enter your Aviation Stack API key"
              className="bg-white/20 border-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save API Keys
          </button>
        </form>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-8">
          <img 
            src="/e1d18eba-0fdf-48cc-828c-16674a94b6ec.png" 
            alt="Travel Planning Assistant - Let AI help you plan your perfect trip" 
            className="max-w-full h-auto rounded-xl shadow-sm" 
          />
        </div>
        
        <TravelForm onSubmit={handleSubmit} loading={loading} />
        
        {formData && aviationStackApiKey && (
          <TravelResults formData={formData} aviationStackApiKey={aviationStackApiKey} />
        )}
        
        {travelPlan && (
          <>
            <TravelPlan plan={travelPlan} />
            <TravelChat travelPlan={travelPlan} />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
