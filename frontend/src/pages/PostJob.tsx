import React, { useState } from "react";

const PostJobPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    preferredDateTime: "",
    flexibleTiming: false,
    budgetRangeMin: "",
    budgetRangeMax: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "budgetRangeMin" || name === "budgetRangeMax") {
      // Only allow numeric values for budget
      const numericValue = value.replace(/[^\d]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Required fields
    const requiredFields: (keyof typeof formData)[] = [
      "title",
      "description",
      "address",
      "city",
      "state",
      "postalCode",
      "preferredDateTime",
      "budgetRangeMin",
      "budgetRangeMax",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Budget validation
    if (
      parseInt(formData.budgetRangeMin) > parseInt(formData.budgetRangeMax) &&
      formData.budgetRangeMin &&
      formData.budgetRangeMax
    ) {
      newErrors.budgetRangeMin =
        "Minimum budget cannot be greater than maximum budget";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:8000/job.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "post_job",
            ...formData,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setSuccessMessage("Job posted successfully!");
          // Reset form
          setFormData({
            title: "",
            description: "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            preferredDateTime: "",
            flexibleTiming: false,
            budgetRangeMin: "",
            budgetRangeMax: "",
          });
        } else {
          setErrors({
            form: data.error || "Failed to post job. Please try again.",
          });
        }
      } catch (error) {
        setErrors({ form: "Network error. Please try again." });
      }
    } else {
      console.log("Form has errors");
    }
  };

  // Indian States for dropdown
  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 w-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Post a New Job</h2>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {errors.form && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white
                ${errors.title ? "border-red-500" : "focus:ring-blue-500"}`}
              placeholder="Enter job title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white
                ${
                  errors.description ? "border-red-500" : "focus:ring-blue-500"
                }`}
              placeholder="Describe the job requirements"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white
                ${errors.address ? "border-red-500" : "focus:ring-blue-500"}`}
              placeholder="Street Address"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white
                  ${errors.city ? "border-red-500" : "focus:ring-blue-500"}`}
                placeholder="City"
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                State
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white
                  ${errors.state ? "border-red-500" : "focus:ring-blue-500"}`}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              maxLength={6}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white
                ${
                  errors.postalCode ? "border-red-500" : "focus:ring-blue-500"
                }`}
              placeholder="Postal Code"
            />
            {errors.postalCode && (
              <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Preferred Date & Time
            </label>
            <input
              type="datetime-local"
              name="preferredDateTime"
              value={formData.preferredDateTime}
              onChange={handleChange}
              min={today.toISOString().slice(0, 16)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white
      ${errors.preferredDateTime ? "border-red-500" : "focus:ring-blue-500"}`}
            />
            {errors.preferredDateTime && (
              <p className="text-red-500 text-xs mt-1">
                {errors.preferredDateTime}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="flexibleTiming"
                checked={formData.flexibleTiming}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <span className="ml-2 text-gray-700">Flexible Timing</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Budget Minimum (₹)
              </label>
              <input
                type="text"
                name="budgetRangeMin"
                value={formData.budgetRangeMin}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white
                  ${
                    errors.budgetRangeMin
                      ? "border-red-500"
                      : "focus:ring-blue-500"
                  }`}
                placeholder="Minimum Budget"
              />
              {errors.budgetRangeMin && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.budgetRangeMin}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Budget Maximum (₹)
              </label>
              <input
                type="text"
                name="budgetRangeMax"
                value={formData.budgetRangeMax}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white
                  ${
                    errors.budgetRangeMax
                      ? "border-red-500"
                      : "focus:ring-blue-500"
                  }`}
                placeholder="Maximum Budget"
              />
              {errors.budgetRangeMax && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.budgetRangeMax}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
