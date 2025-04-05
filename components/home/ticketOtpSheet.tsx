import Colors, { colors } from "@/constants/Colors";
import { fonts } from "@/constants/fonts";
import accountImgs from "@/constants/images/account";
import { homeImgs } from "@/constants/images/home";
import sharedImg from "@/constants/images/shared";
import tripImgs from "@/constants/images/trip";
import {
  c,
  colorBlack,
  colordarkGrey,
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
  ActivityIndicator,
} from "react-native";
import { Text } from "react-native-paper";
import PaddedScreen from "../shared/paddedScreen";
import { image, mXAuto } from "@/utils/imageStyles";
import CtaBtn from "../shared/ctaBtn";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { OtpInput } from "react-native-otp-entry";
import { router } from "expo-router";
import OnTripSheet from "./onTripSheet";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import * as Linking from "expo-linking";
import tw from "@/constants/tw";
import { useState } from "react";
import { useFormik } from "formik";
import { number, ObjectSchema, string } from "yup";
import { Ionicons } from "@expo/vector-icons";
import { setRideState } from "@/state/slices/ride";
import { EQuery, IRiderRideDetails } from "@/state/types/ride";
import ArrivedPickupSheet from "./arrivedPickupSheet";
import FetchService from "@/services/api/fetch.service";
import { useSnackbar } from "@/contexts/snackbar.context";
import { useStorageState } from "@/hooks/useStorageState";
import { RideConstants } from "@/constants/ride";
import { useTooltip } from "../shared/tooltip";

