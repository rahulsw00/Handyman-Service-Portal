import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const ClientProfilePage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interestedHandymen, setInterestedHandymen] = useState([]);
  const [loadingHandymen, setLoadingHandymen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch client profile data
    // This is a placeholder for your actual API call
    const client_id = window.location.pathname.split("/").pop();

    if (client_id) {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated. Please log in.");
        setLoading(false);
        return;
      }
      console.log(token);
      // Fetch client data
      // This should be replaced with your actual API endpoint
      fetch("http://localhost:8000/get_profile.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          action: "profile",
          token: token,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Client data received:", data);
          setClientData(data);
          setLoading(false);

          // If there's a job_id in the URL query parameters, fetch interested handymen
          const urlParams = new URLSearchParams(window.location.search);
          const job_id = urlParams.get("job_id");
          if (job_id) {
            fetchInterestedHandymen(job_id);
            // Set active tab to "interested" when there's a job_id
            setActiveTab("interested");
          }
        })
        .catch((error) => {
          console.error("Error fetching client data:", error);
          setError("Failed to load client profile: " + error.message);
          setLoading(false);
        });
    } else {
      setError("No client ID found");
      setLoading(false);
    }
  }, []);

  const fetchInterestedHandymen = (job_id) => {
    setLoadingHandymen(true);

    // Fetch interested handymen for this job
    fetch("http://localhost:8000/job_interested.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        action: "get_interested_handymen",
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
        console.log("Interested handymen data:", data);
        if (data.success && data.interested_handymen) {
          setInterestedHandymen(data.interested_handymen);
        } else {
          setInterestedHandymen([]);
        }
        setLoadingHandymen(false);
      })
      .catch((error) => {
        console.error("Error fetching interested handymen:", error);
        toast({
          title: "Error",
          description: "Failed to load interested handymen: " + error.message,
          variant: "destructive",
        });
        setLoadingHandymen(false);
      });
  };

  const assignHandyman = (handyman_id, handyman_name) => {
    const urlParams = new URLSearchParams(window.location.search);
    const job_id = urlParams.get("job_id");

    if (!job_id) {
      toast({
        title: "Error",
        description: "No job selected to assign handyman to.",
        variant: "destructive",
      });
      return;
    }

    // Update the job to assign this handyman
    fetch("http://localhost:8000/job.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        action: "assign_handyman",
        job_id: job_id,
        handyman_id: handyman_id,
        handyman_name: handyman_name,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Handyman assignment response:", data);
        if (data.success) {
          toast({
            title: "Success",
            description: `Successfully assigned ${handyman_name} to this job.`,
          });

          // Refresh the list of interested handymen
          fetchInterestedHandymen(job_id);
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to assign handyman to job.",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.error("Error assigning handyman:", error);
        toast({
          title: "Error",
          description: "Failed to assign handyman: " + error.message,
          variant: "destructive",
        });
      });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <p>Loading client profile...</p>
      </div>
    );
  }

  // Show error state
  if (error || !clientData) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <p className="text-red-500">{error || "No client data available"}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 py-8 w-screen">
      <div className="w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Client Summary */}
          <div className="md:col-span-1">
            <Card className="shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 h-24"></div>
              <div className="flex flex-col items-center -mt-12 px-4 pb-6">
                <Avatar className="w-24 h-24 rounded-full border-4 border-white bg-white">
                  <AvatarImage
                    src={clientData.avatar || ""}
                    alt={clientData.name}
                  />
                  <AvatarFallback>
                    {clientData.name?.substring(0, 2) || "CL"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-bold">{clientData.name}</h2>
                <div className="flex items-center mt-1 text-gray-600">
                  <svg
                    className="h-4 w-4 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {clientData.location || "Unknown location"}
                </div>

                <Badge className="mt-3 bg-purple-600">Client</Badge>

                <div className="mt-4 w-full">
                  <div className="flex justify-between text-sm">
                    <span>Member since</span>
                    <span className="font-medium">
                      {clientData.member_since || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Posted jobs</span>
                    <span className="font-medium">
                      {clientData.jobs_posted || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Completed jobs</span>
                    <span className="font-medium">
                      {clientData.jobs_completed || 0}
                    </span>
                  </div>
                </div>

                <Button className="w-full mt-6">Contact</Button>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="mt-6 shadow-md">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {clientData.email && (
                    <div className="flex">
                      <svg
                        className="h-5 w-5 mr-3 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{clientData.email}</span>
                    </div>
                  )}
                  {clientData.phone && (
                    <div className="flex">
                      <svg
                        className="h-5 w-5 mr-3 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{clientData.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Tabs for different sections */}
          <div className="md:col-span-2">
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="jobs">Jobs Posted</TabsTrigger>
                    <TabsTrigger value="interested">
                      Interested Handymen
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">About</h3>
                      <p className="text-gray-600">
                        {clientData.bio || "No bio information available."}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="jobs" className="space-y-6">
                    {clientData.jobs?.length ? (
                      clientData.jobs.map((job, index) => (
                        <div
                          key={index}
                          className="border-b pb-4 last:border-b-0"
                        >
                          <div className="flex justify-between">
                            <h3 className="font-semibold">
                              {job.title || "Untitled Job"}
                            </h3>
                            <span className="text-gray-500">{job.status}</span>
                          </div>
                          <p className="text-gray-600 mt-1">
                            {job.description}
                          </p>
                          <div className="flex justify-between mt-2">
                            <span className="text-sm text-gray-500">
                              {job.created_at &&
                                new Date(job.created_at).toLocaleDateString()}
                            </span>
                            <Badge
                              className={
                                job.status === "completed"
                                  ? "bg-green-500"
                                  : job.status === "in_progress"
                                  ? "bg-blue-500"
                                  : job.status === "cancelled"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                              }
                            >
                              {job.status?.replace(/_/g, " ") || "Unknown"}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No jobs posted yet.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="interested" className="space-y-6">
                    {loadingHandymen ? (
                      <p className="text-center py-4">
                        Loading interested handymen...
                      </p>
                    ) : (
                      <>
                        <div className="mb-4">
                          <h3 className="font-semibold text-lg mb-2">
                            Interested Handymen
                          </h3>
                          {interestedHandymen.length === 0 && (
                            <p className="text-gray-500">
                              No handymen have shown interest in this job yet.
                            </p>
                          )}
                        </div>

                        {interestedHandymen.map((handyman, index) => (
                          <div
                            key={index}
                            className="border-b pb-4 last:border-b-0"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>
                                    {handyman.handyman_name.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold">
                                    {handyman.handyman_name}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    Interested since:{" "}
                                    {new Date(
                                      handyman.interested_at
                                    ).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div>
                                {handyman.status === "hired" ? (
                                  <Badge className="bg-green-500">Hired</Badge>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      assignHandyman(
                                        handyman.handyman_id,
                                        handyman.handyman_name
                                      )
                                    }
                                  >
                                    Assign Job
                                  </Button>
                                )}
                              </div>
                            </div>
                            {handyman.notes && (
                              <p className="mt-2 text-gray-600 text-sm border-l-2 border-gray-300 pl-3">
                                {handyman.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfilePage;
