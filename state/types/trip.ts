import { IUserAccount } from "./account";
import { IDriverDetails } from "./driver";
import { IBusStop, IPlan, IRoute, TRideStatus } from "./ride";

export type TQuery =
  | "accepting"
  | "arrived-pickup"
  | "start-trip"
  | "pause-trip"
  | "dropoff";

export type TCountdownStatus = "idle" | "started" | "completed";

export enum EQuery {
  searching = "searching",
  accepting = "accepting",
  arrived_pickup = "arrived-pickup",
  start_trip = "start-trip",
  pause_trip = "pause-trip",
  dropoff = "dropoff",
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
  driverOnline: boolean;
  driverEligible: boolean;
  ridersOffers: [];
  currentRiderOfferIndex: number;
  tripRequestInView: IRequest | null;
  query: TQuery;
  selectedRoute: IRoute | null;
  currentRequest: IRequest | null;
  pickupBusstopInput: IBusStop | null;
  dropoffBusstopInput: IBusStop | null;
  departureDateInput: string;
  departureTimeInput: string;
  intripDropoffsInput: IBusStop[];
  presetTrips: ICurrentTrip[];
  upcomingTrips: ICurrentTrip[];
  presetRoutes: IRoute[];
  allRequests: IRequest[];
  unAcceptedRequests: IRequest[];
  acceptedRequests: IRiderRideDetails[];
  currentUpcomingTrip: ICurrentTrip | null;
  currentPresetTrip: ICurrentTrip | null;
  countdownStatus: TCountdownStatus;
}
// ? Ride
