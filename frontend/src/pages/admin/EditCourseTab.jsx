import RichTextEditor from "@/components/RichTextEditor";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CoursesApiClient from "@/lib/CoursesApiClient";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function EditCourseTab() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  // const isLoading = false;
  const thumbnailRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishIsLoading, setPublishIsLoading] = useState(false);
  const [values, setValues] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("courseTitle", values.courseTitle);
      formData.append("subTitle", values.subTitle);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("courseLevel", values.courseLevel);
      formData.append("coursePrice", values.coursePrice);
      formData.append("courseThumbnail", values.courseThumbnail);

      const res = await CoursesApiClient.editCourse(courseId, formData);

      if (res.data.success) {
        toast.success(res.data.message || "Course updated successfully.");
      } else {
        toast.success(res.data.error || "Failed to updated course.");
      }

      setValues({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: "",
      });
    } catch (error) {
      console.log("onSubmit error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getCourseById = async () => {
      try {
        setIsLoading(true);
        const res = await CoursesApiClient.getCourseById(courseId);

        if (res.data.success) {
          setValues({
            courseTitle: res.data.course.courseTitle,
            subTitle: res.data.course?.subTitle,
            description: res.data.course.description,
            category: res.data.course.category,
            courseLevel: res.data.course.courseLevel,
            coursePrice: res.data.course.coursePrice,
            courseThumbnail: res.data.course.courseThumbnail,
          });
          setIsPublished(res.data.course.isPublished);
          thumbnailRef.current.src = res.data.course.courseThumbnail;
        }
      } catch (error) {
        console.log("Error getting courses data", error);
      } finally {
        setIsLoading(false);
      }
    };
    getCourseById();
  }, [courseId]);

  const getSelectedCategory = (value) => {
    setValues({ ...values, category: value });
  };

  const getSelectedLevel = (value) => {
    setValues({ ...values, courseLevel: value });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleFormFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setValues({ ...values, courseThumbnail: file });
    // const thumbnail = URL.createObjectURL(file);
    // thumbnailRef.current.src = thumbnail;
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      thumbnailRef.current.src = fileReader.result;
    };
    fileReader.readAsDataURL(file);
  };

  const handleTogglePublishCourse = async () => {
    try {
      setPublishIsLoading(true);
      const res = await CoursesApiClient.togglePublishCourse(courseId);
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message || "Course published successfully.");
        setIsPublished(!isPublished);
      } else {
        toast.error(res.data.error || "Failed to publish course.");
      }
    } catch (error) {
      console.log("Error publishing course", error);
    } finally {
      setPublishIsLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      const res = await CoursesApiClient.deleteCourse(courseId);
      if (res.data.success) {
        toast.success(res.data.message || "Course deleted successfully.");
        navigate(-1);
      } else {
        toast.error(res.data.error || "Failed to delete course.");
      }
    } catch (error) {
      console.log("Error deleting course", error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>Basic Course Information</CardTitle>
            <CardDescription>
              Make changes to your courses here. click save when you are done.
            </CardDescription>
          </div>
          <div className="space-x-4">
            {isPublished ? (
              <Button
                variant="outline"
                className="hover:bg-orange-400 hover:text-white"
                onClick={handleTogglePublishCourse}
                disabled={publishIsLoading}
              >
                {publishIsLoading && <Loader2 className="mr-2 animate-spin" />}
                Unpublish
              </Button>
            ) : (
              <Button
                className="bg-green-600"
                onClick={handleTogglePublishCourse}
                disabled={publishIsLoading}
              >
                {publishIsLoading && <Loader2 className="mr-2 animate-spin" />}
                Publish
              </Button>
            )}

            <Button variant="destructive" onClick={handleDeleteCourse}>
              Remove Course
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5 mt-5">
            <div>
              <Label htmlFor="courseTitle" className="sr-onlyy">
                Title
              </Label>
              <Input
                type="text"
                name="courseTitle"
                id="courseTitle"
                placeholder="eg. fullstack developer"
                value={values.courseTitle}
                onChange={handleOnChange}
              />
            </div>
            <div>
              <Label htmlFor="subTitle" className="sr-onlyy">
                Subtitle
              </Label>
              <Input
                type="text"
                name="subTitle"
                id="subTitle"
                placeholder="eg. become a fullstack developer from zero to hero"
                value={values.subTitle}
                onChange={handleOnChange}
              />
            </div>

            <div>
              <Label htmlFor="description" className="sr-onlyy">
                Description
              </Label>
              <RichTextEditor values={values} setValues={setValues} />
            </div>

            <div className="flex items-center gap-5">
              <div>
                <Label>Category</Label>
                <Select onValueChange={getSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder="Select a category"
                      // defaultValue={values.category}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="Next JS">Next JS</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Frontend Development">
                        Frontend Development
                      </SelectItem>
                      <SelectItem value="Fullstack Development">
                        Fullstack Development
                      </SelectItem>
                      <SelectItem value="MERN Stack Development">
                        MERN Stack Development
                      </SelectItem>
                      <SelectItem value="Javascript">Javascript</SelectItem>
                      <SelectItem value="Python">Python</SelectItem>
                      <SelectItem value="Docker">Docker</SelectItem>
                      <SelectItem value="MongoDB">MongoDB</SelectItem>
                      <SelectItem value="HTML">HTML</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Course Level</Label>
                <Select onValueChange={getSelectedLevel}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select course Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Course Level</SelectLabel>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Advance">Advance</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price in (INR)</Label>
                <Input
                  type="number"
                  name="coursePrice"
                  id="price"
                  placeholder="Enter course price"
                  value={values.coursePrice}
                  onChange={handleOnChange}
                  className="w-fit"
                />
              </div>
            </div>
            <div>
              <Label>Course Thumbnail</Label>
              <Card className="w-96 h-60 rounded-xl overflow-hidden">
                <CardContent className="p-0 relative w-full h-full">
                  <Label
                    htmlFor="courseThumbnail"
                    className="absolute w-full h-full cursor-pointer flex justify-center items-center text-gray-500 "
                  >
                    {!values.courseThumbnail
                      ? "Click here to upload thumbnail."
                      : ""}
                  </Label>
                  <Input
                    type="file"
                    name="courseThumbnail"
                    id="courseThumbnail"
                    onChange={handleFormFileChange}
                    className="w-fit hidden"
                  />
                  <img
                    ref={thumbnailRef}
                    src={values.courseThumbnail}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </CardContent>
              </Card>
            </div>
            <div className="space-x-4">
              <Button variant="destructive" asChild>
                <Link to={`/admin/courses`}>Cancel</Link>
              </Button>
              <Button onClick={onSubmit} disabled={isLoading} variant="default">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
