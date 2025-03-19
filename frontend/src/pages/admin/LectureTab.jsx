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
import LectureApiClient from "@/lib/LectureApiClient";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function LectureTab() {
  const navigate = useNavigate();
  const { courseId, lectureId } = useParams();
  const [values, setValues] = useState({
    isFree: true,
    lectureTitle: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadVideoInfo, setUploadVideoInfo] = useState({});
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(false);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleFormFile = async (e) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      const formData = new FormData();
      formData.append("lecture", file);
      setMediaProgress(true);
      setBtnDisable(true);

      try {
        const res = await axios({
          method: "post",
          url: "http://localhost:5000/api/v1/media/upload-video",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            // "Content-Type": "application/json",
          },
          onUploadProgress: (progressEvent) => {
            setUploadProgress(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
          },
        });
        // console.log(res);
        if (res.data.success) {
          console.log(res.data);
          setUploadVideoInfo({
            videoUrl: res.data.data.videoUrl,
            public_id: res.data.data.public_id,
          });

          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setBtnDisable(false);
        setMediaProgress(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setBtnDisable(true);
      setIsLoading(true);
      const res = await LectureApiClient.updateLecture(courseId, lectureId, {
        lectureTitle: values.lectureTitle,
        lectureDescription: values.lectureDescription,
        videoInfo: uploadVideoInfo,
        isPreviewFree: values.isFree,
      });

      //   //   console.log(res);
      //   console.log(values);
      if (res.data.success) {
        toast.success(res.data.message || "Lecture updated successfully");
      }
    } catch (error) {
      console.log("error update lecture", error);
    } finally {
      setBtnDisable(false);
      setIsLoading(false);
    }
  };

  const removeLecture = async () => {
    try {
      setIsLoading(true);
      const res = await LectureApiClient.removeLecture(courseId, lectureId);

      if (!res.data.success) {
        toast.error(res.data.message || "Failed to remove lecture");
      }
      toast.success(res.data.message || "Lecture removed successfully");
      navigate(-1);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getLectureById = async () => {
      try {
        const res = await LectureApiClient.getLectureById(courseId, lectureId);
        // console.log(res.data);
        if (res.data.success) {
          setValues({
            isFree: res.data.lecture.isPreviewFree,
            lectureTitle: res.data.lecture.lectureTitle,
            lectureDescription: res.data.lecture.lectureDescription,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getLectureById();
  }, [courseId, lectureId]);
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={!setIsLoading}
            variant="destructive"
            onClick={removeLecture}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Remove Lecture
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="my-5">
          <Label htmlFor="lectureTitle">
            Lecture Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lectureTitle"
            name="lectureTitle"
            type="text"
            value={values.lectureTitle}
            onChange={onChange}
            placeholder="Enter Lecture Title"
          />
        </div>

        <div className="my-5">
          <Label htmlFor="lecture">
            Upload Lecture <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lectureTitle"
            type="file"
            accept="video/*"
            placeholder="Enter Lecture Title"
            onChange={handleFormFile}
          />

          {mediaProgress && (
            <div className="my-4">
              <Progress value={uploadProgress} />
              <p>{uploadProgress}% Uploaded</p>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 my-5">
          <Switch
            id="isFree"
            checked={values.isFree}
            onCheckedChange={(e) => {
              setValues({ ...values, isFree: e });
            }}
            name="isFree"
            className="mr-2"
          />
          <Label htmlFor="isFree">Is this video FREE</Label>
        </div>

        <div className="mt-4">
          <Button
            disabled={btnDisable}
            variant="default"
            onClick={handleSubmit}
          >
            {isLoading && <Loader2 className="mr-2 animate-spin" />}
            Update Lecture
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
