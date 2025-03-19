import FilterSection from "@/components/FilterSection";
import CourseSkeleton from "@/components/skeleton/CourseSkeleton";

export default function SearchPage() {
  const isLoading = true;
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="">
        {/* <h1>Showing result for &quot;html&quot;</h1> */}
        <p>
          Showing result for{" "}
          <span className="text-blue-800 font-bold italic">
            &quot;html&quot;
          </span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row font-bold gap-10">
        <FilterSection />
        <div className="flex-1">
          {/* if is loading show course skeleton */}
          <div className="flex flex-wrap gap-x-4">
            {isLoading &&
              Array.from({ length: 3 }).map((course, idx) => (
                <CourseSkeleton key={idx} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
