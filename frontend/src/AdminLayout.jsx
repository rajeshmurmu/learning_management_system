import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import SideBar from "./pages/admin/SideBar";
import AuthApiClient from "./lib/AuthApiClient";
import { useDispatch } from "react-redux";
import { login } from "./features/authSlice";
import ScreenLoader from "./components/ScreenLoader";

function AdminLayout() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true);
        const res = await AuthApiClient.getUser();

        if (res.data.success) {
          dispatch(login({ user: res.data.user, token: res.data.token }));
          // console.log("get user", res.data);
        }
      } catch (error) {
        console.log("Get user error", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);
  if (isLoading) {
    return (
      <>
        <ScreenLoader />
      </>
    );
  }
  return (
    <div>
      <Navbar />
      <main className="flex">
        <SideBar />
        <div className="flex-1 p-2 md:p-4 lg:p-10">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AdminLayout;
