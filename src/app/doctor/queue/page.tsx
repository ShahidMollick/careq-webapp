"use client";
import React, { useState } from "react";
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
import data from "./appointments.json";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import { Save } from "lucide-react";
import { FileText } from "lucide-react";
import { Download } from "lucide-react";
import { ScheduleBtn } from "@/components/ui/schedule-up-btn";

const AppointmentPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const firstTicketNumber =
    data.serving.length > 0 ? data.serving[0].ticketNumber : null;
  const lastTicketNumber =
    data.completed.length > 0
      ? data.completed[data.completed.length - 1].ticketNumber
      : null;

  const filterData = (sectionData) =>
    sectionData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredServing = filterData(data.serving);
  const filteredWaiting = filterData(data.waiting);
  const filteredCompleted = filterData(data.completed);

  return (
    <div className="main-container">
      <div className="right-body">
        <div className="content">
          <div className="accord">
            <div className="flex flex-row gap-2 w-full">
              <div className="md text-sm w-full text-black text-center font-bold p-2 border border-solid rounded-lg border-slate-500/[0.37] ...">
                Current Queue : {firstTicketNumber}
              </div>
              <div className="md text-sm w-full text-black text-center font-bold p-2 border border-solid rounded-lg border-slate-500/[0.37] ...">
                Total Patients : {lastTicketNumber}
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

            <Accordion
              type="multiple"
              defaultValue={["item-1", "item-2"]}
              className="w-full"
            >
              {/* Serving Section */}
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-bold text-secondary">
                  Serving
                </AccordionTrigger>
                <AccordionContent>
                  {filteredServing.map((item, index) => (
                    <div
                      key={index}
                      className="card-list"
                      style={{
                        background: "rgba(23, 194, 123, 0.08)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <Image
                        src={item.photoUrl}
                        alt={item.name}
                        width={50}
                        height={50}
                      />
                      <div className="patient">
                        <div className="patient-detail">
                          <h3 className="font-bold">{item.name}</h3>
                          <p>
                            Sex: {item.sex} Age: {item.age}
                          </p>
                        </div>
                        <div className="border p-2 rounded-md">
                          {item.ticketNumber}
                        </div>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Waiting Section */}
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-bold text-secondary">
                  Waiting
                </AccordionTrigger>
                <AccordionContent>
                  {filteredWaiting.map((item, index) => (
                    <div key={index} className="card-list">
                      <Image
                        src={item.photoUrl}
                        alt={item.name}
                        width={50}
                        height={50}
                      />
                      <div className="patient">
                        <div className="patient-detail">
                          <h3 className="font-bold">{item.name}</h3>
                          <p>
                            Sex: {item.sex} Age: {item.age}
                          </p>
                        </div>
                        <div className="border p-2 rounded-md">
                          {item.ticketNumber}
                        </div>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Completed Section */}
              <AccordionItem value="item-3">
                <AccordionTrigger className="font-bold text-secondary">
                  Completed
                </AccordionTrigger>
                <AccordionContent>
                  {filteredCompleted.map((item, index) => (
                    <div key={index} className="card-list">
                      <Image
                        src={item.photoUrl}
                        alt={item.name}
                        width={50}
                        height={50}
                      />
                      <div className="patient">
                        <div className="patient-detail">
                          <h3 className="font-bold">{item.name}</h3>
                          <p>
                            Sex: {item.sex} Age: {item.age}
                          </p>
                        </div>
                        <div className="border p-2 rounded-md">
                          {item.ticketNumber}
                        </div>
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
              className=""
            />
            <div className="flex flex-row justify-between">
              <div className="w-30 h-20 p-1">
                <Image
                  src="/clinic-sign.png"
                  alt="sign"
                  width={50}
                  height={20}
                  layout="responsive"
                />
              </div>
              <div className="w-30 h-20 p-1">
                <Image
                  src="/doc-sign.png"
                  alt="sign"
                  width={50}
                  height={20}
                  layout="responsive"
                />
              </div>
            </div>
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
                <div className="border p-4 w-full rounded-md">
                  <div className="font-bold">Disha Pandey</div>
                  <div>
                    <span className="font-bold">Sex: </span>
                    <span>Female</span>
                    <span className="font-bold"> Age: </span>
                    <span>19</span>
                  </div>
                  <div>
                    <span className="font-bold">Phone no: </span>
                    <span>+918765789621</span>
                  </div>
                  <div>
                    <span className="font-bold">Email: </span>
                    <span>dishapandey@careq.com</span>
                  </div>
                </div>
              </div>

              <ScheduleBtn onDateChange={setSelectedDate} />
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
              <Button className="bg-white text-black border border-[#000] w-[150px]">
                Finish Consultation
              </Button>
              <Button className="bg-[#16477240] w-[150px]">Next Patient</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
