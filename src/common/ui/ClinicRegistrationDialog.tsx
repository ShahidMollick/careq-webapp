"use client";
import React, { useState } from "react";
import { ArrowRight, PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/popup";
import { registerClinic } from "@/app/api/registerClinic.api";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from "@/utils/apiClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleRow {
  id: string;
  day: string;
  fromTime: string;
  toTime: string;
}

interface ClinicRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clinicData: any, schedules: ScheduleRow[]) => void;
}

interface ClinicData {
  name: string;
  phoneNumber: string;
  description: string;
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  bannerImages: string[]; // Explicitly define as an array of strings
  facilityImages: string[]; // Explicitly define as an array of strings
}

const ClinicRegistrationDialog: React.FC<ClinicRegistrationDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [step, setStep] = useState(1); // Current step state
  const [clinicData, setClinicData] = useState<ClinicData>({
    name: "",
    phoneNumber: "",
    description: "",
    streetAddress: "",
    city: "",
    state: "",
    pincode: "",
    bannerImages: [], // Correctly initialized as a string array
    facilityImages: [], // Correctly initialized as a string array
  });

  const [loading, setLoading] = useState(false); // For showing a loader during submission
  const [error, setError] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<ScheduleRow[]>([
    { id: "1", day: "", fromTime: "", toTime: "" },
  ]);
  const createSchedules = async (schedules: any[]) => {
    const response = await apiClient.post("/facilities/schedule", schedules);
    return response.data;
  };

  const handleNext = async () => {
    if (step === 2) {
      // Step 2: Submit Clinic Data
      try {
        setLoading(true);
        setError(null);

        const userId = String(localStorage.getItem("userID")); // Retrieve userID
        const createdFacility = await registerClinic(clinicData, userId); // Register clinic

        // Save facilityId for schedule submission
        localStorage.setItem("facilityId", createdFacility.facility.id);

        alert("Clinic registered successfully!");
        setStep(step + 1);
      } catch (err: any) {
        setError(
          err.message || "An error occurred while registering the clinic."
        );
        return; // Stop execution if error occurs
      } finally {
        setLoading(false);
      }
    } else if (step === 3) {
      // Step 3: Submit Schedules

      try {
        setLoading(true);
        setError(null);

        const facilityId = localStorage.getItem("facilityId"); // Retrieve facilityId
        if (!facilityId)
          throw new Error("Facility ID not found. Please try again.");

        const validateSchedules = (schedules) => {
          for (const schedule of schedules) {
            const fromTime = new Date(`1970-01-01T${schedule.fromTime}:00`);
            const toTime = new Date(`1970-01-01T${schedule.toTime}:00`);
            if (fromTime >= toTime) {
              return `Invalid time range for day ${schedule.dayOfWeek}: fromTime (${schedule.fromTime}) should be earlier than toTime (${schedule.toTime})`;
            }
          }
          return null;
        };

        // Format schedules for API
        const formattedSchedules = schedules.map((schedule) => ({
          facilityId, // Add the facilityId to each schedule
          dayOfWeek:
            [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ].indexOf(schedule.day.toLowerCase()) + 1, // Convert day to dayOfWeek (1=Monday, ..., 7=Sunday)
          fromTime: `${schedule.fromTime}:00`,
          
          toTime:  `${schedule.toTime}:00`,
        }));
        console.log(
          "Formatted Schedules Payload:",
          JSON.stringify(formattedSchedules, null, 2)
        );

        // console.log(`formatted schedule: ${formattedSchedules}`);
        const validationError = validateSchedules(formattedSchedules);
        if (validationError) {
          setError(validationError);
          return;
        }
        const errorMessage = validateSchedules(formattedSchedules);
        if (errorMessage) {
          console.error(errorMessage);
          return alert(errorMessage);
        }

        await createSchedules(formattedSchedules); // Call the schedule API
        alert("Schedules added successfully!");
        // Call the parent onSubmit function to handle further actions
        onSubmit(clinicData, schedules);
      } catch (err: any) {
        setError(err.message || "An error occurred while adding schedules.");
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const addScheduleRow = () => {
    const newRow: ScheduleRow = {
      id: Date.now().toString(),
      day: "",
      fromTime: "",
      toTime: "",
    };
    setSchedules([...schedules, newRow]);
  };

  const removeScheduleRow = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  const updateSchedule = (
    id: string,
    field: keyof ScheduleRow,
    value: string
  ) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, [field]: value } : schedule
      )
    );
  };

  const handleSubmit = () => {
    onSubmit(clinicData, schedules);
    onClose(); // Close the dialog after submission
  };

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-[60%] min-w-[1000px] min-h-[500px] sm:rounded-3xl">
        <div className="flex gap-32 flex-row">
          <div className="w-[60%]">
            <DialogHeader>
              <DialogTitle className="text-2xl text-secondary font-bold">
                {step === 1 && "Let’s Set Up Your Clinic"}
                {step === 2 && "Upload Clinic Photos"}
                {step === 3 && "Set Your Weekly Schedule"}
              </DialogTitle>
              <DialogDescription className="text-md text-gray-600 mt-2">
                {step === 1 &&
                  "Complete this quick form to register your clinic and access all features in one place!"}
                {step === 2 &&
                  "Upload banner photos and other images to represent your clinic. Make a great first impression!"}
                {step === 3 &&
                  "Set your clinic's day-wise schedule for seamless appointments and management."}
              </DialogDescription>
            </DialogHeader>

            {/* Step Content */}
            {step === 1 && (
              <div id="step-1" className="h-[350px]">
                <form>
                  <div className="flex flex-row mt-4 w-full gap-2">
                    <div className="mb-4 w-full">
                      <Label className="text-sm text-gray-800  font-medium">
                        Clinic Name
                      </Label>
                      <Input
                        value={clinicData.name}
                        placeholder="Enter your clinic name"
                        className="h-12 text-sm text-gray-800 w-full mt-2 border-gray-300 rounded-lg "
                        onChange={(e) =>
                          setClinicData({ ...clinicData, name: e.target.value })
                        }
                      ></Input>
                    </div>
                    <div className="mb-4 w-[60%]">
                      <Label className="text-sm text-gray-800font-medium">
                        Phone Number
                      </Label>
                      <Input
                        value={clinicData.phoneNumber}
                        placeholder="Enter contact number"
                        type="tel"
                        className="h-12 text-sm text-gray-800 mt-2 border-gray-300 rounded-lg w-full"
                        onChange={(e) =>
                          setClinicData({
                            ...clinicData,
                            phoneNumber: e.target.value,
                          })
                        }
                      ></Input>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm text-gray-800 font-semibold">
                      Clinic Address
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-800 font-medium">
                          Street Address
                        </Label>
                        <Input
                          value={clinicData.streetAddress}
                          placeholder="Enter street address"
                          className="h-12 text-sm text-gray-800 mt-2 border-gray-300 rounded-lg"
                          onChange={(e) =>
                            setClinicData({
                              ...clinicData,
                              streetAddress: e.target.value,
                            })
                          }
                        ></Input>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-800 font-medium">
                          City
                        </Label>
                        <Input
                          value={clinicData.city}
                          onChange={(e) =>
                            setClinicData({
                              ...clinicData,
                              city: e.target.value,
                            })
                          }
                          placeholder="Enter city"
                          className="h-12 text-sm text-gray-800 mt-2 border-gray-300 rounded-lg"
                        ></Input>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label className="text-sm text-gray-800 font-medium">
                          State
                        </Label>
                        <Input
                          value={clinicData.state}
                          onChange={(e) =>
                            setClinicData({
                              ...clinicData,
                              state: e.target.value,
                            })
                          }
                          placeholder="Enter state"
                          className="h-12 text-sm text-gray-800 mt-2 border-gray-300 rounded-lg"
                        ></Input>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-800 font-medium">
                          Pin Code
                        </Label>
                        <Input
                          value={clinicData.pincode}
                          onChange={(e) =>
                            setClinicData({
                              ...clinicData,
                              pincode: e.target.value,
                            })
                          }
                          placeholder="Enter pin code"
                          className="h-12 text-sm text-gray-800 mt-2 border-gray-300 rounded-lg"
                        ></Input>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && (
              <div id="step-2" className=" mt-4 h-[350px]">
                <div className="mb-4 ">
                  <Label className="text-sm text-gray-800 font-medium">
                    Banner Photos (Max 3)
                  </Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    className="mt-2 w-full text-sm text-gray-600"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setClinicData({
                        ...clinicData,
                        bannerImages: files.map((file) =>
                          URL.createObjectURL(file)
                        ),
                      });
                    }}
                  ></Input>
                </div>
                <div>
                  <Label className="text-sm text-gray-800 font-medium">
                    Other Photos
                  </Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    className="mt-2 w-full text-sm text-gray-600"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setClinicData({
                        ...clinicData,
                        facilityImages: files.map((file) =>
                          URL.createObjectURL(file)
                        ),
                      });
                    }}
                  ></Input>
                </div>
                <div className="mt-4">
                  <Label className="text-sm text-gray-800 font-medium">
                    About
                  </Label>
                  <Textarea
                    className="mt-2 h-36"
                    value={clinicData.description}
                    onChange={(e) =>
                      setClinicData({
                        ...clinicData,
                        description: e.target.value,
                      })
                    }
                  ></Textarea>
                </div>
              </div>
            )}

            {step === 3 && (
              <div id="step-3" className="h-[375px]">
                {schedules.map((schedule, index) => (
                  <div
                    key={schedule.id}
                    className="flex flex-wrap items-end gap-4"
                  >
                    <div className="flex-1 ">
                      <Label htmlFor={`day-${schedule.id}`}>Day</Label>
                      <Select
                        value={schedule.day}
                        onValueChange={(value) =>
                          updateSchedule(schedule.id, "day", value)
                        }
                      >
                        <SelectTrigger
                          id={`day-${schedule.id}`}
                          className="mt-2"
                        >
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
                            <SelectItem key={day} value={day.toLowerCase()}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 ">
                      <Label htmlFor={`from-${schedule.id}`}>From</Label>
                      <Input
                        type="time"
                        id={`from-${schedule.id}`}
                        value={schedule.fromTime}
                        onChange={(e) =>
                          updateSchedule(
                            schedule.id,
                            "fromTime",
                            e.target.value
                          )
                        }
                        className="mt-2"
                      />
                    </div>
                    <div className="flex-1 ">
                      <Label htmlFor={`to-${schedule.id}`}>To</Label>
                      <Input
                        type="time"
                        id={`to-${schedule.id}`}
                        value={schedule.toTime}
                        onChange={(e) =>
                          updateSchedule(schedule.id, "toTime", e.target.value)
                        }
                      />
                    </div>
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeScheduleRow(schedule.id)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove schedule row</span>
                      </Button>
                    )}
                  </div>
                ))}
                <div>
                  <Button onClick={addScheduleRow} className="ml-auto mt-2">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-items-center align-middle">
            <img src="pana.svg" className="w-96" alt="" />
          </div>
        </div>
        {/* Error Display */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <div className="flex flex-row max-h-14 justify-between">
          {/* Navigation Buttons */}
          {/* Stepper Dots */}
          <div className="flex flex-row  items-center">
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className={`w-3 h-2 rounded-full mx-1 ${
                  step === dot ? "bg-primary" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
          <div className="flex justify-end gap-4 items-center">
            <Button
              className={`text-sm ${
                step === 1 ? "text-gray-400 cursor-not-allowed" : ""
              }`}
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1 || loading}
            >
              Back
            </Button>
            <Button
              className="px-6 py-2 text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark"
              disabled={loading}
              onClick={handleNext}
            >
              {step === 2 ? (loading ? "Submitting..." : "Submit") : "Next"}
              {step === 3 ? "Register Clinic" : "Next Step"}
              {step === 3 ? "" : <ArrowRight></ArrowRight>}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClinicRegistrationDialog;