function TicketOtpSheet() {
  const { hideBottomSheet, showBottomSheet } = useBottomSheet();
  const dispatch = useAppDispatch();
  const { rideRequestInView, currentRide, ridesAccepted } = useAppSelector(
    (state: RootState) => state.ride
  );
  const { token } = useAppSelector((state: RootState) => state.user);
  const {Snackbar, notify, closeSnackbar, snackbarVisible} = useSnackbar();
  // const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);
  const {setTooltipState} = useTooltip()

  console.log({currentRide})

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { code, msg, loading } = fetchState;

  const openCallerApp = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open dialer:", err);
    });
  };

  const openWhatsApp = (phoneNumber: string) => {
    const url = `whatsapp://send?phone=${phoneNumber}`;
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open WhatsApp:", err);
    });
  };

  const startTrip = async (otp: string) => {

    setFetchState((prev) => ({
      ...prev,
      loading: true,
      msg: "",
      code: null,
    }));
    await FetchService.patchWithBearerToken({
      url: `/user/driver/me/ride/${currentRide?._id}/start-ride`,
      data: {
        riderRideId: rideRequestInView?._id,
        ticketOtp: otp,
      },
      token: token as string,
    })
      .then(async (res) => {
        const data = res?.body ? await res.body : res;
        const code = data?.code;
        const msg = data?.msg;

        setTooltipState({key: 'message', value: msg})
        setTooltipState({key: 'visible', value: true})
        const riderRide: IRiderRideDetails | null = data?.riderRide;
        const currentRide = data?.currentRide;
        console.log({ currentRide, riderRide, code });

        setFetchState((prev) => ({ ...prev, loading: false, }));

        if ((code && (code == 200 || code == 201 || code == 400)) && riderRide && currentRide) {
          const rideSaved = ridesAccepted.find(
            (ride) => ride._id == riderRide?._id
          );
          
          if (!rideSaved) {
            dispatch(
              setRideState({
                key: "ridesAccepted",
                value: [...ridesAccepted, riderRide],
              })
            );

            dispatch(setRideState({ key: "currentRide", value: currentRide }));
            dispatch(setRideState({key:'rideRequestInView', value: riderRide}));

            dispatch(setRideState({key: 'query', value: RideConstants.query.pause_trip}))
            showBottomSheet([300, 550], <OnTripSheet />);
            return;
          }
        }
        else setFetchState((prev) => ({ ...prev, msg, code }));
      })
      .catch((err: any) => {
        console.log({ err });
        setFetchState((prev) => ({ ...prev, msg: err?.message }));
      });
  };

  const cancelTrip = () => {
    dispatch(setRideState({key:'selectedRoute', value: false}));
    dispatch(setRideState({key:'driverOnline', value: false}));
    dispatch(setRideState({key:'selectedRoute', value: null}));
    dispatch(setRideState({key:'query', value: RideConstants.query.searching}));

    hideBottomSheet();

    setTooltipState({key: 'message', value: 'Trip cancelled!'})
        setTooltipState({key: 'visible', value: true})
    router.push("/(home)");
  };

  const { handleChange, handleSubmit, values, errors } = useFormik({
    initialValues: { otp: "" },
    validationSchema: new ObjectSchema({
      otp: number()
        .required("Ticket ID is required!")
        .min(4, "ID must be 4-digits"),
    }),
    onSubmit: ({ otp }) => startTrip(otp),
  });

  return (
    <PaddedScreen>
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
        {/* Back Btn CTA */}
        <TouchableOpacity
          style={tw`w-auto flex flex-row items-center`}
          onPress={() => {
            dispatch(
              setRideState({
                key: "query",
                value: RideConstants.query.arrived_pickup,
              })
            );
            showBottomSheet([350, 400], <ArrivedPickupSheet />, true);
          }}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
          <Text>Back</Text>
        </TouchableOpacity>
        {/* Back Btn CTA */}

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
                    (rideRequestInView?.riderPicture as string),
                }}
              />
            </View>

            <View style={[hFull, flexCol, justifyCenter, gap(12)]}>
              <Text style={[c(colors.black), fw700, fs14]}>
                {rideRequestInView?.riderName}
              </Text>
              <Text style={[c(Colors.light.darkGrey), fw400, fs12]}>
                Arrived location
              </Text>
            </View>
          </View>

          <View>
            <Text style={[fw500, fs14, colorBlack]}>
              ₦ {rideRequestInView?.riderCounterOffer}
            </Text>
          </View>
        </View>
        {/* //!Rider Details Block */}

        {/* //!Chat-Call CTAs */}
        <View style={[flex, itemsCenter, gap(20), mXAuto] as ViewStyle[]}>
          <TouchableOpacity
            onPress={() => openWhatsApp(String(rideRequestInView?.riderPhoneNo))}
            style={[
              flex,
              rounded(100),
              gap(10),
              py(13),
              px(26),
              itemsCenter,
              bg("#F9F7F8"),
              { borderColor: Colors.light.border, borderWidth: 0.7 },
            ]}
          >
            <Image
              source={sharedImg.chatImage}
              style={[image.w(18), image.h(18)]}
            />

            <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              openCallerApp(String(rideRequestInView?.riderPhoneNo))
            }
            style={[
              flex,
              rounded(100),
              gap(10),
              py(13),
              px(26),
              itemsCenter,
              bg("#F9F7F8"),
              { borderColor: Colors.light.border, borderWidth: 0.7 },
            ]}
          >
            <Image
              source={sharedImg.phoneImage}
              style={[image.w(18), image.h(18)]}
            />

            <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>Call</Text>
          </TouchableOpacity>
        </View>
        {/* //!Chat-Call CTAs */}

        {/* //!Ticket ID Block */}
        <View style={[flexCol, gap(12), itemsCenter, wFull]}>
          <Text style={[colordarkGrey, fs14, fw500, neurialGrotesk]}>
            Enter Ticket ID
          </Text>

          <OtpInput
            numberOfDigits={4}
            blurOnFilled
            autoFocus={false}
            textInputProps={{
              value: values.otp,
              style: {
                borderColor:
                  errors?.otp != "" || !errors?.otp
                    ? colors.grey500
                    : colors.red500,
              },
            }}
            onTextChange={handleChange("otp")}
            type="alphanumeric"
            theme={{ containerStyle: { ...w("70%"), ...gap(12) } }}
          />
        </View>
        {/* //!Ticket ID Block */}

        {/* //!Start-Cancel Trip CTAs */}
        <View style={[flexCol, gap(20)]}>
          {!loading ? (
            <CtaBtn
            img={{
              src: tripImgs.arrivedpickupImage,
            }}
            onPress={() => handleSubmit()}
            text={{ name: "Start Trip" }}
            bg={{ color: Colors.light.background }}
          />
          ) : (
            <ActivityIndicator size={'small'} />
          )}

          <CtaBtn
            img={{
              src: sharedImg.cancelImage,
            }}
            onPress={() => cancelTrip()}
            text={{ name: "Cancel Trip", color: Colors.light.darkGrey }}
            bg={{ color: "#F9F7F8", borderColor: Colors.light.border }}
            style={{ container: { ...w("80%"), ...mXAuto } as ViewStyle }}
          />
        </View>
        {/* //!Start-Cancel Trip CTAs */}

        {/* <Text style={tw `text-[10px] font-medium text-red-500`}>{msg}</Text> */}
        <Snackbar msg={msg} onDismiss={() => closeSnackbar()} snackbarVisible={snackbarVisible} />
      </View>
    </PaddedScreen>
  );
}

export default TicketOtpSheet;
