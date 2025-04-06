import GoOnlineOptionTile from "@/components/home/goOnlineOptionTile";
import Ionicons from "@expo/vector-icons/Ionicons";
import PresetRouteSheet from "@/components/home/presetRouteSheet";
import SearchingOrder from "@/components/home/searchingOrderSheet";
import CtaBtn from "@/components/shared/ctaBtn";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import sharedImg from "@/constants/images/shared";
import tripImgs from "@/constants/images/trip";
import { useSnackbar } from "@/contexts/snackbar.context";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { useSession } from "@/contexts/userSignedInContext";
import {
  c,
  colorBlack,
  colordarkGrey,
  colorWhite,
  fs,
  fs10,
  fs12,
  fs14,
  fs18,
  fw400,
  fw500,
  fw700,
  neurialGrotesk,
  textCenter,
} from "@/utils/fontStyles";
import {
  image,
  imgAbsolute,
  mXAuto,
  mYAuto,
  wHFull,
} from "@/utils/imageStyles";
import {
  absolute,
  b,
  bg,
  borderB,
  borderGrey,
  borderT,
  bottom0,
  flex,
  flexCenter,
  flexCol,
  gap,
  h,
  hFull,
  itemsCenter,
  justifyBetween,
  justifyCenter,
  justifyStart,
  left0,
  mb,
  mt,
  mTAuto,
  p,
  pb,
  pt,
  px,
  py,
  r,
  relative,
  right0,
  rounded,
  t,
  top0,
  w,
  wFull,
  zIndex,
} from "@/utils/styles";
import { router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ToastAndroid,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { Snackbar, Text } from "react-native-paper";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import AcceptOrderSheet from "@/components/home/acceptOrderSheet";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import {
  EQuery,
  IRequest,
  IRiderRideDetails,
  TCountdownStatus,
} from "@/state/types/ride";
import { setRideState } from "@/state/slices/ride";
import ArrivedPickupSheet from "@/components/home/arrivedPickupSheet";
import TicketOtpSheet from "@/components/home/ticketOtpSheet";
import OnTripSheet from "@/components/home/onTripSheet";
import DropoffSheet from "@/components/home/dropoffTripSheet";
import { useStorageState } from "@/hooks/useStorageState";
import { RideConstants } from "@/constants/ride";
import { Countdown } from "@/components/shared/countdown";
import { useCountdown } from "@/contexts/useCountdown";
import tw from "@/constants/tw";
import { Tooltip } from "@/components/shared/new-tootip";
import { supabase } from "@/supabase/supabase.config";
import { IUserAccount } from "@/state/types/account";
import FetchService from "@/services/api/fetch.service";
import { setUserAccountSecurityFeild } from "@/state/slices/account";
import NewRequestTile, { getHighestInArray } from "@/components/ride/new-request-tile";

function AcceptRide() {
  const { showBottomSheet } = useBottomSheet();
  const dispatch = useAppDispatch();
  const {
    driverOnline,
    query,
    currentRiderOfferIndex,
    allRequests,
    unAcceptedRequests,
    selectedRoute,
    countdownStatus,
    currentRequest,
  } = useAppSelector((state: RootState) => state.ride);
  // const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);
  const { hideBottomSheet } = useBottomSheet();
  const path = usePathname();

  const [state, setState] = useState({
    // Counter state
    counterDuration: 30,
    // UI visibility states
    dropoffShown: false,
    nextBusstopShown: false,
    countdownShown: false,
    newRequestsShown: false,
    // New requests state
    newRequests: [] as IRequest[],

    topRequestId: null,
  });

  const {
    counterDuration,
    dropoffShown,
    countdownShown,
    newRequestsShown,
    nextBusstopShown,
    newRequests,
    topRequestId,
  } = state;

  const handleRequestRearranged = (requestId: string) => {
    // Find the next request to show at the top
    const remainingRequests = unAcceptedRequests.filter(
      (req) => String(req._id) !== requestId
    );

    if (remainingRequests.length > 0) {
      // Sort by zIndex to find the next highest
      const sortedRequests = [...remainingRequests].sort(
        (a, b) => (Number(b.zIndex) || 0) - (Number(a.zIndex) || 0)
      );

      // Update the top request
      setState((prev) => ({
        ...prev,
        topRequestId: (sortedRequests[0]?._id as any) || null,
      }));

      // Rearrange the requests with updated zIndex values
      const rearrangedRequests = unAcceptedRequests.map((req) => {
        if (String(req._id) === String(sortedRequests[0]?._id)) {
          // New top request
          return { ...req, zIndex: 10000, shown: true };
        } else if (String(req._id) === requestId) {
          // Request that just timed out
          return { ...req, zIndex: 1000, shown: false };
        }
        return req;
      });

      dispatch(
        setRideState({
          key: "unAcceptedRequests",
          value: rearrangedRequests,
        })
      );
    }
  };

  // Getting a request (coutdown) with currentIndex and updating it's visibility
  useEffect(() => {
    if (unAcceptedRequests.length === 0) return

    const requests = unAcceptedRequests.map((requestItem, index) => {
      const topIndex = getHighestInArray(unAcceptedRequests.map((req) => Number(req?.zIndex)));
        return {
          ...requestItem,
          shown: Number(requestItem?.number) === currentRiderOfferIndex,
          countdownStatus: Number(requestItem?.number) === currentRiderOfferIndex ? "started" as TCountdownStatus : "idle" as TCountdownStatus,
          zIndex: Number(requestItem?.number) === currentRiderOfferIndex ? topIndex : topIndex - ((Number(requestItem?.number) - 1))
      }
    })

    dispatch(setRideState({ key: "unAcceptedRequests", value: requests }))

    const request = requests.find((requestItem) => Number(requestItem?.number || 1) === currentRiderOfferIndex)

    if (request) {
      dispatch(
        setRideState({
          key: "currentRequest",
          value: {
            ...request,
            shown: true,
            countdownStatus: "started" as TCountdownStatus,
          },
        }),
      )
      dispatch(
        setRideState({
          key: "countdownStatus",
          value: "started" as TCountdownStatus,
        }),
      )
    }
  }, [currentRiderOfferIndex, unAcceptedRequests.length])
  // Getting a request (coutdown) with currentIndex and updating it's visibility

  // Consolidated useEffect for UI states
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      // Show countdown when accepting/searching and there are unaccepted requests
      countdownShown:
        (query === RideConstants.query.accepting ||
          query === RideConstants.query.searching) &&
        unAcceptedRequests.length > 0,

      // Show dropoff UI when trip has started
      dropoffShown: query === RideConstants.query.start_trip,

      // Show new requests when not in accepting/searching mode
      newRequestsShown:
        query !== RideConstants.query.accepting &&
        query !== RideConstants.query.searching,
    }));
  }, [query, unAcceptedRequests.length]);

  const currentUnacceptedRequest = unAcceptedRequests.find(
    (reqItem) => reqItem?.shown == true
  );

  const setupRideRequestChannel = () => {
    const channel = supabase.channel(
      `${RideConstants.channel.ride_requesting}${selectedRoute?._id}`
    );

    channel
      .on(
        "broadcast",
        { event: RideConstants.event.ride_requested },
        handleRideRequestEvent
      )
      .subscribe();

    return channel;
  };

  const handleRideRequestEvent = (payload: any) => {
    const ride = payload?.payload?.ride as IRiderRideDetails & {
      rider: IUserAccount;
    };
    console.log("Ride requested event:", ride?._id);

    // Handle searching state
    if (path === "/acceptRide" && query === RideConstants.query.searching) {
      handleSearchingState(ride);
    }
    // Handle accepting state
    else if (
      path === "/acceptRide" &&
      query === RideConstants.query.accepting
    ) {
      handleAcceptingState(ride);
    }
    // Handle other states
    else if (path === "/acceptRide") {
      handleOtherStates(ride);
    }
  };

  const createRideRequest = ({ride, number, shown}:
    {ride: IRiderRideDetails & { rider: IUserAccount },
    shown?: boolean,
    number?: number,}
  ) => {
    return {
      _id: ride?._id,
      // number: (Number(allRequests[allRequests.length]?.number) || 0) + 1,
      number: number || Number(allRequests[allRequests.length-1]?.number) + 1,
      dropoffId: ride?.dropoffBusstop?._id,
      dropoffName: ride?.dropoffBusstop?.name,
      pickupId: ride?.pickupBusstop?._id,
      pickupName: ride?.pickupBusstop?.name,
      riderCounterOffer: ride?.riderCounterOffer,
      riderId: ride?.riderId,
      rideStatus: ride?.rideStatus,
      riderName: ride?.rider?.fullName,
      riderPhoneNo: ride?.rider?.phoneNo,
      riderPicture: ride?.rider?.picture || ride?.rider?.avatar,
      shown: shown ? true : false,
      // zIndex: (Number(allRequests[allRequests.length]?.zIndex) || 10000) + 1,
      zIndex: 10000 + (number || Number(allRequests[allRequests.length-1]?.number) + 1),
      countdownStatus: "idle" as TCountdownStatus,
    };
  };

  const handleSearchingState = (
    ride: IRiderRideDetails & { rider: IUserAccount }
  ) => {
    const requestPresent = allRequests.find(
      (request) => String(request?._id) === String(ride?._id)
    );

    if (requestPresent) {
      dispatch(
        setRideState({ key: "query", value: RideConstants.query.accepting })
      );
      showBottomSheet([400], <AcceptOrderSheet />, true);
      return;
    }

    const newRequest = createRideRequest({ride,shown: true, number: currentRiderOfferIndex});
    const requests = [...allRequests, newRequest];

    dispatch(setRideState({ key: "allRequests", value: requests }));

    const newUnAcceptedRequests = requests.filter(
      (request) =>
        request?.rideStatus === "pending" ||
        request?.rideStatus === "requesting"
    );

    dispatch(
      setRideState({
        key: "currentRequest",
        value: {
          ...newRequest,
          countdownStatus: "started" as TCountdownStatus,
        },
      })
    );
    dispatch(
      setRideState({
        key: "countdownStatus",
        value: "started" as TCountdownStatus,
      })
    );
    dispatch(
      setRideState({ key: "unAcceptedRequests", value: newUnAcceptedRequests })
    );
    dispatch(
      setRideState({ key: "query", value: RideConstants.query.accepting })
    );
    showBottomSheet([400], <AcceptOrderSheet />, true);
  };

  const handleAcceptingState = (
    ride: IRiderRideDetails & { rider: IUserAccount }
  ) => {
    if (!allRequests) return;

    const requestPresent = allRequests.find(
      (request) => String(request?._id) === String(ride?._id)
    );

    if (requestPresent) return;

    const newRequest = createRideRequest(
      {ride,
      shown: countdownStatus == "completed" ? true : false,
    },
    );
    console.log({ newRequest }, "N E W R E Q U E S T");

    const requests = [...allRequests, newRequest];

    dispatch(setRideState({ key: "allRequests", value: requests }));

    const newUnAcceptedRequests = requests.filter(
      (request) =>
        request?.rideStatus === "pending" ||
        request?.rideStatus === "requesting"
    );

    dispatch(
      setRideState({ key: "unAcceptedRequests", value: newUnAcceptedRequests })
    );

    if (currentRequest?.countdownStatus == "completed") {
      console.log(
        { "currentRequest?.countdownStatus": currentRequest?.countdownStatus },
        "from handleAccept"
      );
      dispatch(
        setRideState({
          key: "currentRiderOfferIndex",
          value: Number(newRequest?.number || currentRequest?.number),
        })
      );
      dispatch(
        setRideState({
          key: "currentRequest",
          value: {
            ...newRequest,
            countdownStatus: "started" as TCountdownStatus,
          },
        })
      );
      dispatch(
        setRideState({
          key: "countdownStatus",
          value: "started" as TCountdownStatus,
        })
      );
    }
  };

  const handleOtherStates = (
    ride: IRiderRideDetails & { rider: IUserAccount }
  ) => {
    if (!allRequests) return;

    const requestPresent = allRequests.find(
      (request) => String(request?._id) === String(ride?._id)
    );

    if (requestPresent) return;

    const newRequest = createRideRequest({ride});
    const requests = [...allRequests, newRequest];

    dispatch(setRideState({ key: "allRequests", value: requests }));

    const newUnAcceptedRequests = requests.filter(
      (request) =>
        request?.rideStatus === "pending" ||
        request?.rideStatus === "requesting"
    );

    dispatch(
      setRideState({ key: "unAcceptedRequests", value: newUnAcceptedRequests })
    );

    // Update new requests state
    const newRequestPresent = newRequests.find(
      (request) => String(request?._id) === String(ride?._id)
    );

    if (!newRequestPresent) {
      setState((prev) => ({
        ...prev,
        newRequests: newUnAcceptedRequests as IRequest[],
      }));
    }
  };

  // Initialize the channel
  const rideChannel = setupRideRequestChannel();

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      rideChannel.unsubscribe();
    };
  }, []);

  return (
    <SafeScreen>
      <View style={[wHFull as ViewStyle, relative]}>
        {/* //!Backlay */}
        <Image
          style={[
            imgAbsolute,
            image.t(0),
            image.l(0),
            wHFull,
            image.zIndex(-1),
          ]}
          source={sharedImg.mapImage}
        />
        {/* //!Backlay */}

        {/* //!Header */}
        <PaddedScreen>
          {/* //!Page Title */}
          <PageTitle
            onPress={() => {
              // setQuery(RideConstants.query.searching); //testing for now
              dispatch(
                setRideState({
                  key: "query",
                  value: RideConstants.query.searching,
                })
              ); //testing for now
              hideBottomSheet();
            }}
            title=""
          />
          {/* //!Page Title */}

          {/* Statuses */}
          <View style={[zIndex(3), tw`top-[-15px] h-[230px]`]}>
            {/* //!Online Status Block */}
            {driverOnline && <DriverOnlineTile />}
            {/* //!Online Status Block */}

            {/* //!Drop off Block */}
            {dropoffShown && <DropoffTile />}
            {/* //!Drop off Block */}

            {/* //!Next Bus Stop Block */}
            {nextBusstopShown && <NextBusstop />}
            {/* //!Next Bus Stop Block */}

            {/* //!Time Down Block */}
            {/* {countdownShown && ( */}
            {countdownShown && (
              <RequestCountdown
                request={
                  (currentUnacceptedRequest as IRequest) ||
                  unAcceptedRequests[0]
                }
              />
            )}
            {/* //!Time Down Block */}

            {/* New Requests */}
            {
            // unAcceptedRequests.some((req) => req.shown == false) &&
              newRequestsShown && (
                // <View style={[tw`w-full h-[40px] relative mt-[50px]`, {zIndex: 999}]}>
                <View
                  style={[
                    tw`w-full h-[40px] relative mt-[20px]`,
                    { zIndex: 999 },
                  ]}
                >
                  {[...unAcceptedRequests]
                    .map((req, index) => {
                      const topPosition =
                      (unAcceptedRequests.length - 1 - index) * 5;

                      return (
                       <NewRequestTile
                          props={{
                            style: [tw``, { top: topPosition, zIndex: Number(req?.zIndex) }],
                          }}
                          request={req}
                          key={index}
                        />
                      );
                    })}
                </View>
              )}
            {/* New Requests */}
          </View>
          {/* Statuses */}
        </PaddedScreen>
        {/* //!Header */}
      </View>
    </SafeScreen>
  );
}

