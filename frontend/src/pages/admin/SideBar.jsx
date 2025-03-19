import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, NavLink } from "react-router-dom";

function SideBar() {
  return (
    <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-200 dark:border-r-gray-700 bg-[#f0f0f0] p-5 sticky top-0 h-screen">
      <div className="space-y-4">
        <NavLink to={"/admin"} className="flex gap-x-2">
          <ChartNoAxesColumn
            size={22}
            className="text-gray-600 dark:text-gray-300"
          />
          <h1>Dashboard</h1>
        </NavLink>
        <NavLink
          to={"/admin/courses"}
          className={`flex gap-x-2  ${({ isActive }) => {
            isActive ? "text-blue-500 dark:text-blue-700" : "";
          }}`}
        >
          <SquareLibrary
            size={22}
            className="text-gray-600 dark:text-gray-300"
          />
          <h1>Courses</h1>
        </NavLink>
      </div>
    </div>
  );
}

export default SideBar;
