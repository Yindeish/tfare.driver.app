import Colors, { colors } from "@/constants/Colors";
import { homeImgs } from "@/constants/images/home";
import tripImgs from "@/constants/images/trip";
import tw from "@/constants/tw";
import { IBusStop } from "@/state/types/ride";
import { c, fs12, fs14, fw400, fw500, fw700 } from "@/utils/fontStyles";
import { image } from "@/utils/imageStyles";
import {
  bg,
  border,
  borderB,
  borderL,
  borderR,
  borderT,
  borderX,
  flex,
  flexCol,
  gap,
  h,
  itemsCenter,
  justifyBetween,
  pb,
  pt,
  rounded,
  w,
} from "@/utils/styles";
import { Ionicons } from "@expo/vector-icons";
import { GestureResponderEvent, Image, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

function InTripDropffTile({
  dropoff,
  index,
}: {
  dropoff: IBusStop;
  index: number;
}) {
  return (
    <View
      style={[
        borderX(0, ""),
        borderB(0.7, Colors.light.border),
        pb(16),
        pt(32),
        flexCol,
        gap(16),
      ]}
    >
      <View style={[flex, itemsCenter, gap(16)]}>
        <Image style={[image.w(20), image.h(20)]} source={homeImgs.tripImg} />

        {/* <Text style={[fs12, fw400, c(Colors.light.darkGrey)]}>{index}st Bus stop</Text> */}
        <Text style={[fs12, fw400, c(Colors.light.darkGrey)]}>
          {index}. Bus stop
        </Text>
      </View>

      <View style={[flex, itemsCenter, gap(10)]}>
        <View style={[w(5), h(5), bg(colors.black), rounded(1000)]} />
        <Text style={[fs14, fw700, c(colors.black)]}>{dropoff?.name}</Text>
      </View>
    </View>
  );
}

export function EditableInTripDropffTile({
  dropoff,
  index,
  onPress
}: {
  dropoff: IBusStop;
  index: number;
  onPress: ((event: GestureResponderEvent) => void) | undefined
}) {
  return (
    <View style={tw `w-full flex flex-row items-center gap-2 pl-1`}>
      <View
        style={[
          borderX(0, ""),
          borderB(0.7, Colors.light.border),
          pb(16),
          pt(32),
          flexCol,
          gap(16),
          {flex: 1}
        ]}
      >
        <View style={[flex, itemsCenter, gap(16)]}>
          <Image style={[image.w(20), image.h(20)]} source={homeImgs.tripImg} />

          {/* <Text style={[fs12, fw400, c(Colors.light.darkGrey)]}>{index}st Bus stop</Text> */}
          <Text style={[fs12, fw400, c(Colors.light.darkGrey)]}>
            {index}. Bus stop
          </Text>
        </View>

        <View style={[flex, itemsCenter, gap(10)]}>
          <View style={[w(5), h(5), bg(colors.black), rounded(1000)]} />
          <Text style={[fs14, fw700, c(colors.black)]}>{dropoff?.name}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={onPress} style={tw `w-[35px] h-[35px] flex items-center justify-center bg-[#F9F7F8] border-[0.7px] border-[#D7D7D7] rounded-full`}>
      <Ionicons name="close-circle-outline" size={25} color="#747474" />
      </TouchableOpacity>
    </View>
  );
}

export default InTripDropffTile;
