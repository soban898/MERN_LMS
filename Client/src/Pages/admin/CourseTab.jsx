import TextEditor from "@/components/TextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "@/redux/courseSlice";
import { Loader2 } from "lucide-react";

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api/v1"
    : "https://coursemacy.onrender.com/api/v1";

const CourseTab = () => {
  const params = useParams();
  const id = params.courseId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { course } = useSelector((store) => store.course);
  const selectCourse = course.find((course) => course._id === id);

  const [selectedCourse, setSelectedCourse] = useState(selectCourse);
  const [loading, SetLoading] = useState(false);
  const [publish, setPublish] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const getCourseById = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/course/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setSelectedCourse(res.data.course);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourseById();
  }, []);

  const [input, setInput] = useState({
    courseTitle: selectedCourse?.courseTitle,
    subTitle: selectedCourse?.subTitle,
    description: selectedCourse?.description,
    category: selectedCourse?.category,
    courseLevel: selectedCourse?.courseLevel,
    courseType: selectedCourse?.courseType,
    coursePrice: selectedCourse?.coursePrice,
    file: "",
  });

  const [previewThumbnail, setPreviewThumbnail] = useState(
    selectedCourse?.courseThumbnail
  );

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  const selectCourseType = (value) => {
    setInput({ ...input, courseType: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("courseType", input.courseType);
    formData.append("coursePrice", input.coursePrice);
    formData.append("file", input.courseThumbnail);

    try {
      SetLoading(true);
      const res = await axios.put(`${BASE_URL}/course/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("lecture");
        toast.success(res.data.message);
        dispatch([...course, setCourse(res.data.course)]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      SetLoading(false);
    }
  };

  const removeCourseHandler = async () => {
    try {
      setRemoveLoading(true);
      const res = await axios.delete(`${BASE_URL}/course/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/course");
      } else {
        toast.error("Failed to delete course");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while deleting the course");
    } finally {
      setRemoveLoading(false);
    }
  };

  const togglePublishUnpublish = async (action) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/course/${id}`,
        {},
        {
          params: { action },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setPublish(!publish);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex md:flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you're done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button
            onClick={() =>
              togglePublishUnpublish(
                selectedCourse.isPublished ? "false" : "true"
              )
            }
            className="bg-gray-800"
          >
            {selectedCourse.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button
            onClick={removeCourseHandler}
            variant="destructive"
            disabled={removeLoading}
          >
            {removeLoading ? (
              <>
                <Loader2 className="mr-1 w-4 h-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Remove Course"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label>Title</Label>
          <Input
            value={input.courseTitle}
            onChange={changeEventHandler}
            type="text"
            name="courseTitle"
            placeholder="MongoDB for Beginners"
          />
        </div>
        <div className="mb-4">
          <Label>Subtitle</Label>
          <Input
            value={input.subTitle}
            onChange={changeEventHandler}
            type="text"
            name="subTitle"
            placeholder="hey this is the subtitle for a trail course"
          />
        </div>
        <div className="mb-4">
          <Label>Description</Label>
          <TextEditor input={input} setInput={setInput} />
        </div>
        <div className="flex md:flex-row flex-wrap gap-1 items-center md:gap-5 mb-4">
          <div>
            <Label>Category</Label>
            <Select
              defaultValue={input.category}
              onValueChange={selectCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="MernStack Development">
                    MernStack Development
                  </SelectItem>
                  <SelectItem value="Frontend Development">
                    Frontend Development
                  </SelectItem>
                  <SelectItem value="Backend Development">
                    Backend Development
                  </SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                  <SelectItem value="PHP">PHP</SelectItem>
                  <SelectItem value="Docker">Docker</SelectItem>
                  <SelectItem value="C++">C++</SelectItem>
                  <SelectItem value="MongoDBe">MongoDB</SelectItem>
                  <SelectItem value="SQL">SQL</SelectItem>
                  <SelectItem value="Java">Java</SelectItem>
                  <SelectItem value="Wordpress">Wordpress</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Course Level</Label>
            <Select
              defaultValue={input.courseLevel}
              onValueChange={selectCourseLevel}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a course level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Course Level</SelectLabel>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Medium">Intermediate</SelectItem>
                  <SelectItem value="Advance">Advance</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Price in (BDT)</Label>
            <Input
              type="number"
              name="coursePrice"
              value={input.coursePrice}
              onChange={changeEventHandler}
              placeholder="500"
              className="w-fit"
            />
          </div>
          <div>
            <Label>Course Type</Label>
            <Select
              defaultValue={input.courseType}
              onValueChange={selectCourseType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a course type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Course Type</SelectLabel>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Free">Free</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mb-4">
          <Label>Course Thumbnail</Label>
          <Input
            type="file"
            id="file"
            onChange={selectThumbnail}
            accept="image/*"
            className="w-fit"
          />
          {previewThumbnail && (
            <img src={previewThumbnail} alt="Thumbnail" className="w-64 my-2" />
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/admin/course")} variant="outline">
            Cancel
          </Button>
          <Button
            className="bg-gray-800"
            disabled={loading}
            onClick={updateCourseHandler}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;




