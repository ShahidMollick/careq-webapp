import AppointmentBox from "@/components/ui/appointment-box";
import DoctorBox from "@/components/ui/doctor-box";
import MetricBox from "@/components/ui/metric-box";
import PrescriptionStatusBox from "@/components/ui/prescription-status-box";
import React from "react";
import ChartBox from "@/components/ui/chart-box";

const ReceptionistPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-gray-500/[.004] ... p-4">
        <div className="text-md font-bold">Overview</div>
        <div className="text-sm text-gray-500">
          View your appointment history
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <MetricBox />
        <MetricBox />
        <MetricBox />
        <MetricBox />
      </div>
      <div className="flex flex-row justify-center item-center gap-8 p-4">
        <ChartBox />
        <DoctorBox />
        <PrescriptionStatusBox />
      </div>
    </div>
  );
};

export default ReceptionistPage;
