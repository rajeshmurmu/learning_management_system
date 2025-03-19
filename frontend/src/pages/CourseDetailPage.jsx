import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CoursesApiClient from "@/lib/CoursesApiClient";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
// import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function CourseDetailPage() {
  const { user } = useSelector((state) => state.auth);
  // console.log(user);
  const navigate = useNavigate();
  const { id } = useParams();
  const [courseDetail, setCourseDetail] = useState({});
  const [videoUrl, setVideoUrl] = useState("");
  const lectureRef = useRef(null);
  const fetchCourseById = async () => {
    try {
      const response = await CoursesApiClient.getCourseById(id);

      if (response.data.success) {
        setCourseDetail(response.data.course);

        // console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourseById();
    // console.log("lecture", courseDetail.lectures[0]?.videoUrl);
    if (courseDetail?.lectures && courseDetail.lectures.length > 0) {
      setVideoUrl(courseDetail.lectures[0]?.videoUrl);
    }
  }, [id]);

  useEffect(() => {
    if (courseDetail?.lectures && courseDetail.lectures.length > 0) {
      lectureRef.current.src = videoUrl;
      console.log("videoUrl", lectureRef.current);
    }
  }, [courseDetail, videoUrl]);
  return (
    <div className="space-y-5">
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {courseDetail.courseTitle}
          </h1>
          <p className="text-base md:text-xl">{courseDetail.subTitle}</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {courseDetail.creator?.name}
            </span>
          </p>

          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last Updated {courseDetail.updatedAt}</p>
          </div>
          <div>
            <p>
              Enrolled Students :{" "}
              <span>{courseDetail.enrolledStudents?.length}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl m-auto my-5 px-4 md:px-8 flex flex-col md:flex-row justify-between gap-10">
        <div className="left_side w-full lg:w-1/2 space-y-5 flex-1">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p>{courseDetail.description}</p>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Course content</CardTitle>
                <CardDescription>
                  {courseDetail.lectures?.length} Lectures
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  {courseDetail.lectures?.map((lecture, idx) => (
                    <div
                      key={idx}
                      onClick={() => setVideoUrl(lecture?.videoUrl)}
                      className="myy-2 cursor-pointer flex items-center gap-2 text-sm hover:bg-slate-200 p-2 rounded"
                    >
                      <span>
                        {lecture.isPreviewFree ? (
                          <PlayCircle size={16} />
                        ) : (
                          <Lock size={16} />
                        )}
                      </span>
                      <p>{lecture.lectureTitle}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="right_side w-full md:w-1/2">
          <div>
            <Card>
              <CardContent className="p-4 flex flex-col">
                <div className="w-full aspect-video mb-4">
                  {/* <ReactPlayer
                    width={"100%"}
                    url={
                      courseDetail?.lectures &&
                      courseDetail.lectures.length > 0 &&
                      courseDetail.lectures[0].videoUrl
                    }
                    ref={lectureRef}
                    controls={true}
                  /> */}
                  <video
                    src=""
                    ref={lectureRef}
                    controls
                    className="w-full"
                  ></video>
                </div>
                <h1>Lecture Title</h1>
                <Separator className="my-2" />
                <h1 className="text-lg md:text-xl font-semibold">
                  RS {courseDetail?.coursePrice}
                </h1>
              </CardContent>
              <CardFooter>
                {user?.coursesEnrolled.filter(
                  (id) => id === courseDetail._id
                ) || courseDetail?.creator === user?._id ? (
                  <Button
                    onClick={() =>
                      navigate(`/course/${courseDetail._id}/course-progress`)
                    }
                  >
                    Continue
                  </Button>
                ) : (
                  <BuyCourseButton course={courseDetail} />
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
