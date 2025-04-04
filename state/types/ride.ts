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
export type TCountdownStatus = 'idle' | 'started' | 'running' | 'completed'

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

export interface IStateInput {
  pickupBusstopInput: IBusStop | null;
  dropoffBusstopInput: IBusStop | null;
  userCounterFareInput: number | null;
  driverRatingInput: number | null;
  driverRatingCommentInput: string;
  cancelRideReasonInput: string;
  userRideInput: Partial<IRide>;
  paymentOptionInput: string;
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

export interface ICurrentRide {
  _id: string;
  driverId: string;
  availableSeats: number;
  vehicleName: string;
  inRideDropoffs: IBusStop[];
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
  rideStatus: TRideStatus | 'pending';
  riderCounterOffer: number;
  riderId: string;
  riderName?: string;
  riderPicture?: string;
  riderPhoneNo?: string;
  shown?: boolean,
  zIndex?: number,
  countdownStatus: TCountdownStatus
}

export interface IRide {
  _id?: string;
  pickupBusstop: IBusStop;
  dropoffBusstop: IBusStop;
  saved: boolean;
  tickets?: ITicket[] | [];
  status: "idle" | "cancelled" | "accepted" | "started";
  duration?: string;
  availableSeats?: number;
  seats?: number;
  driverDetails?: IDriverDetails;
  busStops?: IBusStop[] | [];
}

export interface IRideState {
  pickupBusstopInput: IBusStop | null;
  dropoffBusstopInput: IBusStop | null;
  dropoffsInput: {
    name: string;
    city: ICity;
    order: number;
  }[];
  driverOnline: boolean;
  driverEligible: boolean;
  ridersOffers: IRiderRideDetails[];
  currentRiderOfferIndex: number;
  presetRoutes: IRoute[];
  query: TQuery;
  ridesAccepted: IRiderRideDetails[];
  selectedRoute: IRoute | null;
  // currentRequest: IRiderRideDetails | null;
  currentRequest: IRequest | null;
  currentRide: ICurrentRide | null;
  rides: IRiderRideDetails[];
  allRequests: IRequest[];
  unAcceptedRequests: IRequest[];
  countdownStatus: TCountdownStatus;
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
