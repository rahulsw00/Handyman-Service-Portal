import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ChevronLeft, ChevronRight } from "lucide-react";

import "../styles/JobNode.css";

import { useState, useEffect } from "react";

// JobNode component receives job data as props

const JobNode = ({ job }) => {
  let ProfilePic = "../src/assets/dummypfp.webp";

  let UserName = "@shadcn";

  let AVFallback = UserName.slice(1, 2);

  return (
    <div className="jobnode">
      <Card className="jobcard w-44 h-2">
        <CardContent className="jobcontent object-contain w-44 h-2 p-0">
          <div className="flex items-center space-x-8 overflow-hidden whitespace-nowrap">
            <div className="col-1 flex items-center justify-center h-2 w-2">
              <Avatar className="profile-pic w-10 h-10">
                <AvatarImage src={ProfilePic} alt={UserName} />

                <AvatarFallback>{AVFallback.toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>

            <div className="col-2 flex-1 space-y ml-0">
              <div className="grid grid-rows-4">
                <div className="row-start-1">
                  <span className="flex items-center justify-between">
                    <p className="title text-sm font-medium leading-none">
                      {job.title}
                    </p>

                    <p className="JobAmount text-sm font-medium leading-none">
                      {job.budget_range_min} - {job.budget_range_max}
                    </p>
                  </span>
                </div>

                <div className="row-span-3">
                  <p className="description text-sm text-muted-foreground text-wrap">
                    {job.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-3 flex items-center content-center h-2 w-2">
              <Button
                className="take"
                onClick={async () => {
                  try {
                    const response = await fetch(
                      "http://localhost:8000/job.php",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          action: "get_job",
                          job_id: job.job_id,
                        }),
                      }
                    );

                    if (!response.ok) {
                      throw new Error("Failed to take the job");
                    }

                    // Navigate to another page after successful response
                    window.location.href = `/take-job/${job.job_id}`;
                  } catch (error) {
                    console.error("Error taking the job:", error);
                  }
                }}
              >
                Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main TakeJob component with pagination

const TakeJob = () => {
  const [jobsData, setJobsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);

  // Pagination state

  const [currentPage, setCurrentPage] = useState(1);

  const [jobsPerPage] = useState(6); // Adjust this number based on your layout

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch("http://localhost:8000/job.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "get_jobs_data",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();

        setJobsData(data);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching job data:", error);

        setError(error.message);

        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get current jobs for pagination

  const indexOfLastJob = currentPage * jobsPerPage;

  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  const currentJobs = jobsData.slice(indexOfFirstJob, indexOfLastJob);

  // Calculate total pages

  const totalPages = Math.ceil(jobsData.length / jobsPerPage);

  // Change page

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="category flex flex-wrap gap-1 mt-1 mb-1">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="light">Light</SelectItem>

            <SelectItem value="dark">Dark</SelectItem>

            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="light">Light</SelectItem>

            <SelectItem value="dark">Dark</SelectItem>

            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="container w-screen flex flex-col">
        <div className="jobs-container flex flex-wrap gap-4 justify-between items-center mb-4">
          {isLoading ? (
            <p>Loading jobs...</p>
          ) : error ? (
            <p>Error loading jobs: {error}</p>
          ) : currentJobs.length > 0 ? (
            currentJobs.map((job) => <JobNode key={job.job_id} job={job} />)
          ) : (
            <p>No jobs available</p>
          )}
        </div>

        {/* Pagination Controls */}

        {!isLoading && !error && jobsData.length > 0 && (
          <div className="pagination-controls flex justify-center items-center gap-4 mt-4">
            <Button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              variant="outline"
              size="icon"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              variant="outline"
              size="icon"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default TakeJob;
