import { IUserAccount } from "./account";
import { IDriverDetails } from "./driver";

type TLoadingStatus = 'idle' | 'succeeded' | 'failed';
type TLoadingType = string;
type TCurrentrideView = 'orderRide' | 'availableRides';
type TActiveTab = 'pending' | 'completed' | 'cancelled';
type TCounterFareStatus = 'idle' | 'pending' | 'accepted' | 'rejected';

type TBusStop = 'pickupBusstop' | 'dropoffBusstop';
export type TPlanName = 'standard' | 'premium';
export type TCategoryOrigin = 'ajah' | 'lekki' | 'obalende' | 'cms';
export type TCategoryDestination = 'lekki' | 'obalende' | 'cms' | 'oshodi';
export type TRideDirection = 'forward' | 'backward';
export type TRideStatus = 'requesting' | 'cancelled' | 'accepted' | 'declined' | 'started' | 'booked' | 'ended';
export type TRideAcceptStage = 'searching' | 'accepting' | 'arrived-pickup' | 'start-trip' | 'pause-trip' | 'dropoff';

export enum ERideAcceptStage {
    searching = 'searching',
    accepting = 'accepting',
    arrived_pickup = 'arrived-pickup',
    start_trip = 'start-trip',
    pause_trip = 'pause-trip',
    dropoff = 'dropoff',
};


export interface IBusStop {
    _id?: string,
    name: string,
    order?: {
        forward: { number: number },
        backward: { number: number }
    },
    category?: {
        origin: TCategoryOrigin,
        destination: TCategoryDestination,
    }
}

export interface ISavedBusStop {
    userId: string,
    busstopTitle: string,
    busStop: IBusStop,
}

export interface IRoute {
    // _id: string,
    // pickupBusstopId: string,
    // dropoffBusstopId: string,
    // rideDirection: 'forward' | 'backward',
    // inTripDropoffsIds: string[],
    // inTripDropoffs?: IBusStop[]
    _id: string,
    pickupBusstop: IBusStop,
    dropoffBusstop: IBusStop,
    rideDirection: 'forward' | 'backward',
    inTripDropoffs: IBusStop[]
}

export interface IRecentBusStop {
    userId: string,
    busStop: IBusStop,
}

export interface ILoading {
    status: TLoadingStatus;
    type: TLoadingType;
}

export interface ITicket {
    id?: string,
    owner?: {},
    pickupBusstop?: IBusStop | null,
    dropoffBusstop?: IBusStop | null,
    time?: string,
    sameAsFirstTicket?: boolean,
    number: number,
    userCounterFare?: number | null,
    rideFee?: number
}



export interface IStateInput {
    pickupBusstopInput: IBusStop | null,
    dropoffBusstopInput: IBusStop | null,
    userCounterFareInput: number | null,
    driverRatingInput: number | null,
    driverRatingCommentInput: string,
    cancelRideReasonInput: string,
    userRideInput: Partial<IRide>,
    paymentOptionInput: string,
}
// ? Ride

export interface IPlan {
    planName: TPlanName,
    vehicleSeats: number,
    ride?: {
        rideFee: number
    },
    trip?: {
        tripFee: number
    }
}

export interface ICurrentRide {
    _id: string,
    driverId: string,
    availableSeats: number,
    vehicleName: string,
    inRideDropoffsIds: string[],
    ridersRidesIds: string[],
}

export interface IRiderRideDetails {
    _id: string,
    pickupBusstopId: string,
    dropoffBusstopId: string,
    riderId: string,
    ticketsIds: string[],
    duration: string,
    ridePlan: IPlan
    rideStatus: TRideStatus,
    riderCounterOffer: number,
    currentRideId: string,
    pickupBusstop?: IBusStop,
    dropoffBusstop?: IBusStop,
    rider?: IUserAccount,
}

export interface IRide {
    _id?: string,
    pickupBusstop: IBusStop,
    dropoffBusstop: IBusStop,
    saved: boolean,
    tickets?: ITicket[] | [],
    status: 'idle' | 'cancelled' | 'accepted' | 'started',
    duration?: string,
    availableSeats?: number,
    seats?: number,
    driverDetails?: IDriverDetails,
    busStops?: IBusStop[] | [],
}

export interface IRideState {
    pickupBusstopInput: IBusStop | null,
    dropoffBusstopInput: IBusStop | null,
    currentRoute: IRoute | null,
    driverOnline: boolean,
    driverEligible: boolean,
    ridersOffers: IRiderRideDetails[],
    currentRiderOfferIndex: number| null,
    presetRoutes: IRoute[],
    rideAcceptStage: TRideAcceptStage
}
// ? Ride

export type { TBusStop, TLoadingStatus, TLoadingType, TCurrentrideView, TActiveTab, TCounterFareStatus }