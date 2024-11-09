"use client"; 
import * as React from "react"
import { format, isSameDay } from "date-fns"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DatePickerDemo } from "@/components/ui/datePicker"
import { ComboboxDemo } from "@/components/ui/combobox"

// Sample data for the patients
const data: Patient[] = [
    {
      "queueNo": 1,
      "patientName": "John Doe",
      "email": "johndoe@example.com",
      "phoneNumber": "123-456-7890",
      "arrivalTime": "08:30 AM",
      "age": 32,
      "aadharVerified": true,
      "status": "waiting",
      "prescriptionStatus": "pending",
      "dateOfEntry": "2023-11-09T08:30:00Z"
    },
    {
      "queueNo": 2,
      "patientName": "Jane Smith",
      "email": "janesmith@example.com",
      "phoneNumber": "234-567-8901",
      "arrivalTime": "09:00 AM",
      "age": 45,
      "aadharVerified": false,
      "status": "in progress",
      "prescriptionStatus": "completed",
      "dateOfEntry": "2023-11-09T09:00:00Z"
    },
    {
      "queueNo": 3,
      "patientName": "Alice Johnson",
      "email": "alicejohnson@example.com",
      "phoneNumber": "345-678-9012",
      "arrivalTime": "09:30 AM",
      "age": 29,
      "aadharVerified": true,
      "status": "completed",
      "prescriptionStatus": "completed",
      "dateOfEntry": "2023-11-09T09:30:00Z"
    },
    {
      "queueNo": 4,
      "patientName": "Bob Lee",
      "email": "boblee@example.com",
      "phoneNumber": "456-789-0123",
      "arrivalTime": "10:00 AM",
      "age": 52,
      "aadharVerified": false,
      "status": "waiting",
      "prescriptionStatus": "pending",
      "dateOfEntry": "2023-11-09T10:00:00Z"
    },
    {
      "queueNo": 5,
      "patientName": "Chris Evans",
      "email": "chrisevans@example.com",
      "phoneNumber": "567-890-1234",
      "arrivalTime": "10:30 AM",
      "age": 41,
      "aadharVerified": true,
      "status": "completed",
      "prescriptionStatus": "completed",
      "dateOfEntry": "2023-11-09T10:30:00Z"
    },
    {
      "queueNo": 6,
      "patientName": "Diana Prince",
      "email": "dianaprince@example.com",
      "phoneNumber": "678-901-2345",
      "arrivalTime": "11:00 AM",
      "age": 34,
      "aadharVerified": false,
      "status": "in progress",
      "prescriptionStatus": "pending",
      "dateOfEntry": "2023-11-09T11:00:00Z"
    },
    {
      "queueNo": 7,
      "patientName": "Edward Norton",
      "email": "edwardnorton@example.com",
      "phoneNumber": "789-012-3456",
      "arrivalTime": "11:30 AM",
      "age": 49,
      "aadharVerified": true,
      "status": "waiting",
      "prescriptionStatus": "completed",
      "dateOfEntry": "2023-11-09T11:30:00Z"
    },
    {
      "queueNo": 8,
      "patientName": "Fiona Apple",
      "email": "fionaapple@example.com",
      "phoneNumber": "890-123-4567",
      "arrivalTime": "12:00 PM",
      "age": 27,
      "aadharVerified": false,
      "status": "waiting",
      "prescriptionStatus": "pending",
      "dateOfEntry": "2023-11-09T12:00:00Z"
    },
    {
      "queueNo": 9,
      "patientName": "George Clooney",
      "email": "georgeclooney@example.com",
      "phoneNumber": "901-234-5678",
      "arrivalTime": "12:30 PM",
      "age": 57,
      "aadharVerified": true,
      "status": "in progress",
      "prescriptionStatus": "completed",
      "dateOfEntry": "2023-11-09T12:30:00Z"
    },
    {
      "queueNo": 10,
      "patientName": "Hannah Montana",
      "email": "hannahmontana@example.com",
      "phoneNumber": "012-345-6789",
      "arrivalTime": "01:00 PM",
      "age": 22,
      "aadharVerified": false,
      "status": "completed",
      "prescriptionStatus": "pending",
      "dateOfEntry": "2023-11-09T13:00:00Z"
    },
    {
      "queueNo": 11,
      "patientName": "Isaac Newton",
      "email": "isaacnewton@example.com",
      "phoneNumber": "123-456-7891",
      "arrivalTime": "01:30 PM",
      "age": 44,
      "aadharVerified": true,
      "status": "waiting",
      "prescriptionStatus": "completed",
      "dateOfEntry": "2023-11-09T13:30:00Z"
    },
    {
      "queueNo": 12,
      "patientName": "Jack Black",
      "email": "jackblack@example.com",
      "phoneNumber": "234-567-8902",
      "arrivalTime": "02:00 PM",
      "age": 36,
      "aadharVerified": false,
      "status": "in progress",
      "prescriptionStatus": "pending",
      "dateOfEntry": "2023-11-09T14:00:00Z"
    },
    {
      "queueNo": 13,
      "patientName": "Kurt Russell",
      "email": "kurtrussell@example.com",
      "phoneNumber": "345-678-9013",
      "arrivalTime": "02:30 PM",
      "age": 61,
      "aadharVerified": true,
      "status": "completed",
      "prescriptionStatus": "completed",
      "dateOfEntry": "2023-11-09T14:30:00Z"
    },
    {
      "queueNo": 14,
      "patientName": "Laura Palmer",
      "email": "laurapalmer@example.com",
      "phoneNumber": "456-789-0124",
      "arrivalTime": "03:00 PM",
      "age": 30,
      "aadharVerified": false,
      "status": "waiting",
      "prescriptionStatus": "pending",
      "dateOfEntry": "2023-11-09T15:00:00Z"
    },
    {
      "queueNo": 15,
      "patientName": "Mike Tyson",
      "email": "miketyson@example.com",
      "phoneNumber": "567-890-1235",
      "arrivalTime": "03:30 PM",
      "age": 50,
      "aadharVerified": true,
      "status": "completed",
      "prescriptionStatus": "completed",
      "dateOfEntry": "2023-11-09T15:30:00Z"
    },
    {
      "queueNo": 16,
      "patientName": "Nina Simone",
      "email": "ninasimone@example.com",
      "phoneNumber": "678-901-2346",
      "arrivalTime": "04:00 PM",
      "age": 42,
      "aadharVerified": false,
      "status": "in progress",
      "prescriptionStatus": "pending",
      "dateOfEntry": "2023-11-09T16:00:00Z"
    },
    {
      "queueNo": 17,
      "patientName": "Oscar Wilde",
      "email": "oscarwilde@example.com",
      "phoneNumber": "789-012-3457",
      "arrivalTime": "04:30 PM",
      "age": 48,
      "aadharVerified": true,
      "status": "waiting",
      "prescriptionStatus": "completed",
      "dateOfEntry": "2023-11-09T16:30:00Z"
    },
    {
      "queueNo": 18,
      "patientName": "Paul Newman",
      "email": "paulnewman@example.com",
      "phoneNumber": "890-123-4568",
      "arrivalTime": "05:00 PM",
      "age": 60,
      "aadharVerified": false,
      "status": "waiting",
      "prescriptionStatus": "pending",
      "dateOfEntry": "2023-11-09T17:00:00Z"
    },
    {
      "queueNo": 19,
      "patientName": "Quentin Tarantino",
      "email": "quentintarantino@example.com",
      "phoneNumber": "901-234-5679",
      "arrivalTime": "05:30 PM",
      "age": 58,
      "aadharVerified": true,
      "status": "in progress",
      "prescriptionStatus": "completed",
      "dateOfEntry": "2023-11-09T17:30:00Z"
    },
    {
      "queueNo": 20,
      "patientName": "Rachel Green",
      "email": "rachelgreen@example.com",
      "phoneNumber": "012-345-6790",
      "arrivalTime": "06:00 PM",
      "age": 31,
      "aadharVerified": false,
      "status": "completed",
      "prescriptionStatus": "pending",
      "dateOfEntry": "2023-11-09T18:00:00Z"
    },
    {
      "queueNo": 21,
      "patientName": "Steve Jobs",
      "email": "stevejobs@example.com",
      "phoneNumber": "123-456-7893",
      "arrivalTime": "06:30 PM",
      "age": 56,
      "aadharVerified": true,
      "status": "waiting",
      "prescriptionStatus": "completed",
      "dateOfEntry": "2023-11-09T18:30:00Z"
    },
    {
      "queueNo": 22,
      "patientName": "Tony Stark",
      "email": "tonystark@example.com",
      "phoneNumber": "234-567-8903",
      "arrivalTime": "07:00 PM",
      "age": 50,
      "aadharVerified": true,
      "status": "in progress",
      "prescriptionStatus": "pending",
      "dateOfEntry": "2023-11-09T19:00:00Z"
    },
    {
      "queueNo": 23,
      "patientName": "Uma Thurman",
      "email": "umathurman@example.com",
      "phoneNumber": "345-678-9014",
      "arrivalTime": "07:30 PM",
      "age": 43,
      "aadharVerified": false,
      "status": "completed",
      "prescriptionStatus": "completed",
      "dateOfEntry": "2023-11-09T19:30:00Z"
    },
    {
      "queueNo": 24,
      "patientName": "Victor Hugo",
      "email": "victorhugo@example.com",
      "phoneNumber": "456-789-0125",
      "arrivalTime": "08:00 PM",
      "age": 65,
      "aadharVerified": true,
      "status": "waiting",
      "prescriptionStatus": "pending",
      "dateOfEntry": "2023-11-09T20:00:00Z"
    },
    {
      "queueNo": 25,
      "patientName": "Walt Disney",
      "email": "waltdisney@example.com",
      "phoneNumber": "567-890-1236",
      "arrivalTime": "08:30 PM",
      "age": 59,
      "aadharVerified": false,
      "status": "in progress",
      "prescriptionStatus": "completed",
      "dateOfEntry": "2023-11-09T20:30:00Z"
    },
  
  {
    queueNo: 2,
    patientName: "Jane Smith",
    email: "janesmith@example.com",
    phoneNumber: "234-567-8901",
    arrivalTime: "09:00 AM",
    age: 45,
    aadharVerified: false,
    status: "in progress",
    prescriptionStatus: "completed",
    dateOfEntry: "today",
  },
  {
    queueNo: 3,
    patientName: "Alice Johnson",
    email: "alicejohnson@example.com",
    phoneNumber: "345-678-9012",
    arrivalTime: "09:30 AM",
    age: 29,
    aadharVerified: true,
    status: "completed",
    prescriptionStatus: "completed",
    dateOfEntry: "today",
  },
  {
    queueNo: 4,
    patientName: "Bob Lee",
    email: "boblee@example.com",
    phoneNumber: "456-789-0123",
    arrivalTime: "10:00 AM",
    age: 52,
    aadharVerified: false,
    status: "waiting",
    prescriptionStatus: "pending",
    dateOfEntry: "today",
  },
]

export type Patient = {
  queueNo: number
  patientName: string
  email: string
  phoneNumber: string
  arrivalTime: string
  age: number
  aadharVerified: boolean
  status: "waiting" | "in progress" | "completed"
  prescriptionStatus: "pending" | "completed"
  dateOfEntry: string
}

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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "queueNo",
    header: "Queue No.",
  },
  {
    accessorKey: "patientName",
    header: "Patient Name",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "arrivalTime",
    header: "Arrival Time",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "aadharVerified",
    header: "Aadhar Verification",
    cell: ({ row }) => (
      <Badge variant={row.getValue("aadharVerified") ? "default" : "destructive"}>
        {row.getValue("aadharVerified") ? "Verified" : "Not Verified"}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "prescriptionStatus",
    header: "Prescription Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("prescriptionStatus")}</div>
    ),
  },
  {
    accessorKey: "dateOfEntry",
  header: "Date of Entry",
  cell: ({ row }) => {
    const dateValue = new Date(row.getValue("dateOfEntry"));
    return <div>{format(dateValue, "dd-MM-yyyy")}</div>;
  },
  sortingFn: (rowA, rowB) => {
    const dateA = new Date(rowA.getValue("dateOfEntry")).getTime();
    const dateB = new Date(rowB.getValue("dateOfEntry")).getTime();
    return dateA - dateB;
  },
  },
]

export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined)

  // Filter data based on selected date
  React.useEffect(() => {
    if (selectedDate) {
      console.log(selectedDate);
      setColumnFilters((prev) => [
        ...prev.filter((filter) => filter.id !== "dateOfEntry"), // Remove previous date filter if any
        {
          id: "dateOfEntry",
          value: selectedDate,
        },
      ])
    } else {
      setColumnFilters((prev) => prev.filter((filter) => filter.id !== "dateOfEntry"))
    }
  }, [selectedDate])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    filterFns: {
      dateFilter: (row, columnId, filterValue) => {
        const rowDate = new Date(row.getValue(columnId));
        return isSameDay(rowDate, filterValue);
      },
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search Patients..."
          value={(table.getColumn("patientName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("patientName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DatePickerDemo onDateChange={setSelectedDate} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <ComboboxDemo />
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
      </div>
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
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
    </div>
  )
}
