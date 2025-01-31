"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { ArrowRight } from "lucide-react";
import ClinicRegistrationDialog from "@/common/ui/ClinicRegistrationDialog";
import {
  selectAllAppointments,
} from "../redux/appointmentSlice";
import { RootState } from "../redux/store";
import { Button } from "@/components/ui/button";
import MetricBoxCustom from "@/components/ui/metric-box-custom";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PatientGraph } from "@/components/ui/graph-card1";

// Utility function to get the next 7 days dynamically
const getNextSevenDays = () => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(today.getDate() + index);
    const dayShort = daysOfWeek[date.getDay()];
    const dayFull = date.toLocaleDateString("en-US", { weekday: "long" });
    return {
      short: dayShort,
      full: dayFull,
      date: date,
      label: index === 0 ? "Today" : dayShort,
    };
  });
};

// Utility function to format time difference
const formatTimeDifference = (milliseconds) => {
  const totalMinutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let formatted = "";
  if (hours > 0) formatted += `${hours}h `;
  if (minutes > 0) formatted += `${minutes}m`;
  return formatted.trim();
};

const DashboardPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const appointments = useSelector(selectAllAppointments);
  const totalAppointments = 46;
  const totalWaiting = 12;
  const totalConsulted = 34;
  const [selectedDay, setSelectedDay] = useState("Today");
  const [dayList, setDayList] = useState(getNextSevenDays());
  
  const doctors = [
    {
      name: "Dr. Shahid Mollick",
      time: "09:00-11:00",
      isOnLeave: false,
      days: ["Today", "Mon", "Tue"],
    },
    {
      name: "Dr. Aysha Khan",
      time: "14:00-16:00",
      isOnLeave: true,
      days: ["Wed", "Thu"],
    },
    {
      name: "Dr. Harsh Swami",
      time: "04:00-22:00",
      isOnLeave: false,
      days: ["Fri", "Sat"],
    },
    {
      name: "Dr. Irfan Ali",
      time: "04:00-15:00",
      isOnLeave: false,
      days: ["Today", "Fri", "Sat"],
    },
    {
      name: "Dr. Arushi Sharma",
      time: "12:00-15:00",
      isOnLeave: false,
      days: ["Today", "Wed", "Thu"],
    },
  ];

  // Helper function to get the next available consultation time
  const getNextAvailable = (doctor) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const currentDayIndex = today.getDay();
    const currentTime = today.getTime();
    
    // Iterate through the next 7 days to find the next available day
    for (let i = 0; i < 7; i++) {
      const dayIndex = (currentDayIndex + i) % 7;
      const dayLabel = i === 0 ? "Today" : daysOfWeek[dayIndex];
      if (doctor.days.includes(dayLabel)) {
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + i);
        const [start, end] = doctor.time.split("-");
        const startTime = new Date(targetDate);
        const [startHours, startMinutes] = start.split(":");
        startTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

        if (i === 0 && startTime.getTime() > currentTime) {
          const timeDiff = startTime.getTime() - currentTime;
          return `Next consultation in ${formatTimeDifference(timeDiff)}`;
        } else {
          const availableDayFull = targetDate.toLocaleDateString("en-US", {
            weekday: "long",
          });
          const availableTime = start;
          return `Next consultation at ${availableDayFull} at ${availableTime}`;
        }
      }
    }

    return "No upcoming availability";
  };

  // Helper function to get current status based on current time
  const getCurrentStatus = (doctor) => {
    if (doctor.isOnLeave) {
      return {
        status: "Unavailable",
        color: "bg-red-100 text-red-700",
        type: "badge",
        isActive: false,
      };
    }

    const today = new Date();
    const dayLabel = today.toLocaleDateString("en-US", { weekday: "short" });
    const isTodayAvailable =
      doctor.days.includes("Today") || doctor.days.includes(dayLabel);

    if (!isTodayAvailable) {
      const nextAvailable = getNextAvailable(doctor);
      return { status: nextAvailable, color: "", type: "text", isActive: false };
    }

    // Doctor is available today
    const [start, end] = doctor.time.split("-");

    const startTime = new Date();
    const [startHours, startMinutes] = start.split(":");
    startTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

    const endTime = new Date();
    const [endHours, endMinutes] = end.split(":");
    endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

    const currentTime = today.getTime();

    if (currentTime < startTime.getTime()) {
      const timeDiff = startTime.getTime() - currentTime;
      return {
        status: `Yet to Start`,
        color: "",
        type: "text",
        isActive: false,
        next: `Next consultation in ${formatTimeDifference(timeDiff)}`,
      };
    } else if (
      currentTime >= startTime.getTime() &&
      currentTime <= endTime.getTime()
    ) {
      // During consultation hours
      // Here, implement actual logic to determine if the doctor is on break
      // For demonstration, we'll simulate with a fixed condition
      const isOnBreak = false; // Replace with actual logic if available
      if (isOnBreak) {
        return {
          status: "In Break",
          color: "bg-yellow-200 text-yellow-800",
          type: "badge",
          isActive: true,
        };
      }
      return {
        status: "In Consultation",
        color: "bg-green-200 text-green-800",
        type: "badge",
        isActive: true,
      };
    } else {
      // After consultation hours, find next available
      const nextAvailable = getNextAvailable(doctor);
      return { status: nextAvailable, color: "", type: "text", isActive: false };
    }
  };

  // Dynamic filtering based on selectedDay
  const filteredDoctors = doctors.filter((doctor) =>
    selectedDay === "Today"
      ? doctor.days.includes("Today")
      : doctor.days.includes(selectedDay)
  );

  // useEffect(() => {
  //   const doctorId = "67684d21509a946844805041";
  //   const hospitalId = "67680c40dc41628884bddfeb";
  //   localStorage.setItem("doctorId", doctorId);
  //   localStorage.setItem("hospitalId", hospitalId);
  // }, []);
  const roles = useSelector((state: RootState) => state.userRoles.roles);
  const hasClinics = roles.length > 0;
  console.log(roles);
  console.log("the clinic lenght: ",roles.length);
  

  return (
    <div className="h-full w-full">
      {!hasClinics && <ClinicRegistrationDialog />}
      {hasClinics && 
      <div className="p-4 flex flex-col overflow-hidden w-full gap-4">
        {/* Metrics Section */}
        <div className="flex flex-row gap-3 w-full">
          <MetricBoxCustom
            number={totalAppointments}
            heading="Total Appointments"
            description="Total appointments your patients have booked for today"
          />
          <MetricBoxCustom
            number={totalWaiting}
            heading="Total Patient Waiting"
            description="Total patients waiting for your consultation today"
          />
          <MetricBoxCustom
            number={totalConsulted}
            heading="Total Patients Consulted"
            description="Total patients you have consulted today"
          />
          <MetricBoxCustom
            number={
              totalAppointments *
              (appointments[0]?.doctor?.appointmentFee ?? 0)
            }
            heading="Total Revenue"
            description="Total revenue you have earned today"
          />
        </div>

        {/* Overview Section */}
        <div className="text-xl font-bold text-secondary">Overview</div>
        <div className="flex flex-row gap-3 justify-around w-full h-full flex-wrap lg:flex-nowrap">
          <PatientGraph />
          <Card className="w-[70%] h-full overflow-hidden opacity-95">
            {/* Card Header */}
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="mb-1">Doctors</CardTitle>
                <CardDescription>
                  Quickly see current consultation status
                </CardDescription>
              </div>
              <div>
                <Link href="/admin/doctor" passHref>
                  <Button variant="outline">Manage Doctors
                  <ArrowRight className=""/>
                  </Button>
                  
                </Link>
              </div>
            </CardHeader>

            {/* Card Content */}
            <CardContent>
              {/* Dynamic Day Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {dayList.map((day) => (
                  <Button
                    key={day.label}
                    variant={selectedDay === day.label ? "default" : "outline"}
                    size="sm"
                    className="text-sm rounded-full py-1 px-4"
                    onClick={() => setSelectedDay(day.label)}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>

              {/* Doctors List */}
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor, index) => {
                  const { status, color, type, isActive, next } =
                    getCurrentStatus(doctor);
                  // Determine opacity based on whether the doctor is active
                  const opacityClass = isActive ? "opacity-100" : "opacity-45";

                  return (
                    <CardContent
                      key={index}
                      className={`flex items-center mt-0 w-full justify-between px-0 mb-1 bg-white rounded-lg `}
                      // Removed inline style for opacity
                    >
                      {/* Doctor Info */}
                      <div className={`flex items-center w-48 space-x-3 ${opacityClass}`}>
                        <Avatar>
                          <AvatarImage
                            src="/placeholder.png"
                            alt="Doctor Image"
                          />
                          <AvatarFallback>
                            {doctor.name
                              .split(" ")
                              .slice(1)
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm">{doctor.name}</p>
                          <p className="text-sm text-gray-500">Cardiologist</p>
                        </div>
                      </div>

                      {/* Doctor Time */}
                      <p className={`text-sm text-gray-700 ${opacityClass}`}>{doctor.time}</p>

                      {/* Status Display */}
                      {type === "badge" ? (
                        <Badge
                          className={`justify-center rounded-full w-40 px-3 py-1 ${color}`}
                        >
                          {status}
                        </Badge>
                      ) : (
                        <p className="text-sm italic w-40 text-center text-wrap text-gray-700">
                          {status === "Yet to Start" && next ? (
                            <>
                              {status}{" "}
                              <span className="font-bold text-wrap text-primary">
                                {next.replace("Next consultation in ", "")}
                              </span>
                            </>
                          ) : status.startsWith("Next consultation in") ? (
                            <>
                              Next consultation in{" "}
                              <span className="font-bold text-wrap text-primary">
                                {status.split("Next consultation in ")[1]}
                              </span>
                            </>
                          ) : status.startsWith("Next consultation at") ? (
                            <>
                              Next consultation at{" "}
                              <span className="font-bold text-wrap text-primary">
                                {status.split("Next consultation at ")[1]}
                              </span>
                            </>
                          ) : (
                            status
                          )}
                        </p>
                      )}
                    </CardContent>
                  );
                })
              ) : (
                <p className="text-gray-500">
                  No doctors available for {selectedDay}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
}
    </div>
  );
};

export default DashboardPage;
