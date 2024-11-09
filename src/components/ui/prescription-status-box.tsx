import React from "react";
import { Button } from "./button";
import Image from "next/image";
import { Badge } from "./badge";

const PrescriptionStatusBox: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 width-full max-w-lg bg-white shadow-lg border border-slate-200 rounded-lg p-5">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <div className="text-md font-bold">Prescription Status</div>
          <div className="text-sm text-gray-500">
            Check the status of prescription
          </div>
        </div>
        <Button className=" md text-black border border-solid rounded-lg bg-white border-slate-500/[0.37] ...">
          View Complete List
        </Button>
      </div>
      <div className="flex flex-row gap-4 border-b pb-4 border-slate-500/[0.37] ...">
        <Badge
          variant="outline"
          className="rounded-full bg-primary text-white p-1 px-3"
        >
          All
        </Badge>
        <Badge
          variant="outline"
          className="rounded-full bg-primary text-white p-1 px-3"
        >
          Pending
        </Badge>
        <Badge
          variant="outline"
          className="rounded-full bg-primary text-white p-1 px-3"
        >
          Uploaded
        </Badge>
      </div>
      <div className="flex flex-col justify-between width-full">
        <div className="flex flex-row gap-4 items-center justify-between width-full py-2">
          <Image src="./doctor.svg" alt="doctor icon" width={50} height={50} />
          <div className="flex flex-col">
            <div className="text-md font-bold text-slate-900">
              Sharan Das Gupta Sharma
            </div>
            <div className="text-sm text-gray-500">Sex: Female Age: 21</div>
          </div>
          <Button size="sm" className=" ">
            <Image
              src="./uploadIcon.svg"
              alt="upload icon"
              width={16}
              height={16}
            />
            Upload prescription
          </Button>
        </div>
        <div className="flex flex-row gap-4 items-center justify-between width-ful py-2">
          <Image src="./doctor.svg" alt="doctor icon" width={50} height={50} />
          <div className="flex flex-col">
            <div className="text-md font-bold text-slate-900">
              Sharan Das Gupta Sharma
            </div>
            <div className="text-sm text-gray-500">Sex: Female Age: 21</div>
          </div>
          <Button size="sm" className=" ">
            <Image
              src="./uploadIcon.svg"
              alt="upload icon"
              width={16}
              height={16}
            />
            Upload prescription
          </Button>
        </div>
        <div className="flex flex-row gap-4 items-center justify-between width-full py-2">
          <Image src="./doctor.svg" alt="doctor icon" width={50} height={50} />
          <div className="flex flex-col">
            <div className="text-md font-bold text-slate-900">
              Sharan Das Gupta Sharma
            </div>
            <div className="text-sm text-gray-500">Sex: Female Age: 21</div>
          </div>
          <Button size="sm" className="">
            <Image
              src="./uploadIcon.svg"
              alt="upload icon"
              width={16}
              height={16}
            />
            Upload prescription
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionStatusBox;
