"use client"
import React, { useState } from 'react';
import { useRouter } from "next/navigation";;
import Cookies from "js-cookie";
import ClinicRegistrationDialog from '@/common/ui/ClinicRegistrationDialog';
import { useDispatch } from "react-redux";
import { setUserRoles } from "@/app/redux/userRolesSlice";
import apiClient from '@/utils/apiClient';

// Define the ScheduleRow type
interface ScheduleRow {
  id: string;
  day: string;
  fromTime: string;
  toTime: string;
}

export default function FacilityReg() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);
  const dispatch = useDispatch();
  const userID = localStorage.getItem("userID");
const router = useRouter();
  const handleSubmit = async (clinicData: any, schedules: ScheduleRow[]) => {
    console.log("Clinic Data:", clinicData);
    console.log("Schedules:", schedules);
    
    const roles = await apiClient.get(`/user-facility-roles/${userID}`);
    const data = roles.data;
    
    dispatch(setUserRoles(data));

    const selectedFacility = data[0].facility;
    const selectedRole = data[0].role.name;

    // Store in cookies
    Cookies.set("selectedFacility", JSON.stringify(selectedFacility));
    Cookies.set("selectedRole", selectedRole);

    const primaryRole = data[0].role.name; // Assume the first role is primary
    console.log(primaryRole);

    // Handle redirection or close dialog
    closeDialog(); // Close the dialog
    router.push('/admin');
  };

  return (
    <div className="bg-white h-screen">
      <ClinicRegistrationDialog
        isOpen={true}
        onClose={closeDialog}
        onSubmit={handleSubmit} // This will handle submission
      />
    </div>
  );
}
