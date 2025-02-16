import { IFlutterwaveWallet, } from "./flutterwaveWallet";
import { IBusStop, ILoading } from "./ride";

type TProfileCta = 'edit' | 'save';
export type TUser = 'driver' | 'rider' | 'admin';
export type TTransactionStatus = 'successful' | 'failed';

interface IUserAccountNotification {
    orderStatus: boolean,
    generalUpdates: boolean,
    promotionalOffers: boolean,
    tipsAndTutorials: boolean,
    transactionUpdates: boolean,
}

interface IDriverNotificationMessage {
    title: string,
    content: string,
    read: boolean,
    driverId: string,
}

interface IDriverNotification {
    rideOrTripStatus: boolean,
    generalUpdates: boolean,
    promotionalOffers: boolean,
    tipsAndTutorials: boolean,
    transactionUpdates: boolean
}

interface IRating {
    driverId: string,
    count: number,
    comment: string,
    riderId: string
}

interface IPersonalDocuments {
    roadWorthinessCertImage: string,
    vehicleInsuranceCertImage: string,
    vehicleOwnershipCertImage: string,
    driverLicenseImage: string
}

interface IVehicleImage {
    frontViewImage: string,
    backViewImage: string,
    sideViewImage: string,
    interiorImage: string
}

interface IVehicle extends Document {
    id: string,
    vehicleType: string,
    vehicleYear: number,
    vehicleModel: string,
    vehicleColor: string,
    plateNumber: string,
    vehicleImages: IVehicleImage,
    seats: number
}

interface IDriver {
    personalDocuments: IPersonalDocuments,
    vehicle: IVehicle,
    // ratingsIds: string[]
    isOnline: Boolean,
    notification: IDriverNotification,
    // notificationMessagesIds: string[],
}

interface IRiderNotification {
    rideStatus: boolean,
    generalUpdates: boolean,
    promotionalOffers: boolean,
    tipsAndTutorials: boolean,
    transactionUpdates: boolean
}

// Rider Notification

// Emergency Contact

interface IEmergencyContact {
    name: string,
    email: string,
    phoneNumber: number,
    whatsAppNumber: number,
    riderId: string
}

// Emergency Contact

interface IRider {
    notification: IRiderNotification,
}

interface IUserAccountWallet extends Partial<IFlutterwaveWallet> {
}

interface IUserAccount {
    fullName: string,
    userName: string,
    email: string,
    phoneNo: number,
    picture?: Blob | string,
    avatar?: string,
    auth?: {
        biometricLogin: boolean,
    },
    status?: 'deactivated' | 'deleted',
    deactivationReason?: string,
    notifications?: IUserAccountNotification,
    wallet?: IUserAccountWallet,
    role: TUser,
    riderProfile?: IRider,
    driverProfile?: IDriver,
}

interface EmergencyContact extends
    Pick<IUserAccount, 'fullName' | 'email' | 'phoneNo'> {
    whatsAppNo: number
}

interface IAddress extends Partial<IBusStop> {
    name: string,
}

interface IStateInput {
    profile: IStateInputProfile,
    addNewContact: IStateInputAddNewContact,
    saveNewAddress: IStateInputSaveNewAddress,
    accountSecurity: IStateInputAcountSecurity,
    notifications: IStateInputNotifications,
    deactivateAccount: IStateInputDeactivateAccount
}

interface IStateInputProfile {
    nameInput: string,
    userNameInput: string,
    emailInput: string,
    phoneNoInput: string,
}

interface IStateInputAddNewContact {
    contactNameInput: string,
    contactEmailInput: string,
    contactPhoneNumberInput: string,
    contactWhatsAppInput: string,
}

// interface IStateInputSaveNewAddress extends Pick<IBusStop, 'routeName'> {
interface IStateInputSaveNewAddress extends Pick<IBusStop, 'name'> {
    addressName: string,
}

interface IStateInputAcountSecurity {
    biometricLoginInput: boolean
}

interface IStateInputNotifications {
    orderStatusInput: boolean,
    generalUpdatesInput: boolean,
    promotionalOffersInput: boolean,
    tipsAndTutorialsInput: boolean,
    transactionUpdatesInput: boolean,
}

interface IStateInputDeactivateAccount {
    reasonInput: string
}

export interface ITransaction {
    userId: string,
    event: string,
    data: {
      id: number,
      tx_ref: string,
      flw_ref: string,
      device_fingerprint: string,
      amount: number,
      currency: String,
      charged_amount: number,
      app_fee: number,
      merchant_fee: number,
      processor_response: string,
      auth_model: string,
      ip: string,
      narration: string,
      status: TTransactionStatus,
      payment_type: string,
      created_at: Date,
      account_id: number,
      customer: {
        id: number,
        name: string,
        phone_number: string,
        email: string,
        created_at: Date,
      },
    },
    meta_data: {
      originatorname: string,
      bankname: string,
      originatoramount: string,
      originatoraccountnumber: string,
    },
    eventType: string,
}

interface IAccountState {
    loading: ILoading | null,
    stateInput: IStateInput,
    userAccount: IUserAccount | null,
    emergencyContacts: EmergencyContact[] | [],
    savedAddresses: IAddress[] | [],
    profileCta: TProfileCta,
    transactions: ITransaction[]
}

export type {
    IUserAccountNotification, IUserAccountWallet,
    EmergencyContact, IAddress,
    IAccountState, IStateInput,
    IStateInputAcountSecurity,
    IStateInputAddNewContact,
    IStateInputDeactivateAccount,
    IStateInputNotifications,
    IStateInputProfile, IStateInputSaveNewAddress,
    TProfileCta, IUserAccount
}