"use client";
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store"; // Adjust the import path as needed
import { createFollowUpAppointment } from "@/app/redux/appointmentSlice"; // Adjust the import path as needed

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DatePickerDemoProps = {
  onDateChange?: (date: Date | undefined) => void;
  parentAppointmentId: Array<{ id: string }>;
  followUpFee: number;
  notes?: string;
};

export function ScheduleBtn({
  onDateChange,
  parentAppointmentId,
  followUpFee,
  notes,
}: DatePickerDemoProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [date, setDate] = React.useState<Date>();
  const [showAlert, setShowAlert] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onDateChange) {
      onDateChange(selectedDate);
    }
    setShowAlert(true);
  };

  const handleConfirm = async () => {
    if (!date) return;

    setIsLoading(true);
    try {
      await dispatch(
        createFollowUpAppointment({
          parentAppointmentId,
          followUpDate: date,
          followUpFee,
          notes,
        })
      ).unwrap();

      setShowAlert(false);

      toast(
        <div className="p-4 rounded text-white bg-secondary w-full">
          <strong>Appointment Scheduled</strong>
          <p>
            Your appointment for {format(date, "MMMM dd, yyyy")} has been
            successfully scheduled.
          </p>
        </div>,
        {
          className: "bg-secondary text-white p-0 rounded",
        }
      );
    } catch (error) {
      toast(
        <div className="p-4 rounded text-white bg-destructive w-full">
          <strong>Error</strong>
          <p>Failed to schedule appointment. Please try again.</p>
        </div>,
        {
          className: "bg-destructive text-white p-0 rounded",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDate(undefined);
    setShowAlert(false);

    toast(
      <div className="p-4 rounded text-white bg-secondary w-full">
        <strong>Cancelled</strong>
        <p>Your appointment has not been scheduled.</p>
      </div>,
      {
        className: "bg-secondary text-white p-0 rounded",
      }
    );
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"default"}
            className={cn("w-full", !date && "")}
            disabled={isLoading}
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <CalendarIcon />
              <div>{isLoading ? "Scheduling..." : "Schedule Follow Up"}</div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              You have selected{" "}
              {date ? format(date, "MMMM dd, yyyy") : "a date"}. Do you want to
              confirm this appointment?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? "Scheduling..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </>
  );
}
