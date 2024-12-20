"use client";
import { IndianRupee } from "lucide-react";
import {
  Search,
  Trash2,
  CalendarPlus,
  UserRoundPlus,
  ChevronDown,
  MoreHorizontal,
  GalleryHorizontalEnd,
} from "lucide-react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

// Define the Patient type
type Patient = {
  id: string;
  queueNo: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  sex: string;
  date: string;
  status: "waiting" | "serving" | "completed";
  doctor: {
    name: string;
    profilePic: string;
  };
};

// Sample patient data
const initialPatients: Patient[] = [
  {
    id: "1",
    queueNo: 1,
    name: "Harsh Swami",
    email: "ken99@yahoo.com",
    phone: "+91 9832893023",
    age: 19,
    sex: "male",
    date: "Today",
    status: "waiting",
    doctor: {
      name: "Dr. Sharma",
      profilePic: "/doctor.svg",
    },
  },
  {
    id: "2",
    queueNo: 2,
    name: "Ankit Singh",
    email: "ankit@yahoo.com",
    phone: "+91 9876543210",
    age: 25,
    sex: "male",
    date: "Today",
    status: "serving",
    doctor: {
      name: "Dr. Gupta",
      profilePic: "/doctor.svg",
    },
  },
];

// Define the table columns
export const columns: ColumnDef<Patient, any>[] = [
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
    accessorKey: "doctor",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = row.getValue("doctor");
      return (
        <div className="flex items-center space-x-2">
          <Image
            src={doctor.profilePic}
            alt={doctor.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <span>{doctor.name}</span>
        </div>
      );
    },
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
        waiting: "bg-blue-100 text-blue-600",
        serving: "bg-yellow-100 text-yellow-600",
        completed: "bg-green-100 text-green-600",
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
    header: "Actions",
    cell: ({ row }) => {
      const patient = row.original;

      const handleDeletePatient = (id: string) => {
        setPatients((prev) => prev.filter((p) => p.id !== id));
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col" align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Sheet>
              <SheetTrigger>
                <Button variant='ghost' className="font-normal px-2 py-[6px] w-full flex items-center justify-start">
                  <IndianRupee></IndianRupee>
                  Generate Bill</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Are you absolutely sure?</SheetTitle>
                  <SheetDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>

            <DropdownMenuSeparator />
            <Dialog>
              <DialogTrigger>
                <Button
                  className="font-normal px-2 py-[6px] w-full flex items-center justify-start hover:text-red-500 hover:bg-red-50 text-start text-red-500 text-[14px]"
                  variant="ghost"
                >
                  <Trash2 className="mr-1" />
                  Delete Patient
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Delete</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  Are you sure you want to delete this patient? This action
                  cannot be undone.
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

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search patients..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="mt-4 rounded-md border">
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
    </div>
  );
}
