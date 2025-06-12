import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ✅ Auto-switch between local and deployed API
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api/v1"
    : "https://coursemacy.onrender.com/api/v1";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  const CreateCourseHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/course`,
        { courseTitle, category },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        navigate("/admin/course");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to create course.");
      }
    } catch (error) {
      console.error("Create course error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Network error or server not responding"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 md:pr-20 h-screen">
      <h1 className="text-2xl font-bold">
        Let's Add <span className="text-blue-500">Courses</span>
      </h1>
      <p className="mb-6">
        Ready to share your expertise and generate revenue? Click 'Let's Add
        Course' to launch a new, profitable course, design engaging content, and
        connect with eager learners. Start teaching and earning today!
      </p>

      <div>
        <div className="mb-4">
          <Label className="mb-2">Title</Label>
          <Input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Your Course Name"
            className="bg-white"
          />
        </div>

        <div className="mb-5">
          <Label className="mb-2">Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {[
                  "MernStack Development",
                  "Frontend Development",
                  "Backend Development",
                  "Data Science",
                  "Python",
                  "JavaScript",
                  "PHP",
                  "Docker",
                  "C++",
                  "MongoDB",
                  "SQL",
                  "Java",
                  "Wordpress",
                ].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => navigate("/admin/course")} variant="outline">
            Cancel
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            disabled={loading}
            onClick={CreateCourseHandler}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-1 h-4 w-4" />
                Please wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;

