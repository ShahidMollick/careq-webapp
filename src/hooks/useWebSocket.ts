import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5002"; // Update if needed

export function useWebSocket(scheduleId: string) {
  const [patients, setPatients] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const calculateAge = (dob: string) => {
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

    const newSocket = io(SOCKET_URL, { transports: ["websocket"] });
    setSocket(newSocket);

    console.log("📡 Connected to WebSocket");
    
    // Fetch initial appointments when component mounts
    newSocket.emit("fetchAppointments", scheduleId);

    // ✅ Listen for WebSocket event
    newSocket.on("appointmentsUpdated", (updatedAppointments) => {
      console.log("🔄 Received real-time appointments:", updatedAppointments);

      if (!Array.isArray(updatedAppointments)) {
        console.error("❌ Invalid WebSocket data:", updatedAppointments);
        return;
      }

      // ✅ Format WebSocket data correctly
      const formattedPatients = updatedAppointments.map((appointment: any) => ({
        id: appointment.patient?.id || appointment.id,
        queueNumber: appointment.queueNumber,
        name: appointment.patient?.name || "Unknown",
        phone: appointment.patient?.phone || "N/A",
        age: calculateAge(appointment.patient?.dateOfBirth),
        gender: appointment.patient?.gender || "N/A",
        status: appointment.status,
        dateOfBirth: appointment.patient?.dateOfBirth || "N/A",
        timeAdded: appointment.createdAt,
        timeStarted: appointment.timeStarted || null,
        timeCompleted: appointment.timeCompleted || null,
      }));

      // ✅ Update the state properly
      setPatients(formattedPatients);
    });

    return () => {
      console.log("❌ Disconnecting WebSocket");
      newSocket.disconnect(); // Clean up when component unmounts
    };
  }, [scheduleId]);

  return { patients, socket };
}
