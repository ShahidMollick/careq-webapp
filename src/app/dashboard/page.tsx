"use client";
import React from "react";
import { DataTableDemo } from "@/components/ui/history";
import { ComboboxDemo } from "@/components/ui/combobox";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MetricBox from "@/components/ui/metric-box";
import MetricBoxCustom from "@/components/ui/metric-box-custom";
import { PatientGraph } from "@/components/ui/graph-card1";
import { Component2 } from "@/components/ui/graph-card2";
import { GradientPatientGraph } from "@/components/ui/gradiant-chart";

const DashboardPage: React.FC = () => {
  return (
    <div>
      {/* Need To be copied in every page */}
      <div className="nav-bar bg-white w-[100%] flex item-center justify-between p-3">
        <div className="font-bold text-[20px]">Dashboard</div>
        <div className="right flex items-center">
          <div className="clinic-option">
            <ComboboxDemo />
            <Image src="/bell.svg" alt="bell" width={20} height={20} />
          </div>
          <div className="doctor-profile">
            <Image src="/doctor.svg" alt="doctor" width={40} height={40} />
            <div className="doctor-name">
              <p className="font-bold">Dr. John Doe</p>
              <p>Doctor</p>
            </div>
            <Image
              src="/chevron-down.svg"
              alt="down-arrow"
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>

      <div className="h-[50px] w-[100%] flex bg-[#e7f5f0] items-center gap-[22px] px-6 justify-between text-[12px] py-4">
        <div className="flex items-center gap-2">
          <Image src="/user.svg" alt="user" width={20} height={20} />
          <div className="text-secondary text-sm">
            Your consultation queue is now live! Patient #3 is waiting
          </div>
        </div>
        <div className="flex items-center">
          <Button variant="default">Continue Consultation</Button>
          <img className="w-[30px]" src="/plus.svg" alt="" />
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-row  w-full h-full gap-3 justify-start flex-wrap custom-lg:lg:flex-nowrap">
          <div className="flex flex-row gap-3 w-full ">
            <MetricBoxCustom
              number="65"
              heading="Total Appointments"
              description="Total appointments your patients have booked for today"
            ></MetricBoxCustom>
            <MetricBoxCustom
              number="40"
              heading="Total Patient Waiting"
              description="Total patients waiting for Your consultation today"
            ></MetricBoxCustom>
          </div>
          <div className="flex flex-row gap-3 w-full ">
            <MetricBoxCustom
              number="25"
              heading="Total Patients Consulted"
              description="Total patients you have consulted today"
            ></MetricBoxCustom>
            <MetricBoxCustom
              number="$3,200"
              heading="Total Revenue"
              description="Total revenue you have earned today"
            ></MetricBoxCustom>
          </div>
        </div>
        <div className="text-xl font-bold text-secondary">Overview</div>
        <div className="flex gap-3 justify-around">
          <PatientGraph />
          <PatientGraph />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
