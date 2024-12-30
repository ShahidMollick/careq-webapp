"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  fetchAppointments,
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
const DashboardPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const appointments = useSelector(selectAllAppointments);
  const totalAppointments = 46
  const totalWaiting = 12
  const totalConsulted = 34
  const [selectedDay, setSelectedDay] = useState("Today");

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
      name: "Dr. Harsh swami",
      time: "4:00-18:00",
      isOnLeave: false,
      days: ["Fri", "Sat"],
    },
    {
      name: "Dr. Irfan Ali",
      time: "4:00-18:00",
      isOnLeave: false,
      days: ["Today","Fri", "Sat"],
    },
    {
      name: "Dr. Arushi sharma",
      time: "12:00-15:00",
      isOnLeave: false,
      days: ["Today","Wed", "Thu"],
    },
  ];

  const getCurrentStatus = (doctor) => {
    if (doctor.isOnLeave) return { status: "Unavailable", color: "bg-gray-100 text-gray-700" };

    const [startTime, endTime] = doctor.time.split("-").map((time) => {
      const [hours, minutes] = time.split(":");
      return new Date().setHours(parseInt(hours), parseInt(minutes), 0, 0);
    });

    const currentTime = new Date().getTime();
    if (currentTime >= startTime && currentTime <= endTime) {
      // Simulate additional conditions for break/consultation
      if (Math.random() < 0.3) return { status: "In-Break", color: "bg-yellow-100 text-yellow-700" };
      return { status: "In-Consultation", color: "bg-green-100 text-green-700" };
    } else if (currentTime < startTime) {
      const timeLeft = new Date(startTime - currentTime);
      const hours = timeLeft.getUTCHours();
      const minutes = timeLeft.getUTCMinutes();
      const timerText = `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
      return { status: `Begin in ${timerText}`, color: "italic text-sm text-blue-600" };
    } else {
      return { status: "Unavailable", color: "bg-gray-100 text-gray-700" };
    }
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.days.includes(selectedDay)
  );

  useEffect(() => {
      const doctorId = "67684d21509a946844805041";
      const hospitalId = "67680c40dc41628884bddfeb";
      localStorage.setItem("doctorId", doctorId);
      localStorage.setItem("hospitalId", hospitalId);
    }, []);

  return (
    <div className="h-[100%] w-[100%]">
      <div className="p-4 flex flex-col overflow-hidden w-full gap-4">
        <div className="flex flex-row gap-3 w-full">
          <MetricBoxCustom
            number={totalAppointments}
            heading="Total Appointments"
            description="Total appointments your patients have booked for today"
          />
          <MetricBoxCustom
            number={totalWaiting}
            heading="Total Patient Waiting"
            description="Total patients waiting for Your consultation today"
          />
          <MetricBoxCustom
            number={totalConsulted}
            heading="Total Patients Consulted"
            description="Total patients you have consulted today"
          />
          <MetricBoxCustom
            number={totalAppointments * (appointments[0]?.doctor?.appointmentFee ?? 0)}
            heading="Total Revenue"
            description="Total revenue you have earned today"
          />
        </div>
        <div className="text-xl font-bold text-secondary">Overview</div>
        <div className="flex flex-row gap-3 justify-around w-full h-[100%] flex-wrap lg:flex-nowrap">
          <PatientGraph />
          <Card className="w-full h-full overflow-hidden">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="mb-1">Doctors</CardTitle>
                <CardDescription>
                  Quickly see current consultation status
                </CardDescription>
              </div>
              <div>
                <Link href='/admin/doctor' passHref>
                <Button variant='outline' className="">Manage Doctors</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Today", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <Button
                      key={day}
                      variant={selectedDay === day ? "default" : "outline"}
                      size="sm"
                      className="text-sm rounded-full py-1 px-4"
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </Button>
                  )
                )}
              </div>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor, index) => {
                  const { status, color } = getCurrentStatus(doctor);
                  return (
                    <CardContent
                      key={index}
                      className="flex items-center w-full justify-between px-0"
                    >
                      <div className="flex items-center w-48 space-x-3">
                        <Avatar>
                          <AvatarImage
                            src="/placeholder.png"
                            alt="Doctor Image"
                          />
                          <AvatarFallback>SM</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm">{doctor.name}</p>
                          <p className="text-sm text-gray-500">Cardiologist</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{doctor.time}</p>
                      <Badge className={`justify-center rounded-full w-32 px-3 py-1 ${color}`}>
                        {status}
                      </Badge>
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
    </div>
  );
};

export default DashboardPage;
