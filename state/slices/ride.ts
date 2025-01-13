import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ESlicesNames } from "../enums/slicesNames";
import { IBusStop, ILoading, IRide, IRideState, IStateInput, ITicket, TActiveTab, TCounterFareStatus, TCurrentrideView, } from "../types/ride";


const initialState: IRideState = {
    dropoffBusstopInput: null,
    pickupBusstopInput: null,
    currentRoute: null,
    driverOnline: false,
    driverEligible: false,
    ridersOffers:[],
    currentRiderOfferIndex: null,
    presetRoutes: [],
    rideAcceptStage: "searching"
}

const RideSlice = createSlice({
    name: ESlicesNames.ride,
    initialState,
    reducers: {
        setRideState: (state, action: PayloadAction<{key: keyof IRideState, value: any}>) => {
            const { key, value } = action.payload;
            state[key] = value as never;
        }
    }
})

export const { 
    setRideState,
} = RideSlice.actions;

export default RideSlice.reducer;