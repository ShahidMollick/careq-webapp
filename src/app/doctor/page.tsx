"use client";
import React, { useState } from "react";
import { ArrowRight, Copy, PlusCircle, X } from "lucide-react";
import regForm from "../regForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/popup";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import useAuth from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleRow {
  id: string;
  day: string;
  fromTime: string;
  toTime: string;
}
//import { fetchAppointments, selectAppointments, selectTotalAppointments, selectTotalConsulted, selectTotalWaiting } from '../redux/appointmentSlice';
import { RootState } from "../redux/store";
import { DataTableDemo } from "@/components/ui/history";
import { ComboboxDemo } from "@/components/ui/combobox";
import Image from "next/image";

import MetricBox from "@/components/ui/metric-box";
import MetricBoxCustom from "@/components/ui/metric-box-custom";
import { PatientGraph } from "@/components/ui/graph-card1";
import { GradientPatientGraph } from "@/components/ui/gradiant-chart";
import {
  fetchAppointmentsByDoctor,
  selectAllAppointments,
} from "../redux/appointmentSlice";

const DashboardPage: React.FC = () => {
  useAuth();
  /*const dispatch: AppDispatch = useDispatch();
  const appointments = useSelector(selectAppointments);
  const totalAppointments = useSelector(selectTotalAppointments);
  const totalWaiting = useSelector(selectTotalWaiting);
  const totalConsulted = useSelector(selectTotalConsulted);

  useEffect(() => {
    dispatch(fetchAppointments("6756a4e490c807765b6f4be0"));
  }, [dispatch]);*/

  const totalAppointments = 67;
  const totalWaiting = 53;
  const totalConsulted = 28;
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(1); // Current step state

  const [schedules, setSchedules] = useState<ScheduleRow[]>([
    { id: "1", day: "", fromTime: "", toTime: "" },
  ]);

  const addScheduleRow = () => {
    const newRow: ScheduleRow = {
      id: Date.now().toString(),
      day: "",
      fromTime: "",
      toTime: "",
    };
    setSchedules([...schedules, newRow]);
  };

  const removeScheduleRow = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  const updateSchedule = (
    id: string,
    field: keyof ScheduleRow,
    value: string
  ) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, [field]: value } : schedule
      )
    );
  };

  // Function to handle "Next" and "Back" navigation
  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  useEffect(() => {
    // const doctorId = "67684d21509a946844805041";
    // const hospitalId = "67680c40dc41628884bddfeb";
    // localStorage.setItem("doctorId", doctorId);
    // localStorage.setItem("hospitalId", hospitalId);
  }, []);

  return (
    <div className="h-[100%] w-[100%]">
      

      <div className="h-[50px] w-[100%] flex bg-[#e7f5f0] items-center gap-[22px] px-6 justify-between text-sm  py-4">
        <div className="flex items-center gap-2">
          <Image src="/user.svg" alt="user" width={20} height={20} />
          <div className="text-secondary w-full text-sm">
            Your consultation queue is now live! Patient #3 is waiting
          </div>
        </div>
        <div className="flex items-center">
          <Button variant="default">Continue Consultation</Button>
          <img className="w-[30px]" src="/plus.svg" alt="" />
        </div>
      </div>
      <div className="p-4 flex flex-col overflow-hidden w-full gap-4">
        <div className="flex flex-row   w-full gap-3 justify-start flex-wrap custom-lg:lg:flex-nowrap">
          <div className="flex flex-row gap-3 w-full ">
            <MetricBoxCustom
              number={totalAppointments}
              heading="Total Appointments"
              description="Total appointments your patients have booked for today"
            ></MetricBoxCustom>
            <MetricBoxCustom
              number={totalWaiting}
              heading="Total Patient Waiting"
              description="Total patients waiting for Your consultation today"
            ></MetricBoxCustom>
          </div>
          <div className="flex flex-row gap-3 w-full ">
            <MetricBoxCustom
              number={totalConsulted}
              heading="Total Patients Consulted"
              description="Total patients you have consulted today"
            ></MetricBoxCustom>
            <MetricBoxCustom
              number="5643"
              heading="Total Revenue"
              description="Total revenue you have earned today"
            ></MetricBoxCustom>
          </div>
        </div>
        <div className="text-xl font-bold text-secondary">Overview</div>
        <div className="flex gap-3 justify-around w-full h-[100%] flex-wrap lg:flex-nowrap ">
          <PatientGraph />
          <PatientGraph />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
