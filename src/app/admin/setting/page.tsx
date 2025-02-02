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
import local from "next/font/local";
import Cookies from "js-cookie";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FormData {
  clinicName: string;
  address: string;
  operatingHours: string;
  phone: string;
  email: string;
  website: string;
  about: string;
  schedules: Array<{
    id: string;
    dayOfWeek: number;
    fromTime: string;
    toTime: string;
  }>;
}

const ClinicProfilePage: React.FC = () => {
  const userEmail = localStorage.getItem("userEmail");
  const clinic = JSON.parse(localStorage.getItem("selectedFacility") || "{}");
  console.log(clinic);
  const initialValues: FormData = {
    clinicName: clinic?.name || "",
    address: clinic?.streetAddress || "",
    operatingHours: "",
    phone: clinic?.phoneNumber || "",
    email: userEmail || "",
    website: clinic?.website || "",
    about: clinic?.description || "",
    schedules: clinic?.schedules || [],
  };

  const [formData, setFormData] = useState(initialValues);
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
    if (event.target.files && event.target.files.length > 0) {
      setUploadedImages((prev) => [
        ...prev,
        ...Array.from(event.target.files!),
      ]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getDayName = (dayNumber: number): string => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayNumber] || "";
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="w-full h-fit">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Clinic Profile Settings</CardTitle>
          <CardDescription>
            Update clinic details for better patient accessibility.
          </CardDescription>
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
              <ClinicTimings schedules={formData.schedules} />
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
