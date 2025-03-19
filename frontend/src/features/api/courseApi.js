import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/courses",
    credentials: "include",
  }),

  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (courseData) => ({
        url: "/create",
        method: "POST",
        body: courseData,
      }),
      invalidatesTags: ["Courses"],
    }),

    getCreatedCourses: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Courses"],
    }),

    editCourse: builder.mutation({
      query: ({ course_id, courseData }) => ({
        url: `/edit/${course_id}`,
        method: "PUT",
        body: courseData,
        // credentials: "include",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }),
      invalidatesTags: ["Courses"],
    }),

    getCourseById: builder.query({
      query: (course_id) => ({
        url: `/${course_id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    createLecture: builder.mutation({
      query: ({ course_id, lectureData }) => ({
        url: `/${course_id}/lectures`,
        method: "POST",
        body: lectureData,
        // credentials: "include",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }),
    }),

    getLectures: builder.query({
      query: (course_id) => ({
        url: `/${course_id}/lectures`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetCreatedCoursesQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetLecturesQuery,
} = courseApi;
