import React from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

// ✅ Auto-switch between local and deployed API
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api/v1"
    : "https://coursemacy.onrender.com/api/v1";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${BASE_URL}/user/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(null));
        toast.success(res.data.message);
        navigate("/");
      } else {
        toast.error(res.data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(
        error?.response?.data?.message || "Network error or server not responding"
      );
    }
  };

  return (
    <div className="bg-gray-900 z-50 w-full py-3 fixed top-0">
      <div className="max-w-7xl mx-auto flex justify-between">
        {/* Logo Section */}
        <Link to="/">
          <div className="flex gap-1">
            <GraduationCap className="text-gray-300 w-10 h-10" />
            <h1 className="text-gray-300 text-3xl font-bold">coursemacy</h1>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav>
          <ul className="flex gap-7 text-xl items-center font-semibold text-white">
            <Link to="/">
              <li className="cursor-pointer">Home</li>
            </Link>
            <Link to="/courses">
              <li className="cursor-pointer">Courses</li>
            </Link>

            {!user ? (
              <div className="flex gap-3">
                <Link to="/login">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gray-700 hover:bg-gray-800">
                    Signup
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-7">
                {user.role === "instructor" && (
                  <Link to="/admin/dashboard">
                    <li className="cursor-pointer">Admin</li>
                  </Link>
                )}

                <Link to="/profile">
                  <Avatar>
                    <AvatarImage src={user.photoUrl} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>

                <Button
                  onClick={logoutHandler}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Logout
                </Button>
              </div>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
