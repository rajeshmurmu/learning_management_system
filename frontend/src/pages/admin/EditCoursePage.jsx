import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import EditCourseTab from "./EditCourseTab";

export default function EditCoursePage() {
  const { courseId } = useParams();
  return (
    <div className="">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">
          Add detail information regarding course
        </h1>
        <Link to={`/admin/courses/edit/${courseId}/lectures`}>
          <Button className="hover:text-blue-600" variant="link">
            Go to lectures page
          </Button>
        </Link>
      </div>
      <EditCourseTab />
    </div>
  );
}
