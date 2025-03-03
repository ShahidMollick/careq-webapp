"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function DoctorHeader() {
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    // Safely read from localStorage in the browser
    const storedDoctorName = "Dr. "+ localStorage.getItem("doctorName");
    if (storedDoctorName) {
      setDoctorName(storedDoctorName);
    }
  }, []);

  return (
    <div className="flex gap-2 items-center">
      {/* Example rendering of the doctor icon */}
      <Image src="/doctor.svg" alt="doctor" width={40} height={40} />

      <div className="flex flex-col mr-4">
        <div className="text-sm font-semibold">
          {doctorName ? doctorName : "Doctor"}
        </div>
        <div className="text-sm font-medium text-gray-500">Doctor</div>
      </div>
    </div>
  );
}
