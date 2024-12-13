"use client";

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
import { ChevronDown, MoreHorizontal } from "lucide-react";

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
  status: "waiting" | "serving" | "completed";
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
    status: "waiting",
  },
  {
    id: 2,
    queueNo: 2,
    name: "Ankit Singh",
    email: "ankit@yahoo.com",
    phone: "+91 9876543210",
    age: 25,
    date: "Today",
    status: "serving",
  },
  {
    id: 3,
    queueNo: 3,
    name: "Riya Shah",
    email: "riya@gmail.com",
    phone: "+91 9988776655",
    age: 22,
    date: "Today",
    status: "completed",
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
        waiting: "bg-blue-100 text-blue-600",
        serving: "bg-yellow-100 text-yellow-600",
        completed: "bg-green-100 text-green-600",
      };
      return (
        <span
          className={`px-2 py-1 rounded-md ${statusClasses[status] || ""}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleDeletePatient(patient.id)} // Directly call delete function here
            >
              Delete Patient
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => console.log(`Viewing profile of ${patient.name}`)}
            >
              View Complete Profile
            </DropdownMenuItem>
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
          date: "Today",
          status: "waiting",
        },
      ]);
      setNewPatient({ name: "", email: "", phone: "", age: "" });
    };
  
    const handleDeleteSelectedPatients = () => {
      if (window.confirm("Are you sure you want to delete the selected patients?")) {
        const selectedIds = Object.keys(rowSelection).map(id => parseInt(id));
        setPatients(prev => prev.filter(patient => !selectedIds.includes(patient.id)));
      }
    };
  
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-transparent ml-auto">
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
          </DropdownMenu>
          
          {/* Conditionally render "Delete Selected" button */}
          {Object.keys(rowSelection).length > 0 && (
            <Button
              variant="outline"
              onClick={handleDeleteSelectedPatients}
              className="ml-4 bg-transparent border-red-500 text-red-500"
            >
              Delete Patient
            </Button>
          )}
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="ml-4">
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Name"
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Email"
                  value={newPatient.email}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, email: e.target.value })
                  }
                />
                <Input
                  placeholder="Phone"
                  value={newPatient.phone}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, phone: e.target.value })
                  }
                />
                <Input
                  placeholder="Age"
                  type="number"
                  value={newPatient.age}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, age: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleAddPatient}>Add</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
  
        {/* Table content here */}
        <div className="rounded-md border">
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
  
