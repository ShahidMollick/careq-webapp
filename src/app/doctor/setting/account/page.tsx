"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
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
import { Plus, Lock, Trash2 } from "lucide-react";
import {
  Command,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface TimeSlot {
  from: string;
  to: string;
  maxPatients: number;
  bookingWindowHour: number;
}

interface Hospital {
  _id: string;
  hospitalName: string;
  address: string;
}

interface HospitalSchedule {
  hospital: Hospital;
  appointmentFee: number;
  availabilityStatus:
    | "Break"
    | "Consulting"
    | "NotYetStarted"
    | "Unavailable"
    | "OnLeave";
  availableDays: string[];
  availableTime: TimeSlot[];
}

interface DoctorProfile {
  name: string;
  contactNumber: string;
  email: string;
  licenseNumber: string;
  hospitals: HospitalSchedule[];
}

const DashboardPage: React.FC = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [schedules, setSchedules] = useState<{ [key: string]: TimeSlot[] }>({});
  const [currentHospital, setCurrentHospital] =
    useState<HospitalSchedule | null>(null);
  const [newTimeSlot, setNewTimeSlot] = useState({
    day: "Monday",
    from: "09:00",
    to: "17:00",
    appointmentFee: 500,
  });
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const doctorId = localStorage.getItem("doctorId");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctor/${doctorId}/profile`
        );
        setProfile(response.data);
        if (response.data?.hospitals?.length > 0) {
          setCurrentHospital(response.data.hospitals[0]);
          const initialSchedules = {};
          response.data.hospitals.forEach((hospital) => {
            initialSchedules[hospital.hospital] = hospital.availableTime || [];
          });
          setSchedules(initialSchedules);
        }
      } catch (error) {
        toast.error("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, []);

  const handleClinicSelect = async (clinic: any) => {
    try {
      const doctorId = localStorage.getItem("doctorId");
      const hospitalData: HospitalSchedule = {
        hospital: clinic._id || clinic.name,
        appointmentFee: parseInt(clinic.schedule[0].price.replace("Rs. ", "")),
        availabilityStatus: "NotYetStarted",
        availableDays: [...new Set(clinic.schedule.map((s: any) => s.day))],
        availableTime: clinic.schedule.map((s: any) => ({
          from: convertTo24Hour(s.time.split("-")[0].trim()),
          to: convertTo24Hour(s.time.split("-")[1].trim()),
          maxPatients: 10,
          bookingWindowHour: 24,
        })),
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctor/${doctorId}/profile`,
        {
          hospitals: [...(profile?.hospitals || []), hospitalData],
        }
      );

      setProfile(response.data);
      setCurrentHospital(hospitalData);
      toast.success("Clinic added successfully");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add clinic");
    }
  };

  const handleAddTimeSlot = async () => {
    if (!currentHospital) return;

    const timeSlot: TimeSlot = {
      from: newTimeSlot.from,
      to: newTimeSlot.to,
      maxPatients: 10,
      bookingWindowHour: 24,
    };

    const updatedHospital = {
      ...currentHospital,
      availableTime: [...currentHospital.availableTime, timeSlot],
      availableDays: [
        ...new Set([...currentHospital.availableDays, newTimeSlot.day]),
      ],
    };

    try {
      const doctorId = localStorage.getItem("doctorId");
      const updatedHospitals = profile?.hospitals.map((h) =>
        h.hospital === currentHospital.hospital ? updatedHospital : h
      );

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctor/${doctorId}/profile`,
        { hospitals: updatedHospitals }
      );

      setProfile(response.data);
      setCurrentHospital(updatedHospital);
      toast.success("Time slot added successfully");
    } catch (error) {
      toast.error("Failed to add time slot");
    }
  };

  const handleUpdateTimeSlot = async (
    index: number,
    field: string,
    value: string
  ) => {
    if (!currentHospital) return;

    const updatedTimeSlots = currentHospital.availableTime.map((slot, i) => {
      if (i === index) {
        // Create a new time slot object with the updated field
        const updatedSlot = { ...slot };

        // Validate time format
        if (field === "from" || field === "to") {
          if (/^\d{2}:\d{2}$/.test(value)) {
            updatedSlot[field] = value;
          }
        } else {
          updatedSlot[field] = value;
        }

        return updatedSlot;
      }
      return slot;
    });

    try {
      const doctorId = localStorage.getItem("doctorId");
      const updatedHospital = {
        ...currentHospital,
        availableTime: updatedTimeSlots,
      };

      const updatedHospitals = profile?.hospitals.map((h) =>
        h.hospital === currentHospital.hospital ? updatedHospital : h
      );

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctor/${doctorId}/profile`,
        { hospitals: updatedHospitals }
      );

      setProfile(response.data);
      setCurrentHospital(updatedHospital);
      toast.success("Schedule updated");
    } catch (error) {
      toast.error("Failed to update schedule");
    }
  };

  const handleDeleteTimeSlot = async (index: number) => {
    if (!currentHospital) return;

    try {
      const doctorId = localStorage.getItem("doctorId");
      const updatedTimeSlots = currentHospital.availableTime.filter(
        (_, i) => i !== index
      );
      const updatedHospital = {
        ...currentHospital,
        availableTime: updatedTimeSlots,
      };

      const updatedHospitals = profile?.hospitals.map((h) =>
        h.hospital === currentHospital.hospital ? updatedHospital : h
      );

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctor/${doctorId}/profile`,
        { hospitals: updatedHospitals }
      );

      setProfile(response.data);
      setCurrentHospital(updatedHospital);
      toast.success("Time slot deleted successfully");
    } catch (error) {
      toast.error("Failed to delete time slot");
    }
  };

  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (minutes === undefined) minutes = "00";

    if (hours === "12") {
      hours = "00";
    }

    if (modifier === "PM") {
      hours = (parseInt(hours, 10) + 12).toString();
    }

    return `${hours.padStart(2, "0")}:${minutes}`;
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const doctorId = localStorage.getItem("doctorId");
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctor/${doctorId}/profile`,
        { password: newPassword }
      );
      toast.success("Password updated successfully");
      setIsPasswordDialogOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  return (
    <div className="w-full">
      <Toaster />
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
          <div className="mb-6 flex gap-8">
            <div className="flex flex-col gap-4 w-1/3">
              <p className="font-semibold text-sm">Personal Information</p>
              <Dialog
                open={isPasswordDialogOpen}
                onOpenChange={setIsPasswordDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-fit bg-transparent border-primary text-primary hover:text-primary hover:bg-primary-accent"
                  >
                    <Lock className="mr-2" />
                    Set new password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set New Password</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handlePasswordChange}>
                      Update Password
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-2 gap-4 w-2/3">
              <Input
                disabled
                value={profile?.email || ""}
                placeholder="Email"
              />
              <Input
                disabled
                value={profile?.licenseNumber || ""}
                placeholder="License Number"
              />
              <Input
                disabled
                value={profile?.contactNumber || ""}
                placeholder="Mobile Number"
              />
            </div>
          </div>

          <Separator className="my-4 bg-gray-100" />

          <div className="flex gap-8">
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
                      <CommandInput placeholder="Search hospitals..." />
                      <CommandList>
                        <CommandEmpty>No hospitals found.</CommandEmpty>
                        <CommandGroup heading="Available Hospitals">
                          {profile?.hospitals?.map((hospital) => (
                            <CommandItem
                              key={hospital.hospital}
                              onSelect={() => handleClinicSelect(hospital)}
                            >
                              <div className="flex items-center gap-3">
                                <Image
                                  src="/doctor.svg"
                                  height={32}
                                  width={32}
                                  alt="hospital avatar"
                                  className="rounded-full"
                                />
                                <div>
                                  <p className="text-sm font-medium">
                                    {hospital.hospital.hospitalName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {hospital.hospital.address || "No address"}
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

            {currentHospital && (
              <div className="w-2/3">
                <div className="mb-4 flex flex-row gap-4 items-center">
                  <Image
                    src="/doctor.svg"
                    height={48}
                    width={48}
                    alt="clinic image"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {currentHospital.hospital?.hospitalName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {currentHospital.hospital?.address || "Address"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {currentHospital.availableTime.map((slot, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Input
                        value={currentHospital.availableDays[0]}
                        disabled
                        className="w-28"
                      />
                      <Input
                        type="time"
                        value={slot.from}
                        onChange={(e) =>
                          handleUpdateTimeSlot(index, "from", e.target.value)
                        }
                        onBlur={(e) =>
                          handleUpdateTimeSlot(index, "from", e.target.value)
                        }
                        className="w-20"
                      />
                      <Input
                        type="time"
                        value={slot.to}
                        onChange={(e) =>
                          handleUpdateTimeSlot(index, "to", e.target.value)
                        }
                        onBlur={(e) =>
                          handleUpdateTimeSlot(index, "to", e.target.value)
                        }
                        className="w-20"
                      />
                      <Input
                        type="number"
                        value={currentHospital.appointmentFee}
                        onChange={(e) =>
                          handleUpdateTimeSlot(
                            index,
                            "appointmentFee",
                            e.target.value
                          )
                        }
                        className="w-24"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTimeSlot(index)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="mt-4 w-1/3 flex items-center gap-2"
                  onClick={handleAddTimeSlot}
                >
                  <Plus size={16} /> Add day and time
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
                    <Input
                      value={scheduleItem.time}
                      disabled
                      className="w-40"
                    />
                    <Input
                      value={scheduleItem.price}
                      disabled
                      className="w-24"
                    />
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
