// React Component (jobapplications.tsx)
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { set } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Console } from "console";

export default function HandymanOffers() {
  const navigate = useNavigate();
  const [jobdata, setJobdata] = useState(null);
  const [offersData, setOffersData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState({});
  const [expandedJobs, setExpandedJobs] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const accessToken = Cookies.get("accessToken");

  if (!accessToken) {
    navigate("/login");
  }

  const [jobStatus, setJobStatus] = useState("PENDING");

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

  const toggleJobExpand = (jobId) => {
    const newExpandedState = !expandedJobs[jobId];
    setExpandedJobs((prev) => ({
      ...prev,
      [jobId]: newExpandedState,
    }));

    // Fetch offers if expanding and we don't have them yet
    if (newExpandedState && !offersData[jobId]) {
      fetchOffersForJob(jobId);
    }
  };

  const fetchOffersForJob = (jobId) => {
    setLoadingOffers((prev) => ({ ...prev, [jobId]: true }));

    fetch("http://localhost:8000/job.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        action: "get_job_offers",
        job_id: jobId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setOffersData((prev) => ({
          ...prev,
          [jobId]: data || [],
        }));
        setLoadingOffers((prev) => ({ ...prev, [jobId]: false }));
        console.log("Offers data received:", data);
      })
      .catch((error) => {
        console.error("Error fetching offers:", error);
        setLoadingOffers((prev) => ({ ...prev, [jobId]: false }));
        setError(`Failed to load offers for job #${jobId}`);
      });
  };

  const handleOffer = (jobID, handymanID, aggreed_price, agreed_hours) => {
    fetch("http://localhost:8000/job.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        action: "hire_handyman",
        job_id: jobID,
        handyman_id: handymanID,
        agreed_price: aggreed_price,
        agreed_hours: agreed_hours,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Hire response:", data);
        if (data.success) {
          setIsDialogOpen(true);
          // Optionally, you can refresh the job offers or show a success message
        } else {
          setError("Failed to hire handyman. Please try again.");
        }
      });
  };

  // Fetch all jobs
  useEffect(() => {
    fetch("http://localhost:8000/job.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        action: "posted_jobs",
        token: accessToken,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setJobdata(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setLoading(false);
        setError("Failed to load jobs");
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <p>Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white items-center justify-center pt-3 w-full">
      {jobdata && jobdata.length > 0 ? (
        jobdata.map((job, index) => (
          <Card key={index} className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{job.title}</h2>
                <Badge
                  className={
                    job.status === "PENDING" ? "bg-yellow-500" : "bg-green-500"
                  }
                >
                  {job.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{job.description}</p>
              <p className="text-gray-600 text-sm mt-2">
                {job.address || "Address not available"}
              </p>
              <p className="text-gray-600 text-sm">
                Preferred Date: {formatDate(job.preferred_date_time)}
              </p>
              <p className="text-gray-600 text-sm">
                Budget: ₹{job.budget_range_min} - ₹{job.budget_range_max}
              </p>

              <div className="mt-4">
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-center bg-blue-600 text-white hover:text-blue-800"
                  onClick={() => toggleJobExpand(job.job_id)}
                >
                  {expandedJobs[job.job_id] ? (
                    <>
                      <span>Hide Offers</span>
                      <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>View Handyman Offers</span>
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {expandedJobs[job.job_id] && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="font-semibold mb-3">Handyman Offers</h3>

                    {loadingOffers[job.job_id] ? (
                      <p className="text-gray-500 text-sm">Loading offers...</p>
                    ) : offersData[job.job_id] &&
                      offersData[job.job_id].length > 0 ? (
                      offersData[job.job_id].map((offer, offerIndex) => (
                        <div
                          key={offerIndex}
                          className="bg-gray-50 p-3 rounded-md mb-2"
                        >
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className="bg-blue-100 text-blue-800">
                                {offer.first_name + offer.last_name
                                  ? offer.first_name.charAt(0) +
                                    offer.last_name.charAt(0)
                                  : "H"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {offer.first_name + " " + offer.last_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Bid: ₹{offer.price_quote}
                              </p>
                            </div>
                            <div className="ml-auto">
                              <Button
                                variant="outline"
                                className="mt-2 bg-blue-600 text-white hover:text-blue-800"
                                onClick={() => {
                                  handleOffer(
                                    job.job_id,
                                    offer.handyman_id,
                                    offer.price_quote,
                                    offer.estimated_hours
                                  );
                                }}
                              >
                                Hire
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between mt-2"></div>
                          {offer.additional_notes && (
                            <p className="text-sm mt-2 text-gray-700">
                              {offer.additional_notes}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No offers received yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-gray-500">No job applications found.</p>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hire Handyman</DialogTitle>
            <DialogDescription>
              Are you sure you want to hire this handyman?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 text-white hover:text-blue-800"
              onClick={() => {
                setIsDialogOpen(false);
                // Handle hire action here
              }}
            >
              Hire
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
