import AppointmentsTable from "../../components/AppointmentTable";

const QPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">All Appointments</h1>
      <AppointmentsTable />
    </div>
  );
};

export default QPage;
