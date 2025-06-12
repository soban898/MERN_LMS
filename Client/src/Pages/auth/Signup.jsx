import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ✅ Auto-switch between local and deployed API
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api/v1"
    : "https://coursemacy.onrender.com/api/v1";

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);
    try {
      const response = await axios.post(
        `${BASE_URL}/user/register`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Network error or server not responding"
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Create Your Account
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Join us today! It's quick and easy
        </p>

        {/* Full Name */}
        <div className="mb-4">
          <Label htmlFor="name">Full Name</Label>
          <Input
            placeholder="Enter Your Name"
            name="name"
            id="name"
            value={user.name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            placeholder="Enter Your Email"
            name="email"
            id="email"
            type="email"
            value={user.email}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            placeholder="Enter Your Password"
            name="password"
            id="password"
            type="password"
            value={user.password}
            onChange={handleChange}
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <Label>Role</Label>
          <RadioGroup className="flex gap-4 mt-2 peer">
            <div className="flex items-center space-x-2">
              <Input
                type="radio"
                id="student"
                name="role"
                value="student"
                checked={user.role === "student"}
                onChange={handleChange}
              />
              <Label htmlFor="student">Student</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="radio"
                id="instructor"
                name="role"
                value="instructor"
                checked={user.role === "instructor"}
                onChange={handleChange}
              />
              <Label htmlFor="instructor">Instructor</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Signup Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Signup
        </Button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

