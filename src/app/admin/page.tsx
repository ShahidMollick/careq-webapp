"use client"
import axios from "axios"
import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, Settings2, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type {  QueueSettings } from "./types"

interface Patient {
  id: string;
  queueNumber: number;
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
  const [Patients, setPatients] = useState<Patient[]>([])
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedPatientForCancel, setSelectedPatientForCancel] = useState<Patient | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTab, setCurrentTab] = useState("live")
  const [nextQueueNumber, setNextQueueNumber] = useState(1)
  const [settings, setSettings] = useState<QueueSettings>({
    scheduleStart: "17:00",
    scheduleEnd: "22:00",
    bookingStart: "17:00",
    bookingEnd: "22:00",
    onlineAppointments: true,
  })
  const [newPatient, setNewPatient] = useState({
    phone: "",
    name: "",
    gender: "male",
    dateOfBirth: "",
  })

  const filteredPatients = Patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || patient.phone.includes(searchQuery)
    const matchesTab = {
      live: ["waiting", "serving"],
      skipped: ["skipped"],
      completed: ["completed"],
    }[currentTab]?.includes(patient.status)

    return matchesSearch && matchesTab
  })

  const addPatient = async () => {
    const patientData: Patient = {
      id: Math.random().toString(36).substr(2, 9),
      queueNumber: nextQueueNumber,
      name: newPatient.name,
      phone: newPatient.phone,
      age: calculateAge(newPatient.dateOfBirth),
      gender: newPatient.gender as "male" | "female" | "other",
      status: "waiting",
      dateOfBirth: newPatient.dateOfBirth,
      timeAdded: new Date(),
    };

    try {
      // Send data to the backend
      await axios.post('/api/patients', patientData);

      // Update state with the new patient after successful addition
      setPatients((prev) => [...prev, patientData]);
      setNextQueueNumber((prev) => prev + 1);

      // Reset the input fields
      setNewPatient({
        phone: '',
        name: '',
        gender: 'male',
        dateOfBirth: '',
      });
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Failed to add patient.");
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const skipPatient = () => {
    if (currentPatient) {
      setPatients((prev) => prev.map((p) => (p.id === currentPatient.id ? { ...p, status: "skipped" } : p)))
      setCurrentPatient(null)
    }
  }
  const cancelAppointment = (patient: Patient) => {
    setSelectedPatientForCancel(patient)
    setCancelDialogOpen(true)
  }

  const confirmCancel = () => {
    if (selectedPatientForCancel) {
      setPatients((prev) =>
        prev.filter((p) => p.id !== selectedPatientForCancel.id)
      )
    }
    setCancelDialogOpen(false)
    setSelectedPatientForCancel(null)
  }

  const autoSchedulePatient = (patient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patient.id ? { ...p, status: "waiting" } : p))
    )
  }
  const finishConsultation = () => {
    if (currentPatient) {
      setPatients((prev) =>
        prev.map((p) => (p.id === currentPatient.id ? { ...p, status: "completed", timeCompleted: new Date() } : p)),
      )
      setCurrentPatient(null)
    }
  }

  const callNextPatient = () => {
    if (currentPatient) {
      finishConsultation()
    }

    const nextPatient = Patients.find((p) => p.status === "waiting")
    if (nextPatient) {
      setPatients((prev) =>
        prev.map((p) => (p.id === nextPatient.id ? { ...p, status: "serving", timeStarted: new Date() } : p)),
      )
      setCurrentPatient({ ...nextPatient, status: "serving", timeStarted: new Date() })
    }
  }
  // Determine the "Current Queue" number
  const lastCompletedPatient = [...Patients]
    .filter((p) => p.status === "completed")
    .sort((a, b) => (b.timeCompleted as any) - (a.timeCompleted as any))[0]

  const currentQueueNumber = currentPatient
    ? currentPatient.queueNumber // If serving, show current patient queue number
    : lastCompletedPatient
    ? lastCompletedPatient.queueNumber // If no one is serving, show last completed patient
    : "-" // If no patients have been served yet, show "-"
  return (
    <div className="min-h-screen  overflow-x-hidden">

      <div className="flex h-[calc(100vh-73px)]">

        {/* Main Content */}
        <div className="flex-1 flex">
          <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-md font-bold text-primary">Patient Queue</h2>
                <p className="text-sm text-muted-foreground">Information Information Information Information</p>
              </div>
              <div className="flex gap-2">
                <div className="text-sm">
                  Current Queue <span className="font-medium">{currentQueueNumber}</span>
                </div>
                <div className="text-sm">
                  Total Queue <span className="font-medium">{Patients.length}</span>
                </div>
                <div className="text-sm">
                  Waiting <span className="font-medium">{Patients.filter((p) => p.status === "waiting").length}</span>
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
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-x-2">
                <TabsList>
                  <TabsTrigger value="live" className="bg-primary text-primary-foreground">
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
                    <Accordion type="single" collapsible className="w-full" defaultValue="serving">
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
                                <div className="text-sm">{currentPatient.name}</div>
                                <div className="text-sm">Phone: {currentPatient.phone}</div>
                                <div className="text-sm">Age: {currentPatient.age}</div>
                                <div className="text-sm">Gender: {currentPatient.gender}</div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

<Accordion type="single" collapsible className="w-full" defaultValue="waiting">
  <AccordionItem value="waiting">
    <AccordionTrigger className="text-sm">
      Waiting ({filteredPatients.filter(p => p.status === "waiting").length})
    </AccordionTrigger>
    <AccordionContent>
      {filteredPatients.filter(p => p.status === "waiting").length > 0 ? (
        <div className="space-y-2">
          {filteredPatients
            .filter(p => p.status === "waiting")
            .map((patient) => (
              <div key={patient.id} className="p-2 rounded-lg grid grid-cols-6 gap-4">
                <div className="w-8 h-8 rounded-full flex items-center font-bold justify-center text-sm">
                  {patient.queueNumber}
                </div>
                <div className="text-sm">{patient.name}</div>
                <div className="text-sm">Phone: {patient.phone}</div>
                <div className="text-sm">Age: {patient.age}</div>
                <div className="text-sm">Gender: {patient.gender}</div>

                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => cancelAppointment(patient)}>
                  <X className="w-4 h-4" />
                </Button>
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
                        <div key={patient.id} className="p-2 rounded-lg border flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full flex items-center font-bold justify-center text-sm">
                              {patient.queueNumber}
                            </div>
                            <div className="flex-1 text-sm grid grid-cols-4">
                              <div className="text-sm">{patient.name}</div>
                              <div className="text-sm">Phone: {patient.phone}</div>
                              <div className="text-sm">Age: {patient.age}</div>
                              <div className="text-sm">Gender: {patient.gender}</div>
                            </div>
                          </div>
                          <Button 
                            variant="default" 
                            onClick={() => autoSchedulePatient(patient)}>
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
                              <div className="text-sm">Phone: {patient.phone}</div>
                              <div className="text-sm">Age: {patient.age}</div>
                              <div className="text-sm">Gender: {patient.gender}</div>
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
                  <DialogDescription>Are you sure you want to cancel this patient's appointment?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>Cancel</Button>
                  <Button variant="default" onClick={confirmCancel}>Confirm</Button>
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
                      <div className="text-sm text-primary">Serving</div>
                      <div className="text-sm text-muted-foreground">Phone Number: {currentPatient.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={skipPatient}>
                      Skip
                    </Button>
                    <Button variant="outline" onClick={finishConsultation}>
                      Finish Consultation
                    </Button>
                    <Button variant="default" onClick={callNextPatient}>
                      Next Patient
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full flex justify-center">
                <Button 
                    variant="default" 
                    onClick={callNextPatient}
                    disabled={!Patients.some(p => p.status === "waiting")}
                >
                    Call Next Patient
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
                <p className="text-sm text-muted-foreground">Information Information Information Information</p>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings2 className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Settings</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Schedule Window</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Information Information Information Information
                      </p>
                      <div className="flex gap-4">
                        <Input
                          type="time"
                          value={settings.scheduleStart}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              scheduleStart: e.target.value,
                            }))
                          }
                        />
                        <span className="flex items-center">-</span>
                        <Input
                          type="time"
                          value={settings.scheduleEnd}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              scheduleEnd: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Booking Window</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Information Information Information Information
                      </p>
                      <div className="flex gap-4">
                        <Input
                          type="time"
                          value={settings.bookingStart}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              bookingStart: e.target.value,
                            }))
                          }
                        />
                        <span className="flex items-center">-</span>
                        <Input
                          type="time"
                          value={settings.bookingEnd}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              bookingEnd: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Online Appointment Status</h3>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Information Information Information Information
                          </p>
                        </div>
                        <Switch
                          checked={settings.onlineAppointments}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({
                              ...prev,
                              onlineAppointments: checked,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
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
                  <Button>Verify</Button>
                </div>
              </div>
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
                />
              </div>
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
                  <label className="text-sm font-medium">Date Of Birth</label>
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
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              variant="default"
              onClick={addPatient}
              disabled={!newPatient.name || !newPatient.phone}
            >
              Add Patient
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

