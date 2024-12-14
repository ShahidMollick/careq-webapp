"use client";
import Image from "next/image";
import { useState } from "react"; // Import useState to manage state
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Lock } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Sample clinics data
const clinics = [
  {
    avatar: "/doctor.svg", // Avatar image URL
    name: "BC Roy Hospital",
    address:
      "8882+P3X Indian Institute of Technology Kharagpur, Scholars Avenue, Campus, Kharagpur, West Bengal 721302",
    schedule: [
      { day: "Monday", time: "9 AM - 11 AM", price: "Rs. 500" },
      { day: "Monday", time: "7 PM - 8 PM", price: "Rs. 500" },
      { day: "Monday", time: "5 PM - 11 PM", price: "Rs. 500" },
    ],
  },
  {
    avatar: "/doctor.svg",
    name: "XYZ Medical Center",
    address: "1234 ABC Street, Some City, Some State, 123456",
    schedule: [
      { day: "Tuesday", time: "10 AM - 12 PM", price: "Rs. 600" },
      { day: "Tuesday", time: "6 PM - 7 PM", price: "Rs. 600" },
    ],
  },
  {
    avatar: "/doctor.svg",
    name: "HealthCare Clinic",
    address: "9876 XYZ Road, Cityville, State, 654321",
    schedule: [
      { day: "Wednesday", time: "9 AM - 11 AM", price: "Rs. 700" },
      { day: "Wednesday", time: "2 PM - 4 PM", price: "Rs. 700" },
    ],
  },
];

const DashboardPage: React.FC = () => {
  const [selectedClinic, setSelectedClinic] = useState<any>(null); // State for the selected clinic
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage the dialog visibility

  const handleClinicSelect = (clinic: any) => {
    setSelectedClinic(clinic); // Set the selected clinic data
    setIsDialogOpen(true); // Open the dialog when a clinic is selected
  };

  return (
    <div className="w-full">
      {/* Main Account Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Account</CardTitle>
          <CardDescription>
            Manage your contact information, credentials, clinic details, and
            availability
          </CardDescription>
          <Separator className="my-4" />
        </CardHeader>

        <CardContent>
          {/* Personal Information Section */}
          <div className="mb-6 flex gap-8">
            {/* Title and Action Button */}
            <div className="flex flex-col gap-4 w-1/3">
              <p className="font-semibold text-sm">Personal Information</p>
              <Button
                variant="outline"
                className="w-fit bg-transparent border-primary text-primary hover:text-primary hover:bg-primary-accent"
              >
                <span>
                  <Lock />
                </span>
                Set new password
              </Button>
            </div>

            {/* Form Section */}
            <div className="grid grid-cols-2 gap-4 w-2/3">
              <Input
                disabled
                value="shahidmollck13@gmail.com"
                placeholder="Email"
              />
              <Input disabled value="EP16401" placeholder="License Number" />
              <Input
                disabled
                value="+91 9987179937"
                placeholder="Mobile Number"
              />
            </div>
          </div>

          <Separator className="my-4  bg-gray-100" />

          {/* Clinics and Schedule Section */}
          <div className="flex gap-8">
            {/* Title and Action Button */}
            <div className="flex flex-col gap-4 w-1/3">
              <p className="text-sm font-semibold">Clinics and Schedule</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center w-fit gap-2"
                  >
                    <Plus size={16} /> Add clinic
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add clinic</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    <Command>
                      <CommandInput placeholder="Type a command or search..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Clinics">
                          {clinics.map((clinic, index) => (
                            <CommandItem
                              key={index}
                              onSelect={() => handleClinicSelect(clinic)}
                            >
                              <div className="flex items-center gap-3">
                                <Image
                                  src={clinic.avatar}
                                  height={32}
                                  width={32}
                                  alt="clinic avatar"
                                  className="rounded-full"
                                />
                                <div>
                                  <p className="text-sm font-medium">
                                    {clinic.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {clinic.address}
                                  </p>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            </div>

            {/* Clinic and Schedule Form */}
            <div className="w-2/3">
              {/* Clinic Card */}
              <div className="">
                <div className="mb-4 flex flex-row gap-4 items-center">
                  <Image
                    src="/doctor.svg"
                    height={48}
                    width={48}
                    alt="clinic image"
                  />
                  <div>
                    <p className="text-sm font-medium">BC Roy Hospital</p>
                    <p className="text-sm text-gray-500">
                      8882+P3X Indian Institute of Technology Kharagpur,
                      Scholars Avenue, Campus, Kharagpur, West Bengal 721302
                    </p>
                  </div>
                </div>

                {/* Schedule Items */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Input value="Monday" disabled className="w-28" />
                    <Input type="text" value="9 AM" className="w-20" />
                    <Input type="text" value="11 AM" className="w-20" />
                    <Input type="text" value="Rs. 500" className="w-24" />
                  </div>

                  <div className="flex items-center gap-4">
                    <Input value="Monday" disabled className="w-28" />
                    <Input type="text" value="7 PM" className="w-20" />
                    <Input type="text" value="8 PM" className="w-20" />
                    <Input type="text" value="Rs. 500" className="w-24" />
                  </div>

                  <div className="flex items-center gap-4">
                    <Input value="Monday" disabled className="w-28" />
                    <Input type="text" value="5 PM" className="w-20" />
                    <Input type="text" value="11 PM" className="w-20" />
                    <Input type="text" value="Rs. 500" className="w-24" />
                  </div>
                </div>

                {/* Add Day and Time Button */}
                <Button
                  variant="outline"
                  className="mt-4  w-1/3 flex items-center gap-2"
                >
                  <Plus size={16} /> Add day and time
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog to show clinic schedule details */}
      {selectedClinic && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedClinic.name} Schedule</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <div className="flex flex-col gap-4">
                {selectedClinic.schedule.map((scheduleItem, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Input value={scheduleItem.day} disabled className="w-28" />
                    <Input value={scheduleItem.time} disabled className="w-40" />
                    <Input value={scheduleItem.price} disabled className="w-24" />
                  </div>
                ))}
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DashboardPage;
