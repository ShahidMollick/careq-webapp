"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ClinicTimings from "@/components/ui/ClinicTimings";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useState } from "react";
import { Upload, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Pencil } from "lucide-react";

const ClinicProfilePage: React.FC = () => {
  const initialValues = {
    clinicName: "",
    address: "",
    operatingHours: "",
    specialization: [],
    fee: "",
    languages: ["English", "Hindi"],
    phone: "",
    email: "",
    website: "",
    about: "",
  };

  const [formData, setFormData] = useState(initialValues);
  const [specializationInput, setSpecializationInput] = useState<string>("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedImages((prev) => [...prev, ...Array.from(event.target.files)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addSpecialization = () => {
    if (specializationInput && !formData.specialization.includes(specializationInput)) {
      setFormData((prev) => ({
        ...prev,
        specialization: [...prev.specialization, specializationInput],
      }));
      setSpecializationInput("");
    }
  };

  return (
    <div className="w-full h-fit">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Clinic Profile Settings</CardTitle>
          <CardDescription>Update clinic details for better patient accessibility.</CardDescription>
          <Separator className="my-4" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Clinic Details */}
            <div>
              <Label htmlFor="clinicName">Clinic Name</Label>
              <Input
                id="clinicName"
                placeholder="Enter your clinic name"
                value={formData.clinicName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="address">Clinic Address</Label>
              <Textarea
                id="address"
                placeholder="Enter clinic address"
                value={formData.address}
                onChange={handleTextareaChange}
              />
            </div>
            <div>
            <ClinicTimings />
            </div>

            {/* Specializations */}
            <div>
              <Label>Specializations</Label>
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Add specialization"
                  value={specializationInput}
                  onChange={(e) => setSpecializationInput(e.target.value)}
                />
                <Button onClick={addSpecialization}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.specialization.map((specialization, index) => (
                  <Badge key={index} variant="outline">
                    {specialization}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="website">Website/Booking Link</Label>
              <Input
                id="website"
                placeholder="Enter your website or booking link"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>

            {/* Languages */}
            <div>
              <Label>Languages Spoken</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.languages.map((language, index) => (
                  <Badge key={index} variant="outline">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Consultation Fee */}
            <div>
              <Label htmlFor="fee">Consultation Fee</Label>
              <Input
                id="fee"
                placeholder="Enter consultation fee"
                value={formData.fee}
                onChange={handleInputChange}
              />
            </div>

            {/* About Clinic */}
            <div>
              <Label htmlFor="about">About Clinic</Label>
              <Textarea
                id="about"
                placeholder="Describe your clinic, services offered, and facilities available."
                value={formData.about}
                onChange={handleTextareaChange}
              />
            </div>

            {/* Upload Clinic Images */}
            <div>
              <Label>Upload Clinic Images</Label>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                <label htmlFor="image-upload" className="cursor-pointer">
                  Upload Images
                </label>
              </Button>
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

export default ClinicProfilePage;
