// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import appointmentReducer from './appointmentSlice';
import userRolesReducer from "./userRolesSlice";

const store = configureStore({
  reducer: {
    appointments: appointmentReducer,
    userRoles: userRolesReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
