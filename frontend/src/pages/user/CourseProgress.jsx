import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CoursesApiClient from "@/lib/CoursesApiClient";
import { CheckCircle, CirclePlay } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function CourseProgress() {
  const { course_id } = useParams();
  const videoRef = useRef(null);
  const [playingVideo, setPlayingVideo] = useState({
    title: "",
    url: "",
    isViewed: false,
    lecture_id: "",
  });
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [courseDetails, setCourseDetails] = useState(null);
  const [userCourseProgress, setUserCourseProgress] = useState(0);

  console.log("playingVideo", playingVideo);

  const getCourseLectureProgress = async () => {
    try {
      const response = await CoursesApiClient.getCourseProgress(course_id);
      if (response.data.success) {
        const { userCourseProgress, course } = response.data;
        setCourseDetails(course);
        setUserCourseProgress(userCourseProgress);
        setCourseCompleted(userCourseProgress?.isCourseCompleted);
        setPlayingVideo((prev) => {
          return {
            ...prev,
            title:
              courseDetails?.lectures[
                userCourseProgress?.viewedLectures?.length
              ]?.lectureTitle,
            url:
              prev.url === "" &&
              courseDetails?.lectures[
                userCourseProgress?.viewedLectures?.length
              ]?.videoUrl,
            isViewed: false,
            lecture_id:
              courseDetails?.lectures[
                userCourseProgress?.viewedLectures?.length
              ]?._id,
          };
        });
      }
    } catch (error) {
      console.log("Failed to get course progress", error);
    }
  };

  useEffect(() => {
    getCourseLectureProgress();
  }, []);

  const isLectureCompleted = (lecture_id) => {
    return userCourseProgress?.viewedLectures?.some(
      (lecture) => lecture.lecture_id === lecture_id
    );
  };

  const updateCourseLectureProgress = async (lecture_id) => {
    try {
      console.log("lecture_id", lecture_id);
      const response = await CoursesApiClient.updateCourseLectureProgress(
        course_id,
        lecture_id
      );

      if (response.data.success) {
        console.log("response", response);
        if (
          userCourseProgress?.viewedLectures?.length <
          courseDetails?.lectures.length
        ) {
          getCourseLectureProgress();
        }
        // getCourseLectureProgress();
      }
    } catch (error) {
      console.log("Error update course progress", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseDetails?.courseTitle}</h1>
        <Button>
          {courseCompleted && <CheckCircle className="mr-2 text-green-500" />}{" "}
          {courseCompleted ? "Completed" : "Not Completed"}
        </Button>
      </div>

      {/* Video section */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <video
            className="w-full"
            src={playingVideo.url}
            type="video/mp4"
            ref={videoRef}
            controls
            onPlay={() => {
              setTimeout(() => {
                updateCourseLectureProgress(playingVideo.lecture_id);
              }, 5000);
            }}
          ></video>
          <div className="mt-4">
            <h1 className="font-medium text-lg">{playingVideo.title || ""}</h1>
          </div>
        </div>
        {/* Display current watching course lecture */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-300 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
          <div className="flex-1 overflow-y-auto">
            {/* {[1, 2, 3, 4, 5].map((lecture) => ( */}
            {courseDetails?.lectures.map((lecture) => (
              <Card
                className="mb-4 cursor-pointer transition transform"
                key={lecture._id}
              >
                <CardContent
                  className={`flex items-center justify-between p-4 ${
                    playingVideo.title === lecture.lectureTitle
                      ? "bg-gray-100"
                      : ""
                  }`}
                  onClick={() => {
                    if (playingVideo.title === lecture.lectureTitle) {
                      // console.log("click");
                      return;
                    }
                    videoRef.current.src = lecture.videoUrl;
                    // setWatchingVideoTitle(lecture.lectureTitle);
                    setPlayingVideo({
                      title: lecture.lectureTitle,
                      url: lecture.videoUrl,
                      isViewed: false,
                      lecture_id: lecture._id,
                    });
                    // setLectureId(lecture._id);
                  }}
                >
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <h3 className="font-medium">{lecture.lectureTitle}</h3>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge variant={"outline"} className="bg-green-500">
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