export default AcceptRide;

const RequestCountdown = ({ request }: { request: IRequest }) => {
  const dispatch = useAppDispatch()
  const { unAcceptedRequests, currentRiderOfferIndex, currentRequest } = useAppSelector(
    (state: RootState) => state.ride,
  )

  const [counterDuration] = useState(20)
  const [done, setDone] = useState(false)

  // Reset done state when request changes
  useEffect(() => {
    setDone(false)
  }, [request?._id])
  // Reset done state when request changes

  // Handle countdown completion
  useEffect(() => {
    if (done) {
      // Mark global count down status as completed
      dispatch(
        setRideState({
          key: "countdownStatus",
          value: "completed" as TCountdownStatus,
        }),
      )
      // Mark global count down status as completed

      const updatedRequests = unAcceptedRequests.map((req) => {
        if (Number(req.number) === Number(currentRequest?.number)) {
          return {
            ...req,
            shown: unAcceptedRequests.length == 1 ? true : false,
            countdownStatus: "completed" as TCountdownStatus,
          }
        }
        return req
      })

      // Updating the list
      dispatch(
        setRideState({
          key: "unAcceptedRequests",
          value: updatedRequests,
        }),
      );
      // Updating the list

      // Update to the next request
      (request?.number == currentRequest?.number) && (unAcceptedRequests.length > 1) && dispatch(
        setRideState({
          key: "currentRiderOfferIndex",
          value: currentRiderOfferIndex < unAcceptedRequests[unAcceptedRequests.length-1]?.number ? Number(request?.number) +1 : 1,
        }),
      )
      // Update to the next request
    }
  }, [done])
  // Handle countdown completion

  return (
    <View style={[wFull, h(120), flex, itemsCenter, justifyCenter, bg(colors.transparent)]}>
      {request?.shown && (
        <View style={[absolute, top0, zIndex(Number(request?.zIndex))]}>
          <Countdown
            duration={counterDuration * 1000}
            interval={100}
            request={currentRequest as IRequest}
            changeCondition={[request._id, done]}
            onComplete={() => {
              if (!done) {
                setDone(true)
              }
            }}
          />
        </View>
      )}
    </View>
  )
}

