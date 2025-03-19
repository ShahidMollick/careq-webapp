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
  // Add new fields for family member info
  familyMember?: {
    id: string;
    name: string;
    relationship: string;
    gender: string;
    dob: string;
  } | null;
  isFamily?: boolean;
  primaryPatientName?: string;
}

const SOCKET_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5002";

export function useWebSocket(scheduleId: string) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [showTopLoaders, setShowTopLoaders] = useState(false);

  const [queueStatus, setQueueStatus] = useState<{
    totalLimit: number;
    currentQueue: number;
    totalQueue: number;
  }>({
    totalLimit: 0,
    currentQueue: 0,
    totalQueue: 0,
  });

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
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    setSocket(newSocket);
    setShowTopLoaders(true);

    newSocket.on("connect", () => {
      console.log("✅ WebSocket Connected");
      setIsConnected(true);

      newSocket.emit("fetchAppointments", scheduleId);
      newSocket.emit("schedule-queue-status", { scheduleId });
    });

    newSocket.on("disconnect", () => {
      console.warn("❌ WebSocket Disconnected. Reconnecting...");
      setIsConnected(false);
    });

    const queueEventName = `queue-updated-${scheduleId}`;
    newSocket.on(queueEventName, (data) => {
      console.log(`🔄 Queue Status Update Received for ${scheduleId}:`, data);
      if (
        !data ||
        typeof data.currentQueue === "undefined" ||
        typeof data.totalQueue === "undefined"
      ) {
        console.error("❌ Invalid queue status data received:", data);
        return;
      }

      setQueueStatus((prevState) => ({
        totalLimit: data.totalLimit ?? prevState.totalLimit ?? 0,
        currentQueue: data.currentQueue ?? 0,
        totalQueue: data.totalQueue ?? 0,
      }));

      console.log("✅ Updated Queue Status:", data.currentQueue, data.totalQueue);
    });

    newSocket.on("appointmentsUpdated", (updatedAppointments) => {
      console.log("🔄 Received real-time updates:", updatedAppointments);

      if (!Array.isArray(updatedAppointments)) {
        console.error("❌ Invalid WebSocket data:", updatedAppointments);
        setShowTopLoaders(false);
        return;
      }

      const formattedPatients: Patient[] = updatedAppointments.map((appointment) => {
        const patient = appointment.patient || {};
        const familyMember = appointment.familyMember;
        
        const isFamily = !!familyMember;
        
        // Enhanced relationship handling
        let relationship = "";
        if (isFamily) {
          // Try to get the relationship from either field
          relationship = (familyMember.relationship || familyMember.relation || "").toLowerCase();
          
          // Map common values that might come from the backend
          const relationshipMap = {
            'family_member': 'Family Member',
            'spouse': 'Spouse',
            'child': 'Child',
            'parent': 'Parent',
            'sibling': 'Sibling',
            'other': 'Other'
          };

          relationship = relationshipMap[relationship] || 'Family Member';
        }

        return {
          id: patient.id || "Unknown ID",
          appointmentId: appointment.id || "Unknown Appointment ID",
          queueNumber: appointment.queueNumber ?? "N/A",
          name: isFamily ? familyMember.name : patient.name || "Unknown",
          phone: patient.phone || "N/A",
          age: calculateAge(isFamily ? familyMember.dob : patient.dob),
          gender: isFamily ? familyMember.gender : patient.gender || "N/A",
          status: appointment.status ?? "unknown",
          dob: isFamily ? familyMember.dob : patient.dob || "N/A",
          timeAdded: appointment.createdAt || new Date(),
          timeStarted: appointment.timeStarted || null,
          timeCompleted: appointment.timeCompleted || null,
          familyMember: familyMember ? {
            ...familyMember,
            relationship: relationship // Use the mapped relationship
          } : null,
          isFamily: isFamily,
          primaryPatientName: isFamily ? patient.name : undefined
        };
      });

      setPatients(formattedPatients);

      const servingPatient = formattedPatients.find(
        (p) => p.status === "serving"
      );
      if (servingPatient) {
        setCurrentPatient({ ...servingPatient });
        console.log("✅ Updated currentPatient:", servingPatient);
      } else {
        setCurrentPatient(null);
      }

      if (formattedPatients.length > 0) {
        setShowTopLoaders(false);
      } else {
        setTimeout(() => setShowTopLoaders(false), 2000);
      }
    });

    return () => {
      console.log("❌ Disconnecting WebSocket");
      newSocket.off(queueEventName);
      newSocket.disconnect();
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
