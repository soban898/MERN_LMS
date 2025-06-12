import CourseCard from "@/components/CourseCard";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { setCourse } from "@/redux/courseSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// ✅ Auto-switch between local and deployed API
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api/v1"
    : "https://coursemacy.onrender.com/api/v1";

const Courses = () => {
  const dispatch = useDispatch();
  const { course } = useSelector((store) => store.course);

  useEffect(() => {
    const getAllPublishedCourse = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/course/published`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setCourse(res.data.courses));
        } else {
          toast.error(res.data.message || "Failed to fetch courses.");
        }
      } catch (error) {
        console.error("Error fetching published courses:", error);
        toast.error(
          error?.response?.data?.message ||
            "Network error or server not responding"
        );
      }
    };
    getAllPublishedCourse();
  }, [dispatch]);

  return (
    <div className="bg-gray-100 pt-14">
      <div className="min-h-screen max-w-7xl mx-auto py-10">
        <div className="px-4">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Our Courses
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Explore our curated courses to boost your skills and career. Whether
            you're a beginner or an expert, we have something for everyone.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {course?.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;

