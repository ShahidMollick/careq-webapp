import { useSelector } from "react-redux";
import { useMemo } from "react";
import { selectFollowUpAppointments } from "@/app/redux/appointmentSlice";

// Patient Interface
export type Patient = {
  id: string;
  queueNo: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  date: string;
  status: string;
};

// Custom Hook to Fetch and Prepare Patients Data
const usePatients = (): Patient[] => {
  const appointments = useSelector(selectFollowUpAppointments);

  console.log("appointments", appointments);

  // Map appointments into the required Patient format
  return useMemo(() => {
    return appointments.map((appointment) => ({
      id: appointment._id,
      queueNo: appointment.bookedAppointment?.queueNumber || 0,
      name: appointment.patient.name,
      email: appointment.patient.email,
      phone: appointment.patient.contactNumber,
      age: appointment.patient.age,
      date: new Date(appointment.followUpDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
      status: appointment.followUpStatus || "Unknown",
    }));
  }, [appointments]);
};

export default usePatients;
