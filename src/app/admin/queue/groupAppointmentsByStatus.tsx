// Helper function to transform appointments
const groupAppointmentsByStatus = (appointments) => {
    return {
        serving: appointments
            .filter((appointment) => appointment.queueStatus === "Serving")
            .map((appointment) => ({
                name: appointment.patient.name,
                sex: appointment.patient.sex || "N/A",
                age: appointment.patient.age,
                ticketNumber: appointment.queueNumber,
                photoUrl: "/doctor.svg", // Static URL for simplicity
            })),
        waiting: appointments
            .filter((appointment) => appointment.queueStatus === "Waiting")
            .map((appointment) => ({
                name: appointment.patient.name,
                sex: appointment.patient.sex || "N/A",
                age: appointment.patient.age,
                ticketNumber: appointment.queueNumber,
                photoUrl: "/doctor.svg",
            })),
        completed: appointments
            .filter((appointment) => appointment.queueStatus === "Completed")
            .map((appointment) => ({
                name: appointment.patient.name,
                sex: appointment.patient.sex || "N/A",
                age: appointment.patient.age,
                ticketNumber: appointment.queueNumber,
                photoUrl: "/doctor.svg",
            })),
    };
};

export default groupAppointmentsByStatus;