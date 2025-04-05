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
  ActivityIndicator,
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
import { EQuery, IRequest, IRiderRideDetails } from "@/state/types/ride";
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

export function getHighest(num1: number, num2: number) {
  return num1 > num2 ? num1 : num2;
}

export function getLowest(num1: number, num2: number) {
  return num1 < num2 ? num1 : num2;
}

export function getHighestInArray(arr: number[]) {
  return Math.max(...arr);
}

export function getLowestInArray(arr: number[]) {
  return Math.min(...arr);
}

const NewRequestTile = ({
  props: { style, ...others },
  request,
}: {
  props: ViewProps;
  request: IRequest;
}) => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state: RootState) => state.user);
  const {
    unAcceptedRequests,
    selectedRoute,
    allRequests,
    currentRiderOfferIndex,
    currentRequest,
  } = useAppSelector((state: RootState) => state.ride);
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();

  const [counterDuration] = useState(20);

  const [done, setDone] = useState(false);

  // Countdown hook
  const { start, seconds, reset, restart, completed } = useCountdown({
    duration: counterDuration * 1000,
    // changeCondition: [allRequests, unAcceptedRequests],
  });
  // Countdown hook

  // Reset active and done state when request changes
  // useEffect(() => {
  //   // setCountdownActive(true);
  //   setDone(false);
  // }, [request._id]);

  // Reset active and done state when request changes

  //  Updating done
  

  useEffect(() => {
    if (completed) {
      if (
        Number(request?.number) == Number(currentRequest?.number) &&
        unAcceptedRequests.length > 1
      ) {
        dispatch(
          setRideState({
            key: "currentRiderOfferIndex",
            value:
              currentRiderOfferIndex <
              Number(unAcceptedRequests[unAcceptedRequests.length - 1]?.number)
                ? Number(request?.number) + 1
                : 1,
          })
        );
      }

      restart();
      start();
    }
  }, [completed]);

  return (
    <View
      style={[
        wFull,
        h(60),
        flexCol,
        px(10),
        borderGrey(0.7),
        bg(colors.white),
        rounded(10),
        gap(10),
        absolute,
        zIndex(Number(request.zIndex) || 10000),
        tw`shadow-md shadow-gray-800 flex-row align-items-center`,
        style,
      ]}
      {...others}
    >
      {/* Count down */}
      <Countdown
        duration={counterDuration * 1000}
        interval={100}
        containerStyle={{
          borderWidth: 1,
          borderColor: Colors.light.background,
          height: 35,
          width: 35,
          marginTop: "auto",
          marginBottom: "auto",
          borderRadius: 20,
          ...flexCenter,
        }}
        changeCondition={[request._id, done]}
        onComplete={({ restart: rs }) => {
          if (!done) setDone(true);
        }}
      >
        <Text style={[fs14, colorBlack]}>{seconds}</Text>
      </Countdown>
      {/* Count down */}

      {/* Rider Info Block */}
      <View style={[w("auto"), { flex: 1 }, flexCol, gap(5), justifyCenter]}>
        <Text style={[fw500, fs14, colorBlack]}>{request?.riderName}</Text>
        <Text style={[fw500, fs14, colorBlack]}>
          ₦ {request?.riderCounterOffer}
        </Text>
      </View>
      {/* Rider Info Block */}

      {/* View CTA */}
      <View
        style={[
          flex,
          gap(8),
          w("auto"),
          h(38),
          bg(colors.transparent),
          mYAuto as ViewStyle,
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            dispatch(
              setRideState({
                key: "query",
                value: RideConstants.query.accepting,
              })
            );
            showBottomSheet([400], <AcceptOrderSheet />, true);
            dispatch(
              setRideState({
                key: "currentRiderOfferIndex",
                value: request?.number || 1,
              })
            );
          }}
          style={[
            flex,
            hFull,
            w("auto"),
            rounded(20),
            px(15),
            itemsCenter,
            bg("#F9F7F8"),
            { borderColor: Colors.light.border, borderWidth: 0.7 },
          ]}
        >
          <Text style={[tw`text-black`]}>View</Text>
        </TouchableOpacity>
      </View>
      {/* View CTA */}
    </View>
  );
};

export default NewRequestTile;
