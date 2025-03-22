import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "../styles/HandymanNode.css";

const HandymanNode: React.FC = () => {
  let Name = "Handyman Name";
  let AboutHandyman =
    "brief description about the handyman their job and experience";
  let ProfilePic = "../src/assets/dummypfp.webp";
  let Rating = "user rating: 4.5";
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
              <div className="grid grid-rows-5 justify-center align-middle ">
                <div className="row-start-1">
                  <p className="title text-sm font-medium leading-none">
                    {Name}
                  </p>
                </div>
                <div className="row-span-3">
                  <p className="description text-sm text-muted-foreground text-wrap">
                    {AboutHandyman}
                  </p>
                </div>
                <div className="row-span-1">
                  <p className="description text-sm text-muted-foreground text-wrap">
                    {Rating}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-3">
              <Button className="take">Hire</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HandymanNode;
