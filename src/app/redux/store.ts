// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import appointmentReducer from './appointmentSlice';
import scheduleReducer from './scheduleSlice';

const store = configureStore({
  reducer: {
    appointments: appointmentReducer,
    schedule: scheduleReducer, // Add schedule reducer
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
