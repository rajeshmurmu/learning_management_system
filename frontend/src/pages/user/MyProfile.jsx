import React, { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Course from "@/components/Course";
import { useNavigate } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import CourseSkeleton from "@/components/skeleton/CourseSkeleton";
import { update } from "@/features/authSlice";
import AuthApiClient from "@/lib/AuthApiClient";

const enrolledCourses = [
  {
    id: 1,
    courseTitle: "test",
    courseThumbnail: "https://via.placeholder.com/150",
    creator: {
      name: "test",
      photoUrl: "https://via.placeholder.com/150",
    },
    courseDescription: "test",
    courseDuration: "test",
    courseLevel: "test",
    coursePrice: "0",
  },
];

export default function MyProfile() {
  const { user } = useSelector((state) => state.auth);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [profilePhoto, setProfilePhoto] = React.useState();
  const avatarRef = useRef();
  const pageLoading = false;
  const [avatarLocal, setAvatarLocal] = React.useState("");
  // const [updatedUser, setUpdatedUser] = useState(user);

  const handleOnChange = (e) => {
    const file = e.target.files?.[0];
    const avatarLocalUrl = URL.createObjectURL(file);
    if (file) setAvatarLocal(avatarLocalUrl);
    if (file) setProfilePhoto(file);
  };

  const handleSubmit = async () => {
    // console.log({ name, email, avatarRef: avatarRef.current.src });
    // return;
    console.log(profilePhoto);

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("avatar", profilePhoto);

    try {
      const res = await AuthApiClient.updateUser(formData);

      if (res.data.success) {
        // setUpdatedUser(res.data.user);
        toast.success(res.data.message || "Profile update successfully");
        // console.log(res.data.user);
      }
    } catch (error) {
      console.log("update user error", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <>
        <ProfileSkeleton />
      </>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <h1 className="font-bold text-2xl text-center md:text-left">Profile</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-20 w-20 md:w-32 md:h-32 cursor-pointer">
            <AvatarImage
              ref={avatarRef}
              src={user?.avatar || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex justify-center flex-col">
          <div className="mb-2">
            <h2 className="font-semibold text-gray-900 dark:text-gray-300 md:text-lg">
              Name:{" "}
              <span className="font-normal text-gray-700 dark:text-gray-300">
                {user?.name}
              </span>
            </h2>
          </div>
          <div className="mb-2">
            <h2 className="font-semibold text-gray-900 dark:text-gray-300 md:text-lg">
              Email:{" "}
              <span className="font-normal text-gray-700 dark:text-gray-300">
                {user?.email}
              </span>
            </h2>
          </div>
          <div className="mb-2">
            <h2 className="font-semibold text-gray-900 dark:text-gray-300 md:text-lg">
              Role:{" "}
              <span className="font-normal text-gray-700 dark:text-gray-300">
                {user?.role.toUpperCase()}
              </span>
            </h2>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="profileImage" className="text-right">
                    Profile Photo
                  </Label>
                  <Input
                    id="profileImage"
                    placeholder="email"
                    // value={profilePhoto}
                    type="file"
                    accept="image/*"
                    onChange={handleOnChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="enrolled_courses">
        <h1 className="font-medium text-gray-700 dark:text-gray-300 text-lg">
          Courses you have enrolled
        </h1>
        {enrolledCourses.length == 0 ? (
          <>
            <p className="text-center md:text-xl">
              You have not enrolled in any course
            </p>
          </>
        ) : (
          <></>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5 ">
          {pageLoading ? (
            <>
              {Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))}
            </>
          ) : (
            <>
              {enrolledCourses?.map((course, index) => (
                <Course course={course} key={index + 1} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* Profile Skeleton */}
      <h1 className="font-bold text-2xl text-center md:text-left mb-5">
        Profile
      </h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Skeleton className="h-20 w-20 md:w-32 md:h-32 rounded-full" />
        </div>
        <div className="flex flex-col space-y-4 w-full">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-1/4" />
        </div>
      </div>

      {/* Courses Skeleton */}
      <div className="enrolled_courses">
        <h1 className="font-medium text-gray-700 dark:text-gray-300 text-lg mb-4">
          Courses you have enrolled
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-48 w-full rounded-md bg-gray-200"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// export default ProfileSkeleton;
