import React from "react";
interface MetricBoxCustomProps {
    number: string;
    heading: string;
};

const MetricBoxCustom: React.FC<MetricBoxCustomProps> = ({number,heading}) => {
  return (
    <div className="flex flex-row justify-between  border-1  border-radius: 13.391px bg-white shadow-lg border border-slate-200 rounded-lg p-3 w-[23%]"
    style={{
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
    }}
    >
      <div>
        <div>
          <div className="font-bold text-[12px]">{heading}</div>
          <div className="text-green-600 font-bold text-xs">Today</div>
        </div>
        <div className="text-sm text-gray-500">Set the dimensions for the layer.</div>
      </div>
      <div className="bg-primary-accent text-primary text-xl h-max p-2 font-bold rounded-md">{number}</div>
    </div>
  );
};

export default MetricBoxCustom;

