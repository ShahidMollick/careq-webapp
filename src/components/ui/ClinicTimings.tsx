"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface Schedule {
  id: string;
  dayOfWeek: number;
  fromTime: string;
  toTime: string;
}

interface ClinicTimingsProps {
  schedules: Schedule[];
}

const ClinicTimings: React.FC<ClinicTimingsProps> = ({ schedules }) => {
  const [timings, setTimings] = useState<
    { day: string; start: string; end: string }[]
  >([]);

  useEffect(() => {
    // Convert incoming schedules to the format used by the component
    const convertedTimings = schedules.map((schedule) => ({
      day: daysOfWeek[schedule.dayOfWeek],
      start: schedule.fromTime.substring(0, 5), // Convert "HH:mm:ss" to "HH:mm"
      end: schedule.toTime.substring(0, 5),
    }));
    setTimings(convertedTimings);
  }, [schedules]);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const addTimingRow = () => {
    setTimings((prev) => [...prev, { day: "", start: "", end: "" }]);
  };

  const handleChange = (
    index: number,
    field: "day" | "start" | "end",
    value: string
  ) => {
    setTimings((prev) =>
      prev.map((timing, i) =>
        i === index ? { ...timing, [field]: value } : timing
      )
    );
  };

  const removeTimingRow = (index: number) => {
    setTimings((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-6">
      <Label>Clinic Timings</Label>
      <div className="flex flex-col gap-4">
        {timings.map((timing, index) => (
          <div key={index} className="group flex items-center gap-4 relative">
            {/* Select Component for Day */}
            <Select
              onValueChange={(value) => handleChange(index, "day", value)}
              value={timing.day}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select Day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Input for Start Time */}
            <Input
              type="time"
              value={timing.start}
              onChange={(e) => handleChange(index, "start", e.target.value)}
              className="w-28"
            />

            {/* Input for End Time */}
            <Input
              type="time"
              value={timing.end}
              onChange={(e) => handleChange(index, "end", e.target.value)}
              className="w-28"
            />

            {/* Trash Button */}
            <Button
              onClick={() => removeTimingRow(index)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-red-600 hover:bg-red-100 hover:text-red-600 border-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        onClick={addTimingRow}
        variant="outline"
        className="flex items-center gap-2 w-fit"
      >
        Add day and time +
      </Button>
    </div>
  );
};

export default ClinicTimings;
