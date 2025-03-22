import React from "react";

import { Button } from "@/components/ui/button";
const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between py-4 mx-auto px-4">
        <div className="flex items-center">
          <div className="text-xl font-bold text-blue-700">HANDYMAN</div>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="text-gray-600 hover:text-blue-700">
            Home
          </a>
          <a href="/categories" className="text-gray-600 hover:text-blue-700">
            Categories
          </a>
          <a href="/job" className="text-gray-600 hover:text-blue-700">
            Jobs
          </a>
          <a href="/about-us" className="text-gray-600 hover:text-blue-700">
            About Us
          </a>
        </nav>
        <div>
          <Button variant="outline" className="hidden md:inline-flex mr-2">
            <a href="/login">Login</a>
          </Button>
          <Button className="md:inline-flex">Hire Now</Button>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
