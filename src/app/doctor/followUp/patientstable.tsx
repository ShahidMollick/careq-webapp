"use client";
import { Search } from "lucide-react";
import { Trash2 } from "lucide-react";
import { CalendarPlus } from "lucide-react";
import { UserRoundPlus } from "lucide-react";
import { GalleryHorizontalEnd } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import React, { useState } from "react";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { ChevronDown, MoreHorizontal } from "lucide-react";
import { PatientsTables } from "../appointments/patientstable"; 
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Patient = {
  id: number;
  queueNo: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  date: string;

  status: "Pending Confirmation" | "Appointment Confirmed" | "Appointment Completed";
};

const initialPatients: Patient[] = [
  {
    id: 1,
    queueNo: 1,
    name: "Harsh Swami",
    email: "ken99@yahoo.com",
    phone: "+91 9832893023",
    age: 19,
    date: "Today",
    status: "Pending Confirmation",
  },
  {
    id: 2,
    queueNo: 2,
    name: "Ankit Singh",
    email: "ankit@yahoo.com",
    phone: "+91 9876543210",
    age: 25,
    date: "Today",
    status: "Pending Confirmation",
  },
  {
    id: 3,
    queueNo: 3,
    name: "Riya Shah",
    email: "riya@gmail.com",
    phone: "+91 9988776655",
    age: 22,
    date: "Today",
    status: "Appointment Completed",
  },
  {
    id: 4,
    queueNo: 4,
    name: "Aman Verma",
    email: "aman.verma@example.com",
    phone: "+91 9765432101",
    age: 30,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 5,
    queueNo: 5,
    name: "Pooja Gupta",
    email: "pooja.gupta@example.com",
    phone: "+91 9845678901",
    age: 28,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 6,
    queueNo: 6,
    name: "Vikram Rao",
    email: "vikram.rao@example.com",
    phone: "+91 9008765432",
    age: 35,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 7,
    queueNo: 7,
    name: "Neha Patel",
    email: "neha.patel@example.com",
    phone: "+91 9234567890",
    age: 24,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 8,
    queueNo: 8,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+91 9501234567",
    age: 40,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 9,
    queueNo: 9,
    name: "Anjali Mehta",
    email: "anjali.mehta@example.com",
    phone: "+91 9098765432",
    age: 26,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 10,
    queueNo: 10,
    name: "Sunil Yadav",
    email: "sunil.yadav@example.com",
    phone: "+91 9376543210",
    age: 32,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 11,
    queueNo: 11,
    name: "Shreya Agarwal",
    email: "shreya.agarwal@example.com",
    phone: "+91 9801234567",
    age: 27,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 12,
    queueNo: 12,
    name: "Deepak Joshi",
    email: "deepak.joshi@example.com",
    phone: "+91 9912345678",
    age: 31,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 13,
    queueNo: 13,
    name: "Suman Singh",
    email: "suman.singh@example.com",
    phone: "+91 9887654321",
    age: 38,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 14,
    queueNo: 14,
    name: "Kriti Sharma",
    email: "kriti.sharma@example.com",
    phone: "+91 9776543210",
    age: 23,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 15,
    queueNo: 15,
    name: "Manish Reddy",
    email: "manish.reddy@example.com",
    phone: "+91 9609876543",
    age: 29,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 16,
    queueNo: 16,
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+91 9512345678",
    age: 33,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 17,
    queueNo: 17,
    name: "Ravi Kapoor",
    email: "ravi.kapoor@example.com",
    phone: "+91 9245678901",
    age: 41,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 18,
    queueNo: 18,
    name: "Sonal Desai",
    email: "sonal.desai@example.com",
    phone: "+91 9487654321",
    age: 26,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 9,
    queueNo: 9,
    name: "Anjali Mehta",
    email: "anjali.mehta@example.com",
    phone: "+91 9098765432",
    age: 26,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 10,
    queueNo: 10,
    name: "Sunil Yadav",
    email: "sunil.yadav@example.com",
    phone: "+91 9376543210",
    age: 32,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 11,
    queueNo: 11,
    name: "Shreya Agarwal",
    email: "shreya.agarwal@example.com",
    phone: "+91 9801234567",
    age: 27,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 12,
    queueNo: 12,
    name: "Deepak Joshi",
    email: "deepak.joshi@example.com",
    phone: "+91 9912345678",
    age: 31,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 13,
    queueNo: 13,
    name: "Suman Singh",
    email: "suman.singh@example.com",
    phone: "+91 9887654321",
    age: 38,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 14,
    queueNo: 14,
    name: "Kriti Sharma",
    email: "kriti.sharma@example.com",
    phone: "+91 9776543210",
    age: 23,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 15,
    queueNo: 15,
    name: "Manish Reddy",
    email: "manish.reddy@example.com",
    phone: "+91 9609876543",
    age: 29,
    date: "Today",
    status: "Appointment Confirmed",
  },
  {
    id: 16,
    queueNo: 16,
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+91 9512345678",
    age: 33,
    date: "Today",
    status: "Appointment Confirmed",
  },
  
];

export const columns: ColumnDef<Patient>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "queueNo",
    header: "Queue No.",
  },
  {
    accessorKey: "name",
    header: "Patient Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusClasses = {
        'Pending Confirmation': "bg-red-100 text-red-600",
        'Appointment Confirmed': "bg-blue-100 text-blue-600",
        'Appointment Completed': "bg-green-100 text-green-600",
      };
      return (
        <span className={`px-2 py-1 rounded-md ${statusClasses[status] || ""}`}>
          {status}
        </span>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original;
      const handleDeletePatient = (id: number) => {
        const [patients, setPatients] = useState<Patient[]>(initialPatients);
        setPatients((prev) => prev.filter((patient) => patient.id !== id));
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col " align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Dialog>
              <DialogTrigger>
                <Button
                  className="px-2 w-full py-[6px] font-normal flex items-centre justify-start text-start text-[14px]"
                  variant={"ghost"}
                >
                  <span className="mr-1">
                    <GalleryHorizontalEnd />
                  </span>
                  View medical history
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Medical History</DialogTitle>
                  <DialogDescription>
                    Quick Access to All Prescribed Medications
                  </DialogDescription>
                  <Carousel>
                    <CarouselContent>
                      <CarouselItem>
                        <Image
                          src="/image 4.png"
                          height={400}
                          width={800}
                          alt="Prescription"
                        />
                      </CarouselItem>
                      <CarouselItem>
                        <Image
                          src="/image 4.png"
                          height={400}
                          width={800}
                          alt="Prescription"
                        />
                      </CarouselItem>
                      <CarouselItem>
                        <Image
                          src="/image 4.png"
                          alt="Prescription"
                          height={400}
                          width={800}
                        />
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger>
                <Button
                  className="px-2 w-full py-[6px] font-normal flex items-centre justify-start text-start text-[14px]"
                  variant={"ghost"}
                >
                  <span className="mr-1">
                    <CalendarPlus />
                  </span>
                  Reschedule 
                </Button>
              </DialogTrigger>
              <DialogContent className="w-fit">
                <DialogHeader>
                  <DialogTitle>Schedule Follow Up</DialogTitle>
                  <DialogDescription className=" max-w-fit text-wrap">
                    {" "}
                    Select the date{" "}
                  </DialogDescription>
                  <Calendar className="w-full "></Calendar>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <DropdownMenuSeparator />
            <Dialog>
              <DialogTrigger>
                <Button
                  className="  font-normal px-2 py-[6px] w-full flex items-centre justify-start hover:text-red-500 text-start text-red-500 text-[14px]"
                  variant={"ghost"}
                >
                  <span className="mr-1">
                    <Trash2 />
                  </span>
                  Delete Patient
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Do you want to delete?</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    It will permanently delete your patient record
                  </div>
                  <div className="flex justify-end">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        variant="destructive"
                        type="submit"
                        onClick={() => handleDeletePatient(patient.id)}
                        className="ml-2"
                      >
                        Delete
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function PatientsTable() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
  });

  // Track the active tab for filtering
  const [activeTab, setActiveTab] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  // Update table whenever the tab changes
  const table = useReactTable({
    data: patients,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleAddPatient = () => {
    const id = patients.length + 1;
    const queueNo = id;
    setPatients((prev) => [
      ...prev,
      {
        id,
        queueNo,
        name: newPatient.name,
        email: newPatient.email,
        phone: newPatient.phone,
        age: Number(newPatient.age),
        date: "2024-12-14", // New patient date
        status: "Appointment Confirmed", // default status
      },
    ]);
    setNewPatient({ name: "", email: "", phone: "", age: "" });
  };

  const handleDeletePatient = (id: number) => {
    setPatients((prev) => prev.filter((patient) => patient.id !== id));
  };

  const handleDeleteSelectedPatients = () => {
    const selectedIds = Object.keys(rowSelection).map((id) => parseInt(id));
    setPatients((prev) =>
      prev.filter((patient) => !selectedIds.includes(patient.id))
    );
  };

  // Handle Tab Change (Set active filter)
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Apply filter for the selected tab
    if (tab === "all") {
      setColumnFilters([]);
    } else {
      setColumnFilters([{ id: "status", value: tab }]);
    }
  };
  // Handle Date Filter Change (when a date is selected from the calendar)
  // Handle Date Filter Change (when a date is selected from the calendar)
  const handleDateFilterChange = (selectedDate: string) => {
    const date = new Date(selectedDate);

    // Check if the date is valid
    if (!isNaN(date.getTime())) {
      setDateFilter(selectedDate); // Set the date filter in state
      table.setColumnFilters([
        { id: "date", value: selectedDate }, // Filter by exact date
      ]);
    } else {
      console.error("Invalid date selected");
    }
  };
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search follow up patients..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="ml-4 flex items-center">
              <CalendarPlus className="mr-2" /> {/* Calendar icon */}
              
            </Button>
          </DialogTrigger>
          <DialogContent className="w-fit">
            <DialogHeader>
              <DialogTitle>Select a Date</DialogTitle>
              <DialogDescription>
                Choose a date for filtering the patients.
              </DialogDescription>
              <Calendar
                selected={dateFilter}
                onChange={(date) => handleDateFilterChange(date)}
                className="w-full"
              />
            </DialogHeader>
            <DialogClose asChild>
              <Button className="mt-4">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        {/* Conditionally render "Delete Selected" button */}
      </div>

      {/* Tabs for filtering by status */}
      <div className="flex flex-row justify-between">
        <Tabs value={activeTab} className="" onValueChange={handleTabChange}>
          <TabsList className="space-x-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Pending Confirmation">Pending Confirmation</TabsTrigger>
            <TabsTrigger value="Appointment Confirmed">	Appointment Confirmed</TabsTrigger>
            <TabsTrigger value="Appointment Completed">Appointment Completed</TabsTrigger>
          </TabsList>

          {/* Tab Content */}
        </Tabs>
        <div className="flex flex-row">
          <Dialog>
            <DialogTrigger asChild>
              {Object.keys(rowSelection).length > 0 && (
                <Button
                  variant="outline"
                  className="ml-2 bg-transparent border-red-500 hover:text-red-500 text-red-500"
                >
                  Delete Patient
                  <span className="mr-1">
                    <Trash2 />
                  </span>
                </Button>
              )}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Do you want to delete?</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                It will permanently delete your patient record
              </div>
              <div className="flex justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="destructive"
                    type="submit"
                    onClick={handleDeleteSelectedPatients}
                    className="ml-2"
                  >
                    Delete
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="ml-2">
                Schedule Follow up
                <span className="mr-1">
                  <UserRoundPlus />
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[80%] flex flex-col align-start h-[95vh] max-w-[100%]">
              <DialogHeader>
                <DialogTitle>
                  Schedule Follow Up
                </DialogTitle>
                <DialogDescription>
                  Choose among your past patients to schedule follow up
                </DialogDescription>
              </DialogHeader>
              <PatientsTable/>

              <DialogClose>
                <div className="flex justify-end mt-4">
                  <Button type="submit" onClick={handleAddPatient}>
                    Add Patient
                  </Button>
                </div>
              </DialogClose>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-transparent ml-2">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>{" "}
        </div>
      </div>

      {/* Table content */}
      <div className=" mt-4 rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No patients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          className="bg-none"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
