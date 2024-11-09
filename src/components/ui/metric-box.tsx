import React from "react";

const MetricBox: React.FC = () => {
  return (
    <div className="flex flex-row justify-between rounded-md p-4 border-1">
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
