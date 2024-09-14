import Colors, { colors } from "@/constants/Colors";
import { homeImgs } from "@/constants/images/home";
import tripImgs from "@/constants/images/trip";
import { c, fs12, fs14, fw400, fw500, fw700 } from "@/utils/fontStyles";
import { image } from "@/utils/imageStyles";
import { bg, border, borderB, borderL, borderR, borderT, borderX, flex, flexCol, gap, h, itemsCenter, justifyBetween, pb, pt, rounded, w } from "@/utils/styles";
import { Image, View } from "react-native";
import { Text } from "react-native-paper";

function InTripDropffTile() {


    return (
        <View style={[borderX(0, ''), borderB(0.7, Colors.light.border), pb(16), pt(32), flexCol, gap(16)]}>
            <View style={[flex, itemsCenter, gap(16)]}>
                <Image style={[image.w(20), image.h(20)]} source={homeImgs.tripImg} />

                <Text style={[fs12, fw400, c(Colors.light.darkGrey)]}>1st Bus stop</Text>
            </View>

            <View style={[flex, itemsCenter, gap(10)]}>
                <View style={[w(5), h(5), bg(colors.black), rounded('100%')]} />
                <Text style={[fs14, fw700, c(colors.black)]}>Orogun Bus Stop</Text>
            </View>
        </View>
    )
}

export default InTripDropffTile;