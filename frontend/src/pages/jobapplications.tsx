// React Component (jobapplications.tsx)
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  User,
  Clock,
  DollarSign,
  Briefcase,
  IndianRupee,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import QRCode from "react-qr-code";
import { set } from "react-hook-form";

export default function HandymanOffers() {
  const navigate = useNavigate();
  const [jobdata, setJobdata] = useState(null);
  const [offersData, setOffersData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completionStatus, setCompletionStatus] = useState({});
  const [jobStatus, setJobStatus] = useState("pending");
  const [handymanStatus, setHandymanStatus] = useState(false);
  const [clientStatus, setClientStatus] = useState(false);
  const [loadingOffers, setLoadingOffers] = useState({});
  const [expandedJobs, setExpandedJobs] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [processingHire, setProcessingHire] = useState(false);
  // Add to the existing state variables at the top of the component
  const [showPayment, setShowPayment] = useState(false);
  const [currentPaymentAmount, setCurrentPaymentAmount] = useState(0);

  const accessToken = Cookies.get("accessToken");

  if (!accessToken) {
    navigate("/login");
  }

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
  const handleMarkComplete = (jobId, userType) => {
    // Update local completion status
    setCompletionStatus((prev) => ({
      ...prev,
      [jobId]: { ...prev[jobId], [userType]: true },
    }));

    // Update the database based on user type
    const columnToUpdate =
      userType === "client" ? "client_confirm" : "handyman_confirm";
    fetch("http://localhost:8000/job.php", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        action: "update_job_confirmation",
        job_id: jobId,
        column: columnToUpdate,
        value: "completed",
        token: accessToken,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // After updating, always check backend for full completion
        return fetch("http://localhost:8000/job.php", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=UTF-8" },
          body: JSON.stringify({
            action: "check_job_completion",
            job_id: jobId,
          }),
        });
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setClientStatus(true);
          setHandymanStatus(true);
          setJobStatus("COMPLETED");
          console.log("Job completed successfully:", data);
          setCurrentPaymentAmount(Number(data[0]) * 1.05); // Ensuring it's a number and applying 5% fee
          setShowPayment(true);
        }
      })
      .catch((error) => {
        setError(
          `Failed to update ${userType} confirmation. Please try again.`
        );
        // Revert local state on error
        setCompletionStatus((prev) => ({
          ...prev,
          [jobId]: { ...prev[jobId], [userType]: false },
        }));
      });
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

  const openHireDialog = (job, offer) => {
    setSelectedJob(job);
    setSelectedOffer(offer);
    setIsDialogOpen(true);
  };

  const handleHire = () => {
    if (!selectedJob || !selectedOffer) return;

    setProcessingHire(true);

    fetch("http://localhost:8000/job.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        action: "hire_handyman",
        job_id: selectedJob.job_id,
        handyman_id: selectedOffer.handyman_id,
        agreed_price: selectedOffer.price_quote,
        agreed_hours: selectedOffer.estimated_hours,
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
        setProcessingHire(false);
        setIsDialogOpen(false);

        if (data.success) {
          // Update job status locally

          setJobdata((prevJobs) =>
            prevJobs.map((job) =>
              job.job_id === selectedJob.job_id
                ? { ...job, status: "assigned" }
                : job
            )
          );

          setSuccess(
            `Successfully hired ${selectedOffer.first_name} for your job "${selectedJob.title}".`
          );

          // Scroll to top to see success message
          window.scrollTo(0, 0);

          // Clear success message after 5 seconds
          setTimeout(() => {
            setSuccess(null);
          }, 5000);
        } else {
          setError("Failed to hire handyman. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error hiring handyman:", error);
        setProcessingHire(false);
        setIsDialogOpen(false);
        setError("An error occurred while hiring. Please try again.");
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
        console.log("Job data received:", data);
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
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600">Loading your job postings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white items-center justify-center pt-6 w-full max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Your Job Postings
      </h1>

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {jobdata && jobdata.length > 0 ? (
        jobdata.map((job, index) => (
          <Card
            key={index}
            className="mb-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-bold">{job.title}</h2>
                </div>
                <Badge
                  className={`px-3 py-1 ${
                    job.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      : job.status === "assigned"
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-blue-100 text-blue-800 border border-blue-300"
                  }`}
                >
                  {job.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-gray-700 mb-4">
                {job.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span>{job.address || "Address not available"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Preferred: {formatDate(job.preferred_date_time)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <IndianRupee className="h-4 w-4 mr-2" />
                  <span>
                    Budget: ₹{job.budget_range_min} - ₹{job.budget_range_max}
                  </span>
                </div>
              </div>
              {job.status === "in_progress" && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold mb-3 text-gray-800">
                    Job Completion
                  </h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge
                        className={`mr-2 ${
                          clientStatus
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        Client: {clientStatus ? "Confirmed" : "Pending"}
                      </Badge>
                      <Badge
                        className={
                          handymanStatus
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        Handyman: {handymanStatus ? "Confirmed" : "Pending"}
                      </Badge>
                    </div>
                    <Button
                      className="bg-green-600 text-white hover:bg-green-700"
                      onClick={() => handleMarkComplete(job.job_id, "client")}
                      disabled={completionStatus[job.job_id]?.client}
                    >
                      Mark as Complete
                    </Button>
                  </div>
                </div>
              )}
              <div className="mt-6">
                <Button
                  variant="outline"
                  className={`w-full flex items-center justify-center py-2 ${
                    job.status === "assigned"
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                  }`}
                  onClick={() => toggleJobExpand(job.job_id)}
                  disabled={job.status === "in_progress"}
                >
                  {job.status === "assigned" ? (
                    "Job assigned"
                  ) : expandedJobs[job.job_id] ? (
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

                {expandedJobs[job.job_id] && job.status !== "assigned" && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-800">
                      Available Handyman Offers
                    </h3>

                    {loadingOffers[job.job_id] ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-solid border-blue-600 border-r-transparent mb-2"></div>
                        <p className="text-gray-500">Loading offers...</p>
                      </div>
                    ) : offersData[job.job_id] &&
                      offersData[job.job_id].length > 0 ? (
                      offersData[job.job_id].map((offer, offerIndex) => (
                        <div
                          key={offerIndex}
                          className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-100 hover:border-blue-200 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="flex items-center mb-3 sm:mb-0">
                              <Avatar className="h-12 w-12 mr-3 border-2 border-blue-100">
                                <AvatarFallback className="bg-blue-100 text-blue-800 font-medium">
                                  {offer.first_name && offer.last_name
                                    ? offer.first_name.charAt(0) +
                                      offer.last_name.charAt(0)
                                    : "H"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-800">
                                  {offer.first_name + " " + offer.last_name}
                                </p>
                                <div className="flex items-center mt-1">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger className="bg-white">
                                        <IndianRupee className="h-4 w-4 text-green-600 mr-1" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Price Quote</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <span className="text-sm text-gray-700 font-semibold">
                                    ₹{offer.price_quote}
                                  </span>

                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger className="ml-3 bg-white">
                                        <Clock className="h-4 w-4 text-blue-600 ml-3 mr-1" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Estimated Hours</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <span className="text-sm text-gray-700">
                                    {offer.estimated_hours} hrs
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="ml-auto mt-2 sm:mt-0">
                              <Button
                                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() => openHireDialog(job, offer)}
                              >
                                Hire Now
                              </Button>
                            </div>
                          </div>

                          {offer.additional_notes && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Note: </span>
                                {offer.additional_notes}
                              </p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No offers received yet.</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Check back later or adjust your job details to attract
                          more handymen.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">No job applications found.</p>
          <p className="text-gray-400 mt-2">Post a new job to get started.</p>
          <Button
            className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => navigate("/post-job")}
          >
            Post a New Job
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Handyman Hire</DialogTitle>
            <DialogDescription className="text-gray-600">
              You're about to hire a handyman for your job. Please review the
              details.
            </DialogDescription>
          </DialogHeader>

          {selectedJob && selectedOffer && (
            <div className="py-4">
              <div className="bg-blue-50 p-3 rounded-md mb-4">
                <h3 className="font-medium text-blue-800">Job Details</h3>
                <p className="text-gray-700 mt-1">{selectedJob.title}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <h3 className="font-medium text-gray-800">Handyman</h3>
                <div className="flex items-center mt-2">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      {selectedOffer.first_name && selectedOffer.last_name
                        ? selectedOffer.first_name.charAt(0) +
                          selectedOffer.last_name.charAt(0)
                        : "H"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {selectedOffer.first_name + " " + selectedOffer.last_name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <h3 className="font-medium text-gray-800">Price</h3>
                  <p className="text-green-700 font-bold mt-1">
                    ₹{selectedOffer.price_quote}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <h3 className="font-medium text-gray-800">Estimated Hours</h3>
                  <p className="text-blue-700 font-bold mt-1">
                    {selectedOffer.estimated_hours} hrs
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                By hiring this handyman, you agree to the terms and conditions
                of our service.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={processingHire}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleHire}
              disabled={processingHire}
            >
              {processingHire ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-solid border-white border-r-transparent mr-2"></div>
                  Processing...
                </>
              ) : (
                "Confirm Hire"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Payment</DialogTitle>
            <DialogDescription className="text-gray-600">
              Job completion confirmed by both parties. Please complete the
              payment.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 flex flex-col items-center">
            <p className="mb-4">
              Total amount: ₹{currentPaymentAmount.toFixed(2)} (includes 5%
              platform fee)
            </p>
            <div className="bg-white p-4 mb-4">
              <QRCode
                value={`upi://pay?pa=utkarsh.9486%40waaxis&pn=Handyman&tn=JobPayment&am=${currentPaymentAmount.toFixed(
                  2
                )}&cu=INR`}
                size={200}
              />
            </div>
            <p className="text-sm text-gray-500">
              Scan this QR code with any UPI app to make payment
            </p>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowPayment(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
