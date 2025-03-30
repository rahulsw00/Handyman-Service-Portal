// import React, { useState, useEffect, use } from "react";
// import { Link } from "react-router-dom";

// function Categories() {
//   const [categories, setCategory] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/service-categories")
//       .then((res) => res.json())
//       .then((categories) => setCategory(categories))
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <div className="flex items-center justify-center">
//       <div className="flex flex-wrap justify-center">
//         {categories.map((category, categoryIndex) => (
//           <div
//             key={categoryIndex}
//             className="card bg-white shadow-md rounded-lg p-6 m-4 w-80"
//           >
//             <h3 className="font-bold mb-3">{category.name}</h3>

//             <ul>
//               {category.services.map((service, index) => (
//                 <li key={index}>
//                   <Link to={`/category/${service.services}`}>{service}</Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Categories;

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
  const [subCategories, setSubCategories] = useState<{
    [key: number]: SubCategory[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);

        // Fetch subcategories for each category
        const subcategoryPromises = data.map((category: Category) =>
          fetch(`http://localhost:5000/api/services/${category.category_id}`)
            .then((res) => res.json())
            .then((subcats) => ({ [category.category_id]: subcats }))
        );

        const subcategoryResults = await Promise.all(subcategoryPromises);
        const subcategoryMap = subcategoryResults.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
        setSubCategories(subcategoryMap);

        setLoading(false);
      } catch (err) {
        setError("Error fetching categories");
        setLoading(false);
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  // Handle category click to navigate to category landing page
  const handleCategoryClick = (categoryName: string, serviceId: number) => {
    navigate(`/categories/${serviceId}`, { state: { categoryName } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner-border text-blue-500" role="status">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
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
              {subCategories[category.category_id].map((subCategory) => (
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
              ))}
              {/* {subCategories[category.category_id]?.length > 5 && (
                <li className="text-blue-500 font-semibold">
                  + {subCategories[category.category_id].length - 5} more
                </li>
              )} */}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
