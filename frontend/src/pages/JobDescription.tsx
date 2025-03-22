import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function JobDescription() {
  // Sample job data - in a real app, this would likely come from props or a data fetch
  const jobData = {
    title: "Job Title",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis inventore labore molestias exercitationem voluptates quasi recusandae. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    amount: "50",
    location: "Location",
    avatarUrl: "/assets/dummypfp.webp",
    userInitials: "JD",
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={jobData.avatarUrl} alt="User Avatar" />
              <AvatarFallback>{jobData.userInitials}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{jobData.title}</h2>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Job Description:</h3>
            <p className="text-gray-700">{jobData.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Job Location:</h3>
            <p className="text-gray-700">{jobData.location}</p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center border-t pt-4">
          <span className="text-lg font-semibold">${jobData.amount}</span>
          <Button>Apply Now</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
