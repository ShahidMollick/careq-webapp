import { useSelector } from "react-redux";
import { useMemo } from "react";
import { selectAppointments } from "@/app/redux/appointmentSlice";

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
  const appointments = useSelector(selectAppointments);

  // Map appointments into the required Patient format
  return useMemo(() => {
    return appointments.map((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const today = new Date();
      const isToday = appointmentDate.toDateString() === today.toDateString();

      return {
        id: appointment._id,
        queueNo: appointment.queueNumber,
        name: appointment.patient.name,
        email: appointment.patient.email,
        phone: appointment.patient.contactNumber,
        age: appointment.patient.age,
        date: isToday ? "Today" : appointmentDate.toLocaleDateString(),
        status: appointment.queueStatus.toLowerCase(),
      };
    });
  }, [appointments]);
};

export default usePatients;
