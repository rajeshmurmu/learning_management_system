// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { Toaster } from "@/components/ui/sonner";
import CourseDetailPage from "./pages/CourseDetailPage";
import MyLearnings from "./pages/user/MyLearnings";
import MyProfile from "./pages/user/MyProfile";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./AdminLayout";
import CoursesPage from "./pages/admin/CoursesPage";
import AddCoursePage from "./pages/admin/AddCoursePage";
import AllCourses from "./pages/CoursesPage";
import EditCoursePage from "./pages/admin/EditCoursePage";
import LecturesPage from "./pages/admin/LecturesPage";
import EditLecturePage from "./pages/admin/EditLecturePage";
import CourseProgress from "./pages/user/CourseProgress";
import { ThemeProvider } from "./hooks/ThemeProvider";
import SearchPage from "./pages/SearchPage";

const router = createBrowserRouter([
  // user paths
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/courses",
        element: <AllCourses />,
      },
      {
        path: "/courses/search",
        element: <SearchPage />,
      },
      {
        path: "/course/:id",
        element: <CourseDetailPage />,
      },
      {
        path: "/my-learnings",
        element: <MyLearnings />,
      },
      {
        path: "/course/:course_id/course-progress",
        element: <CourseProgress />,
      },
      {
        path: "/profile",
        element: <MyProfile />,
      },
    ],
  },

  // auth paths
  {
    path: "/auth",
    element: <AuthPage />,
  },

  // admin paths
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      // {
      //   path: "",
      //   element: <SideBar />,
      // },
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "/admin/courses",
        element: <CoursesPage />,
      },
      {
        path: "/admin/courses/create",
        element: <AddCoursePage />,
      },
      {
        path: "/admin/courses/edit/:courseId",
        element: <EditCoursePage />,
      },
      {
        path: "/admin/courses/edit/:courseId/lectures",
        element: <LecturesPage />,
      },
      {
        path: "/admin/courses/edit/:courseId/lectures/:lectureId",
        element: <EditLecturePage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  </ThemeProvider>

  // {/* </StrictMode> */}
);
