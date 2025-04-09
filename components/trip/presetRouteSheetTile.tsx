import Colors, { colors } from "@/constants/Colors";
import tripImgs from "@/constants/images/trip";
import {
  c,
  fs12,
  fs14,
  fw400,
  fw500,
  fw700,
  neurialGrotesk,
} from "@/utils/fontStyles";
import { image } from "@/utils/imageStyles";
import {
  bg,
  borderGrey,
  flex,
  flexCol,
  gap,
  h,
  itemsCenter,
  justifyBetween,
  justifyCenter,
  ml,
  p,
  px,
  py,
  rounded,
  w,
  wFull,
} from "@/utils/styles";
import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Href, router } from "expo-router";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { IRoute } from "@/state/types/ride";
import { useAppDispatch } from "@/state/hooks/useReduxToolkit";
import { setTripState } from "@/state/slices/trip";
import { ICurrentTrip } from "@/state/types/trip";
import { Utils } from "@/utils";
import AcceptOrderSheet from "./acceptOrderSheet";
import SearchingOrder from "./searchingOrderSheet";

function PresetRouteSheetTile({ trip }: { trip: ICurrentTrip }) {
  const { hideBottomSheet, showBottomSheet } = useBottomSheet();
  const dispatch = useAppDispatch();

  const upcomingTrip = trip?.driverId;
  const route = trip?.route as IRoute;

  return (
    <View
      style={[
        wFull,
        bg(upcomingTrip ? Colors.light.background : "#F9F7F8"),
        px(9),
        py(17),
        rounded(10),
        flexCol,
        gap(20),
      ]}
    >
      <View style={[flex, justifyBetween, itemsCenter]}>
        <Text
          style={[fw700, fs14, c(upcomingTrip ? colors.white : colors.black)]}
        >
          {route?.pickupBusstop?.name}
        </Text>

        <Image
          style={[image.w(90), image.h(5)]}
          source={
            upcomingTrip
              ? tripImgs.whiteBgTripDirection
              : tripImgs.tripDirection
          }
        />

        <Text
          style={[fw700, fs14, c(upcomingTrip ? colors.white : colors.black)]}
        >
          {route?.dropoffBusstop?.name}
        </Text>
      </View>

      <View style={[wFull, flex, justifyBetween, itemsCenter]}>
        <View style={[flexCol, gap(16)]}>
          <Text
            style={[
              fw400,
              fs12,
              c(upcomingTrip ? colors.white : Colors.light.darkGrey),
            //   neurialGrotesk,
            ]}
          >
            {Utils.formatTime(trip?.departureTime as unknown as string)}
          </Text>
          <Text
            style={[
              fw400,
              fs12,
              c(upcomingTrip ? colors.white : Colors.light.darkGrey),
            //   neurialGrotesk,
            ]}
          >
            {Utils.formatDate(trip?.departureDate as unknown as string)}
          </Text>
        </View>

        <View style={[flex, itemsCenter]}>
          <View
            style={[
              bg(colors.white),
              borderGrey(0.7),
              flex,
              itemsCenter,
              gap(10),
              p(16),
              rounded(1000),
            ]}
          >
            <Image
              style={[image.w(18), image.h(18)]}
              source={tripImgs.tripWayImage}
            />
            <Text style={[fw500, fs12, c(colors.black)]}>
              View trip details
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              dispatch(setTripState({ key: "currentPresetTrip", value: upcomingTrip ? null : trip }));
              dispatch(
                setTripState({ key: "currentUpcomingTrip", value: upcomingTrip ? trip: null })
              );
              dispatch(
                setTripState({
                  key: "pickupBusstopInput",
                  value: trip?.route?.pickupBusstop,
                })
              );
              dispatch(
                setTripState({
                  key: "dropoffBusstopInput",
                  value: trip?.route?.dropoffBusstop,
                })
              );
              dispatch(setTripState({key: 'intripDropoffsInput', value: trip?.route?.inTripDropoffs}))
              router.push(`/(trip)/tripDetails?id=${route?._id}` as Href);
              showBottomSheet([150, 300], <SearchingOrder />, true)
              // showBottomSheet([100, 400], <AcceptOrderSheet />, true);
            }}
            style={[
              h(45),
              w(45),
              rounded(1000),
              bg(upcomingTrip ? "#5D5FEF" : Colors.light.background),
              flex,
              itemsCenter,
              justifyCenter,
              ml(-15),
            ]}
          >
            <FontAwesome6
              size={20}
              name="arrow-right-long"
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default PresetRouteSheetTile;
