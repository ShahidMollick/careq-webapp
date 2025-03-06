import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface ScheduleState {
    selectedScheduleId: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ScheduleState = {
    selectedScheduleId: null,
    isLoading: false,
    error: null,
};

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        selectSchedule: (state, action: PayloadAction<string>) => {
            state.selectedScheduleId = action.payload;
        },
        clearSelectedSchedule: (state) => {
            state.selectedScheduleId = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

// Export actions
export const { 
    selectSchedule, 
    clearSelectedSchedule, 
    setLoading,
    setError 
} = scheduleSlice.actions;

// Export selectors
export const selectSelectedScheduleId = (state: RootState) => state.schedule.selectedScheduleId;
export const selectScheduleLoading = (state: RootState) => state.schedule.isLoading;
export const selectScheduleError = (state: RootState) => state.schedule.error;

// Export reducer
export default scheduleSlice.reducer;