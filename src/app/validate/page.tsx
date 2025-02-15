"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/utils/apiClient";
import Image from "next/image";
interface TimeSlot {
  from?: string;
  to?: string;
  maxPatients?: number;
  bookingWindowHour?: number;
}
interface HospitalSchedule {
  hospital?: string;
  appointmentFee?: number;
  availabilityStatus?:
    | "Break"
    | "Consulting"
    | "NotYetStarted"
    | "Unavailable"
    | "OnLeave";
  availableDays?: string[];
  availableTime?: TimeSlot[];
}
interface DoctorProfile {
  name?: string;
  phoneNumber?: string;
  specialty?: string;
  qualification?: string;
  licenseNumber?: string;
  address?: string;
  languages?: string[];
  experience?: number;
  profilePhoto?: string;
  images?: string[];
  about?: string;
  fees?: number;
  hospitals?: HospitalSchedule[];
  email?: string;
}

const ValidateDoctorProfile = () => {
  const [isModified, setIsModified] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // state to check if component is mounted
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [cases, setCase] = useState(false);
  const [prefilled, setPrefilled] = useState(false);
  
  const [initialValues, setInitialValues] = useState<DoctorProfile | null>(
    null
  );
  const [formData, setFormData] = useState({
    firstName: "",
    licenseNumber: "",
    specialty: "",
    about: "",
    phoneNumber: "",
    qualification: "",
    fees: 0,
  });

  useEffect(() => {
    if (initialValues) {
      setFormData({
        firstName: initialValues.name?.split(" ")[0] || "",
        licenseNumber: initialValues.licenseNumber || "",
        specialty: initialValues.specialty || "",
        about: initialValues.about || "",
        phoneNumber: initialValues.phoneNumber || "",
        qualification: initialValues.qualification || "",
        fees: initialValues.fees || 0,
      });
    }
  }, [initialValues]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [id]: value };
      setIsModified(JSON.stringify(newData) !== JSON.stringify(initialValues));
      return newData;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [id]: value };
      setIsModified(JSON.stringify(newData) !== JSON.stringify(initialValues));
      return newData;
    });
  };

  // Set isMounted to true once the component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only run the router logic if the component is mounted
  const router = useRouter();
  
  const facilityId = localStorage.getItem("selectedFacilityId");
  // const response = await apiClient.get(`/doctor/facility/${facilityId}`);

  const handlegetDoctorData = async () => {
    if (!facilityId) {
      setError("Facility ID is missing. Please select a facility.");
      return;
    }
    try {
      const response = await apiClient.post("/doctor/validate", {
        email: "adarshmishrajnv91@gmail.com",
        facilityId: "cb42beff-f6b8-40ed-8bf1-7821fcc1c6de",
      });
      console.log(response.data);
      setInitialValues(response.data);
      setFormData({
        firstName: response.data?.name || "",
        licenseNumber: response.data?.licenseNumber || "",
        specialty: response.data?.specialty || "",
      
        about: response.data?.about || "",
        phoneNumber: response.data?.phoneNumber || "",
        qualification: response.data?.qualification || "",
       
        fees: response.data?.fees || 0,
       
      });
    } catch (error: any) {
      console.error("Request failed:", error.message);
      setError(
        "Failed to validate the doctor. Please check your details and try again."
      );
    }
  };
  // useEffect(() => {
  //   if (router.isReady && router.query.token) {
  //     setToken(router.query.token as string);
  //   }
  // }, [router.isReady, router.query.token]);

  useEffect(() => {
    if (token) {
      const verifyProfile = async () => {
        try {
          const response = await axios.get(
            `/api/doctor/validate-profile?token=${token}`
          );
          setIsVerified(true);
        } catch (err) {
          setError("Invalid or expired token. Please check the link again.");
        }
      };
      verifyProfile();
    }
  }, [token]);

  useEffect(() => {
    handlegetDoctorData();
  }, []);

  // Render loading screen while the component is mounting
  if (!isMounted) {
    return <div>Loading...</div>;
  }

  // Show the error if the token is invalid
  if (error) {
    return (
      <div>
        <h1>{error}</h1>
      </div>
    );
  }

  // Show verification message if profile is verified
  if (isVerified) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h1>Your profile is successfully validated!</h1>
        <p>You can now proceed to complete your doctor profile.</p>
        {/* Provide UI for the user to add more information if needed */}
        {/* You can redirect them or show the profile form */}
      </div>
    );
  }

  // Default loading message
 
   

    return (
      <div className="bg-white w-full min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-md">
          <button
            onClick={() => router.push("/settings")}
            onMouseEnter={() => router.prefetch("/settings")}
          >
            <div className="bg-white p-4 rounded-lg shadow-md">
              {/* <div className="flex items-center">
                <div className="h-30 w-30 relative rounded-full">
                  <Image
                    src={"/doctor.svg"}
                    alt="profile"
                    height={120}
                    width={120}
                    className="rounded-full border-8 border-white border-spacing-0 z-10"
                  />
                </div>
                <div className="mx-4 text-2xl font-bold">+</div>
                <div className="h-30 w-30 relative">
                  <Image
                    src={"/login.jpg"}
                    alt="profile"
                    height={120}
                    width={170}
                    className="border-8 border-white border-spacing-0 z-10 rounded-none"
                  />
                </div>
              </div> */}
              <div className="flex items-end gap-4 p-0">
                <div className="flex justify-center items-end gap-4 p-0 pt-0"></div>
                <div className="flex flex-col gap-4 w-full">
                  <div className="w-full pl-0 flex flex-col">
                    <div className="flex gap-4 w-full">
                      <div className="flex flex-col gap-2 w-1/2">
                        <Label htmlFor="firstName" className="text-left">
                          Name
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="Enter Name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          readOnly={prefilled}
                          style={{
                            backgroundColor: prefilled ? "#f3f4f6" : "",
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2 w-1/2">
                        <Label htmlFor="licenseNumber" className="text-left">
                          License Number
                        </Label>
                        <Input
                          id="licenseNumber"
                          placeholder="Enter your License Number"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          readOnly={cases && prefilled}
                          style={{
                            backgroundColor: cases && prefilled ? "#f3f4f6" : "",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-row gap-2 items-center">
                    <div className="w-2/3 flex flex-col max-w-sm gap-2">
                      <Label htmlFor="specialty" className="text-left">
                        Specialty
                      </Label>
                      <Input
                        id="specialty"
                        placeholder="e.g. Dentist"
                        value={formData.specialty}  
                        onChange={handleInputChange}
                        readOnly={cases && prefilled}
                        style={{
                          backgroundColor: cases && prefilled ? "#f3f4f6" : "",
                        }}
                      />
                    </div>
                    <div className="w-3/4 flex flex-col max-w-sm gap-2">
                      <div className="flex gap-4 max-w-md justify-between items-center">
                        <Label className="text-left">Contact Number</Label>
                      </div>
                      <Input
                        id="phoneNumber"
                        type="string"
                        placeholder="Contact Number"
                        value={
                          formData.phoneNumber.startsWith("+91")
                            ? formData.phoneNumber
                            : `+91${formData.phoneNumber}`
                        }
                        onChange={handleInputChange}
                        readOnly={cases && prefilled}
                        style={{
                          backgroundColor: cases && prefilled ? "#f3f4f6" : "",
                        }}
                      />
                    </div>
                    <div className="w-1/3 flex flex-col max-w-sm gap-2">
                      <Label htmlFor="fees" className="text-left">
                        Fee
                      </Label>
                      <Input
                        id="fees"
                        placeholder="Doctors fees"
                        type="number"
                        value={formData.fees}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-6/7 flex flex-col p-4">
                <Label htmlFor="about" className="text-left items-end">
                  About
                </Label>
                <Textarea
                  id="about"
                  placeholder="Share your professional journey..."
                  value={formData.about}
                  onChange={handleTextareaChange}
                  className="h-full mt-2 w-full min-w-full min-h-20"
                  readOnly={cases && prefilled}
                  style={{
                    backgroundColor: cases && prefilled ? "#f3f4f6" : "",
                  }}
                />
              </div>
            </div>
          </button>
        </div>
      </div>
    );
 
};

export default ValidateDoctorProfile;
