import React from "react";
import { Button } from "@/components/ui/button";

interface CategoryProps {
  categoryName: string;
}

const CategoryLandingPage: React.FC<CategoryProps> = ({
  categoryName = "plumber",
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-blue-600">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Looking for a {categoryName}?
          </h1>
          <p className="text-lg md:text-xl text-white">
            Find a trusty {categoryName} in your area
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
          Top {categoryName}s near you
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 8].map((item) => (
            <div key={item} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold mb-2">
                Professional {categoryName} {item}
              </h3>
              <p className="text-gray-600 mb-4">★★★★★ (4.8) · 24 reviews</p>
              <p className="text-sm text-gray-500">
                Available today · 3 KM away
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button className="w-full md:w-auto">View all {categoryName}s</Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryLandingPage;
