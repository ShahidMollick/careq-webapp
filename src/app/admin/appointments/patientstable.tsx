"use client";

import React, { useState , useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Ensure to replace with your actual Dialog component
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Trash2, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import Image from "next/image";

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

type BillItem = {
  id: number;
  description: string;
  amount: number;
};

export const columns: ColumnDef<Patient, any>[] = [
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
            <BillDialog />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function BillDialog() {
  const [billItems, setBillItems] = useState([
    { id: 1, description: "Consultation Fees", amount: 500 },
    { id: 2, description: "Mortar L-I", amount: 50 },
    { id: 3, description: "Mortar L-2", amount: 250 },
  ]);

  const [newItem, setNewItem] = useState({ id: 0, description: "", amount: 0 });
  const printRef = useRef<HTMLDivElement>(null);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.description || newItem.amount <= 0) {
      alert("Please enter valid item details.");
      return;
    }
    const newItemWithId = { ...newItem, id: billItems.length + 1 };
    setBillItems([...billItems, newItemWithId]);
    setNewItem({ id: 0, description: "", amount: 0 });
  };

  const handleDeleteItem = (id: number) => {
    setBillItems(billItems.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: number, field: keyof typeof newItem, value: string) => {
    setBillItems(
      billItems.map((item) =>
        item.id === id
          ? { ...item, [field]: field === "amount" ? parseFloat(value) || 0 : value }
          : item
      )
    );
  };

  const totalAmount = billItems.reduce((total, item) => total + item.amount, 0);

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // To refresh the page and restore the original content
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Generate Bill</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Patient Bill</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {billItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                placeholder="Item Description"
                value={item.description}
                onChange={(e) =>
                  handleUpdateItem(item.id, "description", e.target.value)
                }
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Amount"
                value={item.amount.toString()}
                onChange={(e) =>
                  handleUpdateItem(item.id, "amount", e.target.value)
                }
                className="w-28"
              />
              <Button
                variant="ghost"
                className="p-2 text-red-500"
                onClick={() => handleDeleteItem(item.id)}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="New Item Description"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, description: e.target.value }))
                }
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Amount"
                value={newItem.amount.toString()}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-28"
              />
              <Button type="submit" variant="ghost">
                Add
              </Button>
            </div>
          </form>
          <div className="mt-4 text-lg font-semibold">Total: ₹{totalAmount}</div>
          <Button variant="default" className="w-full mt-4" onClick={handlePrint}>
            Print Prescription
          </Button>
        </div>

        {/* Printable Bill Section */}
        <div ref={printRef} style={{ display: "none" , backgroundColor:"white"}}>
          <h1 style={{ textAlign: "center", margin: "20px 0" }}>Patient Bill</h1>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #000", padding: "8px" }}>Item</th>
                <th style={{ border: "1px solid #000", padding: "8px" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item) => (
                <tr key={item.id}>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>{item.description}</td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>₹{item.amount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ border: "1px solid #000", padding: "8px", fontWeight: "bold" }}>Total</td>
                <td style={{ border: "1px solid #000", padding: "8px", fontWeight: "bold" }}>
                  ₹{totalAmount}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BillDialog;

export function ActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onPointerDown={(e) => e.stopPropagation()} className="p-4">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <BillDialog />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


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
