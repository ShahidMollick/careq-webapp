"use client";
import React, { use, useEffect, useState } from "react";
import "./page.css";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import data from "./appointments.json";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import { Save } from "lucide-react";
import { FileText } from "lucide-react";
import { Download } from "lucide-react";
import { ScheduleBtn } from "@/components/ui/schedule-up-btn";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch } from "@/app/redux/store";
// import { fetchAppointments, selectAppointments, selectError, selectLoading, selectTotalAppointments } from "@/app/redux/appointmentSlice";
// import groupAppointmentsByStatus from "./groupAppointmentsByStatus";
// import {
//   callNextPatient,
//   completeConsultation,
//   fetchTodayAppointmentsByDoctor,
//   selectTodayAppointments,
// } from "@/app/redux/appointmentSlice";

const AppointmentPage: React.FC = () => {

  
  // const dispatch: AppDispatch = useDispatch();

  // // Fetch appointments from Redux
  // const appointments = useSelector(selectTodayAppointments);
  // const lastTicketNumber = appointments.length;
  //const loading = useSelector(selectLoading);
  //const error = useSelector(selectError);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [appointments, setAppointments] = useState(data);
  const [totalConsulted, setTotalConsulted] = useState(appointments.completed.length);  // Track total consulted
  const [consultationFinished, setConsultationFinished] = useState(false); // Track if consultation is finished


  // console.log("appointments fetched in queue page: ", appointments);

  // Transform the appointments into the desired JSON structure
  // const data = groupAppointmentsByStatus(appointments);
  console.log("data: ", data);
  const lastTicketNumber = appointments.completed.length;


  const firstTicketNumber =
    data.serving.length > 0 ? data.serving[0].ticketNumber : null;

    const filterData = (sectionData) =>
      sectionData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
 
  // const filteredServing = filterData(data.serving);
  // console.log("filteredServing: ", filteredServing);
  // console.log("servingid", filteredServing[0]?.id);
  // const filteredWaiting = filterData(data.waiting);
  // const filteredCompleted = filterData(data.completed);4
  const filteredServing = filterData(appointments.serving);
  const filteredWaiting = filterData(appointments.waiting);
  const filteredCompleted = filterData(appointments.completed);
  


  // const handleCallNext = () => {
  //   dispatch(callNextPatient())
  //     .unwrap()
  //     .then(() => {
  //       toast.success("Next patient called successfully");
  //       console.log("Successfully called next patient");
  //       dispatch(fetchTodayAppointmentsByDoctor());
  //     })
  //     .catch((error) => {
  //       toast.error("Failed to call next patient");
  //       console.error("Failed to call next patient:", error);
  //     });
  // };

  
  
  // const finishConsultation = () => {
  //   dispatch(completeConsultation())
  //     .unwrap()
  //     .then(() => {
  //       toast.success("Consultation completed successfully");
  //       console.log("Successfully finished consultation");
  //       dispatch(fetchTodayAppointmentsByDoctor());
  //     })
  //     .catch((error) => {
  //       toast.error("Failed to finish consultation");
  //       console.error("Failed to finish consultation:", error);
  //     });
  // };

  // useEffect(() => {
  //     dispatch(fetchTodayAppointmentsByDoctor());
  // }, []);

  const handleCallNext = () => {
    if (appointments.waiting.length > 0) {
      const currentServing = appointments.serving[0]; // Get the current patient from serving
      const nextPatient = appointments.waiting[0]; // Get the next patient from waiting
      const newCompleted = currentServing ? [...appointments.completed, currentServing] : [...appointments.completed];
  
      // Move the next patient from waiting to serving and add the current serving patient to completed
      setAppointments({
        ...appointments,
        serving: [nextPatient], // Move the next patient to serving
        waiting: appointments.waiting.slice(1), // Remove the first patient from waiting
        completed: newCompleted, // Add the current serving patient to completed list
      });
  
      setConsultationFinished(false);  // Reset consultationFinished to false when calling next patient
      toast.success("Next patient called successfully");
    } else {
      toast.error("No patients in the waiting list.");
    }
  };
  
  
  // Disable the "Next Patient" button if there's a patient in serving
  const isNextPatientButtonDisabled = appointments.serving.length > 0;
  
  
  
  
  
  
  
  

  // Finish consultation function: Move the current serving patient to completed and update the serving section
  const finishConsultation = () => {
    if (appointments.serving.length > 0) {
      const completedPatient = appointments.serving[0]; // Get the first patient from serving
      const newCompleted = [...appointments.completed, completedPatient]; // Move patient to completed
  
      // Empty the serving list
      setAppointments({
        ...appointments,
        serving: [], // Empty the serving list
        completed: newCompleted, // Add the completed patient to completed list
      });
  
      setTotalConsulted(totalConsulted + 1); // Increment totalConsulted by 1
      setConsultationFinished(true); // Mark consultation as finished
      toast.success("Consultation completed successfully");
    } else {
      toast.error("No patient is currently being served.");
    }
  };
  
  
  
  
  

  return (
    <div className="main-container">
      <Toaster />
      <div className="right-body">
        <div className="content">
          <div className="accord">
      <div className="flex flex-row gap-2 w-full">
      <div className="md text-sm w-full text-black text-center font-bold p-2 border border-solid rounded-lg border-slate-500/[0.37]">
  Current Queue: {filteredServing.length > 0 ? filteredServing[0].ticketNumber : "N/A"}
</div>

<div className="md text-sm w-full text-black text-center font-bold p-2 border border-solid rounded-lg border-slate-500/[0.37]">
  Total Consulted: {totalConsulted} {/* Display totalConsulted */}
</div>

      </div>

      {/* Search Bar */}
      <div className="search-bar flex items-center mt-4 mb-2 relative">
        <input
          type="text"
          placeholder="Search by patient name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 pl-10 rounded-lg w-full text-sm bg-transparent"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          width={16}
          height={16}
        />
      </div>

      <Accordion type="multiple" defaultValue={["item-1", "item-2"]} className="w-full">
  {/* Serving Section */}
  <AccordionItem value="item-1">
    <AccordionTrigger className="font-bold text-secondary">Serving</AccordionTrigger>
    <AccordionContent>
      {filteredServing.map((item, index) => (
        <div key={index} className="card-list" style={{ background: "rgba(23, 194, 123, 0.08)", borderRadius: "0.5rem" }}>
          <Image src={item.photoUrl} alt={item.name} width={50} height={50} />
          <div className="patient">
            <div className="patient-detail">
              <h3 className="font-bold">{item.name}</h3>
              <p>Sex: {item.sex} Age: {item.age}</p>
            </div>
            <div className="border p-2 rounded-md">{item.ticketNumber}</div>
          </div>
        </div>
      ))}
    </AccordionContent>
  </AccordionItem>

  {/* Waiting Section */}
  <AccordionItem value="item-2">
    <AccordionTrigger className="font-bold text-secondary">Waiting</AccordionTrigger>
    <AccordionContent>
      {filteredWaiting.map((item, index) => (
        <div key={index} className="card-list">
          <Image src={item.photoUrl} alt={item.name} width={50} height={50} />
          <div className="patient">
            <div className="patient-detail">
              <h3 className="font-bold">{item.name}</h3>
              <p>Sex: {item.sex} Age: {item.age}</p>
            </div>
            <div className="border p-2 rounded-md">{item.ticketNumber}</div>
          </div>
        </div>
      ))}
    </AccordionContent>
  </AccordionItem>

  {/* Completed Section */}
  <AccordionItem value="item-3">
    <AccordionTrigger className="font-bold text-secondary">Completed</AccordionTrigger>
    <AccordionContent>
      {filteredCompleted.map((item, index) => (
        <div key={index} className="card-list">
          <Image src={item.photoUrl} alt={item.name} width={50} height={50} />
          <div className="patient">
            <div className="patient-detail">
              <h3 className="font-bold">{item.name}</h3>
              <p>Sex: {item.sex} Age: {item.age}</p>
            </div>
            <div className="border p-2 rounded-md">{item.ticketNumber}</div>
          </div>
        </div>
      ))}
    </AccordionContent>
  </AccordionItem>
</Accordion>

    </div>

          <div className="h-full w-full p-4 pb-[10%]">
            <div className="flex flex-row justify-between items-center mb-4">
              <div className="head">
                <div className="small-icon">
                  <FileText className="text-white" width={16} height={16} />
                </div>
                <div className="sub-section">
                  <div className="sub-section-title">Prescription</div>
                  <div className="sub-section-sub-title">
                    Prescription at a glance
                  </div>
                </div>
              </div>
              <Button>
                <Save className="h-5 w-5" /> Save Prescription
              </Button>
            </div>

            <Textarea
              placeholder="| Start typing prescription details here......"
              className="h-full"
            />
            <div className="flex flex-row justify-between"></div>
          </div>

          <div className="preview">
            <div className="preview-header">
              <div className="head">
                <div className="small-icon">
                  <Image src="/profile.svg" width={16} height={16} alt="icon" />
                </div>
                <div className="sub-section">
                  <div className="sub-section-title">Patient Profile</div>
                  <div className="sub-section-sub-title">
                    Patient information at a glance
                  </div>
                </div>
              </div>

              <div className="middle text-sm">
                <div className="middle-profile-pic">
                  <Image src="/doctor.svg" width={60} height={60} alt="icon" />
                </div>
                {filteredServing.length > 0 ? (
                  <div className="border p-4 w-full rounded-md">
                    <div className="font-bold">{filteredServing[0].name}</div>
                    <div>
                      <span className="font-bold">Sex: </span>
                      <span>{filteredServing[0].sex}</span>
                      <span className="font-bold"> Age: </span>
                      <span>{filteredServing[0].age}</span>
                    </div>
                    <div>
                      <span className="font-bold">Phone no: </span>
                      <span>{filteredServing[0].phone}</span>
                    </div>
                    <div>
                      <span className="font-bold">Email: </span>
                      <span>{filteredServing[0].email}</span>
                    </div>
                  </div>
                ) : (
                  <div className="border p-4 w-full rounded-md">
                    <div className="text-center font-bold">
                      No patient is being served
                    </div>
                  </div>
                )}
              </div>

              <ScheduleBtn
                parentAppointmentId={filteredServing[0]?.id}
                followUpFee={50}
                notes="Optional follow-up notes"
                onDateChange={setSelectedDate}
              />
            </div>

            <div className="preview-body"></div>

            <Card className="rounded-none h-[21rem] p-0">
              <div className="flex flex-row justify-between items-center p-3">
                <div className="head">
                  <div className="small-icon">
                    <FileText className="text-white" />
                  </div>
                  <div className="sub-section">
                    <div className="sub-section-title">
                      Recent Medical History
                    </div>
                    <div className="sub-section-sub-title">
                      Review the recent prescription
                    </div>
                  </div>
                  <div>
                    <Button className="bg-white text-black w-[3rem] px-8  rounded-[9.484px]  border border-[#64748b60]">
                      View all
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="flex flex-row ml-[0.2rem] h-[40]">
                <div className="w-full overflow-hidden">
                  <div className="mt-0">
                    <div className="border border-[#9D9D9D] rounded-md p-2">
                      <div className="w-full h-40 overflow-hidden">
                        <Image
                          src="/image 4.png"
                          alt="Medical Image"
                          width={500} // Reduced width to control size
                          height={300} // Reduced height to control size
                          className="object-contain max-h-[600px]"
                        />
                      </div>

                      {/* Dialog for full-size image */}
                      <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                          <Button
                            className="bg-white text-black w-full px-8 rounded-[9.484px] border border-[#9D9D9D] my-[0.5rem]"
                            onClick={() => setIsOpen(true)}
                          >
                            Open Prescription
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex flex-row justify-between item-center mx-4">
                              <div className="mt-[0.5rem]">
                                Prescription Image
                              </div>
                              <Button>
                                <Download />
                                Download
                              </Button>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="flex justify-center">
                            <Image
                              src="/image 4.png"
                              alt="Medical Image"
                              width={800} // Reduced width to control size
                              height={300} // Reduced height to control size
                              className="object-contain max-h-[600px] "
                            />
                          </div>
                        </DialogContent>
                      </Dialog>

                      <div className="text-gray-400 text-left text-sm italic mt-[2px]">
                        Prescribed on 24 October at 9:42 am
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="preview-footer mt-[1rem]">
              <Button
                className="bg-white text-black border border-[#000] w-[150px]"
                onClick={finishConsultation}
              >
                Finish Consultation
              </Button>
              <Button
  className={`w-[150px] ${consultationFinished && appointments.waiting.length > 0 ? 'bg-[#164772]' : 'bg-[#16477240]'}`}
  onClick={handleCallNext}
  disabled={isNextPatientButtonDisabled} // Disable the button if serving list is not empty
>
  Next Patient
              </Button>




            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
