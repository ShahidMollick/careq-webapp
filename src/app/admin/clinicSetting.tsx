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
import { useDispatch, useSelector } from "react-redux";
import { 
  selectSchedule, 
  selectSelectedScheduleId,
  clearSelectedSchedule 
} from "@/app/redux/scheduleSlice";


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
  // Types & Interfaces
  // ----------------------------------------------------------------
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
    patientLimit?: number;
    Limit?: number;  // Add this line to fix the error
  };

  type ClinicInfo = {
    name: string;
    address: string;
  };

  type NewScheduleForm = {
    from: string;
    to: string;
    fees: string;
    day: string;
  };

  // ----------------------------------------------------------------
  // State Definitions
  // ----------------------------------------------------------------
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<ClinicInfo | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [scheduleStart, setScheduleStart] = useState("");
  const [scheduleEnd, setScheduleEnd] = useState("");
  const [bookingStart, setBookingStart] = useState("");
  const [bookingEnd, setBookingEnd] = useState("");
  const [newSchedule, setNewSchedule] = useState<NewScheduleForm>({
    from: "",
    to: "",
    fees: "",
    day: "",
  });
  const [showAddScheduleDialog, setShowAddScheduleDialog] = useState(false);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [showNoScheduleWarning, setShowNoScheduleWarning] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);

  // Add these lines for Redux
  const dispatch = useDispatch();
  const selectedScheduleId = useSelector(selectSelectedScheduleId);

  // Add these new state variables near other state definitions
  const [selectedScheduleData, setSelectedScheduleData] = useState<{
    fees: number;
    patientLimit: number | string;  // Allow both number and string
  }>({
    fees: 0,
    patientLimit: 0
  });

  // ----------------------------------------------------------------
  // Load doctor info on mount
  // ----------------------------------------------------------------
  useEffect(() => {
    const storedDoctorData = localStorage.getItem("doctorData");
    console.log("Raw doctorData from localStorage:", storedDoctorData);
    if (storedDoctorData) {
      const parsedData = JSON.parse(storedDoctorData);
      console.log("Patient limit:", parsedData.schedules?.[0]?.Limit);
      console.log("Parsed doctorData:", parsedData);
}
    const loadDoctorData = () => {
      const storedDoctorData = localStorage.getItem("doctorData");
      if (!storedDoctorData) return;
      
      const doctor = JSON.parse(storedDoctorData);
      setDoctorId(doctor.id || null);
      
      // Persist essential doctor info
      localStorage.setItem("doctorId", doctor.id);
      localStorage.setItem("doctorName", doctor.name || "");
      
      if (!doctor.schedules?.length) {
        setShowNoScheduleWarning(true);
        setSelectedClinic({
          name: doctor.clinicName || "",
          address: doctor.clinicAddress || "",
        });
        return;
      }
      
      setSchedules(doctor.schedules);
      
      // Find and set nearest schedule
      const nearestSchedule = findNearestSchedule(doctor.schedules);
      
      const clinicInfo = {
        name: nearestSchedule.clinicName,
        address: nearestSchedule.clinicAddress,
      };
      
      setSelectedClinic(clinicInfo);
      localStorage.setItem("selectedClinic", JSON.stringify(clinicInfo));
      
      // Extract unique days and set nearest day as default
      const uniqueDays = [...new Set(doctor.schedules.map((s: Schedule) => s.day))] as string[];
      setAvailableDays(uniqueDays);
      setSelectedDay(nearestSchedule.day);
      dispatch(selectSchedule(nearestSchedule.id));
    };
    
    const findNearestSchedule = (schedules: Schedule[]): Schedule => {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = new Date().getDay();
      
      return schedules.reduce((nearest, schedule) => {
        const scheduleIndex = daysOfWeek.indexOf(schedule.day);
        const nearestIndex = daysOfWeek.indexOf(nearest.day);
        
        const distCurrent = scheduleIndex >= today 
          ? scheduleIndex - today 
          : scheduleIndex + 7 - today;
        
        const distNearest = nearestIndex >= today 
          ? nearestIndex - today 
          : nearestIndex + 7 - today;
        
        return distCurrent < distNearest ? schedule : nearest;
      }, schedules[0]);
    };
    
    loadDoctorData();
  }, [dispatch]);

  // Clear schedule selection if no valid day or schedules exist
  useEffect(() => {
    if (!selectedDay || schedules.length === 0) {
      dispatch(clearSelectedSchedule());
      localStorage.removeItem("selectedScheduleId");
    }
  }, [selectedDay, schedules, dispatch]);

  // When selectedDay changes, filter schedules for that day
  useEffect(() => {
    if (!selectedDay) return;
    
    const daySchedules = schedules.filter((s) => s.day === selectedDay);
    setFilteredSchedules(daySchedules);
    
    if (daySchedules.length > 0) {
      dispatch(selectSchedule(daySchedules[0].id));
    } else {
      dispatch(selectSchedule(""));
    }
  }, [selectedDay, schedules, dispatch]);

  // Persist the selected schedule ID
  useEffect(() => {
    if (selectedScheduleId) {
      localStorage.setItem("selectedScheduleId", selectedScheduleId);
    }
  }, [selectedScheduleId]);

  // Update time fields when selected schedule changes
  useEffect(() => {
    if (!selectedScheduleId) return;
    
    const selectedSchedule = schedules.find((s) => s.id === selectedScheduleId);
    if (selectedSchedule) {
      setScheduleStart(selectedSchedule.from);
      setScheduleEnd(selectedSchedule.to);
      setBookingStart(selectedSchedule.bookingStart || "");
      setBookingEnd(selectedSchedule.bookingEnd || "");
      // Check for Limit first (API response) then patientLimit (local state)
      setSelectedScheduleData({
        fees: selectedSchedule.fees || 0,
        patientLimit: selectedSchedule.Limit || selectedSchedule.patientLimit || ''
      });
    }
  }, [selectedScheduleId, schedules]);

  // Show add schedule dialog if no schedules exist
  useEffect(() => {
    // Optional: Auto-open dialog when no schedules
    // if (showNoScheduleWarning) {
    //   setShowAddScheduleDialog(true);
    // }
  }, [showNoScheduleWarning]);

  // ----------------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------------
  const handleSelectSchedule = (scheduleId: string) => {
    dispatch(selectSchedule(scheduleId));
  };

  const handleChange = () => {
    setShowSaveButton(true);
  };

  const handleOnSave = async (scheduleId: string) => {
    if (!scheduleId) {
      alert("No schedule selected. Please select a schedule first.");
      return;
    }

    const doctorId = localStorage.getItem("doctorId");
    if (!doctorId) {
      alert("Doctor ID is missing. Please login again.");
      return;
    }

    const currentSchedule = schedules.find(s => s.id === scheduleId);
    if (!currentSchedule) {
      alert("Selected schedule not found.");
      return;
    }

    try {
      // Get latest values
      const fees = schedules.find(s => s.id === scheduleId)?.fees || 0;
      const patientLimit = schedules.find(s => s.id === scheduleId)?.patientLimit || 0;

      const updateData = {
        clinicName: currentSchedule.clinicName,
        clinicAddress: currentSchedule.clinicAddress,
        day: currentSchedule.day,
        from: scheduleStart,
        to: scheduleEnd,
        fees: selectedScheduleData.fees,
        Limit: typeof selectedScheduleData.patientLimit === 'string' 
          ? (selectedScheduleData.patientLimit === '' ? 0 : parseInt(selectedScheduleData.patientLimit)) 
          : selectedScheduleData.patientLimit,
        bookingStart,
        bookingEnd,
      };

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/${scheduleId}/schedules`,
        updateData
      );

      // Update schedules state
      const updatedSchedules = schedules.map(schedule =>
        schedule.id === scheduleId ? { ...schedule, ...response.data, fees: selectedScheduleData.fees, Limit: typeof selectedScheduleData.patientLimit === 'string' 
          ? (selectedScheduleData.patientLimit === '' ? 0 : parseInt(selectedScheduleData.patientLimit))
          : selectedScheduleData.patientLimit, patientLimit: typeof selectedScheduleData.patientLimit === 'string' 
          ? (selectedScheduleData.patientLimit === '' ? 0 : parseInt(selectedScheduleData.patientLimit))
          : selectedScheduleData.patientLimit } : schedule
      );
      setSchedules(updatedSchedules);

      // Update doctorData in localStorage
      const storedDoctorData = localStorage.getItem("doctorData");
      if (storedDoctorData) {
        const doctorData = JSON.parse(storedDoctorData);
        doctorData.schedules = updatedSchedules;
        localStorage.setItem("doctorData", JSON.stringify(doctorData));
      }

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
  };

  const handleAddSchedule = async () => {
    // Validate input
    if (!newSchedule.day || !newSchedule.from || !newSchedule.to || !newSchedule.fees) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const feesInt = parseInt(newSchedule.fees, 10);
    if (isNaN(feesInt) || feesInt <= 0) {
      alert("Fees must be a positive number.");
      return;
    }

    const docId = localStorage.getItem("doctorId");
    const storedClinic = localStorage.getItem("selectedClinic");
    
    if (!docId || !storedClinic) {
      alert("Missing doctor or clinic information. Please login again.");
      return;
    }

    const parsedClinic = JSON.parse(storedClinic);
    if (!parsedClinic.name || !parsedClinic.address) {
      alert("Clinic details are incomplete.");
      return;
    }

    try {
      setIsAddingSchedule(true);

      const requestBody = {
        clinicName: parsedClinic.name,
        clinicAddress: parsedClinic.address,
        day: newSchedule.day,
        from: newSchedule.from,
        to: newSchedule.to,
        fees: feesInt,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/${docId}/schedules`,
        requestBody
      );

      // Update state with new schedule
      setSchedules((prev) => [...prev, response.data]);
      dispatch(selectSchedule(response.data.id));
      localStorage.setItem("selectedScheduleId", response.data.id);
      setShowNoScheduleWarning(false);
      
      // Reset form & close dialog
      setNewSchedule({ from: "", to: "", fees: "", day: "" });
      setShowAddScheduleDialog(false);
      
      alert("Schedule added successfully!");
    } catch (error) {
      let errorMessage = "Unknown error occurred";
      if (isApiError(error)) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(`Failed to add schedule: ${errorMessage}`);
    } finally {
      setIsAddingSchedule(false);
    }
  };

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  const renderFeesAndLimit = () => {
    if (!selectedScheduleId) return null;

    return (
      <>
        <div className="mt-4">
          <h3 className="text-md font-medium">Consultation Fees</h3>
          <p className="text-sm text-gray-500">
            Set the fees amount for this appointment slot.
          </p>
          <div className="mt-2">
            <Input
              type="number"
              placeholder="Enter fees amount"
              value={selectedScheduleData.fees || ''}
              onChange={(e) => {
                setSelectedScheduleData(prev => ({
                  ...prev,
                  fees: parseInt(e.target.value) || 0
                }));
                handleChange();
              }}
            />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-md font-medium">Patient Limit</h3>
          <p className="text-sm text-gray-500">
            Maximum number of patients for this slot.
          </p>
          <div className="mt-2">
            <Input
              type="number"
              min="0"
              placeholder="Max patients"
              value={selectedScheduleData.patientLimit}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedScheduleData(prev => ({
                  ...prev,
                  patientLimit: value === '' ? '' : parseInt(value)
                }));
                handleChange();
              }}
            />
          </div>
        </div>
      </>
    );
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

              {/* Fees */}
              {renderFeesAndLimit()}

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

                  {/* Start Time (24-hr format approach, from the first snippet) */}
                  <div>
                    <label className="text-sm font-medium">Start Time</label>
                    <div className="flex space-x-2 items-center">
                      <Select
                        // Extract the hour from "HH:MM"
                        value={(() => {
                          if (!newSchedule.from) return "";
                          const [h] = newSchedule.from.split(":");
                          const hour24 = parseInt(h, 10);
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
                          const hour24 = parseInt(h, 10);
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
