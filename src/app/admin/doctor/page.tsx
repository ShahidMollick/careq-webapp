"use client";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus ,Upload} from "lucide-react";
import { Pencil ,PlusCircle,X} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import apiClient from "@/utils/apiClient";
import { MoreHorizontal, Trash2, UserPlus } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  description: string;
  schedule: { day: string; timings: string; amount: string }[];
  status: "Not yet started" | "Consulting" | "Break";
  profilePic: string;
};

const initialDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Shahid Mollick",
    specialty: "Cardiologist",
    phone: "9987678896",
    email: "shahidmollick13@gmail.com",
    description:
      "Dr. Shahid is an experienced cardiologist with over 15 years of expertise in treating heart diseases.",
    schedule: [
      { day: "Mon", timings: "9AM - 12PM", amount: "Rs. 500" },
      { day: "Wed", timings: "2PM - 5PM", amount: "Rs. 450" },
    ],
    status: "Consulting",
    profilePic: "/doctor.svg",
  },
  {
    id: 2,
    name: "Dr. Anjali Mehta",
    specialty: "Neurologist",
    phone: "9876543210",
    email: "anjali.mehta@gmail.com",
    description:
      "Dr. Anjali specializes in neurology and has successfully treated complex brain disorders.",
    schedule: [
      { day: "Tue", timings: "10AM - 1PM", amount: "Rs. 600" },
      { day: "Thu", timings: "3PM - 6PM", amount: "Rs. 550" },
    ],
    status: "Not yet started",
    profilePic: "/doctor.svg",
  },
  {
    id: 3,
    name: "Dr. Ravi Kapoor",
    specialty: "Orthopedic",
    phone: "9765432101",
    email: "ravi.kapoor@gmail.com",
    description:
      "Dr. Ravi is a skilled orthopedic surgeon with a focus on bone injuries and joint replacement.",
    schedule: [
      { day: "Fri", timings: "9AM - 11AM", amount: "Rs. 700" },
      { day: "Sat", timings: "11AM - 2PM", amount: "Rs. 650" },
    ],
    status: "Break",
    profilePic: "/doctor.svg",
  },
];

interface ScheduleRow {
  id: string;
  day: string;
  fromTime: string;
  toTime: string;
}
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
  profilePicture?: string;
  images?: string[];
  about?: string;
  fees?: number;  
  hospitals?: HospitalSchedule[];
  email?: string;
}


