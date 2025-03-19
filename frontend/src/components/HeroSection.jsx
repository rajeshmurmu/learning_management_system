import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-4">
          Find the Best Courses for You
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8">
          Discover, Learn, and Grow with Our Online Learning Platform
        </p>

        <form className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-8">
          <Input
            type="text"
            placeholder="Search for Courses"
            className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:bg-gray-500 rounded-l-full shadow-lg overflow-hidden max-w-xl mx-auto "
          />
          <Button className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 ">
            Search
          </Button>
        </form>
        <Link to="/courses">
          <Button className="bg-white dark:bg-gray-800 text-blue-600 hover:bg-gray-200 rounded-full">
            Explore Courses
          </Button>
        </Link>
      </div>
    </div>
  );
}
