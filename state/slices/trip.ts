import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ESlicesNames } from "../enums/slicesNames";
import { ITripState } from "../types/trip";


const initialState: ITripState = {
    dropoffBusstopInput: null,
    pickupBusstopInput: null,
   departureDateInput: '',
   departureTimeInput: '',
   intripDropoffsInput: [],
   presetTrips: [],
   upcomingTrips: [],
   presetRoutes: [],
   currentPresetTrip: null,
   currentUpcomingTrip: null,
}

const TripSlice = createSlice({
    name: ESlicesNames.trip,
    initialState,
    reducers: {
        setTripState: (state, action: PayloadAction<{key: keyof ITripState, value: any}>) => {
            const { key, value } = action.payload;
            state[key] = value as never;
        }
    }
})

export const { 
    setTripState,
} = TripSlice.actions;

export default TripSlice.reducer;