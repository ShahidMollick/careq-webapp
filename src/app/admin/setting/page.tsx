"use client";
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
import { useState } from "react";
import { Upload, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Pencil } from "lucide-react";

const DashboardPage: React.FC = () => {
  // Initial values
  const initialValues = {
    firstName: "Shahid",
    lastName: "Mollick",
    specialization: "Internal Medicine",
    experience: 25,
    about:
      "I am Dr. Shahid Mollick, a consultant in Internal Medicine. I completed my MBBS from All India Institute of Medical Sciences (AIIMS), New Delhi, in 2015, followed by an MD in Internal Medicine from Post Graduate Institute of Medical Education and Research (PGIMER), Chandigarh, in 2018. With over 6 years of experience, I focus on patient-centered care and advancing medical research.",
  };

  // State for profile data and tracking changes
  const [formData, setFormData] = useState(initialValues);
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
  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setUploadedImages((prev) => [
        ...prev,
        ...Array.from(event.target.files),
      ]);
      setIsModified(true); // Mark as modified
    }
  };

  // Function to remove an uploaded image
  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setIsModified(true); // Mark as modified
  };

  // Function to save changes
  const handleSave = () => {
    console.log("Saving data...", formData);
    setIsModified(false); // Reset the modified state after saving
    setOpenConfirmDialog(false); // Close the confirmation dialog
  };

  return (
    <div className="w-full h-fit">
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
                <Dialog>
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
                          {formData.firstName !== initialValues.firstName && (
                            <li>First Name: {formData.firstName}</li>
                          )}
                          {formData.lastName !== initialValues.lastName && (
                            <li>Last Name: {formData.lastName}</li>
                          )}
                          {formData.specialization !==
                            initialValues.specialization && (
                            <li>Specialization: {formData.specialization}</li>
                          )}
                          {formData.experience !== initialValues.experience && (
                            <li>Experience: {formData.experience} years</li>
                          )}
                          {formData.about !== initialValues.about && (
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
                      <Button onClick={handleSave}>Confirm Save</Button>
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
                  <label htmlFor="profile-image-upload" className="cursor-pointer">
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
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-1/2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-row gap-8 items-center">
              {/* Specialization */}
              <div className="w-full flex flex-col max-w-sm gap-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  placeholder="e.g., Cardiologist, Dentist"
                  value={formData.specialization}
                  onChange={handleInputChange}
                />
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

                <div className="flex flex-wrap gap-2 mt-2">
                  {languages.map((language, index) => (
                    <Badge variant="outline" key={index}>
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  placeholder="Enter your total years of experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleInputChange}
                />
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
                className="h-full min-h-40"
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
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
