// Helper function to transform appointments
const groupAppointmentsByStatus = (appointments) => {
    return {
        serving: appointments
            .filter((appointment) => appointment.queueStatus === "Serving")
            .map((appointment) => ({
                id: appointment._id,
                name: appointment.patient.name,
                sex: appointment.patient.sex || "N/A",
                age: appointment.patient.age,
                ticketNumber: appointment.queueNumber,
                photoUrl: "/doctor.svg",
                email: appointment.patient.email,
                phone: appointment.patient.contactNumber,
            })),
        waiting: appointments
            .filter((appointment) => appointment.queueStatus === "Waiting")
            .map((appointment) => ({
                id: appointment._id,
                name: appointment.patient.name,
                sex: appointment.patient.sex || "N/A",
                age: appointment.patient.age,
                ticketNumber: appointment.queueNumber,
                email: appointment.patient.email,
                phone: appointment.patient.contactNumber,
                photoUrl: "/doctor.svg",
            })),
        completed: appointments
            .filter((appointment) => appointment.queueStatus === "Completed")
            .map((appointment) => ({
                id: appointment._id,
                name: appointment.patient.name,
                sex: appointment.patient.sex || "N/A",
                age: appointment.patient.age,
                ticketNumber: appointment.queueNumber,
                email: appointment.patient.email,
                phone: appointment.patient.contactNumber,
                photoUrl: "/doctor.svg",
            })),
    };
};

export default groupAppointmentsByStatus;