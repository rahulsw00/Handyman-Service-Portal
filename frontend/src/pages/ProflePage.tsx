import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample user data - this would come from your API/backend
  const profile = {
    isHandyman: true,
    name: "Placeholder Username",
    avatar: "../src/assets/dummypfp.webp",
    location: "Dummy name, City",
    memberSince: "January 2023",
    rating: 4.8,
    totalReviews: 47,
    completedJobs: 52,
    bio: "Professional handyman with over 10 years of experience in home repair and maintenance. Specialized in plumbing, electrical work, and general carpentry. I take pride in delivering high-quality work with attention to detail.",
    jobType: "Handyman",
    specialties: ["Plumbing", "Electrical", "Carpentry", "Painting"],
    contactInfo: {
      email: "test@example.com",
      phone: "(0123) 123-4567",
    },
    availability: "Weekdays 8am-5pm",
    qualifications: [
      {
        name: "Certified Plumber",
        issuer: "National Plumbing Association",
        year: "2015",
      },
      {
        name: "Electrical Safety Certification",
        issuer: "Electrical Workers Union",
        year: "2017",
      },
    ],
    experience: [
      {
        role: "Lead Handyman",
        company: "Home Solutions Inc.",
        period: "2018 - Present",
        description:
          "Handling various home repair projects and leading a team of 3 handymen.",
      },
      {
        role: "Independent Contractor",
        company: "Self-employed",
        period: "2013 - 2018",
        description:
          "Provided home repair services to residential clients across the Bay Area.",
      },
    ],
    reviews: [
      {
        id: 1,
        name: "Jennifer S.",
        rating: 5,
        date: "March 15, 2024",
        comment:
          "Michael was prompt, professional, and fixed our leaky faucet in no time. Highly recommend!",
      },
      {
        id: 2,
        name: "Robert T.",
        rating: 4,
        date: "February 28, 2024",
        comment:
          "Great work installing our new light fixtures. Clean and efficient.",
      },
      {
        id: 3,
        name: "Sarah L.",
        rating: 5,
        date: "January 10, 2024",
        comment:
          "Michael went above and beyond with our kitchen cabinet repair. Very satisfied with his work.",
      },
    ],
    ratingBreakdown: {
      5: 35,
      4: 10,
      3: 2,
      2: 0,
      1: 0,
    },
  };

  // Function to render star ratings
  const renderStars = (rating) => {
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

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 py-8 w-screen">
      <div className="w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Profile Summary */}
          <div className="md:col-span-1">
            <Card className="shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-24"></div>
              <div className="flex flex-col items-center -mt-12 px-4 pb-6">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full border-4 border-white bg-white"
                />
                <h2 className="mt-4 text-xl font-bold">{profile.name}</h2>
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
                  {profile.location}
                </div>

                <div className="flex items-center mt-3">
                  {renderStars(profile.rating)}
                  <span className="ml-2 font-medium">{profile.rating}</span>
                  <span className="ml-1 text-gray-500">
                    ({profile.totalReviews} reviews)
                  </span>
                </div>

                {profile.isHandyman && (
                  <Badge className="mt-3 bg-blue-600">{profile.jobType}</Badge>
                )}

                <div className="mt-4 w-full">
                  <div className="flex justify-between text-sm">
                    <span>Member since</span>
                    <span className="font-medium">{profile.memberSince}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Completed jobs</span>
                    <span className="font-medium">{profile.completedJobs}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {profile.specialties.map((specialty, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gray-100"
                    >
                      {specialty}
                    </Badge>
                  ))}
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
                    <span>{profile.contactInfo.email}</span>
                  </div>
                  <div className="flex">
                    <svg
                      className="h-5 w-5 mr-3 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>{profile.contactInfo.phone}</span>
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
                    <span>Available {profile.availability}</span>
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
                      <p className="text-gray-600">{profile.bio}</p>
                    </div>

                    {profile.isHandyman &&
                      profile.qualifications.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3">
                            Qualifications
                          </h3>
                          <div className="space-y-3">
                            {profile.qualifications.map(
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
                    {profile.experience.map((exp, index) => (
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
                          {profile.rating}
                        </div>
                        <div className="mt-1">
                          {renderStars(profile.rating)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {profile.totalReviews} reviews
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
                                (profile.ratingBreakdown[rating] /
                                  profile.totalReviews) *
                                100
                              }
                              className="h-2 flex-1"
                            />
                            <span className="ml-2 text-sm text-gray-500 w-8">
                              {Math.round(
                                (profile.ratingBreakdown[rating] /
                                  profile.totalReviews) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {profile.reviews.map((review) => (
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
                          <span className="text-gray-500">{review.rating}</span>
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
};

export default ProfilePage;
