import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const AboutUs = () => {
  return (
    <div className="container flex-col w-screen mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          About Handyman
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're a dedicated team of skilled professionals committed to providing
          reliable, high-quality home repair and maintenance services. Our
          mission is to make home repairs hassle-free and efficient.
        </p>
      </div>

      <div className="text-center mt-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Our Commitment
        </h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Quality Service</h3>
            <p className="text-gray-600">
              We guarantee professional, thorough, and reliable service for
              every job.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Experienced Team</h3>
            <p className="text-gray-600">
              Our technicians are skilled professionals with years of
              specialized experience.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">
              Customer Satisfaction
            </h3>
            <p className="text-gray-600">
              We prioritize your needs and work until you're completely
              satisfied.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <Button variant="default" size="lg">
          Contact Us Today
        </Button>
      </div>
    </div>
  );
};

export default AboutUs;
