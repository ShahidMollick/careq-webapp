// redux/appointmentSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define types
export interface Appointment {
  id: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  time: string;
}

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
};

// Create async thunk for fetching appointments from an API
export const fetchAppointments = createAsyncThunk<Appointment[]>(
  'appointments/fetchAppointments',
  async () => {
    const response = await fetch('http://localhost:5000/api/appointments');
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    return response.json();
  }
);

// Create the slice
const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load appointments';
      });
  },
});

export default appointmentSlice.reducer;
