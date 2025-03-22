import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "../styles/JobNode.css";

const JobNode: React.FC = () => {
  let JobTitle = "Job Title";
  let JobDescription = "Job Description";
  let JobAmount = "$###";
  let ProfilePic = "../src/assets/dummypfp.webp";
  let UserName = "@shadcn";
  let AVFallback = UserName.slice(1, 2);
  return (
    <div className="jobnode">
      <Card className="jobcard">
        <CardContent className="jobcontent object-contain">
          <div className="flex items-center space-x-8">
            <div className="col-1">
              <Avatar className="profile-pic">
                <AvatarImage src={ProfilePic} alt={UserName} />
                <AvatarFallback>{AVFallback.toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <div className="col-2 flex-1 space-y ml-0">
              <div className="grid grid-rows-4">
                <div className="row-start-1">
                  <span className="flex items-center justify-between">
                    <p className="title text-sm font-medium leading-none">
                      {JobTitle}
                    </p>
                    <p className="JobAmount text-sm font-medium leading-none">
                      {JobAmount}
                    </p>
                  </span>
                </div>
                <div className="row-span-3">
                  <p className="description text-sm text-muted-foreground text-wrap">
                    {JobDescription}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-3">
              <Button className="take">Take</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobNode;
