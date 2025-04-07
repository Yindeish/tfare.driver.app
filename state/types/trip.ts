import { IUserAccount } from "./account";
import { IDriverDetails } from "./driver";

type TLoadingStatus = "idle" | "succeeded" | "failed";
type TLoadingType = string;
type TCurrentrideView = "orderRide" | "availableRides";
type TActiveTab = "pending" | "completed" | "cancelled";
type TCounterFareStatus = "idle" | "pending" | "accepted" | "rejected";

type TBusStop = "pickupBusstop" | "dropoffBusstop";
export type TPlanName = "standard" | "premium";
export type TCategoryOrigin = "ajah" | "lekki" | "obalende" | "cms";
export type TCategoryDestination = "lekki" | "obalende" | "cms" | "oshodi";
export type TRideDirection = "forward" | "backward";
export type TRideStatus =
  | "requesting"
  | "cancelled"
  | "accepted"
  | "declined"
  | "started"
  | "booked"
  | "ended";
export type TQuery =
  | "searching"
  | "accepting"
  | "arrived-pickup"
  | "start-trip"
  | "pause-trip"
  | "dropoff";
export type TAllowedPaymentOptions = "cash" | "online" | "wallet" | "point";
export type TCountdownStatus = "idle" | "started" | "completed";

export enum EQuery {
  searching = "searching",
  accepting = "accepting",
  arrived_pickup = "arrived-pickup",
  start_trip = "start-trip",
  pause_trip = "pause-trip",
  dropoff = "dropoff",
}

export interface ICity {
  _id: string;
  name: string;
  stateName: string;
}

export interface IBusStop {
  _id?: string;
  name: string;
  city: ICity;
  order: number;
}

export interface ISavedBusStop {
  userId: string;
  busstopTitle: string;
  busStop: IBusStop;
}

export interface IRoute {
  _id: string;
  pickupBusstop: IBusStop;
  dropoffBusstop: IBusStop;
  inTripDirection: "forward" | "backward";
  city: ICity;
  inTripDropoffs: {
    name: string;
    city: ICity;
    order: number;
    plan: IPlan;
  }[];
  editable: boolean;
  active: boolean;
  allowedPaymentOptions: TAllowedPaymentOptions[];
}

export interface IRecentBusStop {
  userId: string;
  busStop: IBusStop;
}

export interface ILoading {
  status: TLoadingStatus;
  type: TLoadingType;
}

export interface ITicket {
  id?: string;
  owner?: {};
  pickupBusstop?: IBusStop | null;
  dropoffBusstop?: IBusStop | null;
  time?: string;
  sameAsFirstTicket?: boolean;
  number: number;
  userCounterFare?: number | null;
  rideFee?: number;
}

// ? Ride

export interface IPlan {
  planName: TPlanName;
  vehicleSeats: number;
  ride?: {
    rideFee: number;
  };
  trip?: {
    tripFee: number;
  };
}

export interface ICurrentTrip {
  _id: string;
  driverId: string;
  availableSeats: { type: Number; required: true };
  departureDate: { type: Date; required: true };
  departureTime: { type: Date; required: true };
  vehicleName: String;
  routeId: string;
  route?: IRoute;  
  ridersRides: IRiderRideDetails[];
}

export interface IRiderRideDetails {
  _id: string;
  pickupBusstopId: string;
  dropoffBusstopId: string;
  riderId: string;
  ticketsIds: string[];
  duration: string;
  ridePlan: IPlan;
  rideStatus: TRideStatus;
  riderCounterOffer: number;
  currentRideId: string;
  pickupBusstop?: IBusStop;
  dropoffBusstop?: IBusStop;
  rider?: IUserAccount;
}

export interface IRequest {
  _id: string;
  number: number;
  pickupId: string;
  pickupName: string;
  dropoffId: string;
  dropoffName: string;
  ticketOtp: string[];
  rideStatus: TRideStatus | "pending";
  riderCounterOffer: number;
  riderId: string;
  riderName?: string;
  riderPicture?: string;
  riderPhoneNo?: string;
  shown?: boolean;
  zIndex?: number;
  countdownStatus: TCountdownStatus;
}


export interface ITripState {
  pickupBusstopInput: IBusStop | null;
  dropoffBusstopInput: IBusStop | null;
  departureDateInput: string;
  departureTimeInput: string;
  intripDropoffsInput: IBusStop[];
  presetTrips: ICurrentTrip[];
  upcomingTrips: ICurrentTrip[];
  presetRoutes: IRoute[];
  currentUpcomingTrip: ICurrentTrip | null;
  currentPresetTrip: ICurrentTrip | null;
}
// ? Ride

export type {
  TBusStop,
  TLoadingStatus,
  TLoadingType,
  TCurrentrideView,
  TActiveTab,
  TCounterFareStatus,
};
