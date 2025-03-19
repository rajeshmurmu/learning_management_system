import { Loader } from "lucide-react";
import React from "react";

export default function ScreenLoader() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-black/10">
      <Loader width={100} height={100} className="animate-spin text-blue-500" />
      <p className="md:text-xl text-blue-500 font-bold">Please Wait...</p>
    </div>
  );
}
