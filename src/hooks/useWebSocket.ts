import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

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



const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"; // ✅ Default to localhost if env is missing

export function useWebSocket(scheduleId: string) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [showTopLoaders, setShowTopLoaders] = useState(false);

  // ✅ Store Queue Status
  const [queueStatus, setQueueStatus] = useState<{ currentQueue: number; totalQueue: number }>({
    currentQueue: 0,
    totalQueue: 0,
  });

  // ✅ Function to Calculate Age
  const calculateAge = (dob: string | null) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    if (!scheduleId) return;

    console.log("📡 Initializing WebSocket Connection...");

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5, // Retry 5 times if disconnected
      reconnectionDelay: 3000, // Wait 3 seconds before retrying
    });

    setSocket(newSocket);
    setShowTopLoaders(true); // ✅ Start loader while fetching data

    newSocket.on("connect", () => {
      console.log("✅ WebSocket Connected");
      setIsConnected(true);

      // ✅ Fetch Initial Data
      console.log("📡 Requesting initial data...");
      newSocket.emit("fetchAppointments", scheduleId);
      newSocket.emit("schedule-queue-status", { scheduleId }); // ✅ Request Queue Status
    });

    newSocket.on("disconnect", () => {
      console.warn("❌ WebSocket Disconnected. Reconnecting...");
      setIsConnected(false);
    });

    // ✅ Listen for Queue Status Updates
    const queueEventName = `queue-updated-${scheduleId}`;
    newSocket.on(queueEventName, (data) => {
      console.log(`🔄 Queue Status Update Received for ${scheduleId}:`, data);

      if (!data || typeof data.currentQueue === "undefined" || typeof data.totalQueue === "undefined") {
        console.error("❌ Invalid queue status data received:", data);
        return;
      }

      // ✅ Update Queue Status
      setQueueStatus({
        currentQueue: data.currentQueue ?? 0,
        totalQueue: data.totalQueue ?? 0,
      });

      console.log("✅ Updated Queue Status:", data.currentQueue, data.totalQueue);
    });

    // ✅ Listen for Appointment Updates
    newSocket.on("appointmentsUpdated", (updatedAppointments) => {
      console.log("🔄 Received real-time updates:", updatedAppointments);

      if (!Array.isArray(updatedAppointments)) {
        console.error("❌ Invalid WebSocket data:", updatedAppointments);
        setShowTopLoaders(false); // ✅ Stop loader if data is invalid
        return;
      }

      // ✅ Format and Clean WebSocket Data
      const formattedPatients: Patient[] = updatedAppointments.map((appointment) => {
        const patient = appointment.patient || {};
        return {
          id: patient.id || "Unknown ID",
          appointmentId: appointment.id || "Unknown Appointment ID",
          queueNumber: appointment.queueNumber ?? "N/A",
          name: patient.name || "Unknown",
          phone: patient.phone || "N/A",
          age: calculateAge(patient.dob),
          gender: patient.gender || "N/A",
          status: appointment.status ?? "unknown",
          dob: patient.dob || "N/A",
          timeAdded: appointment.createdAt || new Date(),
          timeStarted: appointment.timeStarted || null,
          timeCompleted: appointment.timeCompleted || null,
        };
      });

      setPatients(formattedPatients);

      // ✅ Ensure Serving Patient is Set Correctly
      const servingPatient = formattedPatients.find((p) => p.status === "serving");

      if (servingPatient) {
        setCurrentPatient({
          ...servingPatient, // ✅ Ensures all required fields are included
        });
        console.log("✅ Updated currentPatient:", servingPatient);
      } else {
        setCurrentPatient(null);
      }

      // ✅ Stop Loader When Data is Received
      if (formattedPatients.length > 0) {
        setShowTopLoaders(false);
      } else {
        setTimeout(() => setShowTopLoaders(false), 2000);
      }
    });

    return () => {
      console.log("❌ Disconnecting WebSocket");
      newSocket.off(queueEventName);
      newSocket.disconnect(); // ✅ Cleanup when unmounting
    };
  }, [scheduleId]);

  return {
    patients,
    socket,
    isConnected,
    currentPatient,
    showTopLoaders,
    queueStatus,
  };
}
