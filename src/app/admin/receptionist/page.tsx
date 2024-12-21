"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { MoreHorizontal, Trash2, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Receptionist = {
  id: number;
  name: string;
  email: string;
  phone: string;
  shift: string;
  status: "Active" | "Inactive";
  profilePic: string;
};

const initialReceptionists: Receptionist[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    shift: "Morning (8AM - 2PM)",
    status: "Active",
    profilePic: "/receptionist.svg",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "0987654321",
    shift: "Evening (2PM - 8PM)",
    status: "Inactive",
    profilePic: "/receptionist.svg",
  },
];

export default function ReceptionTable() {
  const [receptionists, setReceptionists] = useState(initialReceptionists);
  const [search, setSearch] = useState("");
  const [selectedReceptionists, setSelectedReceptionists] = useState<number[]>([]);

  const filteredReceptionists = receptionists.filter((receptionist) =>
    receptionist.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelectReceptionist = (id: number) => {
    setSelectedReceptionists((prev) =>
      prev.includes(id) ? prev.filter((recId) => recId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedReceptionists.length === filteredReceptionists.length) {
      setSelectedReceptionists([]); // Deselect all
    } else {
      setSelectedReceptionists(filteredReceptionists.map((rec) => rec.id)); // Select all
    }
  };

  const handleDeleteSelected = () => {
    setReceptionists((prev) =>
      prev.filter((rec) => !selectedReceptionists.includes(rec.id))
    );
    setSelectedReceptionists([]);
  };

  const handleDeleteReceptionist = (id: number) => {
    setReceptionists((prev) => prev.filter((rec) => rec.id !== id));
  };

  return (
    <div className="w-full p-4">
      {/* Search Bar and Add Receptionist */}
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search Receptionist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
        <Dialog>
          <DialogTrigger>
            <Button variant="outline" className="flex items-center">
              <UserPlus className="mr-2" />
              Add Receptionist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Receptionist</DialogTitle>
            </DialogHeader>
            {/* Add Receptionist Form */}
            <DialogFooter>
              <Button>Add Receptionist</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Button for Selected Receptionists */}
      {selectedReceptionists.length > 0 && (
        <div className="mb-4">
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            className="flex items-center"
          >
            <Trash2 className="mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Receptionists Table */}
      <div className="overflow-x-auto rounded-md border mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  aria-label="Select All"
                  checked={selectedReceptionists.length === filteredReceptionists.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>S No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReceptionists.map((rec, index) => (
              <TableRow key={rec.id}>
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${rec.name}`}
                    checked={selectedReceptionists.includes(rec.id)}
                    onCheckedChange={() => toggleSelectReceptionist(rec.id)}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Image
                    src={rec.profilePic}
                    alt={rec.name}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  {rec.name}
                </TableCell>
                <TableCell>{rec.email}</TableCell>
                <TableCell>{rec.phone}</TableCell>
                <TableCell>{rec.shift}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      rec.status === "Active"
                        ? "bg-green-200 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {rec.status}
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
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteReceptionist(rec.id)}
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
