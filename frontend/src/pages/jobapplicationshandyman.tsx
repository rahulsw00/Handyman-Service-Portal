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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import Cookies from "js-cookie";

export default function HandymanOffers() {
  // Dummy job data
  const jobData = {
    description: "Fix leaking kitchen sink and replace faucet",
    address: "123 Main Street, Mumbai, Maharashtra 400001",
    preferred_date_time: "2025-04-25T10:00:00",
    budget_range_min: 1000,
    budget_range_max: 3000,
  };

  const [jobStatus, setJobStatus] = useState("PENDING");
  const [jobdata, setJobdata] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isHiring, setIsHiring] = useState(false);
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [availableDate, setAvailableDate] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [estimatedHours, setEstimatedHours] = useState("");
  const accessToken = Cookies.get("accessToken");
  const job_id = window.location.pathname.split("/").pop();

  React.useEffect(() => {
    if (job_id) {
      setLoading(true);
      fetch("http://localhost:8000/job.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          action: "get_job",
          job_id: job_id,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Job data received:", data);
          setJobdata(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching job data:", error);
          setError("Failed to load job details: " + error.message);
          setLoading(false);
        });
    } else {
      console.error("No job_id found in the URL");
      setError("No job ID found");
      setLoading(false);
    }
  }, []);
  const handleSubmitOffer = async () => {
    // Here you would typically send this data to your backend
    await fetch("http://localhost:8000/job.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        action: "make_offer",
        job_id: job_id, // Replace with actual job ID
        token: accessToken,
        offer_amount: offerAmount,
        available_date: availableDate,
        additional_notes: additionalNotes,
        estimated_hours: estimatedHours,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Offer submitted successfully:", data);
        setOfferSubmitted(true);
      })
      .catch((error) => {
        console.error("Error submitting offer:", error);
      });

    setIsDialogOpen(false);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric" as "numeric",
      month: "long" as "long",
      day: "numeric" as "numeric",
      hour: "2-digit" as "2-digit",
      minute: "2-digit" as "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <p>Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-screen">
      <div className="min-h-full bg-white items-center justify-center pt-3 w-[50%]">
        {/* Job Summary */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{jobdata.title}</h2>
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
            <p className="font-medium">{jobdata.description}</p>
            <p className="text-gray-600 text-sm mt-2">{jobdata.address}</p>
            <p className="text-gray-600 text-sm">
              Preferred Date: {formatDate(jobdata.preferred_date_time)}
            </p>
            <p className="text-gray-600 text-sm">
              Budget: ₹{jobdata.budget_range_min} - ₹{jobdata.budget_range_max}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            {!offerSubmitted ? (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsDialogOpen(true)}
              >
                Make an Offer
              </Button>
            ) : (
              <div className="w-full">
                <p className="text-green-600 font-medium mb-2">
                  Your offer has been submitted!
                </p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p>
                    <span className="font-medium">Your Offer:</span> ₹
                    {offerAmount}
                  </p>
                  <p>
                    <span className="font-medium">Available On:</span>{" "}
                    {availableDate}
                  </p>
                  {additionalNotes && (
                    <p>
                      <span className="font-medium">Notes:</span>{" "}
                      {additionalNotes}
                    </p>
                  )}
                </div>
                <Button
                  className="w-full mt-3 bg-gray-200 text-gray-800 hover:bg-gray-300"
                  variant="outline"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Edit Offer
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
        {/* Offer Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Make an Offer</DialogTitle>
              <DialogDescription>
                Submit your price and availability for this job.
              </DialogDescription>
            </DialogHeader>
            <DialogClose className="absolute right-4 top-4 rounded-sm bg-white hover:bg-red-600 ">
              <X className="h-4 w-4 text-red-600" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Your Price (₹)
                </Label>
                <Input
                  id="price"
                  type="number"
                  className="col-span-3"
                  placeholder="Enter your price"
                  min="0"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Available Date
                </Label>
                <Input
                  id="date"
                  type="datetime-local"
                  className="col-span-3"
                  value={availableDate}
                  onChange={(e) => setAvailableDate(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Estimated Completion Hours
                </Label>
                <Input
                  id="hours"
                  type="number"
                  className="col-span-3"
                  placeholder="Enter estimated hours"
                  min="0"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  className="col-span-3"
                  placeholder="Additional details about your offer"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSubmitOffer}
              >
                Submit Offer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
