"use client";
import Cookies from "js-cookie";
import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/apiClient"; // Import the API client
import { fetchUserRoles } from "@/utils/apiClient";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setUserRoles } from "@/app/redux/userRolesSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jwtDecode } from "jwt-decode";
import { Popover } from "@/components/ui/popover";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Dialog } from "@radix-ui/react-dialog";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const { accessToken } = response.data;
      const decodedToken = jwtDecode(accessToken);
      console.log(decodedToken);
  
      const userID = String(decodedToken.sub);
      console.log(`UserID received`);
  
      // Store token securely
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userID", userID);
  
      // Fetch user roles
      const roles = await apiClient.get(`/user-facility-roles/${userID}`);
      const data = roles.data;
      console.log(`Roles received: ${JSON.stringify(data, null, 2)}`);
      console.log("Length of facility", data.length);
  
      if (data.length > 0) {
        // Store roles in Redux
        dispatch(setUserRoles(data));
  
        // Inside handleLogin function after user logs in:
        const selectedFacility = data[0].facility;
        const selectedRole = data[0].role.name;
        // Store in cookies
        Cookies.set("selectedFacility", JSON.stringify(selectedFacility));
        Cookies.set("selectedRole", selectedRole);
  
        const primaryRole = data[0].role.name; // Assume the first role is primary
        console.log(primaryRole);
  
        if (primaryRole === "Admin") {
          router.push("/admin");
        } else if (primaryRole === "Doctor") {
          router.push("/doctor");
        } else {
          router.push("/other-role"); // Handle other roles
        }
      } else {
        // Handle the case where no roles are assigned
  
        router.push("/facility-reg");
      }
    } catch (err) {
      // This will only catch network-related or unexpected errors
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center p-5 justify-between bg-[url('/CareQ.png')]">
      <div className="flex-grow flex items-center justify-center">
        <Card className="w-[400px] mt-3">
          <CardHeader>
            <CardTitle className="text-lg text-secondary text-center">
              Login to Your Clinic
            </CardTitle>
            <CardDescription className="text-center text-black">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              // Show loader while authenticating
              <div className="flex flex-col justify-center items-center h-40">
                <div className="animate-spin-fast rounded-full mb-1 h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                <div>Authenticating...</div>
              </div>
            ) : (
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      placeholder="example@careq.in"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-red-600 text-sm mt-2">{error}</p>
                  )}
                </div>
                <Button type="submit" className="w-full mt-4">
                  Login
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col ">
            <div className="text-sm text-center">
              Don't have your clinic registered?{" "}
              <Link
                href="/create-account"
                className="text-primary font-bold hover:underline"
              >
                Create account
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <footer className="w-full flex items-center justify-center py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">© 2025 </span>

          <img src="/logo.png" alt="Company Logo" className="h-7" />
          <span className="text-sm text-gray-600">All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
