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

function ClinicSetting() {
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

  // ✅ State for Adding New Schedule
  const [newSchedule, setNewSchedule] = useState({
    from: "",
    to: "",
    fees: "",
    day: "",
  });

  // ✅ Load doctor data from localStorage
  useEffect(() => {
    const storedDoctorData = localStorage.getItem("doctorData");
    if (storedDoctorData) {
      const doctor = JSON.parse(storedDoctorData);

      if (doctor.schedules && doctor.schedules.length > 0) {
        setSchedules(doctor.schedules);

        // ✅ Extract Clinic Name
        const firstClinic = doctor.schedules[0];
        setSelectedClinic({
          name: firstClinic.clinicName,
          address: firstClinic.clinicAddress,
        });

        // ✅ Extract Unique Days
        const uniqueDays = [...new Set(doctor.schedules.map((s) => s.day))];
        setAvailableDays(uniqueDays);

        // ✅ Set Default Day & Schedule
        setSelectedDay(uniqueDays[0] || null);
        setDoctorId(doctor.id);
      }
    }
  }, []);

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
        console.log("I am inside it!");
      }
    } else {
      setSelectedScheduleId("");
      console.log("I am inside it now!");
    }
  }, [selectedDay, schedules]);

  // ✅ Ensure selectedScheduleId is stored correctly in localStorage
  useEffect(() => {
    if (selectedScheduleId) {
      localStorage.setItem("selectedScheduleId", selectedScheduleId);
    }
  }, [selectedScheduleId]); // ✅ Runs whenever selectedScheduleId changes

  // ✅ Handle Schedule Selection Change
  const handleSelectSchedule = (selectedScheduleId: string) => {
    setSelectedScheduleId(selectedScheduleId); // ✅ State update will trigger `useEffect` above
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

      // Ensure fees is a valid integer
      const feesInt = parseInt(newSchedule.fees, 10);
      if (isNaN(feesInt) || feesInt <= 0) {
        alert("Fees must be a positive number.");
        return;
      }

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
        `https://9b94-203-110-242-40.ngrok-free.app/doctors/${doctorId}/schedules`,
        requestBody
      );

      console.log("✅ Schedule Added Successfully:", response.data);
      alert("Schedule added successfully!");

      // ✅ Update local storage & state
      localStorage.setItem("selectedScheduleId", response.data.id);
      setSelectedScheduleId(response.data.id);
      setSchedules((prev) => [...prev, response.data]);

      // ✅ Refresh Available Days
      if (!availableDays.includes(newSchedule.day)) {
        setAvailableDays([...availableDays, newSchedule.day]);
      }

      // ✅ Reset form and close modal
      setNewSchedule({ from: "", to: "", fees: "", day: "" });
      setShowAddScheduleDialog(false);
    } catch (error) {
      console.error("❌ Error adding schedule:", error);
      alert(
        `Failed to add schedule: ${
          error.response?.data?.message || "Unexpected error"
        }`
      );
    }
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings2 className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Clinic Settings</SheetTitle>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* ✅ Display Clinic Name */}
            {selectedClinic && (
              <div>
                <h3 className="text-lg font-medium mb-2">Clinic</h3>
                <p className="text-md font-bold text-gray-700">
                  {selectedClinic.name}
                </p>
              </div>
            )}

            {/* ✅ Select Available Days */}
            {availableDays.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Select Day</h3>
                <Select
                  value={selectedDay || ""}
                  onValueChange={setSelectedDay}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a day" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDays.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* ✅ Select Slot if Multiple Schedules Exist */}
            {selectedDay && filteredSchedules.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Select Slot</h3>
                <Select
                  value={selectedScheduleId || ""}
                  onValueChange={handleSelectSchedule}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSchedules.map((schedule) => (
                      <SelectItem key={schedule.id} value={schedule.id}>
                        {schedule.bookingStart} - {schedule.bookingEnd} (
                        {schedule.from} - {schedule.to})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* ✅ Show Selected Schedule ID */}
            {selectedScheduleId && (
              <p className="text-sm text-gray-600">
                Selected Schedule ID: <strong>{selectedScheduleId}</strong>
              </p>
            )}
          </div>

          {/* ✅ Add Schedule Button in Footer */}
          <SheetFooter>
            <Dialog
              open={showAddScheduleDialog}
              onOpenChange={setShowAddScheduleDialog}
            >
              <DialogTrigger asChild>
                <Button variant="default" className="w-full">
                  <Plus className="mr-2 w-4 h-4" />
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select a day" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
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
                    <Input
                      type="time"
                      value={newSchedule.from}
                      onChange={(e) =>
                        setNewSchedule({ ...newSchedule, from: e.target.value })
                      }
                    />
                  </div>

                  {/* ✅ Select Schedule End Time */}
                  <div>
                    <label className="text-sm font-medium">End Time</label>
                    <Input
                      type="time"
                      value={newSchedule.to}
                      onChange={(e) =>
                        setNewSchedule({ ...newSchedule, to: e.target.value })
                      }
                    />
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
                  <Button variant="default" onClick={handleAddSchedule}>
                    Add Schedule
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
