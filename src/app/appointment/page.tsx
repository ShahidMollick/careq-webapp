import React from "react";
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
//import BulletPointTextarea from "@/components/ui/editor";
//import { TextareaForm } from "@/components/ui/textareaForm";

const AppointmentPage: React.FC = () => {
  /*const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('https://example.com/api/data');
            const result = await res.json();
            setData(result);
        };

        fetchData();
    }, []);

    if (!data) return <p>Loading...</p>;*/

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
        <div className="nav-bar">
          <div className="head">Appointment Management</div>
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
            <Accordion
              type="multiple"
              defaultValue={["item-1", "item-2"]}
              className="w-full"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-bold text-secondary">Serving</AccordionTrigger>
                <AccordionContent>
                  {data.serving.map((item, index) => (
                    <div key={index} className="card-list" style={{background: "rgba(23, 194, 123, 0.08)", borderRadius: "0.5rem"}}>
                      <Image
                        src={item.photoUrl}
                        alt={item.name}
                        width={50}
                        height={50}
                      />
                      <div className="patient">
                        <div className="patient-detail">
                          <h3>{item.name}</h3>
                          <p>
                            Sex: {item.sex} Age: {item.age}
                          </p>
                        </div>

                        <div>{item.ticketNumber}</div>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-bold text-secondary">Waiting</AccordionTrigger>
                <AccordionContent>
                  {data.waiting.map((item, index) => (
                    <div key={index} className="card-list">
                      <Image
                        src={item.photoUrl}
                        alt={item.name}
                        width={50}
                        height={50}
                      />
                      <div className="patient">
                        <div className="patient-detail">
                          <h3>{item.name}</h3>
                          <p>
                            Sex: {item.sex} Age: {item.age}
                          </p>
                        </div>
                        <div>{item.ticketNumber}</div>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="font-bold text-secondary">Completed</AccordionTrigger>
                <AccordionContent>
                  {data.completed.map((item, index) => (
                    <div key={index} className="card-list">
                      <Image
                        src={item.photoUrl}
                        alt={item.name}
                        width={50}
                        height={50}
                      />
                      <div className="patient">
                        <div className="patient-detail">
                          <h3>{item.name}</h3>
                          <p>
                            Sex: {item.sex} Age: {item.age}
                          </p>
                        </div>
                        <div>{item.ticketNumber}</div>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="editor-container">{/*<BulletPointTextarea />*/}</div>

          <div className="preview">
            <div className="preview-header">
              <div className="head">
                <div className="small-icon">
                  <Image src="/profile.svg" width={24} height={24} alt="icon" />
                </div>
                <div className="sub-section">
                  <div className="sub-section-title">Patient Profile</div>
                  <div className="sub-section-sub-title">
                    Patient information at a glance
                  </div>
                </div>
              </div>
              <div className="middle">
                <div className="middle-profile-pic">
                  <Image
                    src="/doctor.svg"
                    width={60}
                    height={60}
                    alt="icon"
                  />
                </div>
                <div className="middle-profile-info">
                  <div className="sub-section-title">Disha Pandey</div>
                  <div className="sub-section-title">
                    <span>Sex: </span>
                    <span className="sub-section-sub-title">Female</span>
                    <span> Age: </span>
                    <span className="sub-section-sub-title">19</span>
                  </div>
                  <div className="sub-section-title">
                    <span>Phone no: </span>
                    <span className="sub-section-sub-title">+918765789621</span>
                  </div>
                  <div className="sub-section-title">
                    <span>Email: </span>
                    <span className="sub-section-sub-title">
                      dishapandey@careq.com
                    </span>
                  </div>
                </div>
              </div>
              <Button variant={"default"} size={'default'}>Schedule Follow Up</Button>
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
