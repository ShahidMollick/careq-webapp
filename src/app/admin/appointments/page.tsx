import React from "react";
import { PatientsTable } from "./patientstable"; // Adjust path to your components folder

export default function AppointmentsPage() {
  return (
    <div className="w-full p-4">
      <PatientsTable />
    </div>
  );
}
