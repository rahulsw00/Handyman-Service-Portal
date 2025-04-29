// ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import HandymanOffers from "./jobapplications";
import HandymanOffers2 from "./jobapplicationshandyman";

// Define TypeScript interfaces for our data structures
interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  city: string;
  avatar: string;
  description: string;
  created_at: string;
  user_type: "client" | "handyman";
}

interface HandymanProfile extends UserProfile {
  rating: number;
  average_rating: number;
  completed_jobs: number;
  is_available: string;
  description: string;
}

interface ClientProfile extends UserProfile {
  jobsPosted: number;
  completedHires: number;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<
    HandymanProfile | ClientProfile | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = Cookies.get("accessToken");
        //console.log("Access Token:", accessToken); // Debugging line

        if (!accessToken) {
          navigate("/login");
        }

        fetch("http://localhost:8000/get_profile.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            action: "profile",
            token: accessToken,
          }),
        })
          .then(async (response) => {
            // Store the response text for debugging
            const responseText = await response.text();

            // Try to parse as JSON
            try {
              const data = JSON.parse(responseText);
              return data;
            } catch (e) {
              // If it's not valid JSON, throw an error with some debug info
              console.error("Server returned non-JSON response:", responseText);
              throw new Error(
                "Server returned invalid JSON. Check server logs."
              );
            }
          })
          .then((data) => {
            console.log(data);
            setProfile(data);
            console.log(profile);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching job data:", error);
            setError("Failed to load job details: " + error.message);
            setLoading(false);
          });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Function to render star ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen w-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-500">Error: {error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button className="mt-4" onClick={() => navigate("/login")}>
              login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No profile data
  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen w-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p>No profile data available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render client profile
  if (profile.user_type === "client") {
    return (
      <div className="flex justify-center min-h-screen bg-gray-50 py-8 w-screen">
        <div className="w-full max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Client Profile Summary */}
            <div className="md:col-span-1">
              <Card className="shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-700 h-24"></div>
                <div className="flex flex-col items-center -mt-12 px-4 pb-6">
                  <img
                    src={profile.avatar || "../src/assets/dummypfp.webp"}
                    alt={profile.first_name[0] + " " + profile.last_name[0]}
                    className="w-24 h-24 rounded-full border-4 border-white bg-white"
                  />
                  <h2 className="mt-4 text-xl font-bold">
                    {profile.first_name + " " + profile.last_name}
                  </h2>
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
                    {profile.city}
                  </div>

                  <Badge className="mt-3 bg-green-600">Client</Badge>

                  <div className="mt-4 w-full">
                    <div className="flex justify-between text-sm">
                      <span>Member since</span>
                      <span className="font-medium">
                        {profile.created_at.slice(0, 10)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full mt-4 bg-gray-700 text-white hover:bg-red-500"
                  onClick={() => {
                    Cookies.remove("accessToken");
                    navigate("/login");
                  }}
                >
                  Logout
                </Button>
              </Card>

              {/* Contact Information */}
              <Card className="mt-6 shadow-md">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    {/* <div className="flex">
                      <svg
                        className="h-5 w-5 mr-3 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>email</span>
                    </div> */}
                    <div className="flex">
                      <svg
                        className="h-5 w-5 mr-3 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{profile.phone_number}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Client profile content */}
            <div className="md:col-span-2">
              <Card className="shadow-md">
                <CardContent className="pt-6">
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 mb-6">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="jobposted">Job Posted</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">About</h3>
                        <p className="text-gray-600">
                          {profile.description ||
                            "No description information available."}
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="jobposted" className="space-y-6">
                      <HandymanOffers />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render handyman profile
  const handymanProfile = profile as HandymanProfile;
  return (
    <div className="flex justify-center min-h-screen bg-gray-50 py-8 w-screen">
      <div className="w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Handyman Profile Summary */}
          <div className="md:col-span-1">
            <Card className="shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-24"></div>
              <div className="flex flex-col items-center -mt-12 px-4 pb-6">
                <img
                  src={profile.avatar || "../src/assets/dummypfp.webp"}
                  alt={profile.first_name + " " + profile.last_name}
                  className="w-24 h-24 rounded-full border-4 border-white bg-white"
                />
                <h2 className="mt-4 text-xl font-bold">{profile.first_name}</h2>
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
                  {profile.city}
                </div>

                <div className="flex items-center mt-3">
                  {renderStars(handymanProfile.average_rating)}
                  <span className="ml-2 font-medium">
                    {handymanProfile.average_rating}
                  </span>
                </div>

                <Badge className="mt-3 bg-blue-600">Handyman</Badge>

                <div className="mt-4 w-full">
                  <div className="flex justify-between text-sm">
                    <span>Member since</span>
                    <span className="font-medium">
                      {profile.created_at.slice(0, 10)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Completed jobs</span>
                    <span className="font-medium">
                      {handymanProfile.completed_jobs}
                    </span>
                  </div>
                </div>

                {/* <div className="flex flex-wrap gap-2 mt-4">
                  {handymanProfile.specialties.map((specialty, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gray-100"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div> */}

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
                  {/* <div className="flex">
                    <svg
                      className="h-5 w-5 mr-3 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>email</span>
                  </div> */}
                  <div className="flex">
                    <svg
                      className="h-5 w-5 mr-3 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>{profile.phone_number}</span>
                  </div>
                  <div className="flex">
                    <svg
                      className="h-5 w-5 mr-3 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Available {handymanProfile.is_available}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Handyman Tabs for different sections */}
          <div className="md:col-span-2">
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="jobs_taken">Jobs taken</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">About</h3>
                      <p className="text-gray-600">{profile.description}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="jobs_taken" className="space-y-6">
                    <HandymanOffers2 />
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

export default ProfilePage;
