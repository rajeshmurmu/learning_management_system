import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScreenLoader from "./components/ScreenLoader";
import { useEffect, useState } from "react";
import AuthApiClient from "./lib/AuthApiClient";
import { useDispatch } from "react-redux";
import { login } from "./features/authSlice";

function App() {
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
    <>
      <div>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
