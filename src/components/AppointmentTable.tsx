"use client";
import React, { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { format, parseISO } from "date-fns";

interface Appointment {
  queue_no: number;
  patient_name: string;
  email: string;
  phone_number: string;
  age: number;
  date: string;
  status: string;
}

const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch("/AppointmentData.json");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setAppointments(data.appointments);
      setFilteredAppointments(data.appointments);
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = appointments;

    if (searchText) {
      filtered = filtered.filter((appt) =>
        appt.patient_name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((appt) => appt.date === selectedDate);
    }

    if (statusFilter) {
      filtered = filtered.filter((appt) => appt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  }, [searchText, selectedDate, statusFilter, appointments]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date ? format(date, "yyyy-MM-dd") : null);
  };

  const getButtonClass = (status: string) => {
    const baseClass = "px-4 py-2 rounded-md text-white"; // Shared styles
    if (statusFilter === status) {
      // Active state: Use status color
      switch (status) {
        case "Waiting":
          return `${baseClass} bg-blue-500`;
        case "Serving":
          return `${baseClass} bg-yellow-500`;
        case "Completed":
          return `${baseClass} bg-green-500`;
        default:
          return `${baseClass} bg-gray-500`;
      }
    }
    // Inactive state: Neutral background
    return "px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300";
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex items-center w-full max-w-md border border-gray-300 rounded-md shadow-sm p-1.5 bg-white">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search Patients..."
            className="flex-grow px-2 py-1 text-sm text-gray-700 focus:outline-none rounded-md"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {/* Calendar Dropdown */}
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="ml-2 text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14m-9 4h4"
                  />
                </svg>
              </button>
            </Popover.Trigger>
            <Popover.Content
              align="end"
              className="bg-white border rounded-lg shadow-md p-4"
            >
              <input
                type="date"
                className="border border-gray-300 rounded-lg px-2 py-1 w-full text-sm"
                onChange={(e) =>
                  handleDateChange(
                    e.target.value ? new Date(e.target.value) : null
                  )
                }
              />
            </Popover.Content>
          </Popover.Root>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setStatusFilter(null)} // Show all
          className={`px-4 py-2 rounded-md ${
            !statusFilter ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter("Waiting")}
          className={getButtonClass("Waiting")}
        >
          Waiting
        </button>
        <button
          onClick={() => setStatusFilter("Serving")}
          className={getButtonClass("Serving")}
        >
          Serving
        </button>
        <button
          onClick={() => setStatusFilter("Completed")}
          className={getButtonClass("Completed")}
        >
          Completed
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Queue No.</th>
              <th className="px-4 py-2 text-left">Patient Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone Number</th>
              <th className="px-4 py-2 text-left">Age</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.queue_no} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{appointment.queue_no}</td>
                <td className="px-4 py-2">{appointment.patient_name}</td>
                <td className="px-4 py-2">{appointment.email}</td>
                <td className="px-4 py-2">{appointment.phone_number}</td>
                <td className="px-4 py-2">{appointment.age}</td>
                <td className="px-4 py-2">{appointment.date}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      appointment.status === "Waiting"
                        ? "bg-blue-500"
                        : appointment.status === "Serving"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <button className="text-gray-500 hover:text-gray-700">...</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsTable;
