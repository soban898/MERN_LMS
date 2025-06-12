import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { setLecture } from "@/redux/lectureSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

// ✅ Base URL Switcher
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api/v1"
    : "https://coursemacy.onrender.com/api/v1";

const LectureTab = () => {
  const params = useParams();
  const { courseId, lectureId } = params;
  const { lecture } = useSelector((store) => store.lecture);
  const selectedLecture = lecture.find((lecture) => lecture._id === lectureId);
  const [lectureTitle, setLectureTitle] = useState(selectedLecture.lectureTitle);
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(selectedLecture.isPreviewFree);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${BASE_URL}/media/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });
        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Video upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async (e) => {
    e.preventDefault();
    const data = {
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
    };
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/course/${courseId}/lecture/${lectureId}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(
          setLecture([
            ...lecture.filter((l) => l._id !== lectureId),
            res.data.lecture,
          ])
        );
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to edit lecture");
    } finally {
      setLoading(false);
    }
  };

  const removeLectureHandler = async (e) => {
    e.preventDefault();
    try {
      setRemoveLoading(true);
      const res = await axios.delete(`${BASE_URL}/course/lecture/${lectureId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        navigate(`/admin/course/${courseId}/lecture`);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete lecture");
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex md:flex-row justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription className="mb-3">
            Make changes and click save when done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button disabled={removeLoading} variant="destructive" onClick={removeLectureHandler}>
            {removeLoading ? (
              <>
                <Loader2 className="mr-1 w-4 h-4 animate-spin" />Please wait
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label className="mb-2">Title</Label>
          <Input
            type="text"
            placeholder="Introduction to JavaScript"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>
        <div className="my-5">
          <Label className="mb-2">
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            className="w-fit"
          />
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch checked={isFree} onCheckedChange={setIsFree} className="bg-gray-800" />
          <Label>Is this video FREE</Label>
        </div>
        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}
        <div className="mt-4">
          <Button
            disabled={loading}
            onClick={editLectureHandler}
            className="bg-gray-800 hover:bg-gray-800"
          >
            {loading ? (
              <>
                <Loader2 className="me-1 w-4 h-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
