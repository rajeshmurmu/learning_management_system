import Lecture from "@/components/Lecture";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LectureApiClient from "@/lib/LectureApiClient";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function LecturesPage() {
  const [values, setValues] = React.useState({
    lectureTitle: "",
    description: "",
    lecture: null,
  });
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  // const {
  //   isError: lectureFetchIsError,
  //   isLoading: lectureFetchIsLoading,
  //   // isSuccess: lectureFetchIsSuccess,
  //   error: lectureFetchError,
  //   data: lectureData,
  //   refetch,
  // } = useGetLecturesQuery(courseId);

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("lecture", values.lecture);
      formData.append("lectureTitle", values.lectureTitle);
      formData.append("lectureDescription", values.description);

      const res = await LectureApiClient.createLecture(courseId, formData);

      if (res.data.success) {
        toast.success(res.data.message || "Lecture created successfully");
      }

      setValues({
        lectureTitle: "",
        description: "",
        lecture: null,
      });
    } catch (error) {
      console.log("Error create lecture", error);
    } finally {
      setIsLoading(false);
      setRefetch(true);
    }
  };

  const handleFormFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setValues({ ...values, lecture: file });
    // const thumbnail = URL.createObjectURL(file);
    // thumbnailRef.current.src = thumbnail;
  };

  useEffect(() => {
    const getLectures = async () => {
      try {
        setIsLoading(true);
        const res = await LectureApiClient.getLectures(courseId);
        // console.log("lectures", res.data.lectures);
        if (res.data.lectures) {
          setLectures(res.data.lectures);
        }
      } catch (error) {
        console.log("Lecture fetch error", error);
      } finally {
        setIsLoading(false);
      }
    };

    getLectures();
  }, [courseId, refetch]);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let&apos;s add lectures to this course, add some basics details for
          your new lecture
        </h1>
        <p className="text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet, nihil.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Lecture Title</Label>
          <Input
            type="text"
            name="lectureTitle"
            value={values.lectureTitle}
            onChange={onChange}
            placeholder="your course name"
          />
        </div>

        <div>
          <Label>Lecture</Label>
          <Input
            type="file"
            name="lecture"
            onChange={handleFormFileChange}
            placeholder="Upload your lecture"
          />
        </div>

        <div>
          <Label htmlFor="description" className="sr-onlyy">
            Description
          </Label>
          <RichTextEditor values={values} setValues={setValues} />
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back to course
          </Button>
          <Button disabled={isLoading} onClick={onSubmit}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                wait
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
      </div>

      <div className="lectures mt-10">
        {isLoading ? (
          <p>Loading...</p>
        ) : lectures.length ? (
          lectures.map((lecture, index) => (
            <Lecture
              key={lecture._id}
              lecture={lecture}
              index={index}
              courseId={courseId}
            />
          ))
        ) : (
          <div>No Lectures</div>
        )}
      </div>
    </div>
  );
}
