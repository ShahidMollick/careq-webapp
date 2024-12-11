import React from "react";

const MetricBox: React.FC = () => {
  return (
   
    <div className="flex flex-row justify-between  border-1  border-radius: 13.391px bg-white shadow-lg border border-slate-200 rounded-lg p-5 w-[316px] h-[130px] ml-[1.3rem]"
    style={{
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
    }}
    >
      <div>
        <div>
          <div>Total Appointments</div>
          <div>Today</div>
        </div>
        <div className="text-sm text-gray-500">Set the dimensions for the layer.</div>
      </div>
      <div className="bg-primary-accent text-primary text-3xl bold p-4 item-center py-4 rounded-md">32</div>
    </div>
  );
};

export default MetricBox;

