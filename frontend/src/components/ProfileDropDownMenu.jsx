import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthApiClient from "@/lib/AuthApiClient";
import { logout } from "@/features/authSlice";

export function ProfileDropDownMenu() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await AuthApiClient.logoutUser();

      if (res.data.success) {
        dispatch(logout());
        navigate("/");
        toast.success(res.data.message || "Logout successfully.");
      }
    } catch (error) {
      console.log("Error logout user", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to={"/my-learnings"}>
            <DropdownMenuItem>My Learnings</DropdownMenuItem>
          </Link>
          <Link to={"/profile"}>
            <DropdownMenuItem>My Profile</DropdownMenuItem>
          </Link>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        <DropdownMenuSeparator />
        {user.role !== "user" ? (
          <Link to={"/admin"}>
            <DropdownMenuItem>Dashboard</DropdownMenuItem>
          </Link>
        ) : (
          ""
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
