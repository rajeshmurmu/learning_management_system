import React from "react";
import CourseSkeleton from "./skeleton/CourseSkeleton";
import Course from "./Course";
import CoursesApiClient from "@/lib/CoursesApiClient";

// const courses = [
//   {
//     id: 1,
//     courseTitle: "test",
//     courseThumbnail: "https://via.placeholder.com/150",
//     creator: {
//       name: "test",
//       photoUrl: "https://via.placeholder.com/150",
//     },
//     courseDescription: "test",
//     courseDuration: "test",
//     courseLevel: "test",
//     coursePrice: "0",
//   },
//   {
//     id: 2,
//     courseTitle: "test",
//     courseThumbnail: "https://via.placeholder.com/150",
//     creator: {
//       name: "test",
//       photoUrl: "https://via.placeholder.com/150",
//     },
//     courseDescription: "test",
//     courseDuration: "test",
//     courseLevel: "test",
//     coursePrice: "0",
//   },
//   {
//     id: 3,
//     courseTitle: "test",
//     courseThumbnail: "https://via.placeholder.com/150",
//     creator: {
//       name: "test",
//       photoUrl: "https://via.placeholder.com/150",
//     },
//     courseDescription: "test",
//     courseDuration: "test",
//     courseLevel: "test",
//     coursePrice: "0",
//   },
//   {
//     id: 4,
//     courseTitle: "test",
//     courseThumbnail: "https://via.placeholder.com/150",
//     creator: {
//       name: "test",
//       photoUrl: "https://via.placeholder.com/150",
//     },
//     courseDescription: "test",
//     courseDuration: "test",
//     courseLevel: "test",
//     coursePrice: "0",
//   },
// ];

export default function Courses() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [courses, setCourses] = React.useState([]);

  const getPublishedCourses = async () => {
    try {
      setIsLoading(true);
      const response = await CoursesApiClient.getPublishedCourses();
      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    getPublishedCourses();
  }, []);
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Our Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <>
              {Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))}
            </>
          ) : (
            <>
              {courses.map((course, index) => (
                <Course course={course} key={index} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
