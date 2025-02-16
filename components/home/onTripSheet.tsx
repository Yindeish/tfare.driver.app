import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import Entypo from "@expo/vector-icons/Entypo";
import { Href, router } from "expo-router";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Pressable,
  Button,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import PaddedScreen from "../shared/paddedScreen";
import {
  absolute,
  bg,
  borderB,
  borderGrey,
  borderT,
  flex,
  flexCol,
  gap,
  h,
  hFull,
  itemsCenter,
  itemsEnd,
  itemsStart,
  justifyBetween,
  justifyCenter,
  justifyStart,
  left0,
  mLAuto,
  mRAuto,
  mXAuto,
  ml,
  mt,
  p,
  pLAuto,
  pXAuto,
  pb,
  pl,
  px,
  py,
  relative,
  right0,
  rounded,
  t,
  top0,
  w,
  wFull,
  wHFull,
  zIndex,
} from "@/utils/styles";
import { Text, Portal, Dialog, Paragraph } from "react-native-paper";
import {
  c,
  colorBlack,
  colorBlueBg,
  colorBorderGrey,
  colorWhite,
  fs12,
  fs14,
  fs16,
  fs18,
  fw400,
  fw500,
  fw700,
  neurialGrotesk,
} from "@/utils/fontStyles";
import { image } from "@/utils/imageStyles";
import sharedImg from "@/constants/images/shared";
import Colors, { colors } from "@/constants/Colors";
import CtaBtn from "../shared/ctaBtn";
import tripImgs from "@/constants/images/trip";
import { useEffect, useState } from "react";
import { homeImgs } from "@/constants/images/home";
import DropoffSheet from "./dropoffTripSheet";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { setRideState } from "@/state/slices/ride";
import { ERideAcceptStage, IRiderRideDetails } from "@/state/types/ride";
import FetchService from "@/services/api/fetch.service";
import { RootState } from "@/state/store";
import tw from "@/constants/tw";
import { Ionicons } from "@expo/vector-icons";
import TicketOtpSheet from "./ticketOtpSheet";

const { height } = Dimensions.get("window");

