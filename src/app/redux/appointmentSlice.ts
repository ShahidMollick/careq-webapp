import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAppointmentsByDoctor = createAsyncThunk(
  "appointments/fetchByDoctor",
  async () => {
    const doctorId = localStorage.getItem("doctorId");

    if (!doctorId) {
      throw new Error("Doctor ID not found in localStorage");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/doctor/${doctorId}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data;
  }
);

export const fetchTodayAppointmentsByDoctor = createAsyncThunk(
  "appointments/fetchTodayByDoctor",
  async () => {
    const doctorId = localStorage.getItem("doctorId");

    if (!doctorId) {
      throw new Error("Doctor ID not found in localStorage");
    }
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/doctor/${doctorId}?date=${formattedDate}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data;
  }
);

export const callNextPatient = createAsyncThunk(
  "appointments/callNext",
  async () => {
    const doctorId = localStorage.getItem("doctorId");

    if (!doctorId) {
      throw new Error("Doctor ID not found in localStorage");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/call-next/${doctorId}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    console.log("Next patient data:", data);
    return data;
  }
);

export const completeConsultation = createAsyncThunk(
  "appointments/complete",
  async () => {
    const doctorId = localStorage.getItem("doctorId");

    if (!doctorId) {
      throw new Error("Doctor ID not found in localStorage");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/finish/${doctorId}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    console.log("Completed appointment data:", data);
    return data;
  }
);

export const createFollowUpAppointment = createAsyncThunk(
  "appointments/createFollowUp",
  async (followUpData) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/follow-up`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(followUpData),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data;
  }
);

export const fetchFollowUpAppointmentsByDoctor = createAsyncThunk(
  "appointments/fetchFollowUpByDoctor",
  async () => {
    const doctorId = localStorage.getItem("doctorId");

    if (!doctorId) {
      throw new Error("Doctor ID not found in localStorage");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/follow-up/doctor/${doctorId}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    return data;
  }
);



interface Appointment {
  _id: string;
  queueStatus: string;
  // Add other fields as necessary
}

interface AppointmentState {
  appointments: Appointment[];
  todayAppointments: Appointment[];
  followUpAppointments: Appointment[];
  status: string;
  error: string | null;
  selectedAppointment: Appointment | null;
}

const initialState: AppointmentState = {
  appointments: [],
  todayAppointments: [],
  followUpAppointments: [],
  status: "idle",
  error: null,
  selectedAppointment: null,
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setSelectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
    clearAppointments: (state) => {
      state.appointments = [];
      state.todayAppointments = [];
      state.followUpAppointments = [];
      state.status = "idle";
      state.error = null;
    },
    updateAppointmentStatus: (state, action) => {
      const { appointmentId, newStatus } = action.payload;
      state.appointments = state.appointments.map((appointment) =>
        appointment._id === appointmentId
          ? { ...appointment, queueStatus: newStatus }
          : appointment
      );
      state.todayAppointments = state.todayAppointments.map((appointment) =>
        appointment._id === appointmentId
          ? { ...appointment, queueStatus: newStatus }
          : appointment
      );
      state.followUpAppointments = state.followUpAppointments.map((appointment) =>
        appointment._id === appointmentId
          ? { ...appointment, queueStatus: newStatus }
          : appointment
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointmentsByDoctor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAppointmentsByDoctor.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.appointments = action.payload;
        state.error = null;
      })
      .addCase(fetchAppointmentsByDoctor.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An unknown error occurred";
      })
      .addCase(fetchTodayAppointmentsByDoctor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodayAppointmentsByDoctor.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todayAppointments = action.payload;
        state.error = null;
      })
      .addCase(fetchTodayAppointmentsByDoctor.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An unknown error occurred";
      })
      .addCase(fetchFollowUpAppointmentsByDoctor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFollowUpAppointmentsByDoctor.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.followUpAppointments = action.payload;
        state.error = null;
      })
      .addCase(fetchFollowUpAppointmentsByDoctor.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An unknown error occurred";
      })
      .addCase(callNextPatient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(callNextPatient.fulfilled, (state, action) => {
        const updateAppointment = (appointments) =>
          appointments.map((appointment) =>
            appointment._id === action.payload._id
              ? { ...appointment, queueStatus: "Serving" }
              : appointment
          );
        state.appointments = updateAppointment(state.appointments);
        state.todayAppointments = updateAppointment(state.todayAppointments);
        state.followUpAppointments = updateAppointment(state.followUpAppointments);
        state.status = "succeeded";
      })
      .addCase(callNextPatient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An unknown error occurred";
      })
      .addCase(completeConsultation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(completeConsultation.fulfilled, (state, action) => {
        const completedAppointmentId = action.payload.completedAppointment._id;
        const updateAppointment = (appointments) =>
          appointments.map((appointment) =>
            appointment._id === completedAppointmentId
              ? { ...appointment, queueStatus: "Completed" }
              : appointment
          );
        state.appointments = updateAppointment(state.appointments);
        state.todayAppointments = updateAppointment(state.todayAppointments);
        state.followUpAppointments = updateAppointment(state.followUpAppointments);
        state.status = "succeeded";
      })
      .addCase(completeConsultation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An unknown error occurred";
      })
      .addCase(createFollowUpAppointment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createFollowUpAppointment.fulfilled, (state, action) => {
        const updateAppointment = (appointments) =>
          appointments.map((appointment) =>
            appointment._id === action.payload.parentAppointment
              ? {
                  ...appointment,
                  isFollowUp: true,
                  followUpAppointment: action.payload._id,
                }
              : appointment
          );
        state.appointments = updateAppointment(state.appointments);
        state.todayAppointments = updateAppointment(state.todayAppointments);
        state.followUpAppointments = updateAppointment(state.followUpAppointments);
        state.status = "succeeded";
      })
      .addCase(createFollowUpAppointment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An unknown error occurred";
      });
  },
  
});

export const selectTodayAppointments = (state) => state.appointments.todayAppointments;
export const selectFollowUpAppointments = (state) => state.appointments.followUpAppointments;
export const selectAllAppointments = (state) => state.appointments.appointments;
export const selectAppointmentStatus = (state) => state.appointments.status;
export const selectAppointmentError = (state) => state.appointments.error;
export const selectSelectedAppointment = (state) => state.appointments.selectedAppointment;

export const {
  setSelectedAppointment,
  clearAppointments,
  updateAppointmentStatus,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;