import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import Entypo from '@expo/vector-icons/Entypo';
import { Href, router } from "expo-router";
import { View, Image, TextInput, TouchableOpacity, ScrollView, FlatList, Pressable, Button, Dimensions } from "react-native";
import PaddedScreen from "../shared/paddedScreen";
import { absolute, bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsEnd, itemsStart, justifyBetween, justifyCenter, justifyStart, left0, mLAuto, mRAuto, mXAuto, ml, mt, p, pLAuto, pXAuto, pb, pl, px, py, relative, right0, rounded, t, top0, w, wFull, wHFull, zIndex } from "@/utils/styles";
import { Text, Portal, Dialog, Paragraph } from "react-native-paper";
import { c, colorBlack, colorBlueBg, colorBorderGrey, colorWhite, fs12, fs14, fs16, fs18, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { image } from "@/utils/imageStyles";
import sharedImg from "@/constants/images/shared";
import Colors, { colors } from "@/constants/Colors";
import CtaBtn from "../shared/ctaBtn";
import tripImgs from "@/constants/images/trip";

function OnTripSheet() {
    const pauseTrip = () => { }

    return (
        <PaddedScreen>
            <View style={[wHFull, flexCol, itemsCenter, gap(44)]}>
                <View style={[flexCol, itemsCenter, gap(16)]}>
                    <View style={[flex, gap(16)]}>
                        <Image style={[image.w(30), image.h(25.91)]} source={sharedImg.tripChargeImage} />

                        <Text style={[neurialGrotesk, fw700, colorBlack, { fontSize: 22 }]}>On Trip</Text>
                    </View>

                    <Text style={[c(Colors.light.darkGrey), neurialGrotesk, fw400, fs12]}>
                        Navigate to Dropoff Bus Stop. You should arrive in 15 minutes
                    </Text>
                </View>

                <TouchableOpacity style={[flex, itemsCenter, gap(16), wFull]}>

                    <Text style={[fw700, fs16, neurialGrotesk, colorBlack]}>View Passengers</Text>

                    <Entypo name="chevron-thin-down" size={20} color={Colors.light.darkGrey} />

                </TouchableOpacity>

                <CtaBtn
                    img={{
                        src: tripImgs.arrivedpickupImage
                    }}
                    onPress={() => pauseTrip()}
                    text={{ name: 'Pause Trip', color: colors.white }}
                    bg={{ color: Colors.light.background }}
                    style={{ baseContainer: { ...wFull } }}
                />
            </View>
        </PaddedScreen>
    )
}

export default OnTripSheet;