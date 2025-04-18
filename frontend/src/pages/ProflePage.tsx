import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface UserData {
  user_id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  profile_image_url: string;
  user_type: "client" | "handyman";
  created_at: string;
}

interface HandymanData {
  profile_id: number;
  user_id: number;
  business_name: string;
  description: string;
  skills: string[];
  years_experience: number;
  completed_jobs: number;
  rating: number;
  total_reviews: number;
  availability: string;
  qualifications: Qualification[];
  experience: Experience[];
  reviews: Review[];
  rating_breakdown: {
    [key: number]: number;
  };
}

interface Qualification {
  name: string;
  issuer: string;
  year: string;
}

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [handymanData, setHandymanData] = useState<HandymanData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoggedIn(true);
    fetchUserData(token);
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      fetch("http://localhost:8000/get_profile.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; cahrset=UTF-8",
        },
        body: JSON.stringify({
          action: "profile",
          token: token,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
        });

      // if (response.data.success) {
      //   setUserData(response.data.user);

      //   if (response.data.user.user_type === "handyman") {
      //     fetchHandymanData(response.data.user.user_id);
      //   }
      // } else {
      //   // Token invalid or expired
      //   localStorage.removeItem("token");
      //   setIsLoggedIn(false);
      // }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHandymanData = async (userId: number) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/get_handyman_profile.php",
        {
          user_id: userId,
        }
      );

      if (response.data.success) {
        setHandymanData(response.data.handyman);
      }
    } catch (error) {
      console.error("Error fetching handyman data:", error);
    }
  };

  const handleLogout = () => {
    const token = localStorage.getItem("token");

    // Call the logout endpoint
    axios
      .post("http://localhost:8000/logout.php", { token })
      .then((response) => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserData(null);
        setHandymanData(null);
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

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
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Not logged in state
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 w-screen">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Profile Not Available</h2>
          <p className="mb-6">Please log in to view your profile.</p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => navigate("/login")}>Login</Button>
            <Button variant="outline" onClick={() => navigate("/register")}>
              Register
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Handyman Profile View
  if (userData?.user_type === "handyman" && handymanData) {
    return (
      <div className="flex justify-center min-h-screen bg-gray-50 py-8 w-full">
        <div className="w-full max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Profile Summary */}
            <div className="md:col-span-1">
              <Card className="shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-24"></div>
                <div className="flex flex-col items-center -mt-12 px-4 pb-6">
                  <Avatar className="w-24 h-24 border-4 border-white bg-white">
                    <AvatarImage
                      src={userData.profile_image_url || "/default-avatar.png"}
                      alt={`${userData.first_name} ${userData.last_name}`}
                    />
                    <AvatarFallback>
                      {userData.first_name.charAt(0)}
                      {userData.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <h2 className="mt-4 text-xl font-bold">{`${userData.first_name} ${userData.last_name}`}</h2>
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
                    {`${userData.city}, ${userData.state}`}
                  </div>

                  <div className="flex items-center mt-3">
                    {renderStars(handymanData.rating)}
                    <span className="ml-2 font-medium">
                      {handymanData.rating}
                    </span>
                    <span className="ml-1 text-gray-500">
                      ({handymanData.total_reviews} reviews)
                    </span>
                  </div>

                  <Badge className="mt-3 bg-blue-600">Handyman</Badge>

                  <div className="mt-4 w-full">
                    <div className="flex justify-between text-sm">
                      <span>Member since</span>
                      <span className="font-medium">
                        {new Date(userData.created_at).toLocaleDateString(
                          "en-US",
                          { month: "long", year: "numeric" }
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span>Completed jobs</span>
                      <span className="font-medium">
                        {handymanData.completed_jobs}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {handymanData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-gray-100"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="w-full mt-6 space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => navigate("/edit-profile")}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Contact Information */}
              <Card className="mt-6 shadow-md">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex">
                      <svg
                        className="h-5 w-5 mr-3 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{userData.phone_number}</span>
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
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        {userData.address}, {userData.city}, {userData.state},{" "}
                        {userData.postal_code}
                      </span>
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
                      <span>Available {handymanData.availability}</span>
                    </div>
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
                      <TabsTrigger value="experience">Experience</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">About</h3>
                        <p className="text-gray-600">
                          {handymanData.description}
                        </p>
                      </div>

                      {handymanData.qualifications.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3">
                            Qualifications
                          </h3>
                          <div className="space-y-3">
                            {handymanData.qualifications.map(
                              (qualification, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between border-b pb-2"
                                >
                                  <div>
                                    <p className="font-medium">
                                      {qualification.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {qualification.issuer}
                                    </p>
                                  </div>
                                  <span className="text-gray-500">
                                    {qualification.year}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="experience" className="space-y-6">
                      {handymanData.experience.map((exp, index) => (
                        <div
                          key={index}
                          className="border-b pb-4 last:border-b-0"
                        >
                          <div className="flex justify-between">
                            <h3 className="font-semibold">{exp.role}</h3>
                            <span className="text-gray-500">{exp.period}</span>
                          </div>
                          <p className="text-gray-600">{exp.company}</p>
                          <p className="mt-2">{exp.description}</p>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="reviews" className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">
                            {handymanData.rating}
                          </div>
                          <div className="mt-1">
                            {renderStars(handymanData.rating)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {handymanData.total_reviews} reviews
                          </div>
                        </div>

                        <div className="flex-1 space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center">
                              <span className="w-3">{rating}</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-yellow-400 mx-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <Progress
                                value={
                                  (handymanData.rating_breakdown[rating] /
                                    handymanData.total_reviews) *
                                  100
                                }
                                className="h-2 flex-1"
                              />
                              <span className="ml-2 text-sm text-gray-500 w-8">
                                {Math.round(
                                  (handymanData.rating_breakdown[rating] /
                                    handymanData.total_reviews) *
                                    100
                                )}
                                %
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {handymanData.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b pb-4 last:border-b-0"
                        >
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-semibold">{review.name}</h4>
                              <div className="flex items-center mt-1">
                                {renderStars(review.rating)}
                                <span className="ml-2 text-sm text-gray-500">
                                  {review.date}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-gray-600">{review.comment}</p>
                        </div>
                      ))}
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

  // Client Profile View
  return (
    <div className="flex justify-center min-h-screen bg-gray-50 py-8 w-full">
      <div className="w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Profile Summary */}
          <div className="md:col-span-1">
            <Card className="shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-24"></div>
              <div className="flex flex-col items-center -mt-12 px-4 pb-6">
                <Avatar className="w-24 h-24 border-4 border-white bg-white">
                  <AvatarImage
                    src={userData?.profile_image_url || "/default-avatar.png"}
                    alt={`${userData?.first_name} ${userData?.last_name}`}
                  />
                  <AvatarFallback>
                    {userData?.first_name.charAt(0)}
                    {userData?.last_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <h2 className="mt-4 text-xl font-bold">{`${userData?.first_name} ${userData?.last_name}`}</h2>
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
                  {`${userData?.city}, ${userData?.state}`}
                </div>

                <Badge className="mt-3 bg-green-600">Client</Badge>

                <div className="mt-4 w-full">
                  <div className="flex justify-between text-sm">
                    <span>Member since</span>
                    <span className="font-medium">
                      {userData?.created_at
                        ? new Date(userData.created_at).toLocaleDateString(
                            "en-US",
                            { month: "long", year: "numeric" }
                          )
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="w-full mt-6 space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => navigate("/post-job")}
                  >
                    Post a Job
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => navigate("/edit-profile")}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="mt-6 shadow-md">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex">
                    <svg
                      className="h-5 w-5 mr-3 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>{userData?.phone_number}</span>
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
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {userData?.address}, {userData?.city}, {userData?.state},{" "}
                      {userData?.postal_code}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Tabs for different sections */}
          <div className="md:col-span-2">
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <Tabs defaultValue="active-jobs">
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="active-jobs">Active Jobs</TabsTrigger>
                    <TabsTrigger value="job-history">Job History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="active-jobs" className="space-y-6">
                    <div className="text-center py-10">
                      <h3 className="text-lg font-semibold mb-2">
                        No Active Jobs
                      </h3>
                      <p className="text-gray-500 mb-4">
                        You don't have any active jobs at the moment.
                      </p>
                      <Button onClick={() => navigate("/post-job")}>
                        Post a New Job
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="job-history" className="space-y-6">
                    <div className="text-center py-10">
                      <h3 className="text-lg font-semibold mb-2">
                        No Job History
                      </h3>
                      <p className="text-gray-500 mb-4">
                        You haven't completed any jobs yet.
                      </p>
                      <Button onClick={() => navigate("/post-job")}>
                        Post Your First Job
                      </Button>
                    </div>
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
