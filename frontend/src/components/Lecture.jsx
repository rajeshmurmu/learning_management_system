import { Edit } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function Lecture({ lecture, courseId, index }) {
  const navigate = useNavigate();
  // console.log(lecture, courseId, index);
  return (
    <div className="flex justify-between items-center bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py-2 rounded-md my-2">
      <h1 className="font-bold text-gray-800 dark:text-gray-100">
        Lecture - {index + 1} : {lecture.lectureTitle}
      </h1>
      <Edit
        onClick={() =>
          // navigate(`/admin/courses/${courseId}/lectures/${lecture._id}`)
          navigate(`${lecture._id}`)
        }
        className="text-gray-800 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
        size={20}
      />
    </div>
  );
}

Lecture.propTypes = {
  lecture: PropTypes.shape({
    lectureTitle: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  courseId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};
