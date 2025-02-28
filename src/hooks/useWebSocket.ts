import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://9b94-203-110-242-40.ngrok-free.app"; // Update if needed

export function useWebSocket(scheduleId: string) {
  const [patients, setPatients] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentPatient, setCurrentPatient] = useState<any | null>(null);

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
        return;
      }

      // ✅ Format WebSocket data correctly
      const formattedPatients = updatedAppointments.map((appointment: any) => ({
        id: appointment.patient?.id || appointment.id || "Unknown ID",
        queueNumber: appointment.queueNumber ?? "N/A",
        name: appointment.patient?.name || "Unknown",
        phone: appointment.patient?.phone || "N/A",
        age: calculateAge(appointment.patient?.dateOfBirth) ?? "N/A",
        gender: appointment.patient?.gender || "N/A",
        status: appointment.status ?? "unknown",
        dateOfBirth: appointment.patient?.dateOfBirth || "N/A",
        timeAdded: appointment.createdAt || new Date(),
        timeStarted: appointment.timeStarted || null,
        timeCompleted: appointment.timeCompleted || null,
      }));

      setPatients(formattedPatients);

      // ✅ Ensure serving patient is correctly set
      const servingPatient = formattedPatients.find((p) => p.status === "serving");

      if (servingPatient) {
        setCurrentPatient({
          id: servingPatient.id,
          name: servingPatient.name,
          phone: servingPatient.phone,
          age: servingPatient.age,
          queueNumber: servingPatient.queueNumber,
          status: "serving",
          timeStarted: servingPatient.timeStarted || new Date(), // Set a default if missing
        });
        console.log("✅ Updated currentPatient:", servingPatient);
      } else {
        setCurrentPatient(null);
      }
    });

    return () => {
      console.log("❌ Disconnecting WebSocket");
      newSocket.disconnect(); // Clean up when component unmounts
    };
  }, [scheduleId]);

  return { patients, socket, isConnected, currentPatient };
}
