
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface TravelFormProps {
  onSubmit: (data: TravelFormData) => void;
  loading: boolean;
}

export interface TravelFormData {
  source: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: string;
  travelers: number;
  interests: string;
}

export function TravelForm({ onSubmit, loading }: TravelFormProps) {
  const [formData, setFormData] = useState<TravelFormData>({
    source: "",
    destination: "",
    startDate: new Date(),
    endDate: new Date(),
    budget: "",
    travelers: 1,
    interests: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto backdrop-blur-xl bg-gradient-to-br from-blue-400/10 to-blue-600/10 p-8 rounded-xl shadow-lg border border-blue-200/20 animate-fade-in hover:shadow-blue-200/20 transition-all duration-300">
      <div className="space-y-2">
        <Label htmlFor="source" className="text-blue-900">Source Location</Label>
        <Input
          id="source"
          placeholder="Enter your starting point"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          className="bg-white/40 border-blue-200/20 focus:border-blue-400/30 transition-all duration-300"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination" className="text-blue-900">Destination</Label>
        <Input
          id="destination"
          placeholder="Where do you want to go?"
          value={formData.destination}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          className="bg-white/40 border-blue-200/20 focus:border-blue-400/30 transition-all duration-300"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-blue-900">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white/40 border-blue-200/20 hover:bg-blue-100/40 transition-all duration-300",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? (
                  format(formData.startDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-blue-900">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white/40 border-blue-200/20 hover:bg-blue-100/40 transition-all duration-300",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? (
                  format(formData.endDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => date && setFormData({ ...formData, endDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget" className="text-blue-900">Budget</Label>
        <Input
          id="budget"
          placeholder="Enter your budget"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          className="bg-white/40 border-blue-200/20 focus:border-blue-400/30 transition-all duration-300"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="travelers" className="text-blue-900">Number of Travelers</Label>
        <Input
          id="travelers"
          type="number"
          min="1"
          value={formData.travelers}
          onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
          className="bg-white/40 border-blue-200/20 focus:border-blue-400/30 transition-all duration-300"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests" className="text-blue-900">Interests</Label>
        <Input
          id="interests"
          placeholder="What are your interests? (e.g., culture, food, adventure)"
          value={formData.interests}
          onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
          className="bg-white/40 border-blue-200/20 focus:border-blue-400/30 transition-all duration-300"
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 shadow-lg hover:shadow-blue-300/30"
        disabled={loading}
      >
        {loading ? "Generating Plan..." : "Plan My Trip"}
      </Button>
    </form>
  );
}
