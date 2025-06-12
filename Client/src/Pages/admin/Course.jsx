import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "@/redux/courseSlice";
import { Edit } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBangladeshiTakaSign } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

// ✅ Auto-switch between local and deployed API
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api/v1"
    : "https://coursemacy.onrender.com/api/v1";

const Course = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { course } = useSelector((store) => store.course);

  useEffect(() => {
    const getCreatorCourse = async () => {
      try {
        // ✅ Updated route to correct endpoint
        const res = await axios.get(`${BASE_URL}/course/creator`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setCourse(res.data.courses));
        } else {
          toast.error(res.data.message || "Failed to fetch courses.");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error(
          error?.response?.data?.message ||
            "Network error or server not responding"
        );
      }
    };
    getCreatorCourse();
  }, [dispatch]);

  return (
    <div className="md:p-10 p-4 w-full h-screen">
      <Button className="bg-blue-500" onClick={() => navigate("create")}>
        Create Course
      </Button>
      <Table className="mt-10">
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Course</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {course?.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="md:w-[300px] flex items-center gap-2">
                <img
                  src={course?.courseThumbnail}
                  alt="Thumbnail"
                  className="w-20 hidden md:block rounded-sm"
                />
                {course.courseTitle}
              </TableCell>

              <TableCell className="font-medium text-right">
                <FontAwesomeIcon
                  icon={faBangladeshiTakaSign}
                  className="mr-1"
                />
                {course.coursePrice === 0 ? 0 : course.coursePrice || "NA"}
              </TableCell>

              <TableCell className="text-center">
                <Badge
                  className={
                    course.isPublished ? "bg-green-400" : "bg-red-400"
                  }
                >
                  {course.isPublished ? "Published" : "Draft"}
                </Badge>
              </TableCell>

              <TableCell className="text-center">
                <Badge
                  className={
                    course.coursePrice != "NA" && course.coursePrice > 0
                      ? "bg-green-600"
                      : "bg-blue-700"
                  }
                >
                  {course.coursePrice != "NA" && course.coursePrice > 0
                    ? "Paid"
                    : "Free"}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/admin/course/${course._id}`)}
                >
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Course;

