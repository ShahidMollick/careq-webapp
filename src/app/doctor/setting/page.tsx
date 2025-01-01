"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Upload, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

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
  contactNumber?: string;
  specialization?: string;
  qualification?: string;
  licenseNumber?: string;
  address?: string;
  languages?: string[];
  experience?: number;
  profilePicture?: string;
  images?: string[];
  about?: string;
  hospitals?: HospitalSchedule[];
}

const DashboardPage: React.FC = () => {
  // Initial values
  const [initialValues, setInitialValues] = useState<DoctorProfile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true); // Track loading state


  // State for profile data and tracking changes
  const [formData, setFormData] = useState({
    firstName: initialValues?.name?.split(" ")[0] || "",
    lastName: initialValues?.name?.split(" ")[1] || "",
    specialization: initialValues?.specialization || "",
    experience: initialValues?.experience || 0,
    about: initialValues?.about || "",
    contactNumber: initialValues?.contactNumber || "",
    qualification: initialValues?.qualification || "",
    licenseNumber: initialValues?.licenseNumber || "",
    address: initialValues?.address || "",
  });
  const [languages, setLanguages] = useState<string[]>([
    "Hindi",
    "English",
    "Bengali",
  ]);
  const [languageInput, setLanguageInput] = useState<string>("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null); // Track profile image
  const [isModified, setIsModified] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const [isLoadings, setIsLoadings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to handle language addition
  const addLanguage = () => {
    if (languageInput && !languages.includes(languageInput)) {
      setLanguages([...languages, languageInput]);
      setLanguageInput(""); // Clear the input after adding
    }
  };

  // Function to handle form field change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [id]: value };
      setIsModified(JSON.stringify(newData) !== JSON.stringify(initialValues));
      return newData;
    });
  };

  // Function to handle textarea change
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [id]: value };
      setIsModified(JSON.stringify(newData) !== JSON.stringify(initialValues));
      return newData;
    });
  };

  // Function to handle profile image upload
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

  // Function to handle image upload (for other images)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedImages((prev) => [...prev, ...Array.from(event.target.files)]);
      setIsModified(true); // Mark as modified
    }
  };

  // Function to remove an uploaded image
  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setIsModified(true); // Mark as modified
  };

  // Function to save changes
  const handleSave = async () => {
    setIsLoadings(true);
    setError(null);

    try {
      // Convert images to base64
      const profilePictureBase64 = profileImage
        ? await fetch(profileImage)
            .then((r) => r.blob())
            .then(fileToBase64)
        : undefined;
      const imagesBase64 = await Promise.all(
        uploadedImages.map((file) => fileToBase64(file))
      );

      const profileData: DoctorProfile = {
        name: `${formData.firstName} ${formData.lastName}`,
        specialization: formData.specialization,
        experience: formData.experience,
        about: formData.about,
        languages: languages,
        profilePicture: profilePictureBase64,
        images: imagesBase64,
        contactNumber: formData.contactNumber,
        qualification: formData.qualification,
        licenseNumber: formData.licenseNumber,
        address: formData.address,
        hospitals: initialValues?.hospitals, // Preserve existing hospital data
      };

      const doctorId = localStorage.getItem("doctorId"); // Retrieve doctor ID from local storage
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctor/${doctorId}/profile`,
        profileData
      );

      if (response.status === 200) {
        setIsModified(false);
        setOpenConfirmDialog(false);
        setInitialValues(response.data);
        toast.success("profile updated succesfully");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoadings(false);
    }
  };

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const doctorId = localStorage.getItem("doctorId");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/doctor/${doctorId}/profile`
        );
        const profile = response.data;

        // Split name into first and last name
        const [firstName = "", lastName = ""] = (profile.name || "").split(" ");
        setInitialValues(profile);
        setFormData({
          firstName,
          lastName,
          specialization: profile.specialization || "",
          experience: profile.experience || 0,
          about: profile.about || "",
          contactNumber: profile.contactNumber || "",
          qualification: profile.qualification || "",
          licenseNumber: profile.licenseNumber || "",
          address: profile.address || "",
        });
        setLanguages(profile.languages || []);
        setProfileImage(profile.profilePicture || null);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    };

    fetchDoctorProfile();
  }, []);
  console.log(isLoading);
 

  // Error display component
  const ErrorMessage = () =>
    error ? <div className="text-red-500 text-sm mt-2">{error}</div> : null;

  return (
    <div className="w-full h-fit">
      <Toaster />
      <Card className="w-full">
        <CardHeader className="flex">
          <div className="flex flex-row justify-between">
            <div>
              <CardTitle className="text-lg">Profile Settings</CardTitle>
              <CardDescription>
                Update your profile to ensure patients get the best experience
                when interacting with you.
              </CardDescription>
            </div>
            <div>
              {/* Save Button in Header */}
              {isModified && (
                <Dialog
                  open={openConfirmDialog}
                  onOpenChange={setOpenConfirmDialog}
                >
                  <DialogTrigger asChild>
                    <Button onClick={() => setOpenConfirmDialog(true)}>
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
                          {`${formData.firstName} ${formData.lastName}` !==
                            initialValues?.name && (
                            <li>
                              Name: {formData.firstName} {formData.lastName}
                            </li>
                          )}
                          {formData.specialization !==
                            initialValues?.specialization && (
                            <li>Specialization: {formData.specialization}</li>
                          )}
                          {formData.experience !==
                            initialValues?.experience && (
                            <li>Experience: {formData.experience} years</li>
                          )}
                          {formData.about !== initialValues?.about && (
                            <li>About: {formData.about}</li>
                          )}
                        </>
                      )}
                    </ul>
                    <DialogFooter>
                      <DialogClose>
                        <Button
                          variant="outline"
                          onClick={() => setOpenConfirmDialog(false)}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Confirm Save"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <Separator className="my-4" />
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Profile Picture */}
            <div className="flex items-end gap-4">
              <div className="h-28 w-28 relative rounded-full">
                <Image
                  src={profileImage || "/doctor.svg"}
                  alt="profile"
                  height={120}
                  width={120}
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
              <div className="w-full pl-8 flex flex-col">
                <div className="flex gap-4 w-full">
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label htmlFor="firstName">First Name</Label>
                    {isLoading?<Skeleton className=" bg-gray-100 h-8 w-full" />:
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
}
                  </div>
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label htmlFor="lastName">Last Name</Label>
                    {isLoading?<Skeleton className=" bg-gray-100 h-9 w-full" />:<Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />}
                    
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-row gap-8 items-center">
              {/* Specialization */}
              <div className="w-full flex flex-col max-w-sm gap-2">
                <Label htmlFor="specialization">Specialization</Label>
                {isLoading?<Skeleton className=" bg-gray-100 h-9 w-full" />:<Input
                  id="specialization"
                  placeholder="e.g., Cardiologist, Dentist"
                  value={formData.specialization}
                  onChange={handleInputChange}
                />}
                
              </div>

              {/* Languages */}
              <div>
                <div className="flex gap-4 max-w-md justify-between items-center">
                  <Label>Languages You Speak</Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="flex items-center p-2 m-0 gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Language
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add a New Language</DialogTitle>
                      </DialogHeader>
                      <Input
                        placeholder="Enter language name"
                        value={languageInput}
                        onChange={(e) => setLanguageInput(e.target.value)}
                      />
                      <DialogFooter>
                        <DialogClose>
                          <Button onClick={addLanguage}>Add Language</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                {isLoading?<Skeleton className=" bg-gray-100 mt-2 h-5 w-full" />:
                <div className="flex flex-wrap gap-2 mt-2">
                  {languages.map((language, index) => (
                    <Badge variant="outline" key={index}>
                      {language}
                    </Badge>
                  ))}
                </div>
}
              </div>

              {/* Experience */}
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                {isLoading?<Skeleton className=" bg-gray-100 h-9 w-full" />:
                <Input
                  id="experience"
                  placeholder="Enter your total years of experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleInputChange}
                />
}
              </div>
            </div>

            {/* About Yourself */}
            <div>
              <Label htmlFor="about">About You</Label>
              {isLoading?<Skeleton className=" bg-gray-100 min-h-40 w-full" />:
              <Textarea
                id="about"
                placeholder="Share your professional journey, your specialties, and what drives you as a healthcare professional."
                value={formData.about}
                onChange={handleTextareaChange}
                className="h-full min-h-40"
              />
}
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
          <ErrorMessage />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
