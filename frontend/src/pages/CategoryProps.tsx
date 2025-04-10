import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Service {
  service_id: number;
  category_id: number;
  name: string;
  description: string;
  description_2: string;
}

const CategoryLandingPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Base API URL - change to your PHP server address

  useEffect(() => {
    const serviceId = window.location.pathname.split("/").pop();
    async function fetchServiceDetails() {
      try {
        const serviceResponse = await fetch(
          "http://localhost:8000/categories.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
              action: "service",
              service_id: serviceId,
            }),
          }
        );

        if (!serviceResponse.ok) {
          throw new Error(`HTTP error! Status: ${serviceResponse.status}`);
        }

        const serviceData = await serviceResponse.json();
        console.log("category data received:", serviceData);
        setLoading(false);
        setService(serviceData);
      } catch (err) {
        setError("Error fetching services " + err);
        setLoading(false);
        console.error(err);
      }
    }

    fetchServiceDetails();
  }, [serviceId]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner-border text-blue-500" role="status">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error || "Service not found"}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-blue-600">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {service.description}
          </h1>
          <p className="text-lg md:text-xl text-white">
            {service.description_2}
          </p>
        </div>
        <div className="absolute bottom-4 right-4">
          <Button variant="secondary" size="lg" className="font-semibold">
            Post a job
          </Button>
        </div>
      </div>
      <div className="w-full p-6 md:p-12">
        <h2 className="text-2xl font-bold mb-6">
          Top service providers near you
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Display sample providers here - in a real app, you'd fetch these from the backend */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-2">{service.name} Professional</h3>
            <p className="text-gray-600 mb-4">★★★★★ (4.8) · 24 reviews</p>
            <p className="text-sm text-gray-500">Available today · 3 KM away</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-2">{service.name} Expert</h3>
            <p className="text-gray-600 mb-4">★★★★☆ (4.2) · 18 reviews</p>
            <p className="text-sm text-gray-500">
              Available tomorrow · 5 KM away
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-2">{service.name} Services Ltd</h3>
            <p className="text-gray-600 mb-4">★★★★★ (4.9) · 36 reviews</p>
            <p className="text-sm text-gray-500">Available today · 2 KM away</p>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Button className="w-full md:w-auto">
            View all service providers
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryLandingPage;