function OnTripSheet() {
  const { showBottomSheet } = useBottomSheet();
  const [passengersShown, setPassengersShown] = useState(false);
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state: RootState) => state.user);
  const { selectedRoute, currentRide } = useAppSelector(
    (state: RootState) => state.ride
  );

  const [fetchState, setFetchState] = useState({
    loading: false,
  });
  const { loading } = fetchState;

  const getCurrentRide = async () => {
    await FetchService.getWithBearerToken({
      url: `/user/driver/me/ride/${currentRide?._id}/ride-details`,
      token: token as string,
    })
      .then(async (res: any) => {
        const data = res?.body ? await res.body : res;
        const code = data?.code;
        const msg = data?.msg;
        const rides = data?.rides;

        if (code && code == 200 && rides) {
          dispatch(setRideState({ key: "rides", value: rides }));
          setFetchState((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      })
      .catch((err) => {
        console.log({ err });
        setFetchState((prev) => ({
          ...prev,
          loading: false,
        }));
      });
  };

  const pauseTrip = () => {
    
  };

  const selectTrip = (request: IRiderRideDetails) => {
    dispatch(setRideState({ key: "currentRequest", value: request }));
    showBottomSheet([450], <DropoffSheet />);
  };

  useEffect(() => {
    getCurrentRide();
  }, []);

  return (
    <View style={[wHFull, flexCol, itemsCenter, gap(44)]}>
      {/* //!Header */}
      <PaddedScreen>
        <View style={[flexCol, itemsCenter, gap(16)]}>
          {/* Back Btn CTA */}
          <TouchableOpacity
            style={tw`w-auto mr-auto flex flex-row items-center`}
            onPress={() => {
              dispatch(
                setRideState({
                  key: "rideAcceptStage",
                  value: ERideAcceptStage.start_trip,
                })
              );
              showBottomSheet([500, 600], <TicketOtpSheet />);
            }}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
            <Text>Back</Text>
          </TouchableOpacity>
          {/* Back Btn CTA */}

          <View style={[flex, gap(16)]}>
            <Image
              style={[image.w(30), image.h(25.91)]}
              source={sharedImg.tripChargeImage}
            />

            <Text style={[neurialGrotesk, fw700, colorBlack, { fontSize: 22 }]}>
              On Trip
            </Text>
          </View>

          <Text style={[c(Colors.light.darkGrey), neurialGrotesk, fw400, fs12]}>
            Navigate to Dropoff Bus Stop. You should arrive in 15 minutes
          </Text>
        </View>
      </PaddedScreen>
      {/* //!Header */}

      <View style={[wFull, flexCol, gap(16)]}>
        {/* //!Show Passengers CTA */}
        <PaddedScreen>
          <TouchableOpacity
            onPress={() => {
              setPassengersShown((prev) => (prev === true ? false : true));
            //   if (!currentRide) getCurrentRide();
            }}
            style={[flex, itemsCenter, gap(16), wFull]}
          >
            <Text style={[fw700, fs16, neurialGrotesk, colorBlack]}>
              View Passengers
            </Text>

            <Entypo
              name={`${
                passengersShown ? "chevron-thin-up" : "chevron-thin-down"
              }`}
              size={20}
              color={Colors.light.darkGrey}
            />
          </TouchableOpacity>
        </PaddedScreen>
        {/* //!Show Passengers CTA */}

        {/* //!Passengers list */}
          <ScrollView
        //   refreshControl={<RefreshControl refreshing={loading} onRefresh={getCurrentRide} />}
            style={[
              flexCol,
              borderT(0.7, Colors.light.border),
              {
                flexBasis: "45%",
                opacity: passengersShown ? 1 : 0,
                display: passengersShown ? "flex" : "none",
              }, tw ``
            ]}
          >
            {loading? (<View style={[tw`w-full h-full flex items-center justify-center bg-red-700`, {flex: 1}]}>
            <ActivityIndicator />
          </View>) :(<View
              style={[
                flexCol,
                passengersShown ? borderT(0.7, Colors.light.border) : {},
                pb(10),
                h(passengersShown ? height * 0.4 : 0),
              ]}
            >
              {currentRide?.ridersRides?.map((request, index) => (
                <TouchableOpacity
                  onPress={() => {
                    selectTrip(request);
                  }}
                  style={[
                    wFull,
                    h(80),
                    flex,
                    justifyBetween,
                    bg("#F9F7F8"),
                    py(7),
                    borderB(0.7, Colors.light.border),
                    px(20),
                  ]}
                  key={index}
                >
                  <Image
                    style={[{ width: 60, height: 60, objectFit: "cover" }]}
                    source={{
                      uri:
                        (request?.rider?.picture as string) ||
                        (request?.rider?.avatar as string),
                    }}
                  />

                  <View
                    style={[
                      flexCol,
                      justifyCenter,
                      gap(16),
                      { flexBasis: "55%" },
                    ]}
                  >
                    <Text style={[c(colors.black), fw700, fs14]}>
                      {request?.rider?.fullName}
                    </Text>
                    <Text style={[c(Colors.light.darkGrey), fw400, fs12]}>
                      Arrived location
                    </Text>
                  </View>

                  <Text style={[fw500, fs14, colorBlack]}>
                    ₦ {request?.riderCounterOffer}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* //!Seat left block */}
              {Number(currentRide?.availableSeats) > 0 && (
                <PaddedScreen>
                  <View
                    style={[
                      w(155),
                      rounded(1000),
                      flex,
                      gap(16),
                      itemsCenter,
                      justifyCenter,
                      borderGrey(0.7),
                      h(45),
                      mt(16),
                    ]}
                  >
                    <Image
                      style={[image.w(18), image.h(15)]}
                      source={sharedImg.passengersImage}
                    />

                    <Text
                      style={[fw500, fs12]}
                    >{`${currentRide?.availableSeats} seat Available`}</Text>
                  </View>
                </PaddedScreen>
              )}
              {/* //!Seat left block */}
            </View>)}
          </ScrollView>
        {/* //!Passengers list */}
      </View>

      {/* //!Pause Trip CTA */}
      <CtaBtn
        img={{
          src: tripImgs.arrivedpickupImage,
        }}
        onPress={() => pauseTrip()}
        text={{ name: "Pause Trip", color: colors.white }}
        bg={{ color: Colors.light.background }}
        style={{ baseContainer: { ...wFull, ...px(20) } }}
      />
      {/* //!Pause Trip CTA */}
    </View>
  );
}

export default OnTripSheet;
