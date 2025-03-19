import Courses from "@/components/Courses";
import HeroSection from "@/components/HeroSection";
// import { useSelector } from "react-redux";

export default function HomePage() {
  // const { user } = useSelector((state) => state.auth);
  // console.log(user);

  return (
    <div className="">
      <HeroSection />
      <Courses />
    </div>
  );
}
