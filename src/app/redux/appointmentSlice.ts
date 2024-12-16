// redux/appointmentSlice.ts
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
  loading: boolean;
  error: string | null;
  appointments: Appointment[];
} = {
  totalAppointments: 0,
  totalWaiting: 0,
  totalConsulted: 0,
  loading: false,
  error: null,
  appointments: [],
};

// Create async thunk for fetching appointments from an API
export const fetchAppointments = createAsyncThunk<Appointment[], string>(
  "appointments/fetchAppointments",
  async (doctorId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/appointment/doctor/${doctorId}`, {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch appointments");
    }
    const data: Appointment[] = await response.json();
    console.log(data);
    if (data.length > 0) {
      console.log(data[0].doctor.appointmentFee);
    }
    return data;
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
          state.totalAppointments = action.payload.length;
          state.totalWaiting = action.payload.filter(
            (appointment) => appointment.queueStatus === "Waiting"
          ).length;
          state.totalConsulted = action.payload.filter(
            (appointment) => appointment.queueStatus === "Completed"
          ).length;
        }
      )
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load appointments";
      });
  },
});

export default appointmentSlice.reducer;
export const selectAppointments = (state: RootState) =>
  state.appointments.appointments;
export const selectTotalAppointments = (state: RootState) =>
  state.appointments.totalAppointments;
export const selectTotalWaiting = (state: RootState) =>
    state.appointments.totalWaiting;
export const selectTotalConsulted = (state: RootState) =>
    state.appointments.totalConsulted;
export const selectLoading = (state: RootState) => state.appointments.loading;
export const selectError = (state: RootState) => state.appointments.error;
