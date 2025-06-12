import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import cloudinary from "../utils/cloud.js";
import getDataUri from "../utils/dataUri.js";

export const createCourse = async(req, res) => {
    try {
        const {courseTitle, category} = req.body;
        if(!courseTitle || !category){
            return res.status(400).json({
                message:"Course title and category is required",
                success:false
            })
        }
        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id
        })
        return res.status(201).json({
            success:true,
            course,
            message:"Course created successfully"
        }) 
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Failed to create course",
            success:false
        })
    }
}

export const getPublishedCourse = async(_, res)=>{
    try {
        const courses = await Course.find({isPublished:true}).populate({path:"creator", select:"name photoUrl description"})
        if(!courses){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            success:true,
            courses,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Failed to get published course",
            success:false
        })
    }
}


export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({creator:userId}).populate("lectures");
        if(!courses){
            return res.status(404).json({
                message:"Course not found",
                courses:[],
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            courses,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Failed to create course",
            success:false
        })
    }
}

export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const {courseTitle, subTitle, description, category, courseLevel, courseType, coursePrice} = req.body;
        const file = req.file;

        let course = await Course.findById(courseId).populate("lectures");
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        let courseThumbnail;
        if(file){
            const fileUri = getDataUri(file)
            courseThumbnail = await cloudinary.uploader.upload(fileUri)
        }
        const UpdateData = {courseTitle, subTitle, description, category, courseLevel, courseType, coursePrice, courseThumbnail:courseThumbnail?.secure_url};
        course = await Course.findByIdAndUpdate(courseId, UpdateData, {new:true});
        return res.status(200).json({
            success:true,
            course,
            message:"Course updated successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Failed to update course",
            success:false
        })
    }
}

export const getCourseById = async (req, res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        return res.status(200).json({
            success:true,
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get course by id"
        })
    }
}

export const removeCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
  
      // Step 1: Find the course
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found!",
        });
      }
  
      // Step 2: Delete all lectures linked to this course
      if (course.lectures.length > 0) {
        await Lecture.deleteMany({ _id: { $in: course.lectures } });
      }
  
      // Step 3: Delete the course itself
      await Course.findByIdAndDelete(courseId);
  
      return res.status(200).json({
        success: true,
        message: "Course removed successfully",
      });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to remove course",
      });
    }
  };
  

// Lecture Controller
export const createLecture = async(req, res)=>{
    try {
        const {lectureTitle} = req.body;
        const {courseId} = req.params;

        if(!lectureTitle || !courseId){
            return res.status(400).json({
                message:"Lecture title is required"
            })
        }
        const lecture = await Lecture.create({lectureTitle});
        const course = await Course.findById(courseId);
        if(course){
            course.lectures.push(lecture._id);
            await course.save()
        }
        return res.status(201).json({
            success:true,
            lecture,
            message:"Lecture created successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create lecture"
        }) 
    }
}


export const getCourseLecture = async (req, res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate('lectures');
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        return res.status(200).json({
            success:true,
            lectures:course.lectures
        }) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lecture"
        })
    }
}

export const editLecture = async (req, res) => {
    try {
        const {lectureTitle, videoInfo, isPreviewFree} = req.body
        const {courseId, lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            })
        }
        // Update lecture
        if(lectureTitle) lecture.lectureTitle = lectureTitle;
        if(videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if(videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        const course = await Course.findById(courseId);
        if(course && !course.lectures.includes(lecture._id)){
            course.lectures.push(lecture._id);
            await course.save()
        }
        return res.status(200).json({
            success:true,
            lecture,
            message:"Lecture updated successfully"
        }) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to edit lecture",
            success:false
        })
    }
}

export const removeLecture = async (req, res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            })
        }
        // Remove the lecture reference from the associative course
        await Course.updateOne(
            {lectures: lectureId}, //bFind the course that contains the lecture
            {$pull: {lectures: lectureId}} // Remove the lecture id from the lectures array
        );
        return res.status(200).json({
            success:true,
            message:"Lecture removed successfully"
        }) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to remove lecture",
        })
    }
}

export const togglePublishedCourse = async (req, res) =>{
    try {
        const {courseId} = req.params;
        const {published} = req.query; //true, false
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        course.isPublished = !course.isPublished
        await course.save()

        const statusMessage = course.isPublished ? "Published":"Unpublished"
        return res.status(200).json({
            success:true,
            message:`Course is ${statusMessage}`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to update status"
        })
    }
}