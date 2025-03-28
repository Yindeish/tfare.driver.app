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
import { image, imgAbsolute, mXAuto, wHFull } from "@/utils/imageStyles";
import {
  absolute,
  b,
  bg,
  borderB,
  borderGrey,
  borderT,
  bottom0,
  flex,
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
  ViewStyle,
} from "react-native";
import { Snackbar, Text } from "react-native-paper";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import AcceptOrderSheet from "@/components/home/acceptOrderSheet";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import { EQuery, IRequest } from "@/state/types/ride";
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

function AcceptRide() {
  const { showBottomSheet } = useBottomSheet();
  const dispatch = useAppDispatch();
  const {
    driverOnline,
    rideAcceptStage,
    currentRiderOfferIndex,
    allRequests,
    unAcceptedRequests,
  } = useAppSelector((state: RootState) => state.ride);
  const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);
  const { hideBottomSheet } = useBottomSheet();

  // const [showOnline, setShowOnline] = useState(true);//testing
  // const [showDropoff, setShowDropoff] = useState(false);//testing
  // const [duration, setDuration] = useState(60);
  // const [countdownShown, setCountdownShown] = useState(true)
  const [showNextBusstop, setShowNextBusstop] = useState(false); //testing
  const [riderArrived, setRiderArrived] = useState(false);

  const [counterState, setCounterState] = useState({
    shown: false,
    duration: 30,
  });
  const { duration, shown } = counterState;

  const { start, seconds, reset, restart, completed } = useCountdown({
    duration,
    changeCondition: [allRequests, unAcceptedRequests],
  });

  useEffect(() => {
    if (
      (query === EQuery.accepting || query === EQuery.searching) &&
      (Number(unAcceptedRequests?.length) > 0)
    ) {
      setCounterState((prev) => ({ ...prev, shown: true }));
    } else setCounterState((prev) => ({ ...prev, shown: false }));
  }, [query, unAcceptedRequests.length]);

  // Remounting the counter component for the new request
  useEffect(() => {
    if (unAcceptedRequests.length > 1 && (seconds == 0 || completed)) {
      setCounterState((prev) => ({ ...prev, duration: 20, shown: false }));
      setTimeout(() => {
        setCounterState((prev) => ({ ...prev, duration: 20, shown: true }));
      }, 300);
    }
  }, [unAcceptedRequests.length, completed, seconds]);
  // Remounting the counter component for the new request

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
              setQuery(RideConstants.query.searching); //testing for now
              hideBottomSheet();
            }}
            title=""
          />
          {/* //!Page Title */}

          <View style={[zIndex(3), tw`top-[-15px]`]}>
            {/* //!Online Status Block */}
            {driverOnline && (
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
            )}
            {/* //!Online Status Block */}

            {/* //!Drop off Block */}
            {rideAcceptStage === EQuery.start_trip && (
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
                  <Text style={[fw500, fs14, colorBlack]}>
                    {"Ojodu Berger Bus Stop"}
                  </Text>
                </View>
                {/* //!Drop off Input Block */}
              </View>
            )}
            {/* //!Drop off Block */}

            {/* //!Next Bus Stop Block */}
            {showNextBusstop && (
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
                  <Text style={[fw700, fs14, colorBlack, neurialGrotesk]}>
                    Next Stop
                  </Text>
                </View>
                {/* //!Next Bus Stop Lable Block */}

                {/* //!Next Bus Stop Value Block */}
                <View style={[wFull, flex, gap(16), itemsCenter, justifyStart]}>
                  <Text style={[fw500, fs14, colorBlack]}>
                    {"Ojodu Berger Bus Stop"}
                  </Text>
                </View>
                {/* //!Next Bus Stop Value Block */}
              </View>
            )}
            {/* //!Next Bus Stop Block */}
          </View>
        </PaddedScreen>
        {/* //!Header */}

        {/* Tooltip */}
        <Tooltip content="This is the next bus stop" position="top">
          <TouchableOpacity
            style={[
              absolute,
              top0,
              right0,
              w(40),
              h(40),
              bg(colors.white),
              rounded(50),
              flex,
              itemsCenter,
              justifyCenter,
              { shadowColor: colors.black, shadowRadius: 10 },
            ]}
            onPress={() => {
              setShowNextBusstop((prev) => !prev);
            }}
          >
            <Ionicons
              name="information-circle"
              size={20}
              color={colors.black}
            />
          </TouchableOpacity>
        </Tooltip>
        {/* Tooltip */}

        {/* //!Time Down Block */}
        {(query === EQuery.accepting || query === EQuery.searching) && (
          <View
            style={[
              absolute,
              // t("45%"),
              t("20%"),
              wFull,
              h(144),
              flex,
              itemsCenter,
              justifyCenter,
              bg(colors.transparent),
            ]}
          >
            {shown && (
              <Countdown
                duration={20 * 1000}
                interval={100}
                changeCondition={[allRequests, unAcceptedRequests, seconds]}
                onComplete={({ restart: rs }) => {
                  if (Number(unAcceptedRequests?.length) > 1) {
                    dispatch(
                      setRideState({
                        key: "currentRiderOfferIndex",
                        value:
                          Number(currentRiderOfferIndex) >=
                          unAcceptedRequests.length - 1
                            ? 0
                            : Number(currentRiderOfferIndex) + 1,
                      })
                    );

                    rs();
                    start();
                  }
                }}
              ></Countdown>
            )}
            {/* </View> */}
          </View>
        )}
        {/* //!Time Down Block */}
      </View>
    </SafeScreen>
  );
}

export default AcceptRide;

// useEffect(() => {
//     rideAcceptStage === EQuery.searching && showBottomSheet([300], <SearchingOrder />, true)

//     if(rideAcceptStage === EQuery.accepting) {
//         showBottomSheet([400], <AcceptOrderSheet />, true)
//     }
//     if(rideAcceptStage === EQuery.arrived_pickup) {
//         showBottomSheet([350, 400], <ArrivedPickupSheet />, true);
//     }
//     if(rideAcceptStage === EQuery.start_trip) {
//         showBottomSheet([500, 600], <TicketOtpSheet />, true)
//     }
//     if(rideAcceptStage === EQuery.pause_trip) {
//         showBottomSheet([300, 550], <OnTripSheet />, true);
//     }
//     if(rideAcceptStage === EQuery.dropoff) {
//         showBottomSheet([450], <DropoffSheet />, true);
//     }
//     // setTimeout(() => {
//     //     showBottomSheet([400], <AcceptOrderSheet />)
//     // }, 3000)
// }, [rideAcceptStage])
