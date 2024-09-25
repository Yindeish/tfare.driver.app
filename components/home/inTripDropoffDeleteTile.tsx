import Colors, { colors } from "@/constants/Colors";
import { homeImgs } from "@/constants/images/home";
import tripImgs from "@/constants/images/trip";
import { c, fs12, fs14, fw400, fw500, fw700 } from "@/utils/fontStyles";
import { image } from "@/utils/imageStyles";
import { bg, border, borderB, borderGrey, borderL, borderR, borderT, borderX, flex, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, pb, pt, rounded, w, wFull } from "@/utils/styles";
import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons';

function InTripDropoffDeleteTile() {


    return (
        <View style={[wFull, borderX(0, ''), borderB(0.7, Colors.light.border), pb(16), pt(32), flex, itemsCenter, justifyBetween]}>
            <View style={[w('85%'), flexCol, gap(16)]}>
                <View style={[flex, itemsCenter, gap(16)]}>
                    <Image style={[image.w(20), image.h(20)]} source={homeImgs.tripImg} />

                    <Text style={[fs12, fw400, c(Colors.light.darkGrey)]}>1st Bus stop</Text>
                </View>

                <View style={[flex, itemsCenter, gap(10)]}>
                    <View style={[w(5), h(5), bg(colors.black), rounded(1000)]} />
                    <Text style={[fs14, fw700, c(colors.black)]}>Orogun Bus Stop</Text>
                </View>
            </View>

            <TouchableOpacity style={[w(45), h(45), rounded(1000), flex, itemsCenter, justifyCenter, bg('#F9F7F8'), borderGrey(0.7)]}>
                <Ionicons name="close-circle-outline" size={24} color={Colors.light.darkGrey} />
            </TouchableOpacity>
        </View>
    )
}

export default InTripDropoffDeleteTile;