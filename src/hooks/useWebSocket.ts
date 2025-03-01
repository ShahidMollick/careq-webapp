import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://9b94-203-110-242-40.ngrok-free.app"; // Update if needed

export function useWebSocket(scheduleId: string) {
  const [patients, setPatients] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentPatient, setCurrentPatient] = useState<any | null>(null);
  const [showTopLoaders, setShowTopLoaders] = useState(false);

  // ✅ Function to calculate age properly
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

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5, // Retry 5 times if disconnected
      reconnectionDelay: 3000, // Wait 3 seconds before retrying
    });

    setSocket(newSocket);
    setShowTopLoaders(true); // ✅ Start loader while fetching data

    console.log("📡 Connecting to WebSocket...");

    newSocket.on("connect", () => {
      console.log("✅ WebSocket Connected");
      setIsConnected(true);
      newSocket.emit("fetchAppointments", scheduleId); // Fetch initial data
    });

    newSocket.on("disconnect", () => {
      console.warn("❌ WebSocket Disconnected");
      setIsConnected(false);
    });

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
          id: patient.id || appointment.id || "Unknown ID",
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
      const servingPatient = formattedPatients.find((p) => p.status === "serving");
      
      if (servingPatient) {
        setCurrentPatient({
          id: servingPatient.id,
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

    return () => {
      console.log("❌ Disconnecting WebSocket");
      newSocket.disconnect(); // Clean up when component unmounts
    };
  }, [scheduleId]);

  return { patients, socket, isConnected, currentPatient, showTopLoaders };
}
