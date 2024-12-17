import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Define the Appointment type
interface Appointment {
  _id: string;
  patient: {
    _id: string;
    name: string;
    age: number;
    email: string;
    contactNumber: string;
  };
  doctor: {
    _id: string;
    appointmentFee: number;
  };
  appointmentDate: string;
  queueNumber: number;
  status: string;
  isFollowUp: boolean; // Indicates if this is a follow-up appointment
  followUpFee?: number | null; // Follow-up appointment fee (can be 0)
  followUpSubStatus?:
    | "Pending Confirmation"
    | "Appointment Confirmed"
    | "Appointment Completed";
  paymentStatus: string;
  queueStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Initial state
const initialState: {
  totalAppointments: number;
  totalWaiting: number;
  totalConsulted: number;
  totalFollowUpAppointments: number;
  followUpAppointments: Appointment[]; // Separate state for follow-up appointments
  loading: boolean;
  error: string | null;
  appointments: Appointment[];
} = {
  totalAppointments: 0,
  totalWaiting: 0,
  totalConsulted: 0,
  totalFollowUpAppointments: 0,
  followUpAppointments: [],
  loading: false,
  error: null,
  appointments: [],
};

// Create async thunk for fetching appointments from an API
export const fetchAppointments = createAsyncThunk<Appointment[], string>(
  "appointments/fetchAppointments",
  async (doctorId: string): Promise<Appointment[]> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointment/doctor/${doctorId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch appointments");
    }
    const appointments: Appointment[] = await response.json();
    return appointments;
  }
);

// Create the slice
const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAppointments.fulfilled,
        (state, action: PayloadAction<Appointment[]>) => {
          state.loading = false;
          state.appointments = action.payload;

          // Calculate derived state
          state.totalAppointments = action.payload.length;
          state.totalWaiting = action.payload.filter(
            (appointment) => appointment.queueStatus === "Waiting"
          ).length;
          state.totalConsulted = action.payload.filter(
            (appointment) => appointment.queueStatus === "Completed"
          ).length;

          // Filter follow-up appointments
          state.followUpAppointments = action.payload.filter(
            (appointment) => appointment.isFollowUp
          );

          state.totalFollowUpAppointments = state.followUpAppointments.length;
        }
      )
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load appointments";
      });
  },
});

export default appointmentSlice.reducer;

// Selectors
export const selectAppointments = (state: RootState) =>
  state.appointments.appointments;
export const selectFollowUpAppointments = (state: RootState) =>
  state.appointments.followUpAppointments;
export const selectTotalAppointments = (state: RootState) =>
  state.appointments.totalAppointments;
export const selectTotalWaiting = (state: RootState) =>
  state.appointments.totalWaiting;
export const selectTotalConsulted = (state: RootState) =>
  state.appointments.totalConsulted;
export const selectTotalFollowUpAppointments = (state: RootState) =>
  state.appointments.totalFollowUpAppointments;
export const selectLoading = (state: RootState) => state.appointments.loading;
export const selectError = (state: RootState) => state.appointments.error;
