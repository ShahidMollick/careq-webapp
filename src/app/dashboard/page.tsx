"use client";
import React from "react";
import { DataTableDemo } from "@/components/ui/history";
import { ComboboxDemo } from "@/components/ui/combobox";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MetricBox from "@/components/ui/metric-box";
import MetricBoxCustom from "@/components/ui/metric-box-custom";
import { PatientGraph } from "@/components/ui/graph-card1";
import { GradientPatientGraph } from "@/components/ui/gradiant-chart";

const DashboardPage: React.FC = () => {
  return (
    <div className="h-[100%] w-[100%]">
      {/* Need To be copied in every page */}

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
      <div className="p-4 flex flex-col overflow-scroll w-full gap-4">
        <div className="flex flex-row   w-full gap-3 justify-start flex-wrap custom-lg:lg:flex-nowrap">
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
        <div className="flex gap-3 justify-around w-full h-[100%] flex-wrap lg:flex-nowrap ">
          <PatientGraph />
          <PatientGraph />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
