import Colors, { colors } from "@/constants/Colors";
import { fonts } from "@/constants/fonts";
import accountImgs from "@/constants/images/account";
import { homeImgs } from "@/constants/images/home";
import sharedImg from "@/constants/images/shared";
import tripImgs from "@/constants/images/trip";
import {
  c,
  colorBlack,
  fs12,
  fs14,
  fw400,
  fw500,
  fw700,
  neurialGrotesk,
} from "@/utils/fontStyles";
import {
  bg,
  borderB,
  borderGrey,
  flex,
  flexCol,
  gap,
  h,
  hFull,
  itemsCenter,
  justifyBetween,
  justifyCenter,
  justifyStart,
  mb,
  mt,
  pb,
  pt,
  px,
  py,
  rounded,
  w,
  wFull,
} from "@/utils/styles";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Text } from "react-native-paper";
import PaddedScreen from "../shared/paddedScreen";
import { image, mXAuto } from "@/utils/imageStyles";
import CtaBtn from "../shared/ctaBtn";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import TicketOtpSheet from "./ticketOtpSheet";
import OnTripSheet from "./onTripSheet";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import tw from "@/constants/tw";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { EQuery, IRiderRideDetails } from "@/state/types/ride";
import { setRideState } from "@/state/slices/ride";
import FetchService from "@/services/api/fetch.service";
import { useState } from "react";
import { useStorageState } from "@/hooks/useStorageState";
import { RideConstants } from "@/constants/ride";

function DropoffSheet() {
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state: RootState) => state.user);
  const { selectedRoute, currentRide, currentRequest } = useAppSelector(
    (state: RootState) => state.ride
  );
  const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { code, msg, loading } = fetchState;

  const dropoffTrip = async () => {
    setFetchState((prev) => ({
      ...prev,
      loading: true,
      msg: "",
      code: null,
    }));
    await FetchService.postWithBearerToken({
      url: `/user/driver/me/ride/${currentRide?._id}/end-ride`,
      data: {
        riderRideId: currentRequest?._id,
      },
      token: token as string,
    })
      .then(async (res) => {
        const data = res?.body ? await res.body : res;
        const code = data?.code;
        const msg = data?.msg;
        const riderRide: IRiderRideDetails | null = data?.riderRide;
        const currentRide = data?.currentRide;
        console.log({ currentRide, riderRide });

        setFetchState((prev) => ({ ...prev, loading: false, msg, code }));

        if (code && code == 200) {
          dispatch(setRideState({ key: "currentRide", value: currentRide }));
          dispatch(setRideState({ key: "currentRequest", value: riderRide }));

          showBottomSheet([300, 550], <OnTripSheet />, true);
        }
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const cancelTrip = () => {
    hideBottomSheet();
    router.push("/(home)");
  };

  return (
    <PaddedScreen>
      <View style={tw`w-full flex flex-col gap-2`}>
        {/* Back Btn CTA */}
        <TouchableOpacity
          style={tw`w-auto flex flex-row items-center`}
          onPress={() => {
            dispatch(
              setRideState({
                key: "rideAcceptStage",
                value: EQuery.pause_trip,
              })
            );
            showBottomSheet([300, 550], <OnTripSheet />, true);
          }}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
          <Text>Back</Text>
        </TouchableOpacity>
        {/* Back Btn CTA */}

        <View
          style={[
            wFull,
            flexCol,
            bg(colors.white),
            h(205),
            gap(32),
            mt(40),
            mb(20),
          ]}
        >
          {/* //!Rider Details Block */}
          <View
            style={[wFull, flex, justifyBetween, itemsCenter, { height: 61 }]}
          >
            <View style={[flex, justifyBetween, { gap: 14 }]}>
              <View>
                <Image
                  style={[
                    { width: 60, height: 60, objectFit: "cover" },
                    tw`rounded-full`,
                  ]}
                  source={{
                    uri:
                      (currentRequest?.rider?.picture as string) ||
                      (currentRequest?.rider?.avatar as string),
                  }}
                />
              </View>

              <View style={[hFull, flexCol, justifyCenter, gap(12)]}>
                <Text style={[c(colors.black), fw700, fs14]}>King John</Text>
                <Text style={[c(Colors.light.darkGrey), fw400, fs12]}>
                  {"few mins"} away
                </Text>
              </View>
            </View>

            <TouchableOpacity>
              <Text style={[fw500, fs14, colorBlack]}>
                ₦ {currentRequest?.riderCounterOffer}
              </Text>
            </TouchableOpacity>
          </View>
          {/* //!Rider Details Block */}

          {/* //!Pick up-Drop off Block */}
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
              { shadowColor: colors.black, shadowRadius: 10 },
            ]}
          >
            {/* //!Pick up Block */}
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
                source={tripImgs.greenBgLocation}
              />
              <Text style={[fw500, fs14, colorBlack]}>
                {currentRequest?.pickupBusstop?.name}
              </Text>
            </View>
            {/* //!Pick up Block */}

            {/* //!Drop off Block */}
            <View style={[wFull, flex, gap(16), itemsCenter, justifyStart]}>
              <Image
                style={[image.w(14), image.h(20)]}
                source={tripImgs.redBgLocation}
              />
              <Text style={[fw500, fs14, colorBlack]}>
                {currentRequest?.dropoffBusstop?.name}
              </Text>
            </View>
            {/* //!Drop off Block */}
          </View>
          {/* //!Pick up-Drop off Block */}

          {/* //!Drop-off-Cancel Trip CTA */}
          <View style={[flexCol, gap(16), justifyBetween]}>
            <CtaBtn
              img={{ src: sharedImg.proceedIcon, w: 20, h: 20 }}
              onPress={() => dropoffTrip()}
              text={{ name: "Drop off", color: colors.white }}
              bg={{ color: Colors.light.background }}
              style={{ baseContainer: {} }}
            />
            <CtaBtn
              img={{ src: sharedImg.cancelImage, w: 20, h: 20 }}
              onPress={() => cancelTrip()}
              text={{ name: "Cancel Trip", color: Colors.light.darkGrey }}
              bg={{ color: "#F9F7F8", borderColor: Colors.light.border }}
              style={{ baseContainer: { ...w("80%"), ...mXAuto } as ViewStyle }}
            />
          </View>
          {/* //!Drop-off-Cancel Trip CTA */}
        </View>
      </View>
    </PaddedScreen>
  );
}

export default DropoffSheet;
