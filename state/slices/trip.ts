import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ESlicesNames } from "../enums/slicesNames";
import { ITripState } from "../types/trip";

const initialState: ITripState = {
  driverOnline: false,
  driverEligible: false,
  ridersOffers: [],
  currentRiderOfferIndex: 1,
  tripRequestInView: null,
  presetRoutes: [],
  query: "accepting",
  selectedRoute: null,
  currentRequest: null,
  dropoffBusstopInput: null,
  pickupBusstopInput: null,
  departureDateInput: "",
  departureTimeInput: "",
  intripDropoffsInput: [],
  presetTrips: [],
  upcomingTrips: [],
  acceptedRequests: [],
  allRequests: [],
  unAcceptedRequests: [],
  currentPresetTrip: null,
  currentUpcomingTrip: null,
  countdownStatus: "idle",
};

const TripSlice = createSlice({
  name: ESlicesNames.trip,
  initialState,
  reducers: {
    setTripState: (
      state,
      action: PayloadAction<{ key: keyof ITripState; value: any }>
    ) => {
      const { key, value } = action.payload;
      state[key] = value as never;
    },
  },
});

export const { setTripState } = TripSlice.actions;

export default TripSlice.reducer;
