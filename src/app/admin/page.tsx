"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  Settings2,
  X,
  Loader2,
  ArrowRight,
  CircleCheck,
  CircleAlert,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QueueSettings } from "./types";
import clinicSetting from "./clinicSetting";
import { log } from "console";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Patient {
  id: string;
  queueNumber: number;
  appointmentId: string;
  name: string;
  phone: string;
  age: number;
  gender: "male" | "female" | "other";
  status: "waiting" | "skipped" | "serving" | "completed";
  dateOfBirth: string;
  timeAdded: Date;
  timeStarted?: Date;
  timeCompleted?: Date;
}

export default function QueueManagement() {
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [error, setError] = useState("");
  const [verifiedPatient, setVerifiedPatient] = useState<Patient | null>(null);
  const [verifiedPatients, setVerifiedPatients] = useState(false);
  const [Patients, setPatients] = useState<Patient[]>([]);
  const [processing, setProcessing] = useState(false);
  // const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedPatientForCancel, setSelectedPatientForCancel] =
    useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("live");
  const [showTopLoader, setShowTopLoader] = useState(false);
  const [nextQueueNumber, setNextQueueNumber] = useState(1);
  const [settings, setSettings] = useState<QueueSettings>({
    scheduleStart: "17:00",
    scheduleEnd: "22:00",
    bookingStart: "17:00",
    bookingEnd: "22:00",
    onlineAppointments: true,
  });
  const [newPatient, setNewPatient] = useState({
    phone: "",

    name: "",
    gender: "male",
    dateOfBirth: "",
  });

  const scheduleId = "ad265dc5-96b7-4dcd-b14b-1eda04f6ad0e"; // Replace with dynamic scheduleId if needed
  const {
    patients: livePatients,
    socket,
    isConnected,
    currentPatient,
    showTopLoaders
  } = useWebSocket(scheduleId);
  // Sync WebSocket data with Patients state
  useEffect(() => {
    setPatients(livePatients);
  }, [livePatients]);

  const startTopLoader = () => {
    setShowTopLoader(true);
    // setTimeout(() => setShowTopLoader(false), 2000); // Auto-hide after 2s
  };

  const filteredPatients = Patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery);
    const matchesTab = {
      live: ["waiting", "serving"],
      skipped: ["skipped"],
      completed: ["completed"],
    }[currentTab]?.includes(patient.status);

    return matchesSearch && matchesTab;
  });

  const fetchAppointments = async (scheduleId: string) => {
    setLoading(true);
    setError("");
    startTopLoader();
    try {
      console.log("Fetching appointments for scheduleId:", scheduleId);
      const response = await axios.get(
        `https://9b94-203-110-242-40.ngrok-free.app/appointments/${scheduleId}`
      );

      // Ensure the response contains valid data
      if (response.data && Array.isArray(response.data)) {
        console.log("Appointments fetched:", response.data);

        // Map the response to match the Patient type
        const formattedPatients = response.data.map((appointment: any) => ({
          id: appointment.patient.id,
          appointmentId: appointment.id,
          queueNumber: appointment.queueNumber,
          name: appointment.patient.name,
          phone: appointment.patient.phone,
          age: calculateAge(appointment.patient.dateOfBirth),
          gender: appointment.patient.gender,
          status: appointment.status,
          dateOfBirth: appointment.patient.dateOfBirth,
          timeAdded: appointment.createdAt,
          timeStarted: appointment.timeStarted || null,
          timeCompleted: appointment.timeCompleted || null,
        }));

        setPatients(formattedPatients);
      } else {
        console.error("Invalid data received:", response.data);
        setError("Failed to fetch appointments.");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Error fetching appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyPatient = async () => {
    setLoading(true);
    setError(""); // Reset error

    console.log("Verifying patient with phone:", newPatient.phone);

    try {
      console.log("Sending verification request to server...");
      const response = await axios.post(
        "https://9b94-203-110-242-40.ngrok-free.app/patients/verify",
        { phone: newPatient.phone }
      );

      if (response.data.message === "Patient exists") {
        const patient = response.data.patient;
        console.log("Patient exists:", patient);

        setVerifiedPatient(patient);

        // Check if DOB is available and format it; otherwise, assign a default value
             // ✅ Ensure DOB is properly formatted
      const formattedDob = patient.dob
      ? new Date(patient.dob).toISOString().split("T")[0]
      : ""; // Convert to YYYY-MM-DD format


        // Set new patient data based on the verified patient response
        setNewPatient({
          ...newPatient,
          name: patient.name,
          gender: patient.gender,
          dateOfBirth: formattedDob,
        });
      } else {
        console.log("Patient not found with phone:", newPatient.phone);

        setVerifiedPatient(null); // Clear verification state
        setError(
          "Patient not found. Please enter details to create an appointment."
        );

        setNewPatient({
          phone: newPatient.phone, // Retain the entered phone number
          name: "",
          gender: "male", // Default gender
          dateOfBirth: "",
        });
      }
    } catch (error) {
      console.error("Error occurred during patient verification:", error);
      setError("Error verifying patient. Please try again.");
    } finally {
      setLoading(false);
      setVerifiedPatients(true);

      console.log("Verification process complete. Loading state set to false.");
    }
  };

  const addPatient = async () => {
    const patientData = {
      phone: newPatient.phone,

      name: newPatient.name,
      gender: newPatient.gender,
      dob: newPatient.dateOfBirth,
    };
    startTopLoader();
    setLoadings(true); // Start top loader
    try {
      let patient;
      console.log(verifiedPatient);

      // Step 1: Check if the patient exists, if not create the patient
      if (verifiedPatient) {
        patient = verifiedPatient; // Use the verified patient
      } else {
        console.log("sending patient data: ", patientData);

        const patientResponse = await axios.post(
          "https://9b94-203-110-242-40.ngrok-free.app/patients/create-patient",
          patientData
        );
        patient = patientResponse.data;
      }

      // Step 2: Create an appointment and add the patient to the queue
      const scheduleId = "ad265dc5-96b7-4dcd-b14b-1eda04f6ad0e"; // Retrieve schedule ID (e.g., from state or context)
      const source = "web"; // Source can be 'web' or 'mobile', depending on where the request is coming from
      console.log("patientId :", patient.id);

      const appointmentResponse = await axios.post(
        "https://9b94-203-110-242-40.ngrok-free.app/appointments/book",
        {
          scheduleId: scheduleId,
          patientId: patient.id,
          source: source,
        }
      );

      console.log("📡 Emitting WebSocket update manually...");
      socket?.emit("fetchAppointments", scheduleId); // ✅ Ensure updates are sent to all clients
    } catch (error) {
      console.error("❌ Error adding patient:", error);
    } finally {
      setShowTopLoader(false);
      setError("");
      setVerifiedPatients(false);
      setLoadings(false);
    }

    //   // Step 3: Get the updated appointment data
    //   const appointment = appointmentResponse.data.appointment;

    //   // Update the UI with the new appointment and patient
    //   setPatients((prev) => [...prev, { ...patient, appointment }]);
    //   setNextQueueNumber((prev) => prev + 1);

    //   // Reset the input fields
    //   setNewPatient({
    //     phone: "",
    //     name: "",

    //     gender: "male",
    //     dateOfBirth: "",
    //   });

    //   alert("Patient successfully added and appointment booked.");
    // } catch (error) {
    //   console.error("Error adding patient:", error);
    //   alert("Failed to add patient.");
    // } finally {
    //   setError("");
    //   setVerifiedPatient(null);
    //   setVerifiedPatients(true);
    // }
  };

  const calculateAge = (dob: string) => {
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

  const cancelAppointment = (patient: Patient) => {
    setSelectedPatientForCancel(patient);
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    if (selectedPatientForCancel) {
      setPatients((prev) =>
        prev.filter((p) => p.id !== selectedPatientForCancel.id)
      );
    }
    setCancelDialogOpen(false);
    setSelectedPatientForCancel(null);
  };

  const autoSchedulePatient = (patient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patient.id ? { ...p, status: "waiting" } : p))
    );
  };

  const skipPatient = async (scheduleId: string, appointmentId: string) => {
    try {
      await axios.patch(
        `https://9b94-203-110-242-40.ngrok-free.app/appointments/skip/${scheduleId}/${appointmentId}`
      );
    } catch (err) {
      console.error("Error skipping patient:", err);
    }
  };

  const handleStartServing = async (scheduleId: string) => {
    try {
      // First mark the current patient as completed

      // Then call the next patient
      await axios.patch(
        `https://9b94-203-110-242-40.ngrok-free.app/appointments/callnextpatient/${scheduleId}`
      );

      // The server + WebSocket will update the state
    } catch (err) {
      console.error("Error processing patients:", err);
      setError(
        "Failed to update patient status and call next patient. Please try again."
      );
    }
  };

  const handleFinishServing = async (scheduleId: string) => {
    setProcessing(true);
    startTopLoader();
    try {
      await axios.patch(
        `https://9b94-203-110-242-40.ngrok-free.app/appointments/finish/${scheduleId}`
      );
      // The server auto-calls the next patient; WebSocket updates your UI
    } catch (err) {
      console.error("Error finishing serving patient:", err);
      setError("Failed to finish serving the patient. Please try again.");
    } finally {
      setProcessing(false);
      setShowTopLoader(false);
    }
  };

  const handleFinish = async (scheduleId: string) => {
    setProcessing(true);
    startTopLoader(); // Start top loader
    try {
      await axios.patch(
        `https://9b94-203-110-242-40.ngrok-free.app/appointments/serve/${scheduleId}`
      );
      // The server auto-calls the next patient; WebSocket updates your UI
    } catch (err) {
      console.error("Error calling next patient:", err);
      setError("Failed to call the next patient. Please try again.");
    } finally {
      setProcessing(false);
      setShowTopLoader(false);
    }
  };
  // Determine the "Current Queue" number
  const lastCompletedPatient = [...Patients]
    .filter((p) => p.status === "completed")
    .sort((a, b) => (b.timeCompleted as any) - (a.timeCompleted as any))[0];

  const currentQueueNumber = currentPatient
    ? currentPatient.queueNumber // If serving, show current patient queue number
    : lastCompletedPatient
    ? lastCompletedPatient.queueNumber // If no one is serving, show last completed patient
    : "-"; // If no patients have been served yet, show "-"
  return (
    <div className="min-h-screen  overflow-x-hidden">
      <div>
        {/* ✅ Top Moving Loader */}
        {showTopLoader && (
          <div className="relative w-full h-1 bg-gray-200 overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1/4 bg-primary animate-smooth-moving-loader"></div>
          </div>
        )}
        {/* ✅ Top Moving Loader */}
        {showTopLoaders && (
          <div className="relative w-full h-1 bg-gray-200 overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1/4 bg-primary animate-smooth-moving-loader"></div>
          </div>
        )}
      </div>
      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-6 overflow-y-scroll">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex flex-row gap-4 items-center mb-1">
                  <h2 className="text-md font-bold">
                    Patient Queue
                  </h2>
                  <div className="flex gap-2 items-center">
                    {/* Connection Status Indicator */}
                    <div className="flex items-center gap-1">
                      {isConnected ? (
                        <CircleCheck className="w-4 h-4 text-green-500" />
                      ) : (
                        <CircleAlert className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {isConnected ? (
                          <>
                            <div className="text-green-500">Online</div>
                          </>
                        ) : (
                          <>
                          <div className="text-red-500">Offline</div>
                          </>
                          
                        )}
                      </span>
                    </div>

                    {/* Retry Button (Only when offline) */}
                    {!isConnected && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => socket?.connect()} // ✅ Retry Connection
                      >
                        Reconnect
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Information Information Information Information
                </p>
              </div>
              {/* ✅ Show Queue Status */}

              <div className="flex gap-2">
                <div className="text-sm">
                  Current Queue{" "}
                  <span className="font-medium">{currentQueueNumber}</span>
                </div>
                <div className="text-sm">
                  Total Queue{" "}
                  <span className="font-medium">{Patients.length}</span>
                </div>
                <div className="text-sm">
                  Waiting{" "}
                  <span className="font-medium">
                    {Patients.filter((p) => p.status === "waiting").length}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  className="pl-9"
                  placeholder="Search Patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Tabs
                value={currentTab}
                onValueChange={setCurrentTab}
                className="space-x-2"
              >
                <TabsList>
                  <TabsTrigger
                    value="live"
                    className="bg-primary text-primary-foreground"
                  >
                    Live Queue
                  </TabsTrigger>
                  <TabsTrigger value="skipped">Skipped Patients</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-4">
              {currentTab === "live" && (
                <>
                  {currentPatient && (
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full"
                      defaultValue="serving"
                    >
                      <AccordionItem value="serving">
                        <AccordionTrigger className="text-sm">
                          Currently Serving (1)
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="bg-primary-accent p-2 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full flex items-center font-bold justify-center text-sm">
                                {currentPatient.queueNumber}
                              </div>
                              <div className="flex-1 text-sm grid grid-cols-4">
                                <div className="text-sm">
                                  {currentPatient.name}
                                </div>
                                <div className="text-sm">
                                  Phone: {currentPatient.phone}
                                </div>
                                <div className="text-sm">
                                  Age: {currentPatient.age}
                                </div>
                                <div className="text-sm">
                                  Gender: {currentPatient.gender}
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue="waiting"
                  >
                    <AccordionItem value="waiting">
                      <AccordionTrigger className="text-sm">
                        Waiting (
                        {
                          filteredPatients.filter((p) => p.status === "waiting")
                            .length
                        }
                        )
                      </AccordionTrigger>
                      <AccordionContent
                      className="mb-32">
                        {filteredPatients.filter((p) => p.status === "waiting")
                          .length > 0 ? (
                          <div className="space-y-2">
                            {filteredPatients
                              .filter((p) => p.status === "waiting")
                              .map((patient) => (
                                <div
                                  key={patient.id}
                                  className="p-2 rounded-lg grid grid-cols-6 gap-4"
                                >
                                  <div className="w-8 h-8 rounded-full flex items-center font-bold justify-center text-sm">
                                    {patient.queueNumber}
                                  </div>
                                  <div className="text-sm">{patient.name}</div>
                                  <div className="text-sm">
                                    Phone: {patient.phone}
                                  </div>
                                  <div className="text-sm">
                                    Age: {patient.age}
                                  </div>
                                  <div className="text-sm">
                                    Gender: {patient.gender}
                                  </div>

                                  <div className="flex items-center">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-black"
                                          >
                                            <circle cx="12" cy="12" r="1" />
                                            <circle cx="12" cy="5" r="1" />
                                            <circle cx="12" cy="19" r="1" />
                                          </svg>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            cancelAppointment(patient)
                                          }
                                        >
                                          Cancel Appointment
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            skipPatient(
                                              scheduleId,
                                              patient.appointmentId
                                            )
                                          }
                                        >
                                          Skip Patient
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            No patients waiting in queue
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </>
              )}

              {currentTab === "skipped" && (
                <div>
                  {filteredPatients.length > 0 ? (
                    <div className="space-y-2">
                      {filteredPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className="p-2 rounded-lg border flex justify-between items-center"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full flex items-center font-bold justify-center text-sm">
                              {patient.queueNumber}
                            </div>
                            <div className="flex-1 text-sm grid grid-cols-4">
                              <div className="text-sm">{patient.name}</div>
                              <div className="text-sm">
                                Phone: {patient.phone}
                              </div>
                              <div className="text-sm">Age: {patient.age}</div>
                              <div className="text-sm">
                                Gender: {patient.gender}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="default"
                            onClick={() => autoSchedulePatient(patient)}
                          >
                            Auto Schedule
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No skipped patients
                    </div>
                  )}
                </div>
              )}

              {currentTab === "completed" && (
                <div>
                  {filteredPatients.length > 0 ? (
                    <div className="space-y-2">
                      {filteredPatients.map((patient) => (
                        <div key={patient.id} className="p-2 rounded-lg border">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full flex items-center font-bold justify-center text-sm">
                              {patient.queueNumber}
                            </div>
                            <div className="flex-1 text-sm grid grid-cols-4">
                              <div className="text-sm">{patient.name}</div>
                              <div className="text-sm">
                                Phone: {patient.phone}
                              </div>
                              <div className="text-sm">Age: {patient.age}</div>
                              <div className="text-sm">
                                Gender: {patient.gender}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No completed consultations
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirmation Dialog for Cancel */}
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Appointment</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cancel this patient's appointment?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCancelDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="default" onClick={confirmCancel}>
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-[72px] right-0 p-4 bg-background border-t flex items-center justify-between">
              {currentPatient ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      {currentPatient.queueNumber}
                    </div>
                    <div>
                      <div className="font-medium">{currentPatient.name}</div>
                      <div className="text-sm font-bold  text-primary">
                        Serving
                      </div>
                      {/* <div className="text-sm text-muted-foreground">
                        Phone Number: {currentPatient.phone}
                      </div> */}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        skipPatient(scheduleId, appointmentId || "")
                      }
                    >
                      Skip
                    </Button>
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => handleFinishServing(scheduleId || "")}
                      className="flex"
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          Ending Consultation...
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        </>
                      ) : (
                        "Finish Consultation"
                      )}
                    </Button>
                    {/* <Button
                      variant="default"
                      onClick={() => handleStartServing(scheduleId || "")}
                    >
                      Next Patient
                    </Button> */}
                  </div>
                </>
              ) : (
                <div className="w-full flex justify-end">
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => handleFinish(scheduleId || "")}
                    // disabled={!Patients.some((p) => p.status === "waiting") || !currentPatient}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        Calling Next Patient...
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      </>
                    ) : (
                      <>
                        Call Next Patient
                        <ArrowRight></ArrowRight>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-[400px] border-l p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-md font-bold text-primary">Add Patient</h2>
                <p className="text-sm text-muted-foreground">
                  Information Information Information Information
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="+91"
                    value={newPatient.phone}
                    onChange={(e) =>
                      setNewPatient((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                  <Button onClick={verifyPatient} disabled={loading}>
                    {loading ? (
                      <>
                        Verifying
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      </>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Render the form fields */}
              {verifiedPatients ? (
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    className="mt-1"
                    placeholder="Enter Patient's Name"
                    value={newPatient.name}
                    onChange={(e) =>
                      setNewPatient((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    disabled={!verifiedPatients} // Disable if patient is verified
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Gender</label>
                      <Select
                        value={newPatient.gender}
                        onValueChange={(value) =>
                          setNewPatient((prev) => ({
                            ...prev,
                            gender: value,
                          }))
                        }
                        disabled={!verifiedPatients} // Disable if patient is verified
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Date Of Birth
                      </label>
                      <Input
                        className="mt-1"
                        type="date"
                        value={newPatient.dateOfBirth}
                        onChange={(e) =>
                          setNewPatient((prev) => ({
                            ...prev,
                            dateOfBirth: e.target.value,
                          }))
                        }
                        disabled={!verifiedPatients} // Disable if patient is verified
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}

              <Button
                className="w-full mt-6"
                variant="default"
                onClick={addPatient}
                disabled={
                  !verifiedPatients ||
                  !newPatient.name ||
                  !newPatient.phone ||
                  loadings
                }
              >
                {loadings ? <>Adding Patient...</> : <>Add Patient</>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
