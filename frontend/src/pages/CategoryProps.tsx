import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Define the Service interface to resolve TypeScript error

const CategoryLandingPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [Services, setServices] = useState([]);
  //console.log(typeof services);
  console.log(Services);
  // const servicesList = Array.isArray(Services) ? Services : [];
  // {
  //   servicesList.map((service) => <div key={service.id}>{service.name}</div>);
  // }
  // console.log(servicesList);
  console.log(categoryId);

  useEffect(() => {
    async function fetchServices() {
      if (!categoryId) {
        console.error("No category ID provided");
        setServices([]);
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:5000/api/category/${categoryId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        // Ensure the data is an array and matches the Services interface
        const dataArray = Array.isArray(data) ? data : [data];
        if (Array.isArray(dataArray)) {
          setServices(dataArray);
        } else {
          console.error("Unexpected data format", data);
          setServices([]);
        }
      } catch (error) {
        console.error("Fetching services failed", error);
        setServices([]); // Fallback to empty array
      }
    }
    fetchServices();
  }, []);
  // useEffect(() => {
  //   fetch(`http://localhost:5000/api/category/75`)
  //     .then((res) => res.json())
  //     .then((services) => setServices(services))
  //     .catch((err) => console.error(err));
  // }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-blue-600">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
          {Services?.map?.((service) => (
            <div key={service.service_id}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {service.description}
              </h1>
              <p className="text-lg md:text-xl text-white">
                {service.description_2}
              </p>
            </div>
          )) || null}
        </div>
        <div className="absolute bottom-4 right-4">
          <Button variant="secondary" size="lg" className="font-semibold">
            Post a job
          </Button>
        </div>
      </div>
      <div className="w-full p-6 md:p-12">
        <h2 className="text-2xl font-bold mb-6">Top near near you</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Services.map((service) => (
            <div
              key={service.service_id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="font-bold mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4">★★★★★ (4.8) · 24 reviews</p>
              <p className="text-sm text-gray-500">
                Available today · 3 KM away
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button className="w-full md:w-auto">View all s</Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryLandingPage;
