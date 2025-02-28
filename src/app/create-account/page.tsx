"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react"; // For loading animation

export default function CreateDoctorAccount() {
  const router = useRouter();
  const [doctorName, setDoctorName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [clinicSchedule, setClinicSchedule] = useState([
    { clinicName: "", clinicAddress: "", day: "Monday", from: "", to: "", fees: "" }
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...clinicSchedule];
    updatedSchedule[index][field] = value;
    setClinicSchedule(updatedSchedule);
  };

  const handleAddSchedule = () => {
    setClinicSchedule([
      ...clinicSchedule,
      { clinicName: "", clinicAddress: "", day: "Monday", from: "", to: "", fees: "" }
    ]);
  };

  const handleRemoveSchedule = (index) => {
    const updatedSchedule = clinicSchedule.filter((_, i) => i !== index);
    setClinicSchedule(updatedSchedule);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(""); // Reset errors
    setLoading(true);

    // Prepare data in the expected structure
    const doctorData = {
      name: doctorName,
      email: email,
      mobileNumber: mobileNumber,
      password: password,
      specialization: specialization,
      schedules: clinicSchedule
    };

    try {
      const response = await fetch("https://9b94-203-110-242-40.ngrok-free.app/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      alert("Doctor account created successfully!");
      router.push("/admin"); // Redirect to doctor dashboard or success page
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-5 justify-center bg-[url('/CareQ.png')]">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Create Doctor Account</CardTitle>
          <CardDescription className="text-sm text-gray-600">Please fill out your details below to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Doctor Name */}
              <div className="space-y-2">
                <label htmlFor="doctorName" className="text-sm font-medium text-gray-700">Doctor Name</label>
                <Input
                  id="doctorName"
                  type="text"
                  placeholder="Dr. John Doe"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  required
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label htmlFor="mobileNumber" className="text-sm font-medium text-gray-700">Mobile Number</label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Specialization */}
              <div className="space-y-2">
                <label htmlFor="specialization" className="text-sm font-medium text-gray-700">Specialization</label>
                <Input
                  id="specialization"
                  type="text"
                  placeholder="e.g., Cardiologist"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                />
              </div>

              {/* Clinic Schedule */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Clinic Schedule</h3>
                {clinicSchedule.map((schedule, index) => (
                  <div key={index} className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="Clinic Name"
                        value={schedule.clinicName}
                        onChange={(e) => handleScheduleChange(index, "clinicName", e.target.value)}
                        className="w-1/2"
                      />
                      <Input
                        type="text"
                        placeholder="Clinic Address"
                        value={schedule.clinicAddress}
                        onChange={(e) => handleScheduleChange(index, "clinicAddress", e.target.value)}
                        className="w-1/2"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Select
                        value={schedule.day}
                        onValueChange={(value) => handleScheduleChange(index, "day", value)}
                        className="w-1/4"
                      >
                        <SelectTrigger>
                          <span>{schedule.day}</span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monday">Monday</SelectItem>
                          <SelectItem value="Tuesday">Tuesday</SelectItem>
                          <SelectItem value="Wednesday">Wednesday</SelectItem>
                          <SelectItem value="Thursday">Thursday</SelectItem>
                          <SelectItem value="Friday">Friday</SelectItem>
                          <SelectItem value="Saturday">Saturday</SelectItem>
                          <SelectItem value="Sunday">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="time"
                        value={schedule.from}
                        onChange={(e) => handleScheduleChange(index, "from", e.target.value)}
                        className="w-1/4"
                      />
                      <Input
                        type="time"
                        value={schedule.to}
                        onChange={(e) => handleScheduleChange(index, "to", e.target.value)}
                        className="w-1/4"
                      />
                      <Input
                        type="number"
                        placeholder="Fees"
                        value={schedule.fees}
                        onChange={(e) => handleScheduleChange(index, "fees", e.target.value)}
                        className="w-1/4"
                      />
                    </div>

                    {/* Remove Schedule */}
                    <button
                      type="button"
                      onClick={() => handleRemoveSchedule(index)}
                      className="text-red-600 hover:text-red-800 mt-2"
                    >
                      Remove Schedule
                    </button>
                  </div>
                ))}
                <Button type="button" onClick={handleAddSchedule} className="w-full mt-4">
                  Add Another Schedule
                </Button>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>

            <CardFooter className="px-0 flex-1 flex-col pt-4 pb-0">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" />
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
