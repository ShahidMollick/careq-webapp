"use client";
import { useToast } from "@/components/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Trash2, UserPlus } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog,DialogFooter,DialogHeader,DialogTrigger,DialogContent,DialogTitle,DialogDescription, } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Doctor = {
  id: number;
  name: string;
  speciality: string;
  phone: string;
  email: string;
  description: string;
  schedule: { day: string; timings: string; amount: string }[];
  status: "Not yet started" | "Consulting" | "Break";
  profilePic: string;
};

// Initial list of doctors with dynamic schedules and descriptions
const initialDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Shahid Mollick",
    speciality: "Cardiologist",
    phone: "9987678896",
    email: "shahidmollick13@gmail.com",
    description:
      "Dr. Shahid is an experienced cardiologist with over 15 years of expertise in treating heart diseases.",
    schedule: [
      { day: "Mon", timings: "9AM - 12PM", amount: "Rs. 500" },
      { day: "Wed", timings: "2PM - 5PM", amount: "Rs. 450" },
    ],
    status: "Consulting",
    profilePic: "/doctor.svg",
  },
  {
    id: 2,
    name: "Dr. Anjali Mehta",
    speciality: "Neurologist",
    phone: "9876543210",
    email: "anjali.mehta@gmail.com",
    description:
      "Dr. Anjali specializes in neurology and has successfully treated complex brain disorders.",
    schedule: [
      { day: "Tue", timings: "10AM - 1PM", amount: "Rs. 600" },
      { day: "Thu", timings: "3PM - 6PM", amount: "Rs. 550" },
    ],
    status: "Not yet started",
    profilePic: "/doctor.svg",
  },
  {
    id: 3,
    name: "Dr. Ravi Kapoor",
    speciality: "Orthopedic",
    phone: "9765432101",
    email: "ravi.kapoor@gmail.com",
    description:
      "Dr. Ravi is a skilled orthopedic surgeon with a focus on bone injuries and joint replacement.",
    schedule: [
      { day: "Fri", timings: "9AM - 11AM", amount: "Rs. 700" },
      { day: "Sat", timings: "11AM - 2PM", amount: "Rs. 650" },
    ],
    status: "Break",
    profilePic: "/doctor.svg",
  },
];

export default function DoctorsTable() {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState(""); // State to track email input
  const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("All");
  const { toast } = useToast()
  // Filter doctors based on search input
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(search.toLowerCase());
    const matchesDay =
      selectedDay === "All" ||
      doctor.schedule.some((schedule) => schedule.day === selectedDay);
    return matchesSearch && matchesDay;
  });

  const toggleSelectDoctor = (id: number) => {
    setSelectedDoctors((prev) =>
      prev.includes(id) ? prev.filter((doctorId) => doctorId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDoctors.length === filteredDoctors.length) {
      setSelectedDoctors([]); // Deselect all
    } else {
      setSelectedDoctors(filteredDoctors.map((doctor) => doctor.id)); // Select all
    }
  };

  const handleDeleteSelected = () => {
    setDoctors((prev) => prev.filter((doctor) => !selectedDoctors.includes(doctor.id)));
    setSelectedDoctors([]); // Reset selection
  };

  const handleDeleteDoctor = (id: number) => {
    setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));
  };

  return (
    <div className="w-full p-4">
      {/* Search Bar and Add Doctor */}
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search Doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
         <Dialog>
          <DialogTrigger>
            <Button variant="outline" className="flex items-center ">
              <UserPlus className="mr-2" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Doctors to Your Clinic</DialogTitle>
              <p className="text-sm text-gray-500">
                Invite doctors to join your clinic by sharing the link below. They'll be able to
                create an account and get started right away.
              </p>
            </DialogHeader>
            <div className="flex flex-row items-center ">
                <Input
              type="email"
              placeholder="Enter doctor's email"
              autoFocus
              
            />
                <Button className="w-fit" onClick={() => {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }} >
                
                <Send></Send>
              </Button>
            </div>
            
            
            <DialogFooter>
            
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs for Day Filtering */}
      <Tabs defaultValue="All" className="mb-4" onValueChange={(value) => setSelectedDay(value)}>
        <TabsList>
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="Mon">Mon</TabsTrigger>
          <TabsTrigger value="Tue">Tue</TabsTrigger>
          <TabsTrigger value="Wed">Wed</TabsTrigger>
          <TabsTrigger value="Thu">Thu</TabsTrigger>
          <TabsTrigger value="Fri">Fri</TabsTrigger>
          <TabsTrigger value="Sat">Sat</TabsTrigger>
          <TabsTrigger value="Sun">Sun</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Delete Button for Selected Doctors */}
      {selectedDoctors.length > 0 && (
        <div className="mb-4">
          <Button variant="destructive" onClick={handleDeleteSelected} className="flex items-center">
            <Trash2 className="mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Doctors Table */}
      <div className="overflow-x-auto rounded-md border mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  aria-label="Select All"
                  checked={selectedDoctors.length === filteredDoctors.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>S No.</TableHead>
              <TableHead>Doctor Name</TableHead>
              <TableHead>Speciality</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Email ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDoctors.map((doctor, index) => (
              <TableRow key={doctor.id}>
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${doctor.name}`}
                    checked={selectedDoctors.includes(doctor.id)}
                    onCheckedChange={() => toggleSelectDoctor(doctor.id)}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Image
                    src={doctor.profilePic}
                    alt={doctor.name}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  {doctor.name}
                </TableCell>
                <TableCell>{doctor.speciality}</TableCell>
                <TableCell>{doctor.phone}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      doctor.status === "Not yet started"
                        ? "bg-gray-200 text-gray-600"
                        : doctor.status === "Consulting"
                        ? "bg-green-200 text-green-600"
                        : "bg-red-200 text-red-600"
                    }`}
                  >
                    {doctor.status}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Sheet>
                        <SheetTrigger>
                          <Button variant="ghost">View profile</Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>{doctor.name}'s Profile</SheetTitle>
                          </SheetHeader>
                          <div className="flex flex-col my-4 w-full items-center">
                            <Image
                              src={doctor.profilePic}
                              alt={doctor.name}
                              width={200}
                              height={200}
                              className="rounded-full mb-2"
                            />
                            <p className="text-sm text-center mb-4">
                              {doctor.description}
                            </p>
                            <div className="text-sm mb-4">
                              <p>
                                <strong>Phone:</strong> {doctor.phone}
                              </p>
                              <p>
                                <strong>Email:</strong> {doctor.email}
                              </p>
                            </div>
                          </div>

                          {/* Doctor's Schedule */}
                          <div className="w-full mt-4">
                            <h3 className="text-lg font-semibold mb-2">
                              Schedule
                            </h3>
                            <div className="overflow-x-auto rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Day</TableHead>
                                    <TableHead>Timings</TableHead>
                                    <TableHead>Amount</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {doctor.schedule.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{item.day}</TableCell>
                                      <TableCell>{item.timings}</TableCell>
                                      <TableCell>{item.amount}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteDoctor(doctor.id)}
                      >
                        Delete
                      </Button>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
