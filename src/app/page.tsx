"use client";
import Image from 'next/image';
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/apiClient";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ShieldAlert } from 'lucide-react';

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
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  // Check if user is already logged in
  useEffect(() => {
    const checkExistingSession = async () => {
      const token = Cookies.get("accessToken");
      if (token) {
        try {
          // Verify token is valid and not expired
          const decoded = jwtDecode<DecodedToken>(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp > currentTime) {
            console.log("✅ Valid session found, redirecting to dashboard...");
            router.push("/admin");
            return;
          } else {
            // Token is expired, clear it
            console.log("❌ Expired token found, clearing...");
            Cookies.remove("accessToken");
          }
        } catch (err) {
          console.error("❌ Invalid token:", err);
          Cookies.remove("accessToken");
        }
      }
      setCheckingSession(false);
    };

    checkExistingSession();
  }, [router]);

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
      localStorage.setItem("doctorData", JSON.stringify(doctor));
      console.log("✅ Doctor data stored in localStorage");
  
      console.log("✅ Login successful! Redirecting...");
  
      // Redirect to dashboard or panel
      router.push("/admin");
  
    } catch (err) {
      console.error("❌ Login Error:", err);
      
      // Handle axios errors
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // The server responded with a status code outside of 2xx range
          const data = err.response.data;
          if (typeof data === 'object' && data !== null) {
            // Check for common error message fields in REST APIs
            if (data.message) setError(data.message);
            else if (data.error) setError(data.error);
            else if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
              // Handle validation errors array
              setError(data.errors[0].message || JSON.stringify(data.errors[0]));
            } else {
              setError(`Server error: ${err.response.status}`);
            }
          } else {
            setError(`Server error: ${err.response.status}`);
          }
        } else if (err.request) {
          // The request was made but no response was received
          setError("No response from server. Please check your connection.");
        } else {
          // Something happened in setting up the request
          setError("Failed to send request. Please try again.");
        }
      } else if (err instanceof Error) {
        // Handle regular Error objects
        setError(err.message);
      } else {
        // Handle unknown errors
        setError("An unknown error occurred. Please try again.");
      }
    } finally {
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
            {checkingSession ? (
              <div className="flex flex-col justify-center items-center h-40">
                <div className="animate-spin-fast rounded-full mb-1 h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                <div>Checking session...</div>
              </div>
            ) : loading ? (
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
                    <div className="bg-red-50 border-l-4 flex flex-row items-center border-red-500 text-red-700 p-3 rounded" role="alert">
                       <ShieldAlert size='20' className='mr-1' />
                      <p className='text-sm'>{error}</p>
                    </div>
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
