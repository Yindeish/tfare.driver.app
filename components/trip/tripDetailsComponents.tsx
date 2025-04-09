import Colors, { colors } from "@/constants/Colors";
import tripImgs from "@/constants/images/trip";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { setRideState } from "@/state/slices/ride";
import { setTripState } from "@/state/slices/trip";
import { RootState } from "@/state/store";
import { IRequest, TCountdownStatus } from "@/state/types/trip";
import { Utils } from "@/utils";
import {
  c,
  colorBlack,
  colordarkGrey,
  colorWhite,
  fs12,
  fs14,
  fw400,
  fw500,
  fw700,
  neurialGrotesk,
  textCenter,
} from "@/utils/fontStyles";
import { image, wHFull } from "@/utils/imageStyles";
import {
  absolute,
  bg,
  borderB,
  borderGrey,
  borderY,
  flex,
  flexCol,
  gap,
  h,
  itemsCenter,
  justifyBetween,
  justifyCenter,
  justifyEnd,
  justifyStart,
  mb,
  ml,
  mr,
  mt,
  p,
  pb,
  pt,
  px,
  py,
  r,
  relative,
  rounded,
  t,
  top0,
  w,
  wFull,
  zIndex,
} from "@/utils/styles";
import { Href, router, useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "react-native-paper";
import { Countdown } from "../shared/countdown";

export const RequestCountdown = ({ request }: { request: IRequest }) => {
  const dispatch = useAppDispatch();
  const { unAcceptedRequests, currentRiderOfferIndex, currentRequest } =
    useAppSelector((state: RootState) => state.trip);

  const [counterDuration] = useState(20);
  const [done, setDone] = useState(false);

  // Reset done state when request changes
  useEffect(() => {
    setDone(false);
  }, [request?._id]);
  // Reset done state when request changes

  // Handle countdown completion
  useEffect(() => {
    if (done) {
      // Mark global count down status as completed
      dispatch(
        setRideState({
          key: "countdownStatus",
          value: "completed" as TCountdownStatus,
        })
      );
      // Mark global count down status as completed

      const updatedRequests = unAcceptedRequests.map((req) => {
        if (Number(req.number) === Number(currentRequest?.number)) {
          return {
            ...req,
            shown: unAcceptedRequests.length == 1 ? true : false,
            countdownStatus: "completed" as TCountdownStatus,
          };
        }
        return req;
      });

      // Updating the list
      dispatch(
        setRideState({
          key: "unAcceptedRequests",
          value: updatedRequests,
        })
      );
      // Updating the list

      // Update to the next request
      request?.number == currentRequest?.number &&
        unAcceptedRequests.length > 1 &&
        dispatch(
          setRideState({
            key: "currentRiderOfferIndex",
            value:
              currentRiderOfferIndex <
              unAcceptedRequests[unAcceptedRequests.length - 1]?.number
                ? Number(request?.number) + 1
                : 1,
          })
        );
      // Update to the next request
    }
  }, [done]);
  // Handle countdown completion

  return (
    <View
      style={[
        wFull,
        h(120),
        flex,
        itemsCenter,
        justifyCenter,
        bg(colors.transparent),
      ]}
    >
      {request?.shown && (
        <View style={[absolute, top0, zIndex(Number(request?.zIndex))]}>
          <Countdown
            duration={counterDuration * 1000}
            interval={100}
            request={currentRequest as IRequest}
            changeCondition={[request._id, done]}
            onComplete={() => {
              if (!done) {
                setDone(true);
              }
            }}
          />
        </View>
      )}
    </View>
  );
};

export const DriverOnlineTile = () => {
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

export const DropoffTile = () => {
  const { allRequests } = useAppSelector((state: RootState) => state.ride);
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
        <Text style={[fw500, fs14, colorBlack]}>
          {
            allRequests.filter((req) => req?.rideStatus == "started")[0]
              ?.dropoffName
          }
        </Text>
      </View>
      {/* //!Drop off Input Block */}
    </View>
  );
};

export const NextBusstop = () => {
  const { allRequests } = useAppSelector((state: RootState) => state.ride);
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
        <Text style={[fw500, fs14, colorBlack]}>
          {allRequests.find((req) => req?.rideStatus == "started")?.dropoffName}
        </Text>
      </View>
      {/* //!Next Bus Stop Value Block */}
    </View>
  );
};
