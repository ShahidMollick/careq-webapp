'use client';
import React, { useEffect } from "react";
import {
  fetchAppointmentsByDoctor,
  fetchTodayAppointmentsByDoctor,
  selectAllAppointments,
  fetchFollowUpAppointmentsByDoctor
} from "../redux/appointmentSlice";
import { AppDispatch } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";

interface ParentComponentProps {
  children: React.ReactNode;
}

const ParentComponent: React.FC<ParentComponentProps> = ({ children }) => {
  const dispatch: AppDispatch = useDispatch();
  // Fetch only if we haven't already
useEffect(() => {
    dispatch(fetchAppointmentsByDoctor());
    dispatch(fetchTodayAppointmentsByDoctor());
    dispatch(fetchFollowUpAppointmentsByDoctor());
    console.log("fetching appointments");
}, []);

  return <>{ children }</>;
};

export default ParentComponent;
