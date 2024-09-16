import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { Href, router } from "expo-router";
import { View, Image, TextInput, TouchableOpacity, ScrollView, FlatList, Pressable, Button, Dimensions } from "react-native";
import PaddedScreen from "../shared/paddedScreen";
import { absolute, bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsEnd, itemsStart, justifyBetween, justifyCenter, justifyStart, left0, mLAuto, mRAuto, mXAuto, ml, mt, p, pLAuto, pXAuto, pb, pl, px, py, relative, right0, rounded, t, top0, w, wFull, wHFull, zIndex } from "@/utils/styles";
import { Text, Portal, Dialog, Paragraph } from "react-native-paper";
import { c, colorBlack, colorBlueBg, colorBorderGrey, colorWhite, fs12, fs14, fs16, fs18, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { image } from "@/utils/imageStyles";
import sharedImg from "@/constants/images/shared";
import Colors from "@/constants/Colors";


const SearchingOrder = () => {
    const { showBottomSheet, hideBottomSheet, } = useBottomSheet();

    // setTimeout(() => {
    //     // hideBottomSheet();
    //     // router.push(`/`)
    // }, 3000)

    return (
        <PaddedScreen>
            <View style={[wHFull, flexCol, itemsCenter, gap(44)]}>
                <View style={[flexCol, itemsCenter, gap(16)]}>
                    <View style={[flex, gap(16)]}>
                        <Image style={[image.w(30), image.h(25.91)]} source={sharedImg.yellowTripImage} />

                        <Text style={[neurialGrotesk, fw700, colorBlack, { fontSize: 22 }]}>Searching for Orders</Text>
                    </View>

                    <Text style={[c(Colors.light.darkGrey), neurialGrotesk, fw400, fs12]}>Searching for nearby available orders</Text>
                </View>

                <Image style={[image.w(120), image.h(120)]} source={sharedImg.searchingOrderImage} />

            </View>
        </PaddedScreen>
    )
}

export default SearchingOrder;