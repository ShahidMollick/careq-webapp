// "use client";
// import * as React from "react";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { Toaster } from "@/components/ui/sonner";
// import { toast } from "sonner";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// // Adding a type for onDateChange prop
// type DatePickerDemoProps = {
//   onDateChange?: (date: Date | undefined) => void;
// };

// export function ScheduleBtn({ onDateChange }: DatePickerDemoProps) {
//   const [date, setDate] = React.useState<Date>();
//   const [showAlert, setShowAlert] = React.useState(false); // State to manage alert dialog visibility

//   const handleDateSelect = (selectedDate: Date | undefined) => {
//     setDate(selectedDate);
//     if (onDateChange) {
//       onDateChange(selectedDate);
//     }
//     setShowAlert(true); // Show alert dialog after selecting a date
//   };

//   const handleConfirm = () => {
//     // Logic after confirming date
//     console.log("Date confirmed:", date);
//     setShowAlert(false); // Close alert dialog

//     // Show toast notification for confirmed appointment
//     toast(
//       <div className="bg-[#164772] w-full rounded text-white">
//         <strong>Appointment Scheduled</strong>
//         <p>Your appointment for {date ? format(date, "MMMM dd, yyyy") : ""} has been successfully scheduled.</p>
//       </div>
//     );
//   };

//   const handleCancel = () => {
//     // Reset the selected date if canceled
//     setDate(undefined);
//     setShowAlert(false); // Close alert dialog

//     // Show toast notification for canceled appointment
//     toast(
//       <div className="bg-red-500 rounded text-white">
//         <strong>Oops!</strong>
//         <p>Your appointment has not been scheduled.</p>
//       </div>
//     );
//   };

//   return (
//     <>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             variant={"default"}
//             className={cn("w-full", !date && "")}
//           >
//             <div className="flex flex-row items-center justify-center gap-2">
//               <CalendarIcon />
//               <div>Schedule Follow Up</div>
//             </div>
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0">
//           <Calendar
//             mode="single"
//             selected={date}
//             onSelect={handleDateSelect} // Call the handler function
//             initialFocus
//           />
//         </PopoverContent>
//       </Popover>

//       {/* AlertDialog for confirmation */}
//       {showAlert && (
//         <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Confirm Appointment</AlertDialogTitle>
//               <AlertDialogDescription>
//                 You have selected {date ? format(date, "MMMM dd, yyyy") : "a date"}. Do you want to confirm this appointment?
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
//               <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       )}

//       {/* Toaster Component for global notifications */}
//       <Toaster />
//     </>
//   );
// }

"use client";
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

// Adding a type for onDateChange prop
type DatePickerDemoProps = {
  onDateChange?: (date: Date | undefined) => void;
};

export function ScheduleBtn({ onDateChange }: DatePickerDemoProps) {
  const [date, setDate] = React.useState<Date>();
  const [showAlert, setShowAlert] = React.useState(false); // State to manage alert dialog visibility

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onDateChange) {
      onDateChange(selectedDate);
    }
    setShowAlert(true); // Show alert dialog after selecting a date
  };

  const handleConfirm = () => {
    // Logic after confirming date
    console.log("Date confirmed:", date);
    setShowAlert(false); // Close alert dialog

    // Show toast notification for confirmed appointment
    toast(
      <div className="p-4 rounded text-white bg-secondary w-full">
        <strong>Appointment Scheduled</strong>
        <p>Your appointment for {date ? format(date, "MMMM dd, yyyy") : ""} has been successfully scheduled.</p>
      </div>,
      {
        className: "bg-secondary text-white p-0 rounded", // Apply full box style here
      }
    );
  };

  const handleCancel = () => {
    // Reset the selected date if canceled
    setDate(undefined);
    setShowAlert(false); // Close alert dialog

    // Show toast notification for canceled appointment
    toast(
      <div className="p-4 rounded text-white bg-secondary w-full">
        <strong>Oops!</strong>
        <p>Your appointment has not been scheduled.</p>
      </div>,
      {
        className: "bg-secondary text-white p-0 rounded", // Apply full box style here
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
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <CalendarIcon />
              <div>Schedule Follow Up</div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect} // Call the handler function
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* AlertDialog for confirmation */}
      {showAlert && (
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Appointment</AlertDialogTitle>
              <AlertDialogDescription>
                You have selected {date ? format(date, "MMMM dd, yyyy") : "a date"}. Do you want to confirm this appointment?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Toaster Component for global notifications */}
      <Toaster />
    </>
  );
}
