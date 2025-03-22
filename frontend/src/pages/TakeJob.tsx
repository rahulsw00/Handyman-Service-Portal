import React from "react";
import JobNode from "@/components/JobNode";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "../styles/TakeJob.css";

export default function TakeJob() {
  const jobNodes = Array.from({ length: 10 }, (_, index) => (
    <JobNode key={index} />
  ));

  return (
    <>
      <div className="category flex flex-wrap gap-1">
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
      <div className="container w-full h-full flex flex-wrap gap-2 justify-between items-center">
        {jobNodes}
      </div>
    </>
  );
}