export default function DoctorsTable() {
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [doctors, setDoctors] = useState(initialDoctors);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("All");
  const { toast } = useToast();
  const [isModified, setIsModified] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoadings, setIsLoadings] = useState(false);
  const [step, setStep] = useState(1);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [schedules, setSchedules] = useState<ScheduleRow[]>([
    { id: "1", day: "", fromTime: "", toTime: "" },
  ]);
  const createSchedules = async (schedules: any[]) => {
    const response = await apiClient.post("/facilities/schedule", schedules);
    return response.data;
  };
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

 
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [initialValues, setInitialValues] = useState<DoctorProfile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
const [formData, setFormData] = useState({
  firstName: initialValues?.name?.split(" ")[0] || "",
  LicenseNumber: initialValues?.name?.split(" ")[1] || "",
  specialty: initialValues?.specialty || "",
  experience: initialValues?.experience || 0,
  about: initialValues?.about || "",
  phoneNumber: initialValues?.phoneNumber || "",
  qualification: initialValues?.qualification || "",
  licenseNumber: initialValues?.licenseNumber || "",
  address: initialValues?.address || "",
  fees: initialValues?.fees || 0,
  email: initialValues?.email || "",
});
 
  
  
  const [error, setError] = useState<string | null>(null);
  

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesDay =
      selectedDay === "All" ||
      doctor.schedule.some((schedule) => schedule.day === selectedDay);
    return matchesSearch && matchesDay;
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

 
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [id]: value };
      setIsModified(JSON.stringify(newData) !== JSON.stringify(initialValues));
      return newData;
    });
  };

  const updateSchedule = (
    id: string,
    field: keyof ScheduleRow,
    value: string
  ) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, [field]: value } : schedule
      )
    );
  };

  const addScheduleRow = () => {
    const newRow: ScheduleRow = {
      id: Date.now().toString(),
      day: "",
      fromTime: "",
      toTime: "",
    };
    setSchedules([...schedules, newRow]);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedImages((prev) => [...prev, ...Array.from(event.target.files)]);
      setIsModified(true); // Mark as modified
    }
  };
  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setIsModified(true); // Mark as modified
  };
  
  // const handleAddDoctor = () => {
  //   if (email) {
  //     setShowDoctorForm(true);
  //     setStep(1);  // Reset to first step when adding a new doctor
  //   } else {
  //     toast({
  //       title: "Error",
  //       description: "Please enter an email address.",
  //       action: <ToastAction altText="Try again">Try again</ToastAction>,
  //     });
  //   }
  // };

  const handleAddDoctor = async () => {
    setIsLoadings(true);
    setError(null);
  
    try {
      const facilityId = localStorage.getItem("facilityId");
  
      if (!formData.email || !facilityId) {
        throw new Error("Email and Facility ID are required.");
      }
  
      // Call the backend and log the full response
      const response = await apiClient.post("/doctor/validate", {
        email: formData.email,
        facilityId,
      });
  
      console.log("Full backend response:", response);
  
      const status = response.data.status;
      console.log("Status:", status);
  
      switch (status) {
        case "USER_NOT_FOUND":
          console.log("User not found");
          setShowDoctorForm(true);
          setStep(1);
          break;
  
        case "USER_FOUND_BUT_NOT_DOCTOR":
          toast({
            title: "User found but not a doctor",
            description: "The user exists, but no doctor profile found.",
            action: <ToastAction altText="Proceed to create profile">Proceed</ToastAction>,
          });
          setShowDoctorForm(true);
          setStep(1);
          break;
  case "EXISTING_DOCTOR":
    const doctorProfile = response.data.doctorProfile;
    console.log("doctorProfile:", doctorProfile);
    setInitialValues(doctorProfile);
    setFormData({
      about: doctorProfile?.about || "",
      LicenseNumber: doctorProfile?.licenseNumber || "",
      phoneNumber: doctorProfile?.phoneNumber || "",
      profilePhoto: doctorProfile?.profilePhoto || "",
      specialty: doctorProfile?.specialty || "",
      fees: doctorProfile?.fees || 500,
    });
    setShowDoctorForm(true);
    setStep(1);
    break;

        // case "USER_FOUND_AND_DOCTOR_FOUND_IN_SAME_FACILITY":
        //   toast({
        //     title: "Doctor already exists",
        //     description: "This doctor is already part of this facility.",
        //     action: <ToastAction altText="Try again">Doctor Already exists at the same clinic</ToastAction>,
        //   });
        //   break;
      
          default:
          toast({
            title: "Unknown error",
            description: "An unknown error occurred while validating the doctor.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error from server:", error.response?.data || error.message);
      } else {
        console.error("Error from server:", error);
      }
      toast({
        title: "Error",
        description: (error as any).response?.data?.message || "Failed to validate the doctor. Please try again.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsLoadings(false);
    }
  

  };
  
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [id]: value };
      setIsModified(JSON.stringify(newData) !== JSON.stringify(initialValues));
      return newData;
    });
  };
  const handleSave = async () => {
    setIsLoadings(true);
    setError(null);

    try {
      const email = formData.email;
      const facilityId = localStorage.getItem("facilityId");

      if (!email || !facilityId) {
        throw new Error("Email and Facility ID are required.");
      }

      // Prepare data according to CreateDoctorProfileDto
      const doctorData = {
        email: email,
        name: formData.firstName,
        licenseNumber: formData.LicenseNumber, 
        specialty: formData.specialty,
        phoneNumber: formData.phoneNumber,
        profilePhoto: profileImage, // Just pass the image URL directly
        about: formData.about,
        facilityId: facilityId
      };

      console.log("Sending doctor data:", doctorData);

      const response = await apiClient.post("doctor/create-profile", doctorData);

      if (response.status === 201 || response.status === 200) {
        setIsModified(false);
        setOpenConfirmDialog(false); 
        setInitialValues(response.data);
        toast({
          title: "Success",
          description: "Doctor profile created successfully",
        });
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create profile");
        console.error("Error creating doctor profile:", err.response?.data);
      } else {
        setError("An unexpected error occurred");
        console.error("Error:", err);
      }
    } finally {
      setIsLoadings(false);
    }
  };
  


  const toggleSelectDoctor = (id: number) => {
    setSelectedDoctors((prev) =>
      prev.includes(id)
        ? prev.filter((doctorId) => doctorId !== id)
        : [...prev, id]
    );
  };

  const handleProfileImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl); // Set the new profile image
      setIsModified(true); // Mark as modified
    }
  };

 
  

  const toggleSelectAll = () => {
    if (selectedDoctors.length === filteredDoctors.length) {
      setSelectedDoctors([]);
    } else {
      setSelectedDoctors(filteredDoctors.map((doctor) => doctor.id));
    }
  };

  const removeScheduleRow = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  const handleDeleteSelected = () => {
    setDoctors((prev) =>
      prev.filter((doctor) => !selectedDoctors.includes(doctor.id))
    );
    setSelectedDoctors([]);
  };

  const handleDeleteDoctor = (id: number) => {
    setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));
  };

  const ErrorMessage = () =>
    error ? <div className="text-red-500 text-sm mt-2">{error}</div> : null;

  return (
    <div className="w-full p-4">
  <div className="flex justify-between items-center mb-4">
    <Input
      placeholder="Search Doctor..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-1/3"
    />
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" className="flex items-center">
          <UserPlus className="mr-2" />
          Add Doctor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[45%] max-h-[85%] overflow-y-auto scrollbar-hide">
      {!showDoctorForm && (
  <DialogHeader className="flex flex-col align-items-center justify-content-center">
    <DialogTitle>Invite Doctors to Your Clinic</DialogTitle>
    <p className="text-sm text-gray-500">
      Invite doctors to join your clinic by sharing the link below.
      They'll be able to create an account and get started right away.
    </p>
  </DialogHeader>
)}

{!showDoctorForm && (
  <div className="flex flex-row justify-content-center items-center p-2 rounded-md w-3/4">
    <Input
      type="email"
      placeholder="Enter doctor's email"
      autoFocus
      className="flex-grow"
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}  // Correct way to update email in formData

    />
    <Button
      color="green"
      className="ml-2"
      onClick={() => {
          handleAddDoctor();

      }}
      disabled={isLoadings}
    >
      {isLoadings ? (
         <div className="flex space-x-1">
         <span className="dot animate-bounce"></span>
         <span className="dot animate-bounce animation-delay-200"></span>
         <span className="dot animate-bounce animation-delay-400"></span>
       </div>

      ) : (
        <Plus />
      )}
    </Button>
  </div>
)}

        {showDoctorForm && (
          <div >
         
            <Toaster />
            
            <Card className="w-full shadow-none outline-none border-0 ">
                <div className="flex font-bold text-lg text-green-600 mb-6 ml-5">
                {step === 1 ? "Add doctor profile" : "Add Schedule"}
                </div>
              <CardContent >
               
              {step === 1 && (
   <div className="flex flex-col gap-6">
   {/* Profile Picture */}
 
   <div className="flex items-end gap-4 p-0">
     <div className="h-140 w-140 relative rounded-full">
       <Image
         src={profileImage || "/doctor.svg"}
         alt="profile"
         height={180}
         width={180}
         className="rounded-full"
       />
       <Button
         variant="outline"
         className="absolute rounded-full bottom-1 right-1"
         size="sm"
       >
         <label
           htmlFor="profile-image-upload"
           className="cursor-pointer"
         >
           <Pencil />
         </label>
       </Button>
     </div>
     <input
       id="profile-image-upload"
       type="file"
       className="hidden"
       onChange={handleProfileImageUpload}
     />
     {/* Name Fields */}
     <div className="flex flex-col gap-4 w-full">
     <div className="w-full pl-0 flex flex-col">
       <div className="flex gap-4 w-full">
         <div className="flex flex-col gap-2 w-1/2">
           <Label htmlFor="firstName"> Name</Label>
           <Input
             id="firstName"
             placeholder="Enter Name"
             value={formData.firstName}
             onChange={handleInputChange}
           />
         </div>
         <div className="flex flex-col gap-2 w-1/2">
           <Label htmlFor="LicenseNumber">License Number</Label>
           <Input
             id="LicenseNumber"
             placeholder="Enter your License Number"
             value={formData.LicenseNumber}
             onChange={handleInputChange}
           />
         </div>
       </div>
     </div>
     <div className="w-full flex flex-row gap-2 items-center">
     {/* specialty */}
     <div className="w-2/3 flex flex-col max-w-sm gap-2">
       <Label htmlFor="specialty">specialty</Label>
       <Input
         id="specialty"
         placeholder="e.g. Dentist"
         value={formData.specialty}
         onChange={handleInputChange}
       />
     </div>

     {/* Languages */}
    <div className="w-3/4 flex flex-col max-w-sm gap-2">
      <div className="flex gap-4 max-w-md justify-between items-center">
        <Label>Contact Number</Label>
      </div>
      <Input
        id="phoneNumber"
        type="string"
        placeholder="Contact Number"
        value={formData.phoneNumber.startsWith("+91") ? formData.phoneNumber : `+91${formData.phoneNumber}`}
        onChange={handleInputChange}
      />
    </div>

     {/* Fee */}
     <div className="w-2/3 flex flex-col max-w-sm gap-2">
       <Label htmlFor="fees"> Fee</Label>
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

   

   {/* About Yourself */}
   <div>
     <Label htmlFor="about">About You</Label>
     <Textarea
       id="about"
       placeholder="Share your professional journey, your specialties, and what drives you as a healthcare professional."
       value={formData.about}
       onChange={handleTextareaChange}
       className="h-full min-h-20"
     />
   </div>

   {/* Upload Images */}
   <div>
     <div className="flex flex-row items-center justify-between">
       <div className="flex flex-col gap-0.5">
         <Label>Upload Images</Label>
         <p className="text-sm text-gray-500">
           Help patients get to know you better by uploading any
           relevant images
         </p>
       </div>

       <Button
         variant="outline"
         size="lg"
         className="flex items-center gap-2"
       >
         <Upload className="w-5 h-5" />
         <label htmlFor="image-upload" className="cursor-pointer">
           Upload Images
         </label>
       </Button>
     </div>

     <Input
       id="image-upload"
       type="file"
       multiple
       className="hidden"
       onChange={handleImageUpload}
     />

     <div className="flex gap-4 mt-2">
       {uploadedImages.map((file, index) => (
         <div key={index} className="relative">
           <Image
             src={URL.createObjectURL(file)}
             alt="Uploaded Image"
             width={120}
             height={120}
             className="rounded-md"
           />
           <Button
             variant="outline"
             className="absolute top-0 right-0"
             size="sm"
             onClick={() => handleRemoveImage(index)}
           >
             <Trash2 className="w-4 h-4" />
           </Button>
         </div>
       ))}
     </div>
   </div>
 </div>
  )}

{step === 2 && (
              <div id="step-3" className="h-[375px]">
                {schedules.map((schedule, index) => (
                  <div
                    key={schedule.id}
                    className="flex flex-wrap items-end gap-4"
                  >
                    <div className="flex-1 ">
                      <Label htmlFor={`day-${schedule.id}`}>Day</Label>
                      <Select
                        value={schedule.day}
                        onValueChange={(value) =>
                          updateSchedule(schedule.id, "day", value)
                        }
                      >
                        <SelectTrigger
                          id={`day-${schedule.id}`}
                          className="mt-2"
                        >
                          <SelectValue placeholder="Select a day" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].map((day) => (
                            <SelectItem key={day} value={day.toLowerCase()}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 ">
                      <Label htmlFor={`from-${schedule.id}`}>From</Label>
                      <Input
                      type="time"
                      id={`from-${schedule.id}`}
                      value={schedule.fromTime}
                      onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                      onChange={(e) =>
                        updateSchedule(
                        schedule.id,
                        "fromTime",
                        e.target.value
                        )
                      }
                      className="mt-2"
                      />
                    </div>
                    <div className="flex-1 ">
                      <Label htmlFor={`to-${schedule.id}`}>To</Label>
                      <Input
                      type="time"
                      id={`to-${schedule.id}`}
                      value={schedule.toTime}
                      onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                      onChange={(e) =>
                        updateSchedule(schedule.id, "toTime", e.target.value)
                      }
                      />
                    </div>
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeScheduleRow(schedule.id)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove schedule row</span>
                      </Button>
                    )}
                  </div>
                ))}
                <div>
                  <Button onClick={addScheduleRow} className="ml-auto mt-2">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>

                {isModified && (
              <div className="fixed bottom-8 right-8 z-50 p-4">
                <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setOpenConfirmDialog(true)}
                      className="shadow-lg hover:shadow-xl transition-shadow"
                      size="lg"
                    >
                      Save Changes
                    </Button>
                  </DialogTrigger>

                  {/* Confirmation Dialog */}
                  <DialogContent>
  <DialogHeader>
    <DialogTitle>Confirm Changes</DialogTitle>
  </DialogHeader>
  <p className="mb-4 text-sm">
    You have made the following changes to your profile:
  </p>
  <ul className="list-disc pl-4 text-sm">
    {isModified && (
      <>
        {formData.firstName !== initialValues?.name && (
          <li>Name: {formData.firstName} </li>
        )}
        {formData.LicenseNumber !== initialValues?.name && (
          <li>License Number: {formData.LicenseNumber}</li>
        )}
        {formData.specialty !== initialValues?.specialty && (
          <li>specialty: {formData.specialty}</li>
        )}
        {formData.phoneNumber !== initialValues?.phoneNumber && (
          <li>Contact Number: {formData.phoneNumber}</li>
        )}
        {formData.fees !== initialValues?.fees && <li>Fees: {formData.fees}</li>}
        {formData.email !== initialValues?.email && <li>Email: {formData.email}</li>}

      </>
    )}
  </ul>
  <DialogFooter>
    <DialogClose>
      <Button
        variant="outline"
        onClick={() => setOpenConfirmDialog(false)}
        disabled={isLoading} // Disable "Cancel" button while saving
      >
        Cancel
      </Button>
    </DialogClose>
    <Button
      onClick={handleSave}
      disabled={!isLoading} // Disable the button when isLoading is true
    >
      {isLoading ? "Saving..." : "Confirm Save"} {/* Display loading or confirm text */}
    </Button>
  </DialogFooter>
</DialogContent>

                </Dialog>
              </div>
            )}
              </div>
            )}
                
                <ErrorMessage />
              </CardContent>
              <CardFooter className="flex justify-between mt-4">
  {/* Go Back Button */}
  <Button
    variant="outline"
    disabled={step === 1}  // Disable on Step 1
    onClick={() => setStep((prev) => prev - 1)}
  >
    Go Back
  </Button>

  {/* Go Next or Submit Button */}
  <Button onClick={() => step < 2 ? setStep((prev) => prev + 1) : handleSave()}>
    {step === 1 ? "Go Next" : "Submit"}  
  </Button>
