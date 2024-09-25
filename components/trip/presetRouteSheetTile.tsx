import Colors, { colors } from "@/constants/Colors";
import tripImgs from "@/constants/images/trip";
import { c, fs12, fs14, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { image } from "@/utils/imageStyles";
import { bg, borderGrey, flex, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, ml, p, px, py, rounded, w, wFull } from "@/utils/styles";
import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Href, router } from "expo-router";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";

function PresetRouteSheetTile() {
    const { hideBottomSheet } = useBottomSheet()


    return (
        <View style={[wFull, bg('#F9F7F8'), px(9), py(17), rounded(10), flexCol, gap(20)]}>
            <View style={[flex, justifyBetween, itemsCenter]}>
                <Text style={[fw700, fs14, c(colors.black)]}>Bus Stop A</Text>

                <Image style={[image.w(90), image.h(5)]} source={tripImgs.tripDirection} />

                <Text style={[fw700, fs14, c(colors.black)]}>Bus Stop B</Text>
            </View>

            <View style={[wFull, flex, justifyBetween, itemsCenter]}>
                <View style={[flexCol, gap(16)]}>
                    <Text style={[fw400, fs12, c(Colors.light.darkGrey), neurialGrotesk]}>00:00 AM</Text>
                    <Text style={[fw400, fs12, c(Colors.light.darkGrey), neurialGrotesk]}>Today</Text>
                </View>

                <View style={[flex, itemsCenter,]}>
                    <View style={[bg(colors.white), borderGrey(0.7), flex, itemsCenter, gap(10), p(16), rounded(1000)]}>
                        <Image style={[image.w(18), image.h(18),]} source={tripImgs.tripWayImage} />
                        <Text style={[fw500, fs12, c(colors.black)]}>View trip details</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/(trip)/tripDetails/1' as Href)} style={[h(45), w(45), rounded(1000), bg(Colors.light.background), flex, itemsCenter, justifyCenter, ml(-15)]}>
                        <FontAwesome6 size={20} name="arrow-right-long" color={colors.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default PresetRouteSheetTile;