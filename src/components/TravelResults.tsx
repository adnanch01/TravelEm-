import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { TravelFormData } from "./TravelForm";
import { useToast } from "@/hooks/use-toast";

interface TravelResultsProps {
  formData: TravelFormData;
  aviationStackApiKey: string;
}

interface FlightResult {
  airline: string;
  flight_number: string;
  departure: {
    airport: string;
    scheduled: string;
  };
  arrival: {
    airport: string;
    scheduled: string;
  };
  status: string;
}

interface HotelResult {
  name: string;
  price: string;
  rating: string;
  location: string;
}

export function TravelResults({ formData, aviationStackApiKey }: TravelResultsProps) {
  const [flights, setFlights] = useState<FlightResult[]>([]);
  const [hotels, setHotels] = useState<HotelResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setApiError(null);
        
        try {
          const apiUrl = `http://api.aviationstack.com/v1/flights?access_key=${encodeURIComponent(aviationStackApiKey)}&dep_iata=${encodeURIComponent(formData.source)}&arr_iata=${encodeURIComponent(formData.destination)}`;
          
          console.log("Attempting to fetch from Aviation Stack:", apiUrl);
          
          const flightsResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(10000),
          });

          if (!flightsResponse.ok) {
            throw new Error(`Aviation Stack API responded with status: ${flightsResponse.status}`);
          }

          const flightsData = await flightsResponse.json();
          
          console.log("Aviation Stack API full response:", flightsData);
          
          if (flightsData && !flightsData.error && flightsData.data && flightsData.data.length > 0) {
            console.log("Aviation Stack API returned flight data:", flightsData.data);
            setFlights(flightsData.data);
            toast({
              title: "Flight Data Retrieved",
              description: `Found ${flightsData.data.length} flights for your route`,
            });
          } else {
            if (flightsData.error) {
              const errorInfo = flightsData.error.info || flightsData.error.message || "Unknown Aviation Stack API error";
              console.error("Aviation Stack API error:", errorInfo);
              setApiError(errorInfo);
              throw new Error(errorInfo);
            } else {
              const errorMessage = "No flights found for this route";
              console.log(errorMessage);
              setApiError(errorMessage);
              throw new Error(errorMessage);
            }
          }
        } catch (error) {
          console.error("Error fetching from Aviation Stack:", error);
          
          const errorMessage = error instanceof Error 
            ? error.message 
            : "Failed to fetch flight data";
          
          setApiError(errorMessage);
          toast({
            title: "Flight Data Error",
            description: errorMessage,
            variant: "destructive",
          });
          
          setFlights([]);
        }

        setHotels([
          {
            name: "Grand Hotel",
            price: "$200/night",
            rating: "4.5",
            location: `${formData.destination} City Center`,
          },
          {
            name: "Seaside Resort",
            price: "$180/night",
            rating: "4.2",
            location: `${formData.destination} Beach Area`,
          },
          {
            name: "Budget Stay",
            price: "$120/night",
            rating: "3.8",
            location: `${formData.destination} Downtown`,
          },
        ]);
      } catch (error) {
        console.error("Error in TravelResults component:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [formData, aviationStackApiKey, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto mt-8">
      <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-400/10 to-blue-600/10 border-blue-200/20">
        <CardHeader>
          <CardTitle>Available Flights</CardTitle>
          {apiError && (
            <div className="flex items-center gap-2 bg-amber-50 text-amber-800 p-3 rounded-md border border-amber-200">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <p className="text-sm">
                API Error: {apiError}
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {flights.map((flight, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-white/50 hover:bg-white/60 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{flight.airline}</h3>
                    <p className="text-sm text-gray-600">
                      Flight: {flight.flight_number}
                    </p>
                    <p className="text-sm text-gray-600">
                      Departure: {flight.departure.airport} at {new Date(flight.departure.scheduled).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Arrival: {flight.arrival.airport} at {new Date(flight.arrival.scheduled).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {flight.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {flights.length === 0 && (
              <div className="text-center py-8 px-4">
                <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">No Flight Data Available</h3>
                  <p className="text-gray-600 mb-4">
                    Unfortunately, we couldn't retrieve real flight data for this route.
                  </p>
                  <div className="bg-white p-4 rounded-md text-left">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Possible reasons:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>The Aviation Stack API free tier has limited access</li>
                      <li>No direct flights exist for this specific route</li>
                      <li>Browser security is blocking mixed content (HTTP API request)</li>
                      <li>The API key may have reached its request limit</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-400/10 to-blue-600/10 border-blue-200/20">
        <CardHeader>
          <CardTitle>Available Hotels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {hotels.map((hotel, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-white/50 hover:bg-white/60 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{hotel.name}</h3>
                    <p className="text-sm text-gray-600">{hotel.location}</p>
                    <p className="text-sm text-gray-600">Rating: {hotel.rating}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{hotel.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
