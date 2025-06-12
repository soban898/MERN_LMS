import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@radix-ui/react-select';
import axios from 'axios';
import { ArrowLeft, Lock, PlayCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBangladeshiTakaSign } from '@fortawesome/free-solid-svg-icons';

// ✅ Inline BASE_URL (like in Login)
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api/v1"
    : "https://coursemacy.onrender.com/api/v1";

const CourseDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;
  const { course } = useSelector(store => store.course);
  const selectedCourse = course.find(course => course._id === courseId);
  const [courseLecture, setCourseLecture] = useState(null);

  useEffect(() => {
    const getCourseLecture = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/course/${courseId}/lecture`, {
          withCredentials: true
        });
        if (res.data.success) {
          setCourseLecture(res.data.lectures);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCourseLecture();
  }, [courseId]);

  return (
    <div className='bg-gray-100 md:p-10'>
      <Card className="max-w-7xl rounded-md mx-auto bg-white shadow-md pt-5 mt-14">
        {/* Header Section */}
        <div className='px-4 py-1'>
          <div className='flex justify-between items-center'>
            <div className='flex gap-2 items-center'>
              <Button size="icon" variant="outline" className="rounded-full" onClick={() => navigate('/courses')}>
                <ArrowLeft size={16} />
              </Button>
              <h1 className='md:text-2xl font-bold text-gray-800'>{selectedCourse.courseTitle}</h1>
            </div>
            <div className='flex space-x-4'>
              <Button className="bg-blue-500 hover:bg-blue-600">Enroll Now</Button>
            </div>
          </div>
        </div>

        {/* Course overview section */}
        <div className='p-6'>
          <div className='flex flex-col lg:flex-row lg:space-x-8'>
            <img src={selectedCourse.courseThumbnail} alt="Thumbnail" className='w-full lg:w-1/2 rounded-md mb-4 lg:mb-0' />
            <div>
              <p className='text-gray-800 mb-4 font-semibold capitalize'>{selectedCourse.subTitle}</p>
              <p className='mb-4 text-gray-700' dangerouslySetInnerHTML={{ __html: selectedCourse.description }} />
              <p className='text-gray-800 font-semibold'>⭐⭐⭐⭐⭐ (4.8) | 1,200 reviews</p>
              <div className='mt-1'>
                <p className='text-2xl font-bold text-gray-800'>
                  <FontAwesomeIcon icon={faBangladeshiTakaSign} className="mr-1" />
                  {selectedCourse.coursePrice}
                </p>
                <p className='text-gray-500 line-through'>
                  <FontAwesomeIcon icon={faBangladeshiTakaSign} className="mr-1" />
                  {selectedCourse.coursePrice + 100}
                </p>
              </div>
              <ul className='mt-4 space-y-2'>
                <li className='text-gray-600'>✔ 30+ hours of video content</li>
                <li className='text-gray-600'>✔ Lifetime access to course materials</li>
                <li className='text-gray-600'>✔ Certificate of completion</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Course Details Section */}
        <div className='p-6'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>What You'll Learn</h2>
          <ul className='list-disc pl-5 space-y-2 text-gray-700'>
            <li>Grasp foundational concepts of the subject matter.</li>
            <li>Develop practical skills and apply learned knowledge.</li>
            <li>Gain a comprehensive understanding of key principles.</li>
          </ul>

          <h2 className='text-xl font-bold text-gray-800 mt-6 mb-4'>Requirements</h2>
          <p className='text-gray-700'>No prior coding experience is needed to enroll in this beginner-friendly course.</p>

          <h2 className='text-xl font-bold text-gray-800 mt-6 mb-4'>Who This course is for</h2>
          <p className='text-gray-700'>Beginner, aspiring developers and professionals looking to upgrade skills</p>
        </div>

        {/* Course Lectures */}
        {courseLecture?.length === 0 ? null : (
          <div className='flex flex-col md:flex-row justify-between gap-10 p-6'>
            <div className='flex-1'>
              <h2 className='text-xl font-bold text-gray-800'>Course Curriculum</h2>
              <p className='text-gray-700 italic my-2'>{courseLecture?.length} Lectures</p>
              <div className='space-y-4'>
                {courseLecture?.map((lecture, index) => (
                  <div key={index} className='flex items-center gap-3 bg-gray-200 p-4 rounded-md cursor-pointer'>
                    <span>
                      {lecture.isPreviewFree ? <PlayCircle size={20} /> : <Lock size={20} />}
                    </span>
                    <p>{lecture.lectureTitle}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='w-full lg:w-1/2'>
              <Card>
                <CardContent className="p-4 flex flex-col">
                  <div className='w-full aspect-video mb-4'>
                    <ReactPlayer
                      width="100%"
                      height="100%"
                      url={courseLecture ? courseLecture[0]?.videoUrl : null}
                      controls={true}
                    />
                  </div>
                  <h1>{courseLecture ? courseLecture[0]?.lectureTitle : "Lecture Title"}</h1>
                  <Separator className='my-2' />
                  <p>
                    Get a sneak peek inside this course! This short preview highlights key learning areas, introduces the instructor, and showcases the engaging content you can expect.
                  </p>
                </CardContent>
                <CardFooter className="flex p-4">
                  <Button>Continue Course</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}

        {/* Instructor Section */}
        <div className='p-6'>
          <h2 className='text-xl font-bold text-gray-800'>Instructor</h2>
          <div className='flex items-center space-x-4'>
            <img src={selectedCourse.creator.photoUrl} alt="instructor" className='w-16 h-16 rounded-full' />
            <div>
              <h3 className='text-lg font-bold text-gray-800'>{selectedCourse.creator.name}</h3>
              <p className='text-gray-600'>Senior Full-Stack Developer</p>
            </div>
          </div>
          <p className='text-gray-700 mt-4'>{selectedCourse.creator.description}</p>
        </div>
      </Card>
    </div>
  );
};

export default CourseDetails;
