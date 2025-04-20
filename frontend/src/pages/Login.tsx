import React, { useState } from "react";
import axios from "axios";
import Categories from "./Categories";
import { useNavigate } from "react-router-dom";
import { register } from "module";
import { useForm } from "react-hook-form";

const LoginPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    fetch("http://localhost:8000/server.php", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json; cahrset=UTF-8",
      },
      body: JSON.stringify({
        action: "login",
        phoneNumber: data.phoneNumber,
        password: data.password,
      }),
    })
      .then(function (response) {
        //return response.text();
        return response.text();
      })
      .then((data) => {
        setError("");
        console.log(JSON.parse(data)); // remove this line after testing
        const parsedData = JSON.parse(data);
        if (parsedData.success) {
          console.log("Login successful!");
          navigate("/");
          //localStorage.setItem("user", JSON.stringify(parsedData.user));
        } else if (data.includes("email_error")) {
          setError("Phone number not registered!");
        } else if (data.includes("password_error")) {
          setError("Password is incorrect!");
        } else {
          setError("Login failed!");
        }
      });
    // .then(function (data) {
    //   console.log(data);
    // });
    // .then(function (data) {
    //   console.log(data);
    //   if (data === "success") {
    //     alert("Login successful!");
    //   } else if (data === "email_error") {
    //     alert("Email not registered!");
    //   } else if (data === "password_error") {
    //     alert("Password is incorrect!");
    //   } else {
    //     alert("Login failed!");
    //   }
    // });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 w-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form className="login" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Mobile Phone Number
            </label>
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">+91</span>
              <input
                type="phone"
                id="phone"
                {...register("phoneNumber")}
                maxLength={10}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Please enter 10-digit phone number
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type={"submit"}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center ">
          <a href="#" className="text-blue-500 hover:underline text-sm">
            Forgot Password?
          </a>
          <a
            href="/register"
            className="text-blue-500 hover:underline text-sm block mt-2"
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
