import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}`; // Update if needed

export function useWebSocket(scheduleId: string) {
  const [patients, setPatients] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentPatient, setCurrentPatient] = useState<any | null>(null);
  const [showTopLoaders, setShowTopLoaders] = useState(false);

  // ✅ State to Store Queue Status
  const [queueStatus, setQueueStatus] = useState<{
    currentQueue: number;
    totalQueue: number;
  }>({
    currentQueue: 0,
    totalQueue: 0,
  });

  // ✅ Function to calculate age properly
  const calculateAge = (dob: string | null) => {
    if (!dob) return "N/A";
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

    // ✅ Listen for queue status updates
    newSocket.on(`queue-updated-${scheduleId}`, (data) => {
      console.log("🔄 Queue Status Update Received:", data);

      // ✅ Check if data is valid
      if (
        !data ||
        typeof data.currentQueue === "undefined" ||
        typeof data.totalQueue === "undefined"
      ) {
        console.error("❌ Invalid queue status data received:", data);
        return;
      }

      // ✅ Update Queue Status
      setQueueStatus({
        currentQueue: data.currentQueue ?? 0,
        totalQueue: data.totalQueue ?? 0,
      });

      console.log(
        "✅ Updated Queue Status:",
        data.currentQueue,
        data.totalQueue
      );
    });

    // ✅ Listen for appointment updates
    newSocket.on("appointmentsUpdated", (updatedAppointments) => {
      console.log("🔄 Received real-time updates:", updatedAppointments);

      if (!Array.isArray(updatedAppointments)) {
        console.error("❌ Invalid WebSocket data:", updatedAppointments);
        setShowTopLoaders(false); // ✅ Stop loader if data is invalid
        return;
      }

      // ✅ Format and clean WebSocket data
      const formattedPatients = updatedAppointments.map((appointment: any) => {
        const patient = appointment.patient || {};
        return {
          id: patient.id || "Unknown ID",
          appointmentId: appointment.id || "Unknown Appointment ID", // Added appointmentId
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

      // ✅ Ensure serving patient is correctly set
      const servingPatient = formattedPatients.find(
        (p) => p.status === "serving"
      );

      if (servingPatient) {
        setCurrentPatient({
          id: servingPatient.id,
          appointmentId: servingPatient.appointmentId,
          name: servingPatient.name,
          phone: servingPatient.phone,
          age: servingPatient.age,
          gender: servingPatient.gender, // ✅ Now gender is correctly included
          queueNumber: servingPatient.queueNumber,
          status: "serving",
          timeStarted: servingPatient.timeStarted || new Date(), // Default if missing
        });
        console.log("✅ Updated currentPatient:", servingPatient);
      } else {
        setCurrentPatient(null);
      }

      // ✅ Stop loader when data is received
      if (formattedPatients.length > 0) {
        setShowTopLoaders(false);
      } else {
        // ✅ If no data, stop loader after a short delay
        setTimeout(() => setShowTopLoaders(false), 2000);
      }
    });

    // ✅ FIX: Attach queue update listener dynamically per scheduleId
    const queueEventName = `queue-updated-${scheduleId}`;
    newSocket.on(queueEventName, (data) => {
      console.log(`🔄 Queue Status Update Received for ${scheduleId}:`, data);
      setQueueStatus({
        currentQueue: data.currentQueue ?? 0,
        totalQueue: data.totalQueue ?? 0,
      });
    });

    return () => {
      console.log("❌ Disconnecting WebSocket");
      newSocket.off(queueEventName);
      newSocket.disconnect(); // Clean up when component unmounts
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
