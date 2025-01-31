"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function EmailForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("register"); // Steps: 'register', 'otp'


  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5002/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: fullName,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      setSuccessMessage(
        data.message ||
          "Registration successful! Enter the OTP sent to your email."
      );
      setStep("otp"); // Move to OTP step
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const otpResponse = await fetch(
        "http://localhost:5002/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      if (!otpResponse.ok) {
        const otpErrorData = await otpResponse.json();
        throw new Error(otpErrorData.message || "OTP verification failed");
      }

      // OTP verification success, now login the user
      const loginResponse = await fetch("http://localhost:5002/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password, // Use the password entered during registration
        }),
      });

      if (!loginResponse.ok) {
        const loginErrorData = await loginResponse.json();
        throw new Error(loginErrorData.message || "Login failed");
      }

      const loginData = await loginResponse.json();
      localStorage.setItem("accessToken", loginData.accessToken); // Store the token
      setSuccessMessage("OTP verified and logged in successfully!");
      router.push("/doctor"); // Redirect to the dashboard or desired page
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-5 justify-center bg-[url('/CareQ.png')]">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>
            {step === "register" ? "Create Account" : "Verify Email"}
          </CardTitle>
          <CardDescription>
            {step === "register"
              ? "Fill in your details to get started"
              : "Enter the OTP sent to your email to verify your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "register" ? (
            <form onSubmit={handleRegisterSubmit}>
              <div className="space-y-4">
                {/* Email */}
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
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Your Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                {/* Password */}
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Error Message */}
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              </div>
              <CardFooter className="px-0 flex-1 flex-col pt-4 pb-0">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center justify-center">
                      Creating Account
                      <div className="flex space-x-1 ml-2">
                        <span className="dot animate-bounce"></span>
                        <span className="dot animate-bounce animation-delay-200"></span>
                        <span className="dot animate-bounce animation-delay-400"></span>
                      </div>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <div className="space-y-4">
                {/* OTP Input */}
                <div className="space-y-2">
                  <label
                    htmlFor="otp"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    OTP
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>

                {/* Error Message */}
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                {successMessage && (
                  <p className="text-green-600 text-sm mt-2">
                    {successMessage}
                  </p>
                )}
              </div>
              <CardFooter className="px-0 flex-1 flex-col pt-4 pb-0">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center justify-center">
                      Verifying
                      <div className="flex space-x-1 ml-2">
                        <span className="dot animate-bounce"></span>
                        <span className="dot animate-bounce animation-delay-200"></span>
                        <span className="dot animate-bounce animation-delay-400"></span>
                      </div>
                    </div>
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
