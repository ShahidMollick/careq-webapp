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
  Calendar,
  X,
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

// Add a new interface for family members
interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  gender: string;
  dob: string;
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
  const [verificationLoading, setVerificationLoading] = useState(false);  

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

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<string | null>(null);
  const [familyMemberFormData, setFamilyMemberFormData] = useState({
    name: "",
    relationship: "spouse",
    gender: "male",
    dob: "",
  });
  const [activeTab, setActiveTab] = useState("self");

  console.log("the schedule that is selected is ", selectedScheduleId);
  const {
    patients: livePatients,
    socket,
    isConnected,
    currentPatient,
    showTopLoaders,
    queueStatus,
  } = useWebSocket(selectedScheduleId || "");
  // Add this utility function near the top of the component
  const extractErrorMessage = (error: unknown): string => {
    // Case 1: Axios error with response data
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data?.message || `Error: ${error.response.status} ${error.response.statusText}`;
    }
    // Case 2: Error object with message property
    else if (error instanceof Error) {
      return error.message;
    }
    // Case 3: Unknown error type
    return "An unexpected error occurred";
  };

  useEffect(() => {
    const fetchBookingStatus = async () => {
      if (!selectedScheduleId) {
        console.warn("⚠ No schedule selected, skipping fetch.");
        return;
      }
      console.log(
        `📡 Fetching booking status for schedule: ${selectedScheduleId}`
      );
      setLoading(true); // Show loading state
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/${selectedScheduleId}/bookingStatus`;
        console.log(`🔗 API Request URL: ${apiUrl}`);
        const response = await axios.get(apiUrl);
        const { data } = response;
        if (data && typeof data.bookingWindow === "boolean") {
          console.log(`✅ Booking status received: ${data.bookingWindow}`);
          setSettings((prev) => ({
            ...prev,
            onlineAppointments: data.bookingWindow,
          }));
          // Update allowOnlineBooking state to match backend data
          setAllowOnlineBooking(data.bookingWindow ? "yes" : "no");
        } else {
          console.warn("⚠ Invalid booking status structure:", data);
          setError("Unable to determine booking status");
        }
      } catch (error) {
        console.error("❌ Error fetching booking status:", error);
        setError(extractErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    // Force fetch on component mount and when selectedScheduleId changes
    console.log(
      "🔄 Booking status effect triggered, scheduleId:",
      selectedScheduleId
    );
    fetchBookingStatus();
    // Setup a refresh interval (every 30 seconds)
    const intervalId = setInterval(fetchBookingStatus, 30000);
    return () => clearInterval(intervalId);
  }, [selectedScheduleId]);

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
  useEffect(() => {
    console.log("Dialog open state changed:", cancelDialogOpen);
  }, [cancelDialogOpen]);
  

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
    if (!scheduleId) {
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
      setError(extractErrorMessage(error));
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

        // Show success toast for patient found
        toast({
          title: "Patient Found",
          description: `${patient.name} was found in our records.`,
          variant: "default",
        });
      } else {
        console.log("Patient not found with phone:", newPatient.phone);
        setVerifiedPatient(null); // Clear verification state
        
        // Show info toast for new patient verification state
        toast({
          title: "New Patient",
          description: "Patient not found. Please enter details to create a new patient.",
          variant: "info",
        });
        setNewPatient({
          phone: newPatient.phone, // Retain the entered phone number
          name: "",
          gender: "male", // Default gender
          dob: "",
        });
      }
    } catch (error) {
      console.error("Error occurred during patient verification:", error);
      // Show error toast instead of setting error state
      toast({
        title: "Verification Failed",
        description: extractErrorMessage(error),
        variant: "destructive",
      });
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
      // Retrieve schedule ID (e.g., from state or context)
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
      // Show error toast with backend message
      toast({
        title: "Error",
        description: extractErrorMessage(error),
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
    // Retrieve schedule ID from local storage or state
    if (!scheduleId) {
      console.error("❌ BookingStatusChange failed: No scheduleId available");
      return;
    }
    console.log(
      `🔄 Starting booking window toggle for schedule ID: ${scheduleId}`
    );
    console.log(`📊 Current booking status: ${allowOnlineBooking}`);

    // Define startTime at the function level so it's available in try and catch blocks
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
      // Show error to user with backend message
      setError(extractErrorMessage(error));
    }
  };

  
const cancelAppointment = (patient: Patient) => {
  // Set patient data first before opening dialog to avoid race conditions
  setSelectedPatientForCancel(patient);
  // Use setTimeout to ensure state updates are processed before opening dialog
  setTimeout(() => setCancelDialogOpen(true), 0);
};

const confirmCancel = async () => {
  // Create local reference to avoid issues with state changes during async operation
  const patientToCancel = selectedPatientForCancel;
  const currentScheduleId = selectedScheduleId;
  
  if (!patientToCancel?.appointmentId || !currentScheduleId) {
    setError("Missing appointment details.");
    // Always close dialog even if validation fails
    setCancelDialogOpen(false);
    setSelectedPatientForCancel(null);
    return;
  }
  
  // Close dialog immediately to prevent UI freezing
  setCancelDialogOpen(false);
  
  setShowTopLoader(true);
  setError("");

  try {
    const cancelUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/cancelappointment/${currentScheduleId}/${patientToCancel.appointmentId}`;
    console.log("Cancelling appointment:", cancelUrl);

    const response = await axios.patch(cancelUrl);

    // Update local state
    setPatients((prev) =>
      prev.filter((p) => p.appointmentId !== patientToCancel.appointmentId)
    );

    // Refresh data via WebSocket or API
    if (socket?.connected) {
      socket.emit("fetchAppointments", currentScheduleId);
    } else {
      console.warn("WebSocket disconnected, fetching manually...");
      await fetchAppointments(currentScheduleId);
    }

    toast({
      title: "Appointment Cancelled",
      description: `Appointment for ${patientToCancel.name} has been cancelled.`,
      variant: "default",
    });

  } catch (error) {
    handleCancellationError(error);
  } finally {
    setShowTopLoader(false);
    // Clean up patient reference
    setSelectedPatientForCancel(null);
  }
};

const handleCancellationError = (error) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      setError(error.response.data?.message || "Server error. Try again.");
    } else if (error.request) {
      setError("Network issue. Please try again.");
    } else {
      setError("Unexpected error occurred.");
    }
  } else {
    setError("An error occurred. Please try again.");
  }
  toast({ title: "Error", description: "Failed to cancel appointment. Please try again.", variant: "destructive" });
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
      // Show appropriate error message from backend
      setError(extractErrorMessage(error));
      // Show error toast
      toast({
        title: "Error",
        description: extractErrorMessage(error),
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
    } catch (error) {
      console.error("Error skipping patient:", error);
      // No need for complex type guards with our utility function
      alert(extractErrorMessage(error));
      // Show error toast
      toast({
        title: "Error",
        description: extractErrorMessage(error),
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
    } catch (error) {
      setShowTopLoader(false);
      console.error("Error processing patients:", error);
      setError(extractErrorMessage(error));
      // Show error toast
      toast({
        title: "Error",
        description: extractErrorMessage(error),
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
    } catch (error) {
      console.error("Error finishing serving patient:", error);
      setError(extractErrorMessage(error));
      // Show error toast
      toast({
        title: "Error",
        description: extractErrorMessage(error),
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
    } catch (error) {
      console.error("Error calling next patient:", error);
      setError(extractErrorMessage(error));
      // Show error toast
      toast({
        title: "Error",
        description: extractErrorMessage(error),
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
  const [nextAvailableSchedule, setNextAvailableSchedule] = useState<
    Date | undefined
  >(undefined);
  const [showCapacityWarning, setShowCapacityWarning] = useState(false);
  const [capacityLimit, setCapacityLimit] = useState(0);
  const [remainingCapacity, setRemainingCapacity] = useState(0);

  // ...existing code...

  // Calculate remaining capacity and show warning if approaching limit
  useEffect(() => {
    // This would come from your API in production
    const totalCapacity = queueStatus && 'totalLimit' in (queueStatus as Record<string, unknown>) 
      ? (queueStatus as Record<string, number>).totalLimit 
      : 0;
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

  // Function to add a new family member
  const addFamilyMember = () => {
    // Validate form data
    if (!familyMemberFormData.name || !familyMemberFormData.dob) {
      toast({
        title: "Missing Information",
        description: "Please provide name and date of birth.",
        variant: "destructive",
      });
      return;
    }
    // Create new family member object
    const newMember: FamilyMember = {
      id: `member-${Date.now()}`,
      name: familyMemberFormData.name,
      relationship: familyMemberFormData.relationship,
      gender: familyMemberFormData.gender,
      dob: familyMemberFormData.dob,
    };
    // Add to family members array
    setFamilyMembers(prev => [newMember, ...prev]);
    // Show success toast
    toast({
      title: "Family Member Added",
      description: `${newMember.name} has been added as a family member.`,
      variant: "default",
    });
    // Reset form
    setFamilyMemberFormData({
      name: "",
      relationship: "spouse",
      gender: "male",
      dob: "",
    });
    // Hide form
    setShowFamilyForm(false);
  };

  // Function to select a family member for appointment
  const selectFamilyMember = (memberId: string) => {
    setSelectedFamilyMember(memberId);
    // Find the selected family member and apply their info to the newPatient state
    const selectedMember = familyMembers.find(member => member.id === memberId);
    if (selectedMember) {
      setNewPatient(prev => ({
        ...prev,
        name: selectedMember.name,
        gender: selectedMember.gender,
        dob: selectedMember.dob,
      }));
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
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
        message={`Queue is approaching capacity limit! Only ${remainingCapacity} ${
          remainingCapacity === 1 ? "slot" : "slots"
        } remaining out of ${capacityLimit}.`}
      />
      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-6 overflow-y-scroll">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex flex-row gap-4 items-center mb-1">
                  <div className="flex items-center">
                    <h2 className="text-md font-semibold mr-2">
                      Patient Queue
                    </h2>
                    {/* Connection Status Indicator
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
                    </div> */}
                  </div>
                </div>
                <div className="flex gap-2 items-center mt-2">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full border border-gray-200 bg-gray-50 text-sm font-medium">
                    <span className="text-gray-500 text-sm gap-2 mr-1 flex flex-row items-center"><Calendar size='16'></Calendar> Today:</span>
                    {new Date().toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
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
              {/* ✅ Show Queue Status */}
              {/* Online Booking Toggle */}
              <div className="">
                <h3 className="text-md font-medium">Online Booking</h3>
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
                            {filteredPatients.filter(
                              (p) => p.status === "waiting"
                            ).length}
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
            <Dialog 
              open={cancelDialogOpen} 
              onOpenChange={(open) => {
                // If dialog is being closed, always clean up related state
                if (!open) {
                  setCancelDialogOpen(false);
                  // Use setTimeout to avoid state update conflicts
                  setTimeout(() => setSelectedPatientForCancel(null), 0);
                }
              }}
            >
              <DialogContent onEscapeKeyDown={() => setCancelDialogOpen(false)}>
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
                    onClick={() => {
                      setCancelDialogOpen(false);
                      setTimeout(() => setSelectedPatientForCancel(null), 0);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmCancel}>
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
                        handleFinishServing(selectedScheduleId || "").finally(
                          () => setProcessingFinish(false)
                        )
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
                        handleStartServing(selectedScheduleId || "").finally(
                          () => setProcessingNext(false)
                        );
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
                      <>Call Next Patient</>
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
                <h2 className="text-md font-semibold">Add Patient</h2>
                <p className="text-sm text-muted-foreground">
                  Add a new patient to the queue
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
                        value={
                          newPatient.phone.startsWith("+91 ")
                            ? newPatient.phone.slice(4)
                            : newPatient.phone
                        }
                        onChange={(e) => {
                          // Remove any non-digit characters
                          const value = e.target.value.replace(/\D/g, "");
                          // Limit to 10 digits
                          const sanitizedValue = value.slice(0, 10);
                          // Save with the +91 prefix and a space
                          setNewPatient((prev) => ({
                            ...prev,
                            phone: "+91 " + sanitizedValue,
                          }));
                          
                          // Clear error when user starts typing again
                          if (error && error.includes("phone")) {
                            setError("");
                          }
                        }}
                        className={`rounded-l-none ${newPatient.phone.length > 0 && newPatient.phone.length !== 14 ? "border-red-500" : ""}`}
                      />
                    </div>
                    <Button
                    onClick={() => {
                      const verifyWithLoading = async () => {
                      setVerificationLoading(true);
                      try {
                        await verifyPatient();
                      } finally {
                        setVerificationLoading(false);
                      }
                      };
                      verifyWithLoading();
                    }}
                    disabled={verificationLoading || (newPatient.phone.startsWith("+91 ") ? newPatient.phone.slice(4).length !== 10 : newPatient.phone.length !== 10)}
                    >
                    {verificationLoading ? (
                      <>
                      Verifying
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      </>
                    ) : (
                      "Verify"
                    )}
                    </Button>
                </div>
                {newPatient.phone.length > 0 &&
                  newPatient.phone.length !== 10 &&
                  error && (
                    <p className="text-xs text-red-500 mt-1">
                      Please enter a valid 10-digit phone number
                    </p>
                  )}
                </div>

              {/* Patient Form after Verification */}
              {verifiedPatients && (
                <div className="animate-in fade-in-50 duration-300">
                  {/* Show booking options (Self or Family Member) for all patients */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Booking for</label>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="self">Self</TabsTrigger>
                        <TabsTrigger value="family">Family Member</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    {/* Tab content using conditional rendering */}
                    <div className="mt-2">
                      {/* SELF TAB CONTENT */}
                      {activeTab === 'self' && (
                        <div className="p-2 border rounded-md mt-2">
                          {verifiedPatient ? (
                            // Existing verified patient
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{verifiedPatient.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {verifiedPatient.gender}, {calculateAge(verifiedPatient.dob)} years
                                </p>
                              </div>
                              <CircleCheck className="h-5 w-5 text-primary" />
                            </div>
                          ) : (
                            // New patient form (simplified)
                            <div className="space-y-3">
                              <label className="text-sm text-muted-foreground">
                                Enter your details to create a new patient record
                              </label>
                              <div>
                                <label className="text-sm font-medium">Full Name</label>
                                <Input
                                  className="mt-1"
                                  placeholder="Enter Your Name"
                                  value={newPatient.name}
                                  onChange={(e) =>
                                    setNewPatient((prev) => ({
                                      ...prev,
                                      name: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
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
                                  <label className="text-sm font-medium">Date Of Birth</label>
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
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* FAMILY MEMBER TAB CONTENT */}
                      {activeTab === 'family' && (
                        <div className="p-2 border rounded-md mt-2">
                          {verifiedPatient ? (
                            <div className="space-y-3">
                              {/* Add New Family Member Button */}
                              <Button 
                                variant="outline" 
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => setShowFamilyForm(true)}
                              >
                                <User className="h-4 w-4" />
                                Add New Family Member
                              </Button>

                              {/* Family Member Form - shown when showFamilyForm is true */}
                              {showFamilyForm && (
                                <div className="border rounded-md p-3 space-y-3 animate-in fade-in-50 slide-in-from-top-5 duration-300">
                                  <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-sm font-medium">New Family Member</h4>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => setShowFamilyForm(false)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input
                                      className="mt-1"
                                      placeholder="Enter Family Member's Name"
                                      value={familyMemberFormData.name}
                                      onChange={(e) => setFamilyMemberFormData(prev => ({
                                        ...prev,
                                        name: e.target.value
                                      }))}
                                    />
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-sm font-medium">Gender</label>
                                      <Select 
                                        value={familyMemberFormData.gender}
                                        onValueChange={(value) => setFamilyMemberFormData(prev => ({
                                          ...prev,
                                          gender: value
                                        }))}
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
                                      <label className="text-sm font-medium">Relationship</label>
                                      <Select 
                                        value={familyMemberFormData.relationship}
                                        onValueChange={(value) => setFamilyMemberFormData(prev => ({
                                          ...prev,
                                          relationship: value
                                        }))}
                                      >
                                        <SelectTrigger className="mt-1">
                                          <SelectValue placeholder="Select relation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="spouse">Spouse</SelectItem>
                                          <SelectItem value="child">Child</SelectItem>
                                          <SelectItem value="parent">Parent</SelectItem>
                                          <SelectItem value="sibling">Sibling</SelectItem>
                                          <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium">Date of Birth</label>
                                    <Input 
                                      className="mt-1" 
                                      type="date"
                                      value={familyMemberFormData.dob}
                                      onChange={(e) => setFamilyMemberFormData(prev => ({
                                        ...prev,
                                        dob: e.target.value
                                      }))} 
                                    />
                                  </div>
                                  
                                  <Button 
                                    className="w-full mt-2" 
                                    size="sm"
                                    onClick={addFamilyMember}
                                    disabled={!familyMemberFormData.name || !familyMemberFormData.dob}
                                  >
                                    Save Family Member
                                  </Button>
                                </div>
                              )}

                              {/* Family Members List */}
                              <div className="border rounded-md overflow-hidden">
                                <div className="p-2 border-b bg-muted/30">
                                  <h4 className="text-sm font-medium">Select Family Member</h4>
                                </div>
                                
                                <div className="divide-y max-h-[250px] overflow-y-auto">
                                  {familyMembers.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                      No family members added yet
                                    </div>
                                  ) : (
                                    familyMembers.map(member => (
                                      <div 
                                        key={member.id}
                                        className={`p-3 hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-between relative ${selectedFamilyMember === member.id ? 'bg-muted/50' : ''}`}
                                        onClick={() => selectFamilyMember(member.id)}
                                      >
                                        <div>
                                          <h5 className="font-medium text-sm">{member.name}</h5>
                                          <p className="text-xs text-muted-foreground">
                                            {member.relationship}, {calculateAge(member.dob)} years
                                          </p>
                                        </div>
                                        <div 
                                          className={`h-5 w-5 rounded-full border-2 transition-all duration-300 ease-in-out ${
                                            selectedFamilyMember === member.id ? 'border-primary' : 'border-primary/0'
                                          }`}
                                        />
                                        {selectedFamilyMember === member.id && (
                                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                                        )}
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="border rounded-md p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <CircleAlert className="h-5 w-5 text-amber-500" />
                                <h4 className="font-medium">Create Your Account First</h4>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                You need to create your account before adding family members. 
                                Please provide your details in the &ldquo;Self&rdquo; tab first and book 
                                an appointment. You can add family members for future appointments.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Add Patient Button */}
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
                        dob: "",
                      });
                      setVerifiedPatients(false);
                      setVerifiedPatient(null);
                      setSelectedFamilyMember(null); // Also reset family member selection
                    }}
                    disabled={
                      !newPatient.name ||
                      !newPatient.phone ||
                      loadings
                    }
                  >
                    {loadings ? (
                      <>
                        Adding Patient...
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      </>
                    ) : (
                      <>Add Patient</>
                    )}
                  </Button>
                  
                  {/* Add animation styles */}
                  <style jsx global>{`
                    @keyframes ripple {
                    0% {
                      opacity: 1;
                      transform: scale(0);
                    }
                    100% {
                      opacity: 0;
                      transform: scale(1.5);
                    }
                    }
                    .animate-ripple {
                    animation: ripple 1s ease-in-out;
                    }
                    #add-family-form.flex {
                    display: flex;
                    flex-direction: column;
                    opacity: 1 !important;
                    transform: scale(100%) !important;
                    }
                    [data-selected="true"] {
                    background-color: #f8f9fc;
                    position: relative;
                    }
                    [data-selected="true"]::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 3px;
                    background-color: var(--primary);
                    opacity: 1;
                    transition: opacity 300ms ease-in-out;
                    }
                  `}</style>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
