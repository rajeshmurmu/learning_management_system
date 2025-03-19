import { Menu, School } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { ProfileDropDownMenu } from "./ProfileDropDownMenu";
import { Button } from "./ui/button";
import { ThemeMode } from "./ThemeMode";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  // const user = {
  //   name: "test",
  //   email: "test@gmail.com",
  //   password: "kdsjfksjdfkjkfdj",
  // };

  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white dark:text-white border-b dark:border-b-gray-800 border-b-gray-200 fixedd top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop Navbar */}
      <div className=" max-w-7xl hidden mx-auto md:flex justify-between items-center gap-10 h-full px-8">
        <Link to={"/"}>
          <div className="flex items-center gap-x-1 py-2">
            <School className="text-primary" />
            <h1 className="hidden md:block text-3xl text-primary font-extrabold">
              E-Learning
            </h1>
          </div>
          {/* user icon and theme icon */}
          {/* <div className="nav_menu"> */}
        </Link>
        <div className="left_menu flex items-center gap-x-4">
          {user ? (
            <>
              <div className="user_icon">
                <ProfileDropDownMenu />
              </div>
            </>
          ) : (
            <>
              <div className="login_signup">
                <Link to={"/auth"}>
                  <Button>Login/Signup</Button>
                </Link>
              </div>
            </>
          )}

          <div className="theme_icon">
            <ThemeMode />
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center h-16 bg-white dark:bg-[#0A0A0A] border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10 px-4">
        <Link to={"/"}>
          <div className="flex items-center gap-x-1 py-2">
            <School className="text-primary" />
            <h1 className="text-3xl text-primary font-extrabold">E-Learning</h1>
          </div>
        </Link>
        <MobileNavbar />
      </div>
    </div>
  );
}

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSelector } from "react-redux";

const MobileNavbar = () => {
  const user = true;
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="rounded-full bg-gray-200 hover:bg-gray-300"
            variant="outline"
          >
            <Menu className="h-8 w-8" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader className={"flex flex-col gap-2 mt-4"}>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-extrabold">
                E-Learning
              </SheetTitle>
              <ThemeMode />
            </div>
          </SheetHeader>
          <SheetDescription></SheetDescription>
          {user ? (
            <>
              <div className="auth_user_menu text-md my-4 flex flex-col gap-2">
                <NavLink to={"/"}>My Learnings</NavLink>
                <NavLink to={"/"}>Edit Profile</NavLink>
                <NavLink to={"/"}>Settings</NavLink>
                <NavLink to={"/"}>Logout</NavLink>
                {user?.role === "istructor" && (
                  <NavLink to={"/"}>Dashboard</NavLink>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="my-4">
                <Link to={"/auth"}>
                  <Button className="w-full">Login/Signup</Button>
                </Link>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
