import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HandymanOffers() {
  // Dummy job data
  const jobData = {
    description: "Fix leaking kitchen sink and replace faucet",
    address: "123 Main Street, Mumbai, Maharashtra 400001",
    preferred_date_time: "2025-04-25T10:00:00",
    budget_range_min: 1000,
    budget_range_max: 3000,
  };

  // Dummy offers data with selected property initialized
  const [offers, setOffers] = useState([
    {
      id: "1",
      name: "Rajesh Kumar",
      rating: 4.8,
      jobs: 157,
      price: 1800,
      notes: "Can complete the job in 3 hours. I have all necessary tools.",
      availability: "2025-04-25T14:00:00",
      selected: false,
    },
    {
      id: "2",
      name: "Amit Sharma",
      rating: 4.5,
      jobs: 89,
      price: 1500,
      notes: "Experienced with this type of repair. Available same day.",
      availability: "2025-04-25T11:00:00",
      selected: false,
    },
    {
      id: "3",
      name: "Priya Patel",
      rating: 4.9,
      jobs: 203,
      price: 2200,
      notes: "Premium service with 1-year warranty on parts and labor.",
      availability: "2025-04-26T09:00:00",
      selected: false,
    },
    {
      id: "4",
      name: "Suresh Verma",
      rating: 4.3,
      jobs: 62,
      price: 1200,
      notes: "Budget-friendly service. I can bring replacement faucet.",
      availability: "2025-04-27T16:00:00",
      selected: false,
    },
  ]);

  const [jobStatus, setJobStatus] = useState("PENDING");
  const [isHiring, setIsHiring] = useState(false);

  const handleHire = (handymanId) => {
    // Show loading state
    setIsHiring(true);

    // Simulate API delay
    setTimeout(() => {
      // Update offers to mark selected handyman
      setOffers(
        offers.map((offer) => ({
          ...offer,
          selected: offer.id === handymanId,
        }))
      );

      // Update job status
      setJobStatus("ASSIGNED");
      setIsHiring(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white items-center justify-center pt-3 w-full">
      {/* Job Summary */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Job Details</h2>
            <Badge
              className={
                jobStatus === "PENDING" ? "bg-yellow-500" : "bg-green-500"
              }
            >
              {jobStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{jobData.description}</p>
          <p className="text-gray-600 text-sm mt-2">{jobData.address}</p>
          <p className="text-gray-600 text-sm">
            Date: {new Date(jobData.preferred_date_time).toLocaleDateString()}
          </p>
          <p className="text-gray-600 text-sm">
            Budget: ₹{jobData.budget_range_min} - ₹{jobData.budget_range_max}
          </p>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">Handyman Offers</h2>

      {/* Offers List */}
      <div className="space-y-4">
        {offers.map((offer) => (
          <Card
            key={offer.id}
            className={offer.selected ? "border-2 border-green-500" : ""}
          >
            <CardContent className="flex gap-4 pt-6">
              {/* Avatar */}
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {offer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              {/* Content */}
              <div className="flex-grow">
                <div className="flex justify-between">
                  <h3 className="font-bold">{offer.name}</h3>
                  <div className="text-sm">
                    <span className="text-yellow-500">★</span> {offer.rating} (
                    {offer.jobs} jobs)
                  </div>
                </div>

                <p className="text-gray-700 text-sm mt-1">{offer.notes}</p>

                <div className="flex justify-between mt-3 text-sm">
                  <div>
                    Available:{" "}
                    {new Date(offer.availability).toLocaleDateString()}
                  </div>
                  <div className="font-bold">Price: ₹{offer.price}</div>
                </div>
              </div>
            </CardContent>

            {/* Hire Button or Status */}
            <CardFooter className={offer.selected ? "bg-green-50" : ""}>
              {offer.selected ? (
                <div className="w-full text-center text-green-700">
                  <p>
                    You've hired {offer.name}. They will contact you shortly.
                  </p>
                </div>
              ) : (
                <div className="w-full flex justify-end">
                  {jobStatus === "ASSIGNED" ? (
                    <Badge className="bg-gray-300 text-gray-600">
                      Not Selected
                    </Badge>
                  ) : (
                    <Button
                      onClick={() => handleHire(offer.id)}
                      disabled={isHiring}
                    >
                      {isHiring ? "Processing..." : "Hire Handyman"}
                    </Button>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Success Message */}
      {jobStatus === "ASSIGNED" && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-green-700">
            You've successfully hired a handyman for this job!
          </p>
        </div>
      )}
    </div>
  );
}
