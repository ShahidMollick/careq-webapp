"use client";
import React, { useState } from "react";
import "./page.css";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ComboboxDemo } from "@/components/ui/combobox";
import data from "./appointments.json";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import { Save } from "lucide-react";
import { FileText } from "lucide-react";

const AppointmentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Get the first ticket number (from the 'serving' array)
  const firstTicketNumber =
    data.serving.length > 0 ? data.serving[0].ticketNumber : null;

  // Get the last ticket number (from the 'completed' array)
  const lastTicketNumber =
    data.completed.length > 0
      ? data.completed[data.completed.length - 1].ticketNumber
      : null;

  // Filter data based on search term
  const filterData = (sectionData) =>
    sectionData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Filtered sections
  const filteredServing = filterData(data.serving);
  const filteredWaiting = filterData(data.waiting);
  const filteredCompleted = filterData(data.completed);

  return (
    <div className="main-container">
      <div className="left-menu">
        <Image src="/circle-logo.svg" alt="icon" width={45} height={45} />

        <Link href="/dashboard" passHref>
          <Image
            src="/dashboard.svg"
            alt="logo"
            width={45}
            height={45}
            className="icon"
          />
        </Link>
        <Link href="/appointment" passHref>
          {" "}
          <Image
            src="/appointmentIcon.svg"
            alt="logo"
            width={45}
            height={45}
            className="icon"
          />{" "}
        </Link>
      </div>
      <div className="right-body">
        <div className="nav-bar item-center">
          <div className="text-xl font-bold">Appointment Management</div>
          <div className="right">
            <div className="clinic-option">
              <ComboboxDemo />
              <Image src="/bell.svg" alt="bell" width={30} height={30} />
            </div>
            <div className="doctor-profile">
              <Image src="/doctor.svg" alt="doctor" width={40} height={40} />
              <div className="doctor-name">
                <p>Dr. John Doe</p>
                <p>Doctor</p>
              </div>
            </div>
          </div>
        </div>
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

          <div className="editor-container p-4 pb-[20%]">
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
                <Save className="h-5 w-5" />{" "}
                Save Prescription
              </Button>
            </div>

            <Textarea
              placeholder="| Start typing prescription details here......"
              className="overflow-auto h-full"
            />
            <div className="flex flex-row justify-between">
              <div className="w-30 h-20 p-1"><Image src="/clinic-sign.png" alt="sign" width={50} height={20} layout="responsive" /></div>
              <div className="w-30 h-20 p-1"><Image src="/doc-sign.png" alt="sign" width={50} height={20} layout="responsive" /></div>
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
              <Button variant={"default"}>
                <Image src="/calender.svg" width={18} height={18} alt="icon" />
                Schedule Follow Up
              </Button>
            </div>
            <div className="preview-body"></div>
            <div className="preview-footer">
              <Button>Finish Consultation</Button>
              <Button>Next Patient</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
