import React from "react";
interface MetricBoxCustomProps {
    number: string;
    heading: string;
    description: string;
};

const MetricBoxCustom: React.FC<MetricBoxCustomProps> = ({number,heading, description}) => {
  return (
    <div className="flex justify-between flex-row w-full bg-white shadow-lg border border-slate-200 rounded-lg p-3 "
    style={{
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
    }}
    >
      <div>
        <div>
          <div className="font-semibold text-lg">{heading}</div>
          <div className="text-primary font-semibold text-lg -translate-y-1">Today</div>
        </div>
        <div className="text-md text-gray-500">{description}</div>
      </div>
      <div className="bg-primary-accent text-primary text-xl h-max p-2 font-bold rounded-md">{number}</div>
    </div>
  );
};

export default MetricBoxCustom;

