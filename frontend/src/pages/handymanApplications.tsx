import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

function HandymanApplications() {
  const [jobdata, setJobdata] = useState(null);
  const [jobStatus, setJobStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [completionStatus, setCompletionStatus] = useState({});
  const [handymanStatus, setHandymanStatus] = useState(false);
  const [clientStatus, setClientStatus] = useState(false);
  const [error, setError] = useState(null);
  const [isassigned, setIsAssigned] = useState(false);
  const [offersData, setOffersData] = useState({});
  const accessToken = Cookies.get("accessToken");

  const formatDate = (dateString: string | number | Date) => {
    const options = {
      year: "numeric" as "numeric",
      month: "long" as "long",
      day: "numeric" as "numeric",
      hour: "2-digit" as "2-digit",
      minute: "2-digit" as "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch applied jobs data
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/job.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        action: "job_applied",
        token: accessToken,
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

        checkIfJobAssigned(data.job_id);
      })
      .catch((error) => {
        console.error("Error fetching job data:", error);
        setError("Failed to load job details: " + error.message);
        setLoading(false);
      });
  }, []);

  // Function to check if job is assigned (moved outside useEffect)
  const checkIfJobAssigned = (jobId) => {
    fetch("http://localhost:8000/job.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        action: "check_assigned",
        job_id: jobId,
        token: accessToken,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setIsAssigned(true);
          console.log("Job assigned to handyman:", data);
          setJobStatus("ASSIGNED");
        } else {
          setJobdata(null);
          setError("No job data available.");
        }
      })
      .catch((error) => {
        console.error("Error checking job assignment:", error);
        setError("Failed to check job assignment: " + error.message);
      });
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
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <p>Loading job details...</p>
      </div>
    );
  }

  // Check if jobdata exists
  if (!jobdata) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mb-6">
          <CardContent>
            <p>{error || "No job data available."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{jobdata.title}</h2>
            <Badge
              className={
                jobStatus === "pending" ? "bg-yellow-500" : "bg-green-500"
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
        {isassigned && (
          <CardFooter>
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
                  onClick={() => handleMarkComplete(jobdata.job_id, "handyman")}
                  disabled={completionStatus[jobdata.job_id]?.client}
                >
                  Mark as Complete
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default HandymanApplications;
