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
import { View, StyleSheet, Image, TouchableOpacity, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import PaddedScreen from "../shared/paddedScreen";
import { image, mXAuto } from "@/utils/imageStyles";
import CtaBtn from "../shared/ctaBtn";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import TicketOtpSheet from "./ticketOtpSheet";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { setRideState } from "@/state/slices/ride";
import { EQuery } from "@/state/types/ride";
import AcceptOrderSheet from "./acceptOrderSheet";
import tw from "@/constants/tw";
import * as Linking from 'expo-linking';
import { RootState } from "@/state/store";
import { useStorageState } from "@/hooks/useStorageState";
import { RideConstants } from "@/constants/ride";

function ArrivedPickupSheet() {
  const { showBottomSheet } = useBottomSheet();
  const dispatch = useAppDispatch();
  const {rideRequestInView, currentRiderOfferIndex} = useAppSelector((state: RootState) => state.ride);
  // const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);

  const openCallerApp = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch((err) => {
      console.error('Failed to open dialer:', err);
    });
  };
  
  const openWhatsApp = (phoneNumber: string) => {
    const url = `whatsapp://send?phone=${phoneNumber}`;
    Linking.openURL(url).catch((err) => {
      console.error('Failed to open WhatsApp:', err);
    });
  };

  return (
    <PaddedScreen styles={tw ``}>
      <View style={tw `w-full h-full flex flex-col gap-2`}>
        {/* Back Btn CTA */}
        <TouchableOpacity
        style={tw `w-auto flex flex-row items-center`}
          onPress={() => {
            dispatch(
              setRideState({
                key: "query",
                value: RideConstants.query.accepting
              })
            );
            showBottomSheet([400], <AcceptOrderSheet />, true);
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
            // h(205),
            hFull,
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
                  style={[{ width: 60, height: 60, objectFit: "cover" }, tw `rounded-full`]}
                source={{uri: rideRequestInView?.riderPicture as string}}
                />
              </View>

              <View style={[hFull, flexCol, justifyCenter, gap(12)]}>
                <Text style={[c(colors.black), fw700, fs14]}>{rideRequestInView?.riderName}</Text>
                <Text style={[c(Colors.light.darkGrey), fw400, fs12]}>
                  {/* {"5 min"} away */}
                  {"few mins"} {'index:'} {currentRiderOfferIndex} away
                </Text>
              </View>
            </View>

            <TouchableOpacity>
              <Text style={[fw500, fs14, colorBlack]}>₦ {rideRequestInView?.riderCounterOffer}</Text>
            </TouchableOpacity>
          </View>
          {/* //!Rider Details Block */}

          {/* //!Call-Chat Rider Block */}
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

              <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>
                Chat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openCallerApp(String(rideRequestInView?.riderPhoneNo))}
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

              <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>
                Call
              </Text>
            </TouchableOpacity>
          </View>
          {/* //!Call-Chat Rider Block */}

          {/* //!Arrived Pickup CTA */}
          <CtaBtn
            img={{ src: tripImgs.arrivedpickupImage, w: 20, h: 20 }}
            onPress={() => {
              dispatch(setRideState({key: 'query', value: RideConstants.query.start_trip}));
              showBottomSheet([300, 500, 600], <TicketOtpSheet />, true)
            }}
            text={{ name: "Arrived Pickup", color: colors.white }}
            bg={{ color: Colors.light.background }}
          />
          {/* //!Arrived Pickup CTA */}
        </View>
      </View>
    </PaddedScreen>
  );
}

export default ArrivedPickupSheet;
