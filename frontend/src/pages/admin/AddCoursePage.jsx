import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import CoursesApiClient from "@/lib/CoursesApiClient";

export default function AddCoursePage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await CoursesApiClient.createCourse({
        courseTitle,
        category,
      });

      if (res.data.success) {
        navigate(-1);
        toast.success(res.data.message || "Course created Successfully");
      }
    } catch (error) {
      console.log("Error create course", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedValue = (value) => {
    setCategory(value);
  };

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let&apos;s add basic course details for your new course
        </h1>
        <p className="text-sm">
          Lorem, ipsum dolor sit abet consectetur adipisicing edit. Abet, nihil.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            name="courseTitle"
            value={courseTitle}
            onChange={(e) => {
              setCourseTitle(e.target.value);
            }}
            placeholder="your course name"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select onValueChange={getSelectedValue}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectLabel>Categories</SelectLabel>
                <SelectItem value="apple">Nextjs</SelectItem>
                <SelectItem value="banana">Data Science</SelectItem>
                <SelectItem value="blueberry">HTML</SelectItem>
                <SelectItem value="grapes">CSS</SelectItem>
                <SelectItem value="pineapple">Javascript</SelectItem>
                <SelectItem value="pineapple">
                  Full stack web development
                </SelectItem>
                <SelectItem value="pineapple">Docker</SelectItem>
                <SelectItem value="pineapple">Frontend Development</SelectItem>
                <SelectItem value="pineapple">Backend Development</SelectItem>
                <SelectItem value="pineapple">Mongodb</SelectItem>
                <SelectItem value="pineapple">SQL</SelectItem>
                <SelectItem value="pineapple">Mysql</SelectItem>
                <SelectItem value="pineapple">Python</SelectItem>
                <SelectItem value="pineapple">Nodejs</SelectItem>
                <SelectItem value="pineapple">Expressjs</SelectItem>
                <SelectItem value="pineapple">Reactjs</SelectItem>
                <SelectItem value="pineapple">Django</SelectItem>
                <SelectItem value="pineapple">Flask</SelectItem> */}
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
        <div className="flex justify-end gap-4">
          <Button variant="destructive" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={onSubmit}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                wait
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
