"use client";
import Image from 'next/image';
import Cookies from "js-cookie";
import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/apiClient"; // Import API client
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface DecodedToken {
  id: string;
  email: string;
  specialization: string;
  iat: number;
  exp: number;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true);
  
    try {
      console.log("🔄 Attempting login...");
      const response = await apiClient.post("/auth/login", { email, password });
      if (!response.data || !response.data.access_token || !response.data.doctor) {
        throw new Error("Invalid response from server");
      }
  
      const { access_token, doctor } = response.data;
      console.log("✅ Token received:", access_token);
      console.log("✅ Doctor Details:", doctor);
  
      // Decode token to extract user details
      const decodedToken = jwtDecode<DecodedToken>(access_token);
      console.log("🔍 Decoded Token:", decodedToken);
  
      // Extract user details safely
      const userID = decodedToken.id || "";
      console.log(`✅ UserID received: ${userID}`);
  
      // Store JWT securely in HTTP-only cookie
      Cookies.set("accessToken", access_token, { expires: 1, secure: true });
  
      // Store doctor details in local storage or state for future use
      localStorage.setItem("doctorData", JSON.stringify(doctor)); // ✅ Save doctor details
      console.log("✅ Doctor data stored in localStorage");
  
      console.log("✅ Login successful! Redirecting...");
  
      // Redirect to dashboard or panel
      router.push("/admin");
  
    } catch (err: unknown) {  // ✅ Fix: Use 'unknown' instead of 'Error'
      console.error("❌ Login Error:", err);
    
      // Type guard to check if err is an instance of Error
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
     finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center p-5 justify-between bg-[url('/CareQ.png')]">
      <div className="flex-grow flex items-center justify-center">
        <Card className="w-[400px] mt-3">
          <CardHeader>
            <CardTitle className="text-lg text-secondary">
              Login to Your Clinic
            </CardTitle>
            <CardDescription className="text-black">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
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
        </Card>
      </div>
      <footer className="w-full flex items-center justify-center py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">© 2025 </span>
        <Image src="/logo.png" alt="Company Logo" width={28} height={28} />
          <span className="text-sm text-gray-600">All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
