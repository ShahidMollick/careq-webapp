import React from "react";
interface MetricBoxCustomProps {
    number: string | number;
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
          <div className="font-semibold text-sm">{heading+` `}
            <span className="text-primary font-semibold text-sm -translate-y-1">Today</span>
          </div>
          
        </div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
      <div className="bg-primary-accent text-primary text-xl h-max p-2 font-bold rounded-md">{number}</div>
    </div>
  );
};

export default MetricBoxCustom;

