// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import appointmentReducer from './appointmentSlice';


const store = configureStore({
  reducer: {
    appointments: appointmentReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
