import Colors, { colors } from "@/constants/Colors";
import tripImgs from "@/constants/images/trip";
import { c, fs12, fs14, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { image } from "@/utils/imageStyles";
import { bg, flex, flexCol, gap, itemsCenter, justifyBetween, p, px, py, rounded, wFull } from "@/utils/styles";
import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Href, router } from "expo-router";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { IRoute } from "@/state/types/ride";

function PresetRouteSheetTile({route}:{route: IRoute}) {
    console.log({route})
    const { hideBottomSheet } = useBottomSheet()


    return (
        <View style={[wFull, bg('#F9F7F8'), px(9), py(17), rounded(10), flexCol, gap(20)]}>
            <View style={[flex, justifyBetween, itemsCenter]}>
                <Text style={[fw700, fs14, c(colors.black)]}>{route?.pickupBusstop?.name}</Text>

                <Image style={[image.w(90), image.h(5)]} source={tripImgs.tripDirection} />

                <Text style={[fw700, fs14, c(colors.black)]}>{route?.dropoffBusstop?.name}</Text>
            </View>

            <View style={[wFull, flex, justifyBetween, itemsCenter]}>
                <Text style={[fw400, fs12, c(Colors.light.darkGrey), neurialGrotesk]}>Ride starts immediately</Text>

                <TouchableOpacity onPress={() => {
                    hideBottomSheet();
                    router.push('/(route)/routeDetails' as Href)
                }} style={[bg(Colors.light.background), flex, itemsCenter, gap(10), p(16), rounded(1000)]}>
                    <Image style={[image.w(18), image.h(18),]} source={tripImgs.whiteBgTripWay} />
                    <Text style={[fw500, fs12, c(colors.white)]}>Select Route</Text>
                    <FontAwesome6 size={20} name="arrow-right-long" color={colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default PresetRouteSheetTile;