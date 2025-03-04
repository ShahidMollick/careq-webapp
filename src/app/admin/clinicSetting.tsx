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
import { Settings2, Plus, Hospital } from "lucide-react";
import axios from "axios";
import { Switch } from "@/components/ui/switch";

function ClinicSetting() {
  // doctorId is used indirectly when saving to localStorage
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<{
    name: string;
    address: string;
  } | null>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [filteredSchedules, setFilteredSchedules] = useState<any[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null
  );
  const [showAddScheduleDialog, setShowAddScheduleDialog] = useState(false);
  const [scheduleStart, setScheduleStart] = useState("");
  const [scheduleEnd, setScheduleEnd] = useState("");
  const [bookingStart, setBookingStart] = useState("");
  const [bookingEnd, setBookingEnd] = useState("");
  const [allowOnlineBooking, setAllowOnlineBooking] = useState("yes");

  // ✅ State for Adding New Schedule
  const [newSchedule, setNewSchedule] = useState({
    from: "",
    to: "",
    fees: "",
    day: "",
  });

  // ✅ State for no schedule warning
  const [showNoScheduleWarning, setShowNoScheduleWarning] =
    useState<boolean>(false);
  useEffect(() => {
    if (selectedScheduleId) {
      const selectedSchedule = schedules.find(
        (s) => s.id === selectedScheduleId
      );
      if (selectedSchedule) {
        setScheduleStart(selectedSchedule.from);
        setScheduleEnd(selectedSchedule.to);
        setBookingStart(selectedSchedule.bookingStart || "");
        setBookingEnd(selectedSchedule.bookingEnd || "");
      }
    }
  }, [selectedScheduleId, schedules]);
  // ✅ State for tracking loading state when adding schedule
  const [isAddingSchedule, setIsAddingSchedule] = useState<boolean>(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  // Define Schedule type
  type Schedule = {
    id: string;
    day: string;
    clinicName: string;
    clinicAddress: string;
    from: string;
    to: string;
    fees: number;
    bookingStart?: string;
    bookingEnd?: string;
  };

  useEffect(() => {
    const storedDoctorData = localStorage.getItem("doctorData");
    if (storedDoctorData) {
      const doctor = JSON.parse(storedDoctorData);
      setDoctorId(doctor.id);

      localStorage.setItem("doctorId", doctor.id);
      localStorage.setItem("doctorName", doctor.name || ""); // still store it
      console.log("Doctor Id :", doctor.id);

      if (doctor.schedules && doctor.schedules.length > 0) {
        setSchedules(doctor.schedules);

        // ✅ Extract Clinic Name
        const firstClinic = doctor.schedules[0];
        const clinicInfo = {
          name: firstClinic.clinicName,
          address: firstClinic.clinicAddress,
        };
        setSelectedClinic(clinicInfo);

        // Store clinic info in localStorage for consistency
        localStorage.setItem("selectedClinic", JSON.stringify(clinicInfo));

        // ✅ Extract Unique Days
        const uniqueDays = [
          ...new Set(doctor.schedules.map((s: Schedule) => s.day)),
        ] as string[];
        setAvailableDays(uniqueDays);

        // ✅ Set Default Day & Schedule
        setSelectedDay(uniqueDays[0] || null);
      } else {
        // ✅ Show warning if no schedules found
        setShowNoScheduleWarning(true);
        setSelectedClinic({
          name: doctor.clinicName || "",
          address: doctor.clinicAddress || "",
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!selectedDay || schedules.length === 0) {
      console.log("No schedule available, clearing selectedScheduleId.");
      setSelectedScheduleId(null);
      localStorage.removeItem("selectedScheduleId");
    }
  }, [selectedDay, schedules]);

  // ✅ Update Schedule List when Day Changes
  useEffect(() => {
    if (selectedDay) {
      const daySchedules = schedules.filter((s) => s.day === selectedDay);
      setFilteredSchedules(daySchedules);

      // ✅ Auto-select the first schedule and store it
      if (daySchedules.length > 0) {
        setSelectedScheduleId(daySchedules[0].id);
      } else {
        setSelectedScheduleId("");
      }
    }
  }, [selectedDay, schedules]);

  // ✅ Ensure selectedScheduleId is stored correctly in localStorage
  useEffect(() => {
    if (selectedScheduleId) {
      localStorage.setItem("selectedScheduleId", selectedScheduleId);
    }
  }, [selectedScheduleId]);

  // ✅ Handle Schedule Selection Change
  const handleSelectSchedule = (selectedScheduleId: string) => {
    setSelectedScheduleId(selectedScheduleId);
  };

  // ✅ Handle Adding a New Schedule
  const handleAddSchedule = async () => {
    try {
      // Get stored doctor ID & clinic details
      const doctorId = localStorage.getItem("doctorId");
      const selectedClinic = JSON.parse(
        localStorage.getItem("selectedClinic") || "{}"
      );

      // Ensure required fields are provided
      if (!doctorId) {
        alert("Doctor ID is missing. Please login again.");
        return;
      }
      if (!selectedClinic.name || !selectedClinic.address) {
        alert("Clinic details are missing.");
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
      if (
        !newSchedule.day ||
        !newSchedule.from ||
        !newSchedule.to ||
        !newSchedule.fees
      ) {
        alert("Please fill in all fields before submitting.");
        return;
      }

      // Ensure fees is a valid integer
      const feesInt = parseInt(newSchedule.fees, 10);
      if (isNaN(feesInt) || feesInt <= 0) {
        alert("Fees must be a positive number.");
        return;
      }

      // Set loading state only after validation passes
      setIsAddingSchedule(true);

      // ✅ Request Payload
      const requestBody = {
        clinicName: selectedClinic.name,
        clinicAddress: selectedClinic.address,
        day: newSchedule.day,
        from: newSchedule.from,
        to: newSchedule.to,
        fees: feesInt,
      };

      console.log("📡 Sending Schedule Data:", requestBody);

      // ✅ Send API request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/${doctorId}/schedules`,
        requestBody
      );

      console.log("✅ Schedule Added Successfully:", response.data);
      alert("Schedule added successfully!");

      // ✅ Update local storage & state
      localStorage.setItem("selectedScheduleId", response.data.id);
      setSelectedScheduleId(response.data.id);
      setSchedules((prev) => [...prev, response.data]);
      setShowNoScheduleWarning(false); // Hide warning after adding schedule

      // ✅ Reset form and close modal
      setNewSchedule({ from: "", to: "", fees: "", day: "" });
      setShowAddScheduleDialog(false);
      setIsAddingSchedule(false);
    } catch (error: any) {
      // ✅ Reset form and close modal
      setNewSchedule({ from: "", to: "", fees: "", day: "" });
      setShowAddScheduleDialog(false);

      // Extract error message if available
      let errorMessage = "Unknown error occurred";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      alert(`Failed to add schedule: ${errorMessage}`);
      setIsAddingSchedule(false);
    }
  }
  };

  // ✅ No Schedule Warning Dialog
  useEffect(() => {
    if (showNoScheduleWarning) {
      setTimeout(() => {
        // Optionally auto-open the add schedule dialog or do something else
      }, 1000);
    }
  }, [showNoScheduleWarning]);

  // Just read doctorName straight from localStorage
  const localDoctorName =
    typeof window !== "undefined" ? localStorage.getItem("doctorName") : "";

  const handleChange = () => {
    setShowSaveButton(true);
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings2 className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col justify-between">
          <div>
            <SheetHeader className="mt-2 flex flex-row justify-between mb-4">
              <SheetTitle>
                Clinic Settings
                <p className="text-sm flex flex-row text-gray-500 font-normal items-center gap-2">
                  Configure your bookings
                </p>
              </SheetTitle>
              {/* ✅ Select Available Days */}
              {availableDays.length > 0 && (
                <div className="text-sm">
                  <Select
                    value={selectedDay || ""}
                    onValueChange={setSelectedDay}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue
                        className="text-sm"
                        placeholder="Choose a day"
                      />
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

            <div className="flex flex-row w-full gap-2">
              {/* ✅ Select Slot if Multiple Schedules Exist */}
              {selectedDay && filteredSchedules.length > 0 && (
                <div className="w-full mb-1 ">
                  <span className=" text-sm font-medium mb-2">Slot</span>
                  <Select
                    value={selectedScheduleId || ""}
                    onValueChange={handleSelectSchedule}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue
                        className="text-sm"
                        placeholder="Choose a slot"
                      />
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

            <div>
              {/* Schedule Timing */}
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
              {showSaveButton && (
                <Button
                  className="w-full bg-primary text-white"
                  onClick={() => {
                    setShowSaveButton(false);
                    alert("Changes saved!");
                  }}
                >
                  Save Changes
                </Button>
              )}
            </div>
          </div>

          {/* ✅ Add Schedule Button in Footer */}
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
                  {/* ✅ Show Clinic Name (Pre-filled) */}
                  <div>
                    <h3 className="text-md font-medium">Clinic Name</h3>
                    <p className="text-md font-bold text-gray-700">
                      {selectedClinic?.name}
                    </p>
                  </div>

                  {/* ✅ Select Day */}
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

                  {/* ✅ Select Schedule Start Time */}
                  <div>
                    <label className="text-sm font-medium">Start Time</label>
                    <div className="flex space-x-2 items-center">
                      {/* Hour */}
                      <Select
                        value={
                          (function () {
                            if (!newSchedule.from) return "";
                            const [h, m] = newSchedule.from.split(":");
                            const hour24 = parseInt(h, 10);
                            // Convert 24h to 12h for display
                            let hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                            return String(hour12).padStart(2, "0");
                          })()
                        }
                        onValueChange={(val) => {
                          const [currH, currM] = (newSchedule.from || "00:00").split(":");
                          let hour24 = parseInt(currH, 10);
                          let minute = parseInt(currM, 10);
                          // Determine current AM/PM from hour24
                          const wasPM = hour24 >= 12;
                          const newHour12 = parseInt(val, 10);
                          // Convert newHour12 + wasPM -> final 24h
                          let finalHour24 = wasPM
                            ? newHour12 === 12
                              ? 12
                              : newHour12 + 12
                            : newHour12 === 12
                            ? 0
                            : newHour12;
                          setNewSchedule({
                            ...newSchedule,
                            from: `${String(finalHour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
                          });
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((hour) => (
                            <SelectItem key={hour} value={hour}>
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span>:</span>

                      {/* Minute */}
                      <Select
                        value={
                          (function () {
                            if (!newSchedule.from) return "00";
                            const minutes = newSchedule.from.split(":")[1];
                            return String(parseInt(minutes, 10)).padStart(2, "0");
                          })()
                        }
                        onValueChange={(val) => {
                          const [currH] = (newSchedule.from || "00:00").split(":");
                          let hour24 = parseInt(currH, 10);
                          let minute = parseInt(val, 10);
                          setNewSchedule({
                            ...newSchedule,
                            from: `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
                          });
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0")).map((minute) => (
                            <SelectItem key={minute} value={minute}>
                              {minute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* AM/PM */}
                      <Select
                        value={
                          (function () {
                            if (!newSchedule.from) return "AM";
                            const [h] = newSchedule.from.split(":");
                            return parseInt(h, 10) >= 12 ? "PM" : "AM";
                          })()
                        }
                        onValueChange={(val) => {
                          const [currH, currM] = (newSchedule.from || "00:00").split(":");
                          let hour24 = parseInt(currH, 10);
                          // Convert to or from PM/AM
                          if (val === "PM" && hour24 < 12) {
                            hour24 += 12;
                          } else if (val === "AM" && hour24 >= 12) {
                            hour24 -= 12;
                          }
                          setNewSchedule({
                            ...newSchedule,
                            from: `${String(hour24).padStart(2, "0")}:${currM}`,
                          });
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="AM/PM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* ✅ Select Schedule End Time */}
                  <div>
                    <label className="text-sm font-medium">End Time</label>
                    <div className="flex space-x-2 items-center">
                      {/* Hour */}
                      <Select
                        value={
                          (function () {
                            if (!newSchedule.to) return "";
                            const [h, m] = newSchedule.to.split(":");
                            const hour24 = parseInt(h, 10);
                            let hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                            return String(hour12).padStart(2, "0");
                          })()
                        }
                        onValueChange={(val) => {
                          const [currH, currM] = (newSchedule.to || "00:00").split(":");
                          let hour24 = parseInt(currH, 10);
                          let minute = parseInt(currM, 10);
                          const wasPM = hour24 >= 12;
                          const newHour12 = parseInt(val, 10);
                          let finalHour24 = wasPM
                            ? newHour12 === 12
                              ? 12
                              : newHour12 + 12
                            : newHour12 === 12
                            ? 0
                            : newHour12;
                          setNewSchedule({
                            ...newSchedule,
                            to: `${String(finalHour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
                          });
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((hour) => (
                            <SelectItem key={hour} value={hour}>
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span>:</span>

                      {/* Minute */}
                      <Select
                        value={
                          (function () {
                            if (!newSchedule.to) return "00";
                            return String(parseInt(newSchedule.to.split(":")[1], 10)).padStart(2, "0");
                          })()
                        }
                        onValueChange={(val) => {
                          const [currH] = (newSchedule.to || "00:00").split(":");
                          let hour24 = parseInt(currH, 10);
                          let minute = parseInt(val, 10);
                          setNewSchedule({
                            ...newSchedule,
                            to: `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
                          });
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0")).map((minute) => (
                            <SelectItem key={minute} value={minute}>
                              {minute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* AM/PM */}
                      <Select
                        value={
                          (function () {
                            if (!newSchedule.to) return "AM";
                            const [h] = newSchedule.to.split(":");
                            return parseInt(h, 10) >= 12 ? "PM" : "AM";
                          })()
                        }
                        onValueChange={(val) => {
                          const [currH, currM] = (newSchedule.to || "00:00").split(":");
                          let hour24 = parseInt(currH, 10);
                          if (val === "PM" && hour24 < 12) {
                            hour24 += 12;
                          } else if (val === "AM" && hour24 >= 12) {
                            hour24 -= 12;
                          }
                          setNewSchedule({
                            ...newSchedule,
                            to: `${String(hour24).padStart(2, "0")}:${currM}`,
                          });
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="AM/PM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* ✅ Enter Fees */}
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

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddScheduleDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddSchedule}
                    disabled={isAddingSchedule}
                  >
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
