import Course from "@/components/Course";
import CourseSkeleton from "@/components/skeleton/CourseSkeleton";
import { useSelector } from "react-redux";

const enrolledCourses = [
  {
    id: 1,
    courseTitle: "test",
    courseThumbnail: "https://via.placeholder.com/150",
    creator: {
      name: "test",
      photoUrl: "https://via.placeholder.com/150",
    },
    courseDescription: "test",
    courseDuration: "test",
    courseLevel: "test",
    coursePrice: "0",
  },
  {
    id: 2,
    courseTitle: "test",
    courseThumbnail: "https://via.placeholder.com/150",
    creator: {
      name: "test",
      photoUrl: "https://via.placeholder.com/150",
    },
    courseDescription: "test",
    courseDuration: "test",
    courseLevel: "test",
    coursePrice: "0",
  },
  {
    id: 3,
    courseTitle: "test",
    courseThumbnail: "https://via.placeholder.com/150",
    creator: {
      name: "test",
      photoUrl: "https://via.placeholder.com/150",
    },
    courseDescription: "test",
    courseDuration: "test",
    courseLevel: "test",
    coursePrice: "0",
  },
  {
    id: 4,
    courseTitle: "test",
    courseThumbnail: "https://via.placeholder.com/150",
    creator: {
      name: "test",
      photoUrl: "https://via.placeholder.com/150",
    },
    courseDescription: "test",
    courseDuration: "test",
    courseLevel: "test",
    coursePrice: "0",
  },
];

export default function MyLearnings() {
  const { user } = useSelector((state) => state.auth);
  const isLoading = false;
  console.log(user);

  return (
    <div className="bg-gray-50 max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <>
                <CourseSkeleton key={index} />
              </>
            ))}
          </>
        ) : (
          <>
            {user?.coursesEnrolled?.map((course, index) => (
              <>
                <Course course={course} key={index} />
              </>
            ))}
          </>
        )}
      </div>

      {enrolledCourses.length == 0 ? (
        <>
          <>
            <p className="text-center md:text-xl">
              You have not enrolled in any course
            </p>
          </>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
