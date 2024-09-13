import MenuTile from "@/components/shared/menuTile";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import sharedImg from "@/constants/images/shared";
import { c, fs, fs14, fs18, fw500, fw700, leading, neurialGrotesk } from "@/utils/fontStyles";
import { image, wHFull } from "@/utils/imageStyles";
import { bg, flexYCenter, h, mt, w, wFull, absolute, b, border, flex, itemsCenter, justifyBetween, rounded, py, px, pYAuto, flexCol, gap, my, itemsStart, justifyCenter, } from "@/utils/styles";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { Menu, Text } from "react-native-paper";


function FileUploadTile({ layout, label, placeholder, styles }: {
    layout: 'stack' | 'flat',
    label: string,
    styles?: { label?: TextStyle, container?: ViewStyle, },
    placeholder: { uploadHelper: Function, condition: boolean, hasError: boolean }
}) {
    const stack = layout === 'stack';

    return (
        <View style={[stack ? flexCol : flex, stack ? itemsStart : itemsCenter, stack ? gap(8) : gap(13), stack ? {} : justifyCenter]}>
            <Text style={[fw500, fs14, c(colors.black)]}>{label}</Text>

            <View style={[wFull, h(88), rounded('15%'), flexCol, itemsCenter, justifyCenter, gap(10), border(1.5, Colors.light.border), { borderStyle: 'dashed' }]}>

                {placeholder.condition ? (
                    <TouchableOpacity onPress={() => placeholder.uploadHelper()} style={[w('45%'), h('45%'), rounded('100%'), flex, gap(9.25), itemsCenter, justifyCenter, gap(10), border(0.65, placeholder.hasError ? '#CF0707' : Colors.light.border),]}>

                        <Image style={[image.w(18.5), image.h(18.5)]} source={sharedImg.plusIcon} />

                        <Text style={[fw500, fs(11.11), leading(13.22), neurialGrotesk, c(colors.black)]}>Upload file</Text>

                    </TouchableOpacity>
                ) : (
                    <View style={[w('45%'), h('45%'), rounded('100%'), flex, gap(9.25), itemsCenter, justifyCenter, gap(16), border(0.65, Colors.light.border),]}>

                        <TouchableOpacity onPress={() => placeholder.uploadHelper()}>
                            <Image style={[image.w(18.5), image.h(18.5)]} source={sharedImg.editBtn2} />
                        </TouchableOpacity>

                        <Text style={[fw500, fs(12), leading(13.22), neurialGrotesk, c('#27AE65')]}>Done</Text>

                    </View>
                )}

            </View>
        </View>
    )
}

export default FileUploadTile;