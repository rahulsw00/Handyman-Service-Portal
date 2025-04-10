import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define interface for category
interface Category {
  category_id: number;
  name: string;
}

// Define interface for subcategory
interface SubCategory {
  service_id: number;
  category_id: number;
  name: string;
  description: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories and subcategories
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoryResponse = await fetch(
          "http://localhost:8000/categories.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
              action: "category",
            }),
          }
        );

        if (!categoryResponse.ok) {
          throw new Error(`HTTP error! Status: ${categoryResponse.status}`);
        }

        const categoryData = await categoryResponse.json();
        console.log("category data received:", categoryData);
        setCategories(categoryData);

        // Fetch subcategories
        const subcategoryResponse = await fetch(
          "http://localhost:8000/categories.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
              action: "categories",
            }),
          }
        );

        if (!subcategoryResponse.ok) {
          throw new Error(`HTTP error! Status: ${subcategoryResponse.status}`);
        }

        const subcategoryData = await subcategoryResponse.json();
        console.log("subcategory data received:", subcategoryData);
        setSubCategories(subcategoryData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          `Failed to load data: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(categories);
  console.log(subCategories);

  // Get subcategories for a specific category
  const getSubcategoriesForCategory = (categoryId: number) => {
    return subCategories.filter(
      (subCategory) => subCategory.category_id === categoryId
    );
  };

  // Handle category click to navigate to category landing page
  const handleCategoryClick = (categoryName: string, serviceId: number) => {
    navigate(`/categories/${serviceId}`, { state: { categoryName } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-screen">
        <div className="spinner-border text-blue-500" role="status">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 w-screen">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {categories.map((category) => (
          <div
            key={category.category_id}
            className="card bg-white shadow-md rounded-lg p-6 w-80 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold mb-4">{category.name}</h3>
            <ul className="space-y-2">
              {getSubcategoriesForCategory(category.category_id).map(
                (subCategory) => (
                  <li
                    key={subCategory.service_id}
                    className="text-gray-700 hover:text-blue-600"
                    onClick={() =>
                      handleCategoryClick(
                        subCategory.name,
                        subCategory.service_id
                      )
                    }
                  >
                    {subCategory.name}
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