</CardFooter>

            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
    
  </div>
  <Tabs
    defaultValue="All"
    className="mb-4"
    onValueChange={(value) => setSelectedDay(value)}
  >
    <TabsList>
      <TabsTrigger value="All">All</TabsTrigger>
      <TabsTrigger value="Mon">Mon</TabsTrigger>
      <TabsTrigger value="Tue">Tue</TabsTrigger>
      <TabsTrigger value="Wed">Wed</TabsTrigger>
      <TabsTrigger value="Thu">Thu</TabsTrigger>
      <TabsTrigger value="Fri">Fri</TabsTrigger>
      <TabsTrigger value="Sat">Sat</TabsTrigger>
      <TabsTrigger value="Sun">Sun</TabsTrigger>
    </TabsList>
  </Tabs>
  {selectedDoctors.length > 0 && (
    <div className="mb-4">
      <Button variant="destructive" onClick={handleDeleteSelected}>
        <Trash2 className="mr-2" />
        Delete Selected
      </Button>
    </div>
  )}
  <div className="overflow-x-auto rounded-md border mb-6">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              aria-label="Select All"
              checked={selectedDoctors.length === filteredDoctors.length}
              onCheckedChange={toggleSelectAll}
            />
          </TableHead>
          <TableHead>S No.</TableHead>
          <TableHead>Doctor Name</TableHead>
          <TableHead>Specialty</TableHead>
          <TableHead>Phone Number</TableHead>
          <TableHead>Email ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredDoctors.map((doctor, index) => (
          <TableRow key={doctor.id}>
            <TableCell>
              <Checkbox
                aria-label={`Select ${doctor.name}`}
                checked={selectedDoctors.includes(doctor.id)}
                onCheckedChange={() => toggleSelectDoctor(doctor.id)}
              />
            </TableCell>
            <TableCell>{index + 1}</TableCell>
            <TableCell className="flex items-center gap-2">
              <Image
                src={doctor.profilePic}
                alt={doctor.name}
                width={30}
                height={30}
                className="rounded-full"
              />
              {doctor.name}
            </TableCell>
            <TableCell>{doctor.specialty}</TableCell>
            <TableCell>{doctor.phone}</TableCell>
            <TableCell>{doctor.email}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  doctor.status === "Not yet started"
                    ? "bg-gray-200 text-gray-600"
                    : doctor.status === "Consulting"
                    ? "bg-green-200 text-green-600"
                    : "bg-red-200 text-red-600"
                }`}
              >
                {doctor.status}
              </span>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Sheet>
                    <SheetTrigger>
                      <Button variant="ghost">View profile</Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>{doctor.name}'s Profile</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col my-4 w-full items-center">
                        <Image
                          src={doctor.profilePic}
                          alt={doctor.name}
                          width={200}
                          height={200}
                          className="rounded-full mb-2"
                        />
                        <p className="text-sm text-center mb-4">
                          {doctor.description}
                        </p>
                        <div className="text-sm mb-4">
                          <p>
                            <strong>Phone:</strong> {doctor.phone}
                          </p>
                          <p>
                            <strong>Email:</strong> {doctor.email}
                          </p>
                        </div>
                      </div>
                      <div className="w-full mt-4">
                        <h3 className="text-lg font-semibold mb-2">
                          Schedule
                        </h3>
                        <div className="overflow-x-auto rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Day</TableHead>
                                <TableHead>Timings</TableHead>
                                <TableHead>Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {doctor.schedule.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>{item.day}</TableCell>
                                  <TableCell>{item.timings}</TableCell>
                                  <TableCell>{item.amount}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteDoctor(doctor.id)}
                  >
                    Delete
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</div>

  );
}
