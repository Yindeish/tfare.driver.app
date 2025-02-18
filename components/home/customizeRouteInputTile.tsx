import { colors } from "@/constants/Colors";
import { homeImgs } from "@/constants/images/home";
import sharedImg from "@/constants/images/shared";
import tripImgs from "@/constants/images/trip";
import { colordarkGrey, fs12, fw400, fw500, neurialGrotesk } from "@/utils/fontStyles";
import { image } from "@/utils/imageStyles";
import { bg, border, borderGrey, flex, flexCol, gap, h, hFull, itemsCenter, px, rounded, wFull } from "@/utils/styles";
import { Image, NativeSyntheticEvent, TextInput, TextInputFocusEventData, TextStyle, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";


function CustomizeRouteInputTile({ label, onBlur, onChangeText, value, onFocus }: { label: string, value: string, onChangeText: ((text: string) => void) | undefined, onBlur: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) | undefined, onFocus?: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) | undefined
}) {


    return (
        <View style={[wFull, flexCol, gap(16)]}>
            <View style={[flex, gap(16), itemsCenter]}>
                <Image style={[image.w(20), image.h(20)]} source={homeImgs.tripImg} />
                <Text style={[fs12, fw400, colordarkGrey, neurialGrotesk]}>{label}</Text>
            </View>

            <View style={[flex, gap(16), itemsCenter, borderGrey(0.7), rounded(10), wFull, h(50), px(24), bg('#F9F7F8')]}>
                <Image style={[image.w(14), image.h(20)]} source={tripImgs.locationImage} />
                <TextInput
                    style={[hFull, bg(colors.transparent), border(0, colors.transparent), fw500, { flexBasis: '90%' }] as TextStyle[]}
                    placeholder='Select Bust stop'
                    placeholderTextColor={colors.black}
                    keyboardType='default'
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />

            </View>
        </View>
    )
}

export default CustomizeRouteInputTile;