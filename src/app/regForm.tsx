import React, { useState } from "react";
import { ArrowRight, Copy, PlusCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/popup";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
function regForm() {
    const [step, setStep] = useState(1); // Current step state
    const [schedules, setSchedules] = useState<ScheduleRow[]>([
        { id: "1", day: "", fromTime: "", toTime: "" },
      ]);
    
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
    
      // Function to handle "Next" and "Back" navigation
      const handleNext = () => {
        if (step < 3) setStep(step + 1);
      };
    
      const handleBack = () => {
        if (step > 1) setStep(step - 1);
      };
  return (

    <div>
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
                          placeholder="Enter your clinic name"
                          className="h-12 text-sm text-gray-800 w-full mt-2 border-gray-300 rounded-lg "
                        ></Input>
                      </div>
                      <div className="mb-4 w-[60%]">
                        <Label className="text-sm text-gray-800font-medium">
                          Phone Number
                        </Label>
                        <Input
                          placeholder="Enter contact number"
                          type="tel"
                          className="h-12 text-sm text-gray-800 mt-2 border-gray-300 rounded-lg w-full"
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
                            placeholder="Enter street address"
                            className="h-12 text-sm text-gray-800 mt-2 border-gray-300 rounded-lg"
                          ></Input>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-800 font-medium">
                            City
                          </Label>
                          <Input
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
                            placeholder="Enter state"
                            className="h-12 text-sm text-gray-800 mt-2 border-gray-300 rounded-lg"
                          ></Input>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-800 font-medium">
                            Zip Code
                          </Label>
                          <Input
                            placeholder="Enter zip code"
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
                    ></Input>
                  </div>
                  <div className="mt-4">
                    <Label className="text-sm text-gray-800 font-medium">
                      About
                    </Label>
                    <Textarea className="mt-2 h-36"></Textarea>
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
                          <SelectTrigger id={`day-${schedule.id}`} className="mt-2">
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
                            updateSchedule(
                              schedule.id,
                              "toTime",
                              e.target.value
                            )
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
                disabled={step === 1}
              >
                Back
              </Button>
              <Button
                className="px-6 py-2 text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark"
                onClick={handleNext}
              >
                {step === 3 ? "Register Clinic" : "Next Step"}
                {step === 3 ? "" : <ArrowRight></ArrowRight>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default regForm