"use client";
import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Settings2, Plus } from "lucide-react";
import axios from "axios";
import { Switch } from "@/components/ui/switch";

/* ------------------------------------------------------------------
   A small type-guard utility for more graceful error handling
------------------------------------------------------------------ */
interface ApiErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}
function isApiError(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as ApiErrorResponse).response === "object" &&
    (error as ApiErrorResponse).response !== null &&
    "data" in (error as ApiErrorResponse).response &&
    typeof (error as ApiErrorResponse).response.data === "object" &&
    (error as ApiErrorResponse).response.data !== null &&
    "message" in (error as ApiErrorResponse).response.data &&
    typeof (error as ApiErrorResponse).response.data.message === "string"
  );
}

/* ------------------------------------------------------------------
   Main Component
------------------------------------------------------------------ */
function ClinicSetting() {
  // ----------------------------------------------------------------
  // State Definitions
  // ----------------------------------------------------------------
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<{
    name: string;
    address: string;
  } | null>(null);

  // Full list of schedules fetched (if any)
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // Days & current selection
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Filtered schedules for selected day
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

  // Booking window & schedule times for the currently-selected schedule
  const [scheduleStart, setScheduleStart] = useState("");
  const [scheduleEnd, setScheduleEnd] = useState("");
  const [bookingStart, setBookingStart] = useState("");
  const [bookingEnd, setBookingEnd] = useState("");
  const [allowOnlineBooking, setAllowOnlineBooking] = useState<"yes" | "no">("yes");

  // Adding a new schedule
  const [newSchedule, setNewSchedule] = useState({
    from: "",
    to: "",
    fees: "",
    day: "",
  });
  const [showAddScheduleDialog, setShowAddScheduleDialog] = useState(false);
  const [isAddingSchedule, setIsAddingSchedule] = useState<boolean>(false);

  // Warnings & UI flags
  const [showNoScheduleWarning, setShowNoScheduleWarning] = useState<boolean>(false);
  const [showSaveButton, setShowSaveButton] = useState(false);

  // ----------------------------------------------------------------
  // Type Definition
  // ----------------------------------------------------------------
  type Schedule = {
    id: string;
    day: string;
    clinicName: string;
    clinicAddress: string;
    from: string;          // e.g. "09:00"
    to: string;            // e.g. "13:00"
    fees: number;
    bookingStart?: string; // e.g. "08:00"
    bookingEnd?: string;   // e.g. "12:00"
  };

  // ----------------------------------------------------------------
  // Load doctor info on mount
  // ----------------------------------------------------------------
  useEffect(() => {
    const storedDoctorData = localStorage.getItem("doctorData");
    if (storedDoctorData) {
      const doctor = JSON.parse(storedDoctorData);
      setDoctorId(doctor.id || null);

      // Keep these for further reference
      localStorage.setItem("doctorId", doctor.id);
      localStorage.setItem("doctorName", doctor.name || "");

      // If the doctor has any schedules, set them up
      if (doctor.schedules && doctor.schedules.length > 0) {
        setSchedules(doctor.schedules);

        // Set the clinic info from the first schedule
        const firstClinic = doctor.schedules[0];
        const clinicInfo = {
          name: firstClinic.clinicName,
          address: firstClinic.clinicAddress,
        };
        setSelectedClinic(clinicInfo);
        localStorage.setItem("selectedClinic", JSON.stringify(clinicInfo));

        // Extract unique days & set the first as default
        const uniqueDays = [
          ...new Set(doctor.schedules.map((s: Schedule) => s.day)),
        ] as string[];
        setAvailableDays(uniqueDays);
        setSelectedDay(uniqueDays[0] || null);
      } else {
        // If the doc has no schedules
        setShowNoScheduleWarning(true);
        setSelectedClinic({
          name: doctor.clinicName || "",
          address: doctor.clinicAddress || "",
        });
      }
    }
  }, []);

  // Clear schedule selection if no valid day or schedules exist
  useEffect(() => {
    if (!selectedDay || schedules.length === 0) {
      setSelectedScheduleId(null);
      localStorage.removeItem("selectedScheduleId");
    }
  }, [selectedDay, schedules]);

  // When selectedDay changes, filter schedules for that day
  useEffect(() => {
    if (selectedDay) {
      const daySchedules = schedules.filter((s) => s.day === selectedDay);
      setFilteredSchedules(daySchedules);

      // Auto-select the first schedule for that day (if any)
      if (daySchedules.length > 0) {
        setSelectedScheduleId(daySchedules[0].id);
      } else {
        setSelectedScheduleId("");
      }
    }
  }, [selectedDay, schedules]);

  // Persist the selected schedule ID in localStorage
  useEffect(() => {
    if (selectedScheduleId) {
      localStorage.setItem("selectedScheduleId", selectedScheduleId);
    }
  }, [selectedScheduleId]);

  // Whenever the selected schedule changes, update the times
  useEffect(() => {
    if (selectedScheduleId) {
      const selectedSchedule = schedules.find((s) => s.id === selectedScheduleId);
      if (selectedSchedule) {
        setScheduleStart(selectedSchedule.from);
        setScheduleEnd(selectedSchedule.to);
        setBookingStart(selectedSchedule.bookingStart || "");
        setBookingEnd(selectedSchedule.bookingEnd || "");
        // Suppose we want to reflect online booking state if needed
        // but for now we default it to "yes" unless we have a special marker
      }
    }
  }, [selectedScheduleId, schedules]);

  // ----------------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------------

  // 1) Schedule selection
  const handleSelectSchedule = (scheduleId: string) => {
    setSelectedScheduleId(scheduleId);
  };

  // 2) Toggling booking window on the server (from first code snippet)
  //    Adjust as needed if your backend supports toggling online booking
  const handleOnSave = async (scheduleId: string) => {
    try {
      // Check if we have a selected schedule
      if (!scheduleId) {
        alert("No schedule selected. Please select a schedule first.");
        return;
      }
      
      const doctorId = localStorage.getItem("doctorId");
      if (!doctorId) {
        alert("Doctor ID is missing. Please login again.");
        return;
      }
      
      // Find the current schedule from our local state
      const currentSchedule = schedules.find(s => s.id === scheduleId);
      if (!currentSchedule) {
        alert("Selected schedule not found.");
        return;
      }
      
      // Prepare data for update - include all fields whether changed or not
      const updateData = {
        
   // Convert to boolean
         // Include existing data
        // fees: currentSchedule.fees, // Include existing data
        clinicName: currentSchedule.clinicName, // Include existing data
        clinicAddress: currentSchedule.clinicAddress, // Include existing data
        day: currentSchedule.day,
        from: scheduleStart,
        to: scheduleEnd,
        fees: currentSchedule.fees, 
        bookingStart: bookingStart,
        bookingEnd: bookingEnd,
      };
      
      console.log("------------------ Schedule Update Debug ------------------");
      console.log(`Doctor ID: ${doctorId}`);
      console.log(`Schedule ID: ${scheduleId}`);
      console.log("Schedule data being sent from frontend:", updateData);
      console.log("-----------------------------------------------------------");
      
      // Make API call to update the schedule with the correct endpoint URL
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/${scheduleId}/schedules`,
        updateData
      );
      
      console.log("Schedule update response:", response.data);
      
      // Update local data with response
      setSchedules(prevSchedules => 
        prevSchedules.map(schedule => 
          schedule.id === scheduleId 
          ? { ...schedule, ...response.data } 
          : schedule
        )
      );
      
      setShowSaveButton(false);
      alert("Changes saved successfully!");
    } catch (error) {
      let errorMessage = "Failed to save changes";
      if (isApiError(error)) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Schedule update failed:", error);
      alert(`Error: ${errorMessage}`);
    }
  }

  

  // 3) Adding a new schedule
  const handleAddSchedule = async () => {
    try {
      // Double-check we have a doc ID & clinic info
      const docId = localStorage.getItem("doctorId");
      const storedClinic = localStorage.getItem("selectedClinic");
      if (!docId) {
        alert("Doctor ID is missing. Please login again.");
        return;
      }
      if (!storedClinic) {
        alert("Clinic details are missing.");
        return;
      }

      const parsedClinic = JSON.parse(storedClinic);
      if (!parsedClinic.name || !parsedClinic.address) {
        alert("Clinic details are incomplete.");
        return;
      }

      // Validate newSchedule
      if (!newSchedule.day || !newSchedule.from || !newSchedule.to || !newSchedule.fees) {
        alert("Please fill in all fields before submitting.");
        return;
      }
      if (
        !newSchedule.day ||
        !newSchedule.from ||
        !newSchedule.to ||
        !newSchedule.fees
      ) {
        alert("Please fill in all fields before submitting.");
        return;
      }

      const feesInt = parseInt(newSchedule.fees, 10);
      if (isNaN(feesInt) || feesInt <= 0) {
        alert("Fees must be a positive number.");
        return;
      }

      setIsAddingSchedule(true);

      // Prepare data
      const requestBody = {
        clinicName: parsedClinic.name,
        clinicAddress: parsedClinic.address,
        day: newSchedule.day,
        from: newSchedule.from,
        to: newSchedule.to,
        fees: feesInt,
      };

      console.log("Sending new schedule data:", requestBody);

      // Make the POST request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/${docId}/schedules`,
        requestBody
      );

      // On success
      alert("Schedule added successfully!");
      localStorage.setItem("selectedScheduleId", response.data.id);
      setSelectedScheduleId(response.data.id);
      setSchedules((prev) => [...prev, response.data]);
      setShowNoScheduleWarning(false);

      // Reset form & close dialog
      setNewSchedule({ from: "", to: "", fees: "", day: "" });
      setShowAddScheduleDialog(false);
      setIsAddingSchedule(false);
    } catch (error: unknown) {
      // Graceful error handling
      setNewSchedule({ from: "", to: "", fees: "", day: "" });
      setShowAddScheduleDialog(false);

      let errorMessage = "Unknown error occurred";
      if (isApiError(error)) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(`Failed to add schedule: ${errorMessage}`);
      setIsAddingSchedule(false);
    }
  };

  // 4) If there's no schedule, we can do something or show a prompt
  useEffect(() => {
    if (showNoScheduleWarning) {
      // Potentially open the add schedule dialog automatically, etc.
      // setShowAddScheduleDialog(true);
    }
  }, [showNoScheduleWarning]);

  // 5) Track changes so we show the Save button
  const handleChange = () => {
    setShowSaveButton(true);
  };

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings2 className="w-5 h-5" />
          </Button>
        </SheetTrigger>

        <SheetContent className="flex flex-col justify-between">
          {/* Top Section */}
          <div>
            <SheetHeader className="mt-2 flex flex-row justify-between mb-4">
              <SheetTitle>
                Clinic Settings
                <p className="text-sm flex flex-row text-gray-500 font-normal items-center gap-2">
                  Configure your bookings
                </p>
              </SheetTitle>

              {/* Day Selection */}
              {availableDays.length > 0 && (
                <div className="text-sm">
                  <Select value={selectedDay || ""} onValueChange={setSelectedDay}>
                    <SelectTrigger className="text-sm">
                      <SelectValue className="text-sm" placeholder="Choose a day" />
                    </SelectTrigger>
                    <SelectContent className="text-sm">
                      {availableDays.map((day) => (
                        <SelectItem className="text-sm" key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </SheetHeader>

            {/* Slot Selection (if day has schedules) */}
            <div className="flex flex-row w-full gap-2">
              {selectedDay && filteredSchedules.length > 0 && (
                <div className="w-full mb-1 ">
                  <span className="text-sm font-medium mb-2">Slot</span>
                  <Select
                    value={selectedScheduleId || ""}
                    onValueChange={handleSelectSchedule}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue className="text-sm" placeholder="Choose a slot" />
                    </SelectTrigger>
                    <SelectContent className="text-sm">
                      {filteredSchedules.map((schedule) => (
                        <SelectItem key={schedule.id} value={schedule.id}>
                          {schedule.from} - {schedule.to}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Schedule Timing */}
            <div>
              <div className="mt-4">
                <h3 className="text-md font-medium">Schedule Timing</h3>
                <p className="text-sm text-gray-500">
                  Adjust the schedule for this slot.
                </p>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="time"
                    value={scheduleStart}
                    onChange={(e) => {
                      setScheduleStart(e.target.value);
                      handleChange();
                    }}
                  />
                  <Input
                    type="time"
                    value={scheduleEnd}
                    onChange={(e) => {
                      setScheduleEnd(e.target.value);
                      handleChange();
                    }}
                  />
                </div>
              </div>

              {/* Booking Timing */}
              <div className="mt-4">
                <h3 className="text-md font-medium">Booking Timing</h3>
                <p className="text-sm text-gray-500">
                  Set the allowed booking window for this slot.
                </p>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="time"
                    value={bookingStart}
                    onChange={(e) => {
                      setBookingStart(e.target.value);
                      handleChange();
                    }}
                  />
                  <Input
                    type="time"
                    value={bookingEnd}
                    onChange={(e) => {
                      setBookingEnd(e.target.value);
                      handleChange();
                    }}
                  />
                </div>
              </div>

              {/* Online Booking Toggle */}
              <div className="mt-4">
                <h3 className="text-md font-medium">Online Booking</h3>
                <p className="text-sm text-gray-500">
                  Allow patients to book appointments online?
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <Switch
                  checked={allowOnlineBooking === "yes"}
                  onCheckedChange={(isChecked) => {
                    setAllowOnlineBooking(isChecked ? "yes" : "no");
                    handleChange();
                  }}
                  />
                  <span className="text-sm text-gray-700">
                  {allowOnlineBooking === "yes" ? "Enabled" : "Disabled"}
                  </span>
                </div>
                </div>

                {/* Conditionally show a Save button if something changed */}
                {showSaveButton && (
                <Button
                  className="w-full bg-primary text-white mt-4"
                  onClick={() => handleOnSave(selectedScheduleId || "")}
                >
                  Save Changes
                </Button>
              )}
            </div>
          </div>

          {/* Footer with "Add New Schedule" Button */}
          <SheetFooter>
            <Dialog
              open={showAddScheduleDialog}
              onOpenChange={setShowAddScheduleDialog}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full hover:bg-green-50 text-primary border-primary font-medium hover:text-primary"
                >
                  <Plus className="mr-2 w-4 h-4 text-primary" />
                  Add New Schedule
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Schedule</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Clinic Name */}
                  <div>
                    <h3 className="text-md font-medium">Clinic Name</h3>
                    <p className="text-md font-bold text-gray-700">
                      {selectedClinic?.name}
                    </p>
                  </div>

                  {/* Day Selection */}
                  <div>
                    <label className="text-sm font-medium">Select Day</label>
                    <Select
                      value={newSchedule.day}
                      onValueChange={(val) =>
                        setNewSchedule({ ...newSchedule, day: val })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a day" />
                      </SelectTrigger>
                      <SelectContent className="pr-1">
                        {[
                          "Monday  ",
                          "Tuesday  ",
                          "Wednesday  ",
                          "Thursday  ",
                          "Friday  ",
                          "Saturday  ",
                          "Sunday ",
                        ].map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Start Time (24-hr format approach, from the first snippet) */}
                  <div>
                    <label className="text-sm font-medium">Start Time</label>
                    <div className="flex space-x-2 items-center">
                      <Select
                        // Extract the hour from "HH:MM"
                        value={(() => {
                          if (!newSchedule.from) return "";
                          const [h] = newSchedule.from.split(":");
                          let hour24 = parseInt(h, 10);
                          // Ensure we produce a 2-digit string
                          return String(hour24).padStart(2, "0");
                        })()}
                        onValueChange={(val) => {
                          const [currH, currM] = (newSchedule.from || "00:00").split(":");
                          const wasMinute = currM || "00";
                          setNewSchedule({
                            ...newSchedule,
                            from: `${val}:${wasMinute}`,
                          });
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) =>
                            String(i).padStart(2, "0")
                          ).map((hour) => (
                            <SelectItem key={hour} value={hour}>
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span>:</span>

                      <Select
                        // Extract the minute from "HH:MM"
                        value={(() => {
                          if (!newSchedule.from) return "00";
                          const parts = newSchedule.from.split(":");
                          return parts[1] || "00";
                        })()}
                        onValueChange={(val) => {
                          const [hour24] = (newSchedule.from || "00:00").split(":");
                          setNewSchedule({
                            ...newSchedule,
                            from: `${hour24}:${val}`,
                          });
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0")).map(
                            (minute) => (
                              <SelectItem key={minute} value={minute}>
                                {minute}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* End Time (24-hr format approach) */}
                  <div>
                    <label className="text-sm font-medium">End Time</label>
                    <div className="flex space-x-2 items-center">
                      <Select
                        value={(() => {
                          if (!newSchedule.to) return "";
                          const [h] = newSchedule.to.split(":");
                          let hour24 = parseInt(h, 10);
                          return String(hour24).padStart(2, "0");
                        })()}
                        onValueChange={(val) => {
                          const [currH, currM] = (newSchedule.to || "00:00").split(":");
                          const wasMinute = currM || "00";
                          setNewSchedule({
                            ...newSchedule,
                            to: `${val}:${wasMinute}`,
                          });
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) =>
                            String(i).padStart(2, "0")
                          ).map((hour) => (
                            <SelectItem key={hour} value={hour}>
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span>:</span>

                      <Select
                        value={(() => {
                          if (!newSchedule.to) return "00";
                          const parts = newSchedule.to.split(":");
                          return parts[1] || "00";
                        })()}
                        onValueChange={(val) => {
                          const [hour24] = (newSchedule.to || "00:00").split(":");
                          setNewSchedule({
                            ...newSchedule,
                            to: `${hour24}:${val}`,
                          });
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0")).map(
                            (minute) => (
                              <SelectItem key={minute} value={minute}>
                                {minute}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Fees */}
                  <div>
                    <label className="text-sm font-medium">Fees</label>
                    <Input
                      type="number"
                      placeholder="Enter fees amount"
                      value={newSchedule.fees}
                      onChange={(e) =>
                        setNewSchedule({ ...newSchedule, fees: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Dialog Footer: Add Schedule / Cancel */}
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddScheduleDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddSchedule} disabled={isAddingSchedule}>
                    {isAddingSchedule ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Adding Schedule...
                      </>
                    ) : (
                      "Add Schedule"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default ClinicSetting;
