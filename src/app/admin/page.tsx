"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWebSocket } from "@/hooks/useWebSocket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Loader2,
  ArrowRight,
  CircleCheck,
  History,
  CircleAlert,
  SkipForward,
  CheckCheck,
  User,
  UsersRound,
  Clock,
  MoreVertical,
  CalendarX2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QueueSettings } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSchedule,
  selectSelectedScheduleId,
} from "@/app/redux/scheduleSlice";
import { useToast } from "@/hooks/use-toast";
import NotificationHeader from "./notification";
import NotificationBanner from "./NotificationBanner";
interface Patient {
  id: string;
  appointmentId: string;
  queueNumber: string | number;
  name: string;
  phone: string;
  age: number | string;
  gender: string;
  status: string;
  dob: string;
  timeAdded: Date | string;
  timeStarted: Date | string | null;
  timeCompleted: Date | string | null;
}
interface Appointment {
  id: string;
  queueNumber?: number;
  status?: string;
  createdAt?: string;
  timeStarted?: string;
  timeCompleted?: string;
  patient?: {
    id?: string;
    name?: string;
    phone?: string;
    dob?: string;
    gender?: string;
  };
}

export default function QueueManagement() {
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const dispatch = useDispatch();
  const selectedScheduleId = useSelector(selectSelectedScheduleId);
  const { toast } = useToast(); // Add toast hook

  const [error, setError] = useState("");
  const [verifiedPatient, setVerifiedPatient] = useState<Patient | null>(null);
  const [verifiedPatients, setVerifiedPatients] = useState(false);
  const [Patients, setPatients] = useState<Patient[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processingNext, setProcessingNext] = useState(false);
  const [processingFinish, setProcessingFinish] = useState(false);
  // const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [allowOnlineBooking, setAllowOnlineBooking] = useState<"yes" | "no">(
    "yes"
  );
  const [selectedPatientForCancel, setSelectedPatientForCancel] =
    useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("live");
  const [showTopLoader, setShowTopLoader] = useState(false);
  const [nextQueueNumber, setNextQueueNumber] = useState(1);
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    const date = new Date();
    setTodayDate(date.toLocaleDateString()); // Formats the date as per locale
  }, []);
  const [settings, setSettings] = useState<QueueSettings>({
    scheduleStart: "17:00",
    scheduleEnd: "22:00",
    bookingStart: "17:00",
    bookingEnd: "22:00",
    onlineAppointments: false,
  });

  const [newPatient, setNewPatient] = useState({
    phone: "",

    name: "",
    gender: "male",
    dob: "",
  });

  // Retrieve schedule ID (e.g., from state or context)

  console.log("the schedule that is selected is ", selectedScheduleId);
  const {
    patients: livePatients,
    socket,
    isConnected,
    currentPatient,
    showTopLoaders,
    queueStatus,
  } = useWebSocket(selectedScheduleId || "");

  useEffect(() => {
    const fetchBookingStatus = async () => {
      if (!selectedScheduleId) {
        console.warn("⚠ No schedule selected, skipping fetch.");
        return;
      }

      console.log(`📡 Fetching booking status for schedule: ${selectedScheduleId}`);
      setLoading(true); // Show loading state

      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/${selectedScheduleId}/bookingStatus`;
        console.log(`🔗 API Request URL: ${apiUrl}`);
        
        const response = await axios.get(apiUrl);
        const { data } = response;

        if (data && typeof data.bookingWindow === 'boolean') {
          console.log(`✅ Booking status received: ${data.bookingWindow}`);
          setSettings((prev) => ({ ...prev, onlineAppointments: data.bookingWindow }));
          // Update allowOnlineBooking state to match backend data
          setAllowOnlineBooking(data.bookingWindow ? "yes" : "no");
        } else {
          console.warn("⚠ Invalid booking status structure:", data);
          setError("Unable to determine booking status");
        }
      } catch (error) {
        console.error("❌ Error fetching booking status:", error);
        setError("Failed to load booking status");
      } finally {
        setLoading(false);
      }
    };

    // Force fetch on component mount and when selectedScheduleId changes
    console.log("🔄 Booking status effect triggered, scheduleId:", selectedScheduleId);
    fetchBookingStatus();
    
    // Setup a refresh interval (every 30 seconds)
    const intervalId = setInterval(fetchBookingStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, [selectedScheduleId]);

  // useEffect(() => {
  //   const fetchBookingStatus = async () => {
  //     if (!selectedScheduleId) {
  //       console.warn("⚠ No schedule selected, skipping fetch.");
  //       return;
  //     }

  //     console.log(
  //       `📡 Fetching booking status for schedule: ${selectedScheduleId}`
  //     );
  //     console.log(`📡 Fetching booking status for schedule: ${selectedScheduleId}`);
  //     setLoading(true); // Show loading state

  //     try {
  //       const apiUrl = `http:localhost:5001/doctors/${selectedScheduleId}/bookingStatus`;
  //       console.log(`🔗 API Request URL: ${apiUrl}`);

  //       const response = await axios.get(apiUrl);
  //       const { data } = response;

  //       console.log("📊 ❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌ Received booking status data:", data);

  //       // Handle either bookingWindow or onlineAppointments property
  //       if (data && (typeof data.bookingWindow === 'boolean' || typeof data.onlineAppointments === 'boolean')) {
  //         const bookingStatus = typeof data.bookingWindow === 'boolean' 
  //           ? data.bookingWindow 
  //           : data.onlineAppointments;
            
  //         console.log(`✅ Booking status determined: ${bookingStatus}`);
          
  //         // Update settings state
  //         setSettings((prev) => ({ 
  //           ...prev, 
  //           onlineAppointments: bookingStatus 
  //         }));
          
  //         // Update allowOnlineBooking state
  //         setAllowOnlineBooking(bookingStatus ? "yes" : "no");
  //       } else {
  //         console.warn("⚠ Invalid booking status structure:", data);
  //         setError("Unable to determine booking status");
  //       }
  //     } catch (error) {
  //       console.error("❌ Error fetching booking status:", error);
  //       setError("Failed to load booking status");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   // Force fetch on component mount and when selectedScheduleId changes
  //   console.log("🔄 Booking status effect triggered, scheduleId:", selectedScheduleId);
  //   fetchBookingStatus();
  // }, [selectedScheduleId]);

  useEffect(() => {
    if (selectedScheduleId) {
      console.log("Listening for scheduleId:", selectedScheduleId);
      socket?.emit("fetchAppointments", selectedScheduleId);
    } else {
      console.log("No schedule selected. Resetting WebSocket.");
      socket?.emit("clearAppointments");
    }
  }, [selectedScheduleId, socket]);
  // Sync WebSocket data with Patients state
  // ✅ Listen for Booking Window Updates
  useEffect(() => {
    if (socket) {
      console.log("📡 Listening for booking window updates...");
      socket.on("bookingWindowUpdated", ({ scheduleId, isOpen }) => {
        console.log(
          `📢 Booking window update received for ${scheduleId}: ${
            isOpen ? "OPEN" : "CLOSED"
          }`
        );

        if (selectedScheduleId === scheduleId) {
          setSettings((prev) => ({
            ...prev,
            onlineAppointments: isOpen, // ✅ Dynamically enable/disable bookings
          }));
        }
      });
    }

    return () => {
      socket?.off("bookingWindowUpdated");
    };
  }, [socket, selectedScheduleId]);

  useEffect(() => {
    setPatients(livePatients);
  }, [livePatients]);
  console.log("The status of the queue is : ", queueStatus);
  const startTopLoader = () => {
    setShowTopLoader(true);
    // setTimeout(() => setShowTopLoader(false), 2000); // Auto-hide after 2s
  };

  const filteredPatients = Patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery);
    const matchesTab = {
      live: ["waiting", "serving"],
      skipped: ["skipped"],
      completed: ["completed"],
    }[currentTab]?.includes(patient.status);

    return matchesSearch && matchesTab;
  });

  const fetchAppointments = async (scheduleId: string | null) => {
    // ✅ Prevent API call if scheduleId is null or invalid
    if (!scheduleId ) {
      console.warn("⚠ No valid schedule selected. Skipping API call.");
      setPatients([]); // Clear the list to prevent showing wrong data
      setLoading(false);
      return;
    }

    
    setError("");
    

    try {
      setLoading(true);
      setShowTopLoader(true); // Show top loader
      console.log("📡 Fetching appointments for scheduleId:", scheduleId);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/${scheduleId}`
      );

      // ✅ Ensure response is valid
      if (response.data && Array.isArray(response.data)) {
        console.log("✅ Appointments fetched:", response.data);

        // ✅ Format data correctly
        const formattedPatients = response.data.map(
          (appointment: Appointment) => ({
            id: appointment.patient?.id || "N/A",
            appointmentId: appointment.id,
            queueNumber: appointment.queueNumber || "N/A",
            name: appointment.patient?.name || "Unknown",
            phone: appointment.patient?.phone || "N/A",
            age: appointment.patient?.dob
              ? calculateAge(appointment.patient.dob)
              : "N/A",
            gender: appointment.patient?.gender || "N/A",
            status: appointment.status || "N/A",
            dob: appointment.patient?.dob || "N/A",
            timeAdded: appointment.createdAt
              ? new Date(appointment.createdAt)
              : new Date(), // ✅ Convert string to Date
            timeStarted: appointment.timeStarted
              ? new Date(appointment.timeStarted)
              : null, // ✅ Convert or leave undefined
            timeCompleted: appointment.timeCompleted
              ? new Date(appointment.timeCompleted)
              : null, // ✅ Convert or leave undefined
          })
        );

        setPatients(formattedPatients);
      } else {
        console.error("❌ Invalid data received:", response.data);
        setError("No appointments found.");
        setPatients([]); // Clear the list if no valid data
      }
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
      setError("Error fetching appointments. Please try again.");
      setPatients([]); // Ensure UI does not show old data
    } finally {
      setLoading(false);
    }
  };

  const verifyPatient = async () => {
    setLoading(true);
    setError(""); // Reset error

    console.log("Verifying patient with phone:", newPatient.phone);

    try {
      console.log("Sending verification request to server...");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/verify`,
        { phone: newPatient.phone }
      );

      if (response.data.message === "Patient exists") {
        const patient = response.data.patient;
        console.log("Patient exists:", patient);

        setVerifiedPatient(patient);

        // Check if DOB is available and format it; otherwise, assign a default value
        // ✅ Ensure DOB is properly formatted
        const formattedDob = patient.dob
          ? new Date(patient.dob).toISOString().split("T")[0]
          : ""; // Convert to YYYY-MM-DD format

        // Set new patient data based on the verified patient response
        setNewPatient({
          ...newPatient,
          name: patient.name,
          gender: patient.gender,
          dob: formattedDob,
        });
      } else {
        console.log("Patient not found with phone:", newPatient.phone);

        setVerifiedPatient(null); // Clear verification state
        setError(
          "Patient not found. Please enter details to create an appointment."
        );

        setNewPatient({
          phone: newPatient.phone, // Retain the entered phone number
          name: "",
          gender: "male", // Default gender
          dob: "",
        });
      }
    } catch (error) {
      console.error("Error occurred during patient verification:", error);
      setError("Error verifying patient. Please try again.");
    } finally {
      setLoading(false);
      setVerifiedPatients(true);

      console.log("Verification process complete. Loading state set to false.");
    }
  };

  const addPatient = async () => {
    const patientData = {
      phone: newPatient.phone,

      name: newPatient.name,
      gender: newPatient.gender,
      dob: newPatient.dob,
    };
    
    setLoadings(true); // Start top loader
    try {
      let patient;
      console.log(verifiedPatient);
      startTopLoader();
      // Step 1: Check if the patient exists, if not create the patient
      if (verifiedPatient) {
        patient = verifiedPatient; // Use the verified patient
      } else {
        console.log("sending patient data: ", patientData);

        const patientResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/create-patient`,
          patientData
        );
        patient = patientResponse.data;
      }

      // Step 2: Create an appointment and add the patient to the queue
      const scheduleId =
        typeof window !== "undefined"
          ? localStorage.getItem("selectedScheduleId")
          : null;
      // Retrieve schedule ID (e.g., from state or context)
      console.log("the schedule that is selected is ", scheduleId);

      const source = "web"; // Source can be 'web' or 'mobile', depending on where the request is coming from
      console.log("patientId :", patient.id);

      const appointmentResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/book`,
        {
          scheduleId: scheduleId,
          patientId: patient.id,
          source: source,
        }
      );

      console.log("📡 Emitting WebSocket update manually...");
      socket?.emit("fetchAppointments", scheduleId); // ✅ Ensure updates are sent to all clients

      // Show success toast
      toast({
        title: "Patient Added",
        description: `${newPatient.name} has been added to the queue.`,
        variant: "default",
      });
    } catch (error) {
      console.error("❌ Error adding patient:", error);
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to add patient. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowTopLoader(false);
      setError("");
      setVerifiedPatients(false);
      setLoadings(false);
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };
  const BookingStatusChange = async (): Promise<void> => {
    // Retrieve schedule ID from local storage or state
    const scheduleId = localStorage.getItem("selectedScheduleId");

    if (!scheduleId) {
      console.error("❌ BookingStatusChange failed: No scheduleId available");
      return;
    }

    console.log(
      `🔄 Starting booking window toggle for schedule ID: ${scheduleId}`
    );
    console.log(`📊 Current booking status: ${allowOnlineBooking}`);

    const startTime = performance.now();

    try {
      // Log request details
      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/${scheduleId}/booking-window`;
      console.log(`📤 Sending PATCH request to: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Log response status
      console.log(
        `📥 Response status: ${response.status} ${response.statusText}`
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch((e) => ({ message: "Failed to parse error response" }));
        console.error("❌ API Error Response:", errorData);
        throw new Error(
          `API returned error ${response.status}: ${
            errorData.message || response.statusText
          }`
        );
      }

      const updatedSchedule = await response.json();
      const timeElapsed = Math.round(performance.now() - startTime);

      console.log(
        `✅ Booking window updated successfully (${timeElapsed}ms):`,
        updatedSchedule
      );
      console.log(
        `📊 New booking status: ${
          updatedSchedule.onlineAppointments ? "open" : "closed"
        }`
      );

      // Update local state to match the server state
      setSettings((prev) => ({
        ...prev,
        onlineAppointments: updatedSchedule.onlineAppointments,
      }));
    } catch (error) {
      const timeElapsed = Math.round(performance.now() - startTime);
      console.error(
        `❌ Error updating booking window (${timeElapsed}ms):`,
        error
      );

      if (error instanceof Error) {
        console.error(`- Message: ${error.message}`);
        console.error(`- Stack: ${error.stack}`);
      }

      // Show error to user or handle it
      setError(
        `Failed to update booking status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const cancelAppointment = (patient: Patient) => {
    setSelectedPatientForCancel(patient);
    setCancelDialogOpen(true);
  };
  const confirmCancel = async () => {
    // Store patient info before closing dialog
    const patientToCancel = selectedPatientForCancel;

    // Close dialog immediately to prevent UI issues
    setCancelDialogOpen(false);
    setSelectedPatientForCancel(null);

    // Validate the patient data
    if (!patientToCancel) {
      console.error("Cannot cancel: No patient selected");
      return;
    }

    if (!patientToCancel.appointmentId) {
      console.error(
        "Cannot cancel: Missing appointmentId for patient",
        patientToCancel
      );
      setError("Cannot cancel: Missing appointment information");
      return;
    }

    if (!selectedScheduleId) {
      console.error("Cannot cancel: Missing scheduleId");
      setError("System configuration error. Please contact support.");
      return;
    }

    try {
      // Show loading indicator
      setShowTopLoader(true);
      setError("");

      // Use the same domain as other API calls
      const cancelUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/cancelappointment/${selectedScheduleId}/${patientToCancel.appointmentId}`;
      console.log(`Attempting to cancel appointment: ${cancelUrl}`);

      // Call API to cancel the appointment
      const response = await axios.patch(cancelUrl);

      // Log success
      // console.log(Successfully cancelled appointment for ${patientToCancel.name}, response.data);

      // Update local state first (optimistic update)
      setPatients((prevPatients) =>
        prevPatients.filter(
          (p) => p.appointmentId !== patientToCancel.appointmentId
        )
      );

      // Then update all clients via WebSocket
      if (socket?.connected) {
        socket.emit("fetchAppointments", selectedScheduleId);
      } else {
        console.warn(
          "WebSocket disconnected, changes won't be synchronized automatically"
        );
        // Fetch appointments manually as fallback
        await fetchAppointments(selectedScheduleId);
      }

      // Show success toast
      toast({
        title: "Appointment Cancelled",
        description: `Appointment for ${patientToCancel.name} has been cancelled.`,
        variant: "default",
      });
    } catch (error) {
      // Handle different error types
      if (axios.isAxiosError(error)) {
        // Network or server errors (typed Axios errors)
        if (error.response) {
          // Server returned error response (4xx, 5xx)
          const status = error.response.status;
          const errorMessage =
            error.response.data?.message || "Unknown server error";

          console.error(
            `Server error (${status}) cancelling appointment:`,
            error.response.data
          );
          setError(
            status >= 500
              ? "Server error. Please try again later."
              : `Failed to cancel appointment: ${errorMessage}`
          );
        } else if (error.request) {
          // Request made but no response received
          console.error("Network error cancelling appointment:", error.message);
          setError(
            "Network error. Please check your connection and try again."
          );
        } else {
          // Error in request configuration
          console.error("Error preparing request:", error.message);
          setError("An error occurred. Please try again.");
        }
      } else {
        // Generic error handling
        console.error("Unexpected error cancelling appointment:", error);
        setError("An unexpected error occurred. Please try again.");
      }

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Hide loading indicator
      setShowTopLoader(false);
    }
  };

  const autoSchedulePatient = async (patient: Patient) => {
    if (!patient.appointmentId) {
      console.error("Cannot reschedule patient: Missing appointmentId");
      alert("Cannot reschedule patient: Missing appointment information");
      return;
    }

    if (!selectedScheduleId) {
      console.error("Cannot reschedule: Missing scheduleId");
      alert("System error: Missing schedule information");
      return;
    }

    try {
      // Show loading indicator
      setShowTopLoader(true);
      console.log(
        `Rescheduling patient: ${patient.name}, appointmentId: ${patient.appointmentId}`
      );

      // Call the API endpoint to reschedule the skipped patient - use the same base URL as other successful API calls
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/autoreschedule/${selectedScheduleId}/${patient.appointmentId}`
      );

      console.log("Rescheduling response:", response.data);

      // Trigger WebSocket update to refresh the appointments for all clients
      if (socket?.connected) {
        console.log("Emitting WebSocket update after rescheduling patient");
        socket.emit("fetchAppointments", selectedScheduleId);
      } else {
        console.warn("WebSocket disconnected, fetching appointments manually");
        // Fallback - manually fetch appointments if WebSocket isn't connected
        await fetchAppointments(selectedScheduleId);
      }

      // Show success toast
      toast({
        title: "Patient Rescheduled",
        description: `${patient.name} has been rescheduled.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to reschedule patient:", error);

      // Show appropriate error message based on response
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message || "Unknown error occurred";
        console.error("Server error details:", error.response.data);
        alert(`Failed to reschedule patient: ${errorMessage}`);
      } else {
        alert("Failed to reschedule patient. Please try again.");
      }

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to reschedule patient. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Hide loading indicator
      setShowTopLoader(false);
    }
  };
  const skipPatient = async (scheduleId: string, appointmentId: string) => {
    console.log(
      "Skipping patient - scheduleId:",
      scheduleId,
      "appointmentId:",
      appointmentId
    );

    if (!scheduleId || !appointmentId) {
      console.error("Cannot skip patient: Missing scheduleId or appointmentId");
      alert("Cannot skip patient: Missing required information");
      return;
    }

    try {
      setShowTopLoader(true); // Show loading indicator

      type ApiError = {
        response?: {
          data?: { message?: string };
          status?: number;
        };
        message?: string;
      };
      // Modify the URL to include appointmentId in the path
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/skip/${scheduleId}/${appointmentId}`,
        {
          status: "skipped",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Skip response:", response.data);
      console.log("📡 Emitting WebSocket update after skipping patient...");
      socket?.emit("fetchAppointments", scheduleId);

      // Show success toast
      toast({
        title: "Patient Skipped",
        description: `Patient with appointment ID ${appointmentId} has been skipped.`,
        variant: "default",
      });
    } catch (err: unknown) {
      console.error("Error skipping patient:", err);

      // Type guard function to check if the error is an Axios error
      const isAxiosError = (
        error: unknown
      ): error is {
        response?: {
          data?: { message?: string };
          status?: number;
        };
      } => {
        return (
          typeof error === "object" && error !== null && "response" in error
        );
      };

      // Type guard function to check if the error has a message property
      const hasMessage = (error: unknown): error is { message: string } => {
        return (
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof (error as { message: string }).message === "string"
        );
      };

      if (isAxiosError(err) && err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        const errorMessage =
          err.response.data?.message || "Unknown error occurred";
        alert(`Failed to skip patient: ${errorMessage}`);
      } else if (hasMessage(err)) {
        alert(`Failed to skip patient: ${err.message}`);
      } else {
        alert("Failed to skip patient: An unknown error occurred");
      }

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to skip patient. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowTopLoader(false); // Hide loading indicator
    }
  };

  const handleStartServing = async (selectedScheduleId: string) => {
    try {
      // First mark the current patient as completed
      setShowTopLoader(true);
      // Then call the next patient
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/callnextpatient/${selectedScheduleId}`
      );

      // The server + WebSocket will update the state

      // Show success toast
      toast({
        title: "Next Patient Called",
        description: "The next patient has been called.",
        variant: "default",
      });
    } catch (err) {
      setShowTopLoader(false);
      console.error("Error processing patients:", err);
      setError(
        "Failed to update patient status and call next patient. Please try again."
      );

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to call next patient. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowTopLoader(false);
    }
  };

  const handleFinishServing = async (selectedScheduleId: string) => {
    setProcessing(true);
    startTopLoader();
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/finish/${selectedScheduleId}`
      );
      // The server auto-calls the next patient; WebSocket updates your UI

      // Show success toast
      toast({
        title: "Consultation Finished",
        description: "The consultation has been finished.",
        variant: "default",
      });
    } catch (err) {
      console.error("Error finishing serving patient:", err);
      setError("Failed to finish serving the patient. Please try again.");

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to finish consultation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      setShowTopLoader(false);
    }
  };

  const handleFinish = async (selectedScheduleId: string) => {
    setProcessing(true);
    startTopLoader(); // Start top loader
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/serve/${selectedScheduleId}`
      );
      // The server auto-calls the next patient; WebSocket updates your UI

      // Show success toast
      toast({
        title: "Next Patient Called",
        description: "The next patient has been called.",
        variant: "default",
      });
    } catch (err) {
      console.error("Error calling next patient:", err);
      setError("Failed to call the next patient. Please try again.");

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to call next patient. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      setShowTopLoader(false);
    }
  };
  // Determine the "Current Queue" number
  const lastCompletedPatient = [...Patients]
    .filter((p) => p.status === "completed")
    .sort((a, b) => {
      if (!a.timeCompleted || !b.timeCompleted) return 0;
      return (
        new Date(b.timeCompleted).getTime() -
        new Date(a.timeCompleted).getTime()
      );
    })[0];

  const currentQueueNumber = currentPatient
    ? currentPatient.queueNumber // If serving, show current patient queue number
    : lastCompletedPatient
    ? lastCompletedPatient.queueNumber // If no one is serving, show last completed patient
    : "-"; // If no patients have been served yet, show "-"
  const [bookingStatusLoading, setBookingStatusLoading] = useState(false);
  const [nextAvailableSchedule, setNextAvailableSchedule] = useState<Date | undefined>(undefined);
  const [showCapacityWarning, setShowCapacityWarning] = useState(false);
  const [capacityLimit, setCapacityLimit] = useState(0);
  const [remainingCapacity, setRemainingCapacity] = useState(0);

  // ...existing code...

  // Calculate remaining capacity and show warning if approaching limit
  useEffect(() => {
    // This would come from your API in production
    const totalCapacity = queueStatus?.totalLimit || 0;
    const totalQueue = queueStatus?.totalQueue || 0;
    
    const remaining = totalCapacity - totalQueue;
    setRemainingCapacity(remaining);
    
    // Show warning if 5 or fewer slots remain
    setShowCapacityWarning(remaining > 0 && remaining <= 5);
    setCapacityLimit(totalCapacity);
    
  }, [queueStatus]);

  // Fetch next available schedule date/time when booking window is closed
  useEffect(() => {
    if (settings.onlineAppointments === false) {
      // This would be a real API call in production
      // For now we'll just use a dummy future date for demonstration
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0); // 10:00 AM tomorrow
      setNextAvailableSchedule(tomorrow);
    }
  }, [settings.onlineAppointments]);
  
  // Function to handle editing the schedule
  const handleEditSchedule = () => {
    // Navigate to settings page or open settings dialog
    console.log("Navigating to schedule settings");
    // Example: router.push("/admin/settings");
  };

  const handleCapacityWarningDismiss = () => {
    setShowCapacityWarning(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div>
        {/* Top Moving Loader */}
        {showTopLoader && (
          <div className="relative w-full h-1 bg-gray-200 overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1/4 bg-primary animate-smooth-moving-loader"></div>
          </div>
        )}
        {/* ✅ Top Moving Loader */}
        {showTopLoaders && (
          <div className="relative w-full h-1 bg-gray-200 overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1/4 bg-primary animate-smooth-moving-loader"></div>
          </div>
        )}
      </div>
      
      {/* Notification Header */}
      <NotificationHeader
        title=""
        isConnected={isConnected}
        onReconnect={() => socket?.connect()}
        bookingWindowOpen={settings.onlineAppointments}
        onEditSchedule={handleEditSchedule}
        nextScheduleDate={nextAvailableSchedule}
      />
      
      {/* Capacity Warning Notification */}
      <NotificationBanner
        type="warning"
        show={showCapacityWarning}
        onDismiss={handleCapacityWarningDismiss}
        message={`Queue is approaching capacity limit! Only ${remainingCapacity} ${remainingCapacity === 1 ? 'slot' : 'slots'} remaining out of ${capacityLimit}.`}
        
        
      />
      
      
      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-6 overflow-y-scroll">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex flex-row gap-4 items-center mb-1">
                  <h2 className="text-md font-semibold">
                    Patient Queue Of - {todayDate}
                  </h2>

                  <div className="flex gap-2 items-center">
                    {/* Connection Status Indicator */}
                    <div className="flex items-center gap-1">
                      {isConnected ? (
                        <CircleCheck className="w-4 h-4 text-green-500" />
                      ) : (
                        <CircleAlert className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {isConnected ? (
                          <>
                            <div className="text-green-500">Online</div>
                          </>
                        ) : (
                          <>
                            <div className="text-red-500">Offline</div>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Retry Button (Only when offline) */}
                    {!isConnected && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => socket?.connect()} // ✅ Retry Connection
                      >
                        Reconnect
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Information Information Information Information
                </p>
              </div>
              {/* ✅ Show Queue Status */}
              {/* Online Booking Toggle */}
              <div className="mt-4">
                <h3 className="text-md font-medium">Online Booking</h3>
                <p className="text-sm text-gray-500">
                  Current booking window status:
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  {/* 
                    Switch disabled - viewing only 
                    The switch will be green when booking window is open
                  */}
                  <Switch
                    checked={settings?.onlineAppointments ?? false}
                    disabled={true} // Disable toggling
                  />
                  <span className="text-sm text-gray-700">
                    {settings?.onlineAppointments ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="text-sm  flex flex-row gap-1 items-center justify-center border border-gray-200 font-normal rounded-md p-2 ">
                  <User size="18"></User>
                  Current Queue{" "}
                  <span className="font-medium">
                    {queueStatus?.currentQueue ?? "Loading..."}
                  </span>
                </div>
                <div className="text-sm  flex flex-row gap-1 items-center justify-center border border-gray-200 font-normal rounded-md p-2 ">
                  <UsersRound size="18"></UsersRound>
                  Total Queue{" "}
                  <span className="font-medium">
                    {queueStatus?.totalQueue ?? "Loading..."}
                  </span>
                </div>
                <div className="text-sm  flex flex-row gap-1 items-center justify-center border border-gray-200 font-normal rounded-md p-2">
                  <Clock size="18"></Clock>
                  Waiting{" "}
                  <span className="font-medium">
                    {Patients.filter((p) => p.status === "waiting").length}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  className="pl-9"
                  placeholder="Search Patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Tabs
                value={currentTab}
                onValueChange={setCurrentTab}
                className="space-x-2"
              >
                <TabsList>
                  <TabsTrigger value="live" className="">
                    Live Queue
                  </TabsTrigger>
                  <TabsTrigger value="skipped">Skipped Patients</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-4 mb-16">
              {currentTab === "live" && (
                <>
                  {currentPatient && (
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full"
                      defaultValue="serving"
                    >
                      <AccordionItem value="serving">
                        <AccordionTrigger className="text-sm">
                          Currently Serving (1)
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="bg-primary-accent p-2 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full flex items-center font-bold justify-center text-sm">
                                {currentPatient.queueNumber}
                              </div>
                              <div className="flex-1 text-sm grid grid-cols-4">
                                <div className="text-sm">
                                  {currentPatient.name}
                                </div>
                                <div className="text-sm">
                                  Phone: {currentPatient.phone}
                                </div>
                                <div className="text-sm">
                                  Age: {currentPatient.age}
                                </div>
                                <div className="text-sm">
                                  Gender: {currentPatient.gender}
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue="waiting"
                  >
                    <AccordionItem value="waiting">
                      <AccordionTrigger className="text-sm">
                        <div className="flex flex-row items-center gap-2">
                          Waiting
                          <p className=" flex text-white text-sm h-6 w-6 items-center justify-center  rounded-full bg-primary">
                            {
                              filteredPatients.filter(
                                (p) => p.status === "waiting"
                              ).length
                            }
                          </p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm pt-4">
                        {filteredPatients.filter((p) => p.status === "waiting")
                          .length > 0 ? (
                          <div className="rounded-md border-0">
                            <Table className="[&_tr]:border-0 h-4">
                              <TableHeader className=" pb-1 mb-1">
                                <TableRow>
                                  <TableHead className="text-sm w-[80px]">
                                    Queue
                                  </TableHead>
                                  <TableHead className="text-sm">
                                    Name
                                  </TableHead>
                                  <TableHead className="text-sm">
                                    Phone
                                  </TableHead>
                                  <TableHead className="text-sm">Age</TableHead>
                                  <TableHead className="text-sm">
                                    Gender
                                  </TableHead>
                                  <TableHead className="text-sm w-[80px]">
                                    Actions
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredPatients
                                  .filter((p) => p.status === "waiting")
                                  .map((patient) => (
                                    <TableRow key={patient.id}>
                                      <TableCell className="text-sm">
                                        <div className="w-8 h-8 rounded-full  flex items-center justify-center font-bold text-sm">
                                          {patient.queueNumber}
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-sm font-medium">
                                        {patient.name}
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {patient.phone}
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {patient.age}
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {patient.gender}
                                      </TableCell>
                                      <TableCell>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                              <MoreVertical className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                              onClick={() => {
                                                console.log(
                                                  "scheduleId:",
                                                  selectedScheduleId
                                                );
                                                console.log(
                                                  "Patient data:",
                                                  patient
                                                );

                                                if (
                                                  !selectedScheduleId ||
                                                  !patient.appointmentId
                                                ) {
                                                  console.error(
                                                    "Cannot skip patient: Missing appointmentId in patient data"
                                                  );
                                                  alert(
                                                    "Cannot skip: Missing appointment information"
                                                  );
                                                  return;
                                                }

                                                console.log(
                                                  "Skipping patient with appointmentId:",
                                                  patient.appointmentId
                                                );
                                                skipPatient(
                                                  selectedScheduleId,
                                                  patient.appointmentId
                                                );
                                              }}
                                            >
                                              <SkipForward></SkipForward>
                                              Skip Appointment
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() =>
                                                cancelAppointment(patient)
                                              }
                                              className="text-red-500 hover:text-red-500"
                                            >
                                              <CalendarX2 className="text-red-500"></CalendarX2>
                                              <span className="text-red-500 hover:text-red-600 text-sm">
                                                Cancel Appointment
                                              </span>
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-md">
                            No patients waiting in queue
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </>
              )}

              {currentTab === "skipped" && (
                <div>
                  {filteredPatients.length > 0 ? (
                    <div className="space-y-2">
                      {filteredPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className="p-2 rounded-lg  flex justify-between items-center"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full flex items-center font-bold justify-center text-sm">
                              {patient.queueNumber}
                            </div>
                            <div className="flex-1 text-sm grid grid-cols-4">
                              <div className="text-sm">{patient.name}</div>
                              <div className="text-sm">
                                Phone: {patient.phone}
                              </div>
                              <div className="text-sm">Age: {patient.age}</div>
                              <div className="text-sm">
                                Gender: {patient.gender}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="default"
                            onClick={() => autoSchedulePatient(patient)}
                          >
                            <History></History>
                            Auto Schedule
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No skipped patients
                    </div>
                  )}
                </div>
              )}

              {currentTab === "completed" && (
                <div className="mb-28">
                  {filteredPatients.length > 0 ? (
                    <div className="space-y-2">
                      {filteredPatients.map((patient) => (
                        <div key={patient.id} className="p-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center font-bold justify-center text-sm">
                              {patient.queueNumber}
                            </div>
                            <div className="flex-1 text-sm grid grid-cols-4">
                              <div className="text-sm">{patient.name}</div>
                              <div className="text-sm">
                                Phone: {patient.phone}
                              </div>
                              <div className="text-sm">Age: {patient.age}</div>
                              <div className="text-sm">
                                Gender: {patient.gender}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No completed consultations
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirmation Dialog for Cancel */}
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Appointment</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cancel this patient&apos;s
                    appointment?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCancelDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="default" onClick={confirmCancel}>
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-[72px] right-0 p-4 bg-background border-t flex items-center justify-between">
              {currentPatient ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      {currentPatient.queueNumber}
                    </div>
                    <div>
                      <div className="font-medium">{currentPatient.name}</div>
                      <div className="text-sm font-bold  text-primary">
                        Serving
                      </div>
                      {/* <div className="text-sm text-muted-foreground">
                        Phone Number: {currentPatient.phone}
                      </div> */}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (
                          currentPatient?.appointmentId &&
                          selectedScheduleId
                        ) {
                          skipPatient(
                            selectedScheduleId,
                            currentPatient.appointmentId
                          );
                        } else {
                          console.error(
                            "Cannot skip: Missing appointmentId or scheduleId"
                          );
                          alert(
                            "Cannot skip patient: Missing required information"
                          );
                        }
                      }}
                      disabled={!currentPatient || !selectedScheduleId}
                      className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <SkipForward></SkipForward>
                      Skip Patient
                    </Button>
                    <Button
                      variant="default"
                      onClick={() =>
                      handleFinishServing(selectedScheduleId || "")
                      .finally(() => setProcessingFinish(false))
                      }
                      className=""
                      disabled={processingFinish}
                    >
                      {processingFinish ? (
                      <>
                        Ending Consultation...
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      </>
                      ) : (
                      <>
                        <CheckCheck className="mr-2" />
                        Finish Consultation
                      </>
                      )}
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => {
                      setProcessingNext(true);
                      handleStartServing(selectedScheduleId || "")
                        .finally(() => setProcessingNext(false));
                      }}
                      disabled={processingNext || !Patients.some(p => p.status === "waiting")}
                    >
                      {processingNext ? (
                      <>
                        Calling Next Patient...
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      </>
                      ) : (
                      <>
                        Next Patient
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full flex justify-end">
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => handleFinish(selectedScheduleId || "")}
                    disabled={processing || !Patients.some(p => p.status === "waiting")}
                  >
                    {processing ? (
                      <>
                        Calling Next Patient...
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      </>
                    ) : (
                      <>
                        Call Next Patient
                        <ArrowRight></ArrowRight>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-[400px] border-l p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-md font-semibold ">Add Patient</h2>
                <p className="text-sm text-muted-foreground">
                  Information Information Information Information
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <div className="flex gap-2 mt-1">
                  <div className="flex-1 flex">
                    <div className="flex items-center justify-center px-3 border border-r-0 border-input rounded-l-md">
                      +91
                    </div>
                    <Input
                      placeholder="Enter 10-digit mobile number"
                      value={newPatient.phone}
                      onChange={(e) => {
                        // Only allow digits
                        const value = e.target.value.replace(/\D/g, '');
                        // Limit to 10 digits
                        const sanitizedValue = value.slice(0, 10);
                        setNewPatient((prev) => ({
                          ...prev,
                          phone: sanitizedValue,
                        }));
                      }}
                      className="rounded-l-none"
                    />
                  </div>
                  <Button 
                    onClick={verifyPatient} 
                    disabled={loading || newPatient.phone.length !== 10}
                  >
                    {loading ? (
                      <>
                        Verifying
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      </>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
                {newPatient.phone.length > 0 && newPatient.phone.length !== 10 && error && (
                  <p className="text-xs text-red-500 mt-1">Please enter a valid 10-digit phone number</p>
                )}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Render the form fields */}
              {verifiedPatients ? (
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    className="mt-1"
                    placeholder="Enter Patient's Name"
                    value={newPatient.name}
                    onChange={(e) =>
                      setNewPatient((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    disabled={!verifiedPatients} // Disable if patient is verified
                  />
                  <div className="grid grid-cols-2 mt-1 gap-4">
                    <div>
                      <label className="text-sm font-medium">Gender</label>
                      <Select
                        value={newPatient.gender}
                        onValueChange={(value) =>
                          setNewPatient((prev) => ({
                            ...prev,
                            gender: value,
                          }))
                        }
                        disabled={!verifiedPatients} // Disable if patient is verified
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Date Of Birth
                      </label>
                      <Input
                        className="mt-1"
                        type="date"
                        value={newPatient.dob}
                        onChange={(e) =>
                          setNewPatient((prev) => ({
                            ...prev,
                            dob: e.target.value,
                          }))
                        }
                        disabled={!verifiedPatients} // Disable if patient is verified
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <Button
                className="w-full mt-6"
                variant="default"
                onClick={async () => {
                  await addPatient();
                  // Reset form after successful addition
                  setNewPatient({
                    phone: "",
                    name: "",
                    gender: "male",
                    dob: ""
                  });
                  setVerifiedPatients(false);
                  setVerifiedPatient(null);
                }}
                disabled={
                  !verifiedPatients ||
                  !newPatient.name ||
                  !newPatient.phone ||
                  loadings
                }
              >
                {loadings ? (
                  <>Adding Patient...</>
                ) : (
                  <>Add Patient</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