const DriverOnlineTile = () => {
  return (
    <TouchableOpacity
      style={[
        w(110),
        h(40),
        bg("#27AE65"),
        rounded(50),
        flex,
        itemsCenter,
        relative,
      ]}
    >
      <Text
        style={[
          fw700,
          fs14,
          colorWhite,
          neurialGrotesk,
          textCenter,
          { flexBasis: "55%" },
        ]}
      >
        ONLINE
      </Text>
      <View
        style={[
          w(30),
          h(30),
          rounded(30),
          bg(colors.white),
          absolute,
          t(5),
          r(7),
          { shadowColor: colors.black, shadowRadius: 10 },
        ]}
      />
    </TouchableOpacity>
  );
};

const DropoffTile = () => {
  return (
    <View
      style={[
        wFull,
        h(112),
        flexCol,
        pt(16),
        px(32),
        borderGrey(0.7),
        bg(colors.white),
        rounded(10),
        gap(10),
      ]}
    >
      {/* //!Dropoff lable Block */}
      <View
        style={[
          wFull,
          flex,
          gap(16),
          itemsCenter,
          justifyStart,
          borderB(0.7, Colors.light.border),
          pb(16),
        ]}
      >
        <Image
          style={[image.w(14), image.h(20)]}
          source={tripImgs.redBgLocation}
        />
        <Text style={[fw700, fs14, colorBlack, neurialGrotesk]}>
          Dropoff Bus Stop
        </Text>
      </View>
      {/* //!Dropoff lable Block */}

      {/* //!Drop off Input Block */}
      <View style={[wFull, flex, gap(16), itemsCenter, justifyStart]}>
        <Text style={[fw500, fs14, colorBlack]}>{"Ojodu Berger Bus Stop"}</Text>
      </View>
      {/* //!Drop off Input Block */}
    </View>
  );
};

const NextBusstop = () => {
  return (
    <View
      style={[
        wFull,
        h(100),
        flexCol,
        mt(10),
        pt(10),
        px(32),
        borderGrey(0.7),
        bg(colors.white),
        rounded(10),
        gap(10),
      ]}
    >
      {/* //!Next Bus Stop Lable Block */}
      <View
        style={[
          wFull,
          flex,
          gap(16),
          itemsCenter,
          justifyStart,
          borderB(0.7, Colors.light.border),
          pb(16),
        ]}
      >
        <Image
          style={[image.w(14), image.h(20)]}
          source={tripImgs.locationImage}
        />
        <Text style={[fw700, fs14, colorBlack, neurialGrotesk]}>Next Stop</Text>
      </View>
      {/* //!Next Bus Stop Lable Block */}

      {/* //!Next Bus Stop Value Block */}
      <View style={[wFull, flex, gap(16), itemsCenter, justifyStart]}>
        <Text style={[fw500, fs14, colorBlack]}>{"Ojodu Berger Bus Stop"}</Text>
      </View>
      {/* //!Next Bus Stop Value Block */}
    </View>
  );
};

