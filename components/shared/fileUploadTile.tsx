import MenuTile from "@/components/shared/menuTile";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import sharedImg from "@/constants/images/shared";
import { c, fs, fs14, fs18, fw500, fw700, leading, neurialGrotesk } from "@/utils/fontStyles";
import { image, wHFull } from "@/utils/imageStyles";
import { bg, flexYCenter, h, mt, w, wFull, absolute, b, border, flex, itemsCenter, justifyBetween, rounded, py, px, pYAuto, flexCol, gap, my, itemsStart, justifyCenter, justifyStart, mb, pb, } from "@/utils/styles";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { ReactNode, useState } from "react";
import { Image, ScrollView, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { Menu, Text } from "react-native-paper";


function FileUploadTile({ layout, label, placeholder, styles }: {
    layout: 'stack' | 'flat',
    label: string | ReactNode,
    styles?: { label?: TextStyle | TextStyle[], container?: ViewStyle | ViewStyle[], },
    placeholder: { uploadHelper: Function, success: boolean, hasError: boolean, imgNotClear: boolean }
}) {
    const stack = layout === 'stack';
    const flat = layout === 'flat';

    return (
        <View style={[stack ? flexCol : flex, stack ? itemsStart : itemsCenter, stack ? gap(8) : gap(13), flat ? justifyStart : justifyCenter, styles?.container ? styles?.container : {}]}>
            {stack && <Text style={[fw500, fs14, c(colors.black), styles?.label ? styles?.label : {}, placeholder.imgNotClear ? pb(20) : {}]}>{label}</Text>}

            <View style={[stack ? wFull : w('50%'), placeholder.imgNotClear ? h(100) : h(88), rounded('15%'), flexCol, itemsCenter, justifyCenter, gap(10), stack ? border(1.5, Colors.light.border) : {}, stack ? { borderStyle: 'dashed' } : {}]}>

                {placeholder.imgNotClear && (<Text style={[c('#CF0707'), fw500, fs14]}>Picture isn’t clear enough,Try again!</Text>)}

                {placeholder.success ? (
                    <TouchableOpacity onPress={() => placeholder.uploadHelper()} style={[stack ? w('45%') : wFull, h('45%'), rounded('100%'), flex, gap(9.25), itemsCenter, justifyCenter, gap(10), border(0.65, placeholder.hasError ? '#CF0707' : Colors.light.border),]}>

                        <Image style={[image.w(18.5), image.h(18.5)]} source={sharedImg.plusIcon} />

                        <Text style={[fw500, fs(11.11), leading(13.22), neurialGrotesk, c(colors.black)]}>Upload file</Text>

                    </TouchableOpacity>
                ) : (
                    <View style={[stack ? w('45%') : wFull, h('45%'), rounded('100%'), flex, gap(9.25), itemsCenter, justifyCenter, gap(16), border(0.65, Colors.light.border),]}>

                        <TouchableOpacity onPress={() => placeholder.uploadHelper()}>
                            <Image style={[image.w(18.5), image.h(18.5)]} source={sharedImg.editBtn2} />
                        </TouchableOpacity>

                        <Text style={[fw500, fs(12), leading(13.22), neurialGrotesk, c('#27AE65')]}>Done</Text>

                    </View>
                )}

            </View>

            {flat && <Text>{label}</Text>}
        </View>
    )
}

export default FileUploadTile;