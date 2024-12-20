"use-client"
import React from "react";
import { PatientGraph } from "@/components/ui/graph-card1";

function AnalyticsPage() {
  return (
    <div className="w-full p-4  flex flex-col gap-5 ">
        <div>
            <p className="text-md font-bold ">Metric heading 1</p>
        <p className="text-sm">Subheading for the metric 1 goes here</p>
        </div>
        
        <div className="flex gap-4 max-w-full">
        <PatientGraph></PatientGraph>
        <PatientGraph></PatientGraph>
        </div>
        <div>
            <p className="text-md font-bold ">Metric heading 1</p>
        <p className="text-sm">Subheading for the metric 1 goes here</p>
        </div>
        <div className="flex gap-4 max-w-full">
        <PatientGraph></PatientGraph>
        <PatientGraph></PatientGraph>
        </div>
      
    </div>
  );
}
export default AnalyticsPage;