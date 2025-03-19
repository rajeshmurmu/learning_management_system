import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LectureTab from "./LectureTab";

export default function EditLecturePage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            asChild
            className="rounded-full cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
          </Button>
          <h1 className="font-bold text-xl">Update your Lecture</h1>
        </div>
      </div>
      <LectureTab />
    </div>
  );
}
