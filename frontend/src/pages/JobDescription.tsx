import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Cookies from "js-cookie";
import { set } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function JobDescription() {
  const [jobdata, setJobdata] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [userType, setUserType] = React.useState(null);
  const [makeOffer, setMakeOffer] = React.useState(false);
  const navigate = useNavigate();

  fetch("http://localhost:8000/get_profile.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      action: "get_user_type",
      token: Cookies.get("accessToken"),
    }),
  }).then(async (response) => {
    // Store the response text for debugging
    const responseText = await response.text();

    // Try to parse as JSON
    try {
      const data = JSON.parse(responseText);
      setUserType(data.user_type);
    } catch (e) {
      // If it's not valid JSON, throw an error with some debug info
      console.error("Server returned non-JSON response:", responseText);
      throw new Error("Server returned invalid JSON. Check server logs.");
    }
  });

  React.useEffect(() => {
    const job_id = window.location.pathname.split("/").pop();

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
  const handleOffer = () => {
    fetch("http://localhost:8000/job.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        action: "make_offer",
        job_id: jobdata.job_id,
        client_id: jobdata.client_id,
      }),
    });
  };
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <p>Loading job details...</p>
      </div>
    );
  }

  // Show error state
  if (error || !jobdata) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <p className="text-red-500">{error || "No job data available"}</p>
      </div>
    );
  }

  // Check if jobdata contains an error message from the server
  if (jobdata.error) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <p className="text-red-500">Server error: {jobdata.error}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">Job Details</h2>
              {jobdata.status && (
                <p className="text-sm text-gray-500">
                  Status: {jobdata.status.replace(/_/g, " ")}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description:</h3>
            <p className="text-gray-700 mb-1">{jobdata.description || "N/A"}</p>
            <h3 className="font-semibold mb-2">Location:</h3>
            <p className="text-gray-700">
              {jobdata.address || "N/A"}, {jobdata.city || "N/A"},{" "}
              {jobdata.state || "N/A"} {jobdata.postal_code || "N/A"}
            </p>
            {jobdata.latitude && jobdata.longitude && (
              <p className="text-sm text-gray-500 mt-1">
                Coordinates: {jobdata.latitude}, {jobdata.longitude}
              </p>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Job Schedule:</h3>
            {jobdata.preferred_date_time && (
              <p className="text-gray-700">
                Preferred date:{" "}
                {new Date(jobdata.preferred_date_time).toLocaleString()}
              </p>
            )}
            <p className="text-gray-700">
              Flexible timing: {jobdata.flexible_timing ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Budget Range:</h3>
            <p className="text-gray-700">
              ₹{jobdata.budget_range_min || "0"} - ₹
              {jobdata.budget_range_max || "0"}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center border-t pt-4">
          <div className="text-sm text-gray-500">
            {jobdata.created_at && (
              <span>
                Created: {new Date(jobdata.created_at).toLocaleDateString()}
              </span>
            )}
          </div>

          <Button
            onClick={() => navigate("/jobapp2")}
            disabled={userType === "client"}
          >
            Make an Offer
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
