import React from "react";
import { Button } from "./button";
import Image from "next/image";
import data from "../../app/doctor/appointment/appointments.json";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const AppointmentBox: React.FC = () => {
  // Get the first ticket number (from the 'serving' array)
  const firstTicketNumber =
    data.serving.length > 0 ? data.serving[0].ticketNumber : null;

  // Get the last ticket number (from the 'completed' array)
  const lastTicketNumber =
    data.completed.length > 0
      ? data.completed[data.completed.length - 1].ticketNumber
      : null;

  return (
    <div className="flex flex-row justify-between rounded-md  border-1  border-radius: 13.391px bg-white shadow-lg border border-slate-200 rounded-lg p-5 w-[316px] h-[130px] ml-[1.3rem] " >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <div className="text-md font-bold">Appointments</div>
          <div className="text-sm text-gray-500">Check Appointments</div>
        </div>
        <Button className=" md text-black border border-solid rounded-lg bg-white border-slate-500/[0.37] ...">
          View Complete List
        </Button>
      </div>
      <div className="flex flex-row gap-2 w-full">
        <div className="md text-sm w-full text-black text-center font-bold p-2 border border-solid rounded-lg border-slate-500/[0.37] ...">
          Current Queue : {firstTicketNumber}
        </div>
        <div className="md text-sm w-full text-black text-center font-bold p-2 border border-solid rounded-lg border-slate-500/[0.37] ...">
          Total Patients : {lastTicketNumber}
        </div>
      </div>
      <div className="flex flex-col justify-between width-full">
        <div className="flex flex-row gap-4 items-center justify-between width-full py-2">
          <div className="flex flex-row gap-8">
            <Image
              src="./doctor.svg"
              alt="doctor icon"
              width={50}
              height={50}
            />
            <div className="flex flex-col">
              <div className="text-md font-bold text-slate-900">
                Sharan Das Gupta Sharma
              </div>
              <div className="text-sm text-gray-500">Sex: Female Age: 21</div>
            </div>
          </div>
          <Badge
            variant="outline"
            className="rounded-full bg-primary text-white p-1 px-3"
          >
            Serving
          </Badge>
        </div>
        <div className="flex flex-row gap-4 items-center justify-between width-ful py-2">
          <div className="flex flex-row gap-8">
            <Image
              src="./doctor.svg"
              alt="doctor icon"
              width={50}
              height={50}
            />
            <div className="flex flex-col">
              <div className="text-md font-bold text-slate-900">
                Sharan Das Gupta Sharma
              </div>
              <div className="text-sm text-gray-500">Sex: Female Age: 21</div>
            </div>
          </div>

          <Badge
            variant="outline"
            className="rounded-full bg-primary text-white p-1 px-3"
          >
            Serving
          </Badge>
        </div>
        <div className="flex flex-row gap-4 items-center justify-between width-ful py-2">
          <div className="flex flex-row gap-8">
            <Image
              src="./doctor.svg"
              alt="doctor icon"
              width={50}
              height={50}
            />
            <div className="flex flex-col">
              <div className="text-md font-bold text-slate-900">
                Sharan Das Gupta Sharma
              </div>
              <div className="text-sm text-gray-500">Sex: Female Age: 21</div>
            </div>
          </div>

          <Badge
            variant="outline"
            className="rounded-full bg-primary text-white p-1 px-3"
          >
            Serving
          </Badge>
        </div>
        <div className="flex flex-row gap-4 items-center justify-between width-full py-2">
          <div className="flex flex-row gap-8">
            <Image
              src="./doctor.svg"
              alt="doctor icon"
              width={50}
              height={50}
            />
            <div className="flex flex-col">
              <div className="text-md font-bold text-slate-900">
                Sharan Das Gupta Sharma
              </div>
              <div className="text-sm text-gray-500">Sex: Female Age: 21</div>
            </div>
          </div>

          <Badge
            variant="outline"
            className="rounded-full bg-primary text-white p-1 px-3"
          >
            Serving
          </Badge>
        </div>
      </div>
      <Button className="bg-secondary flex items-center">
        Add Patient
        <Plus className="mr-2 h-5 w-5" />
      </Button>
    </div>
  );
};

export default AppointmentBox;
