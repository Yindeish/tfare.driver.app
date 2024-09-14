import FileUploadTile from "@/components/shared/fileUploadTile";
import MenuTile from "@/components/shared/menuTile";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import { c, colorBlack, colorWhite, fs, fs10, fs14, fs18, fw400, fw500, fw700, leading, neurialGrotesk, textCenter } from "@/utils/fontStyles";
import { wHFull } from "@/utils/imageStyles";
import { bg, flexYCenter, h, mt, w, wFull, absolute, b, border, flex, itemsCenter, justifyBetween, rounded, py, px, pYAuto, flexCol, gap, my, justifyCenter, m, mb, pl, } from "@/utils/styles";
import { Entypo } from "@expo/vector-icons";
import { Href, Link, router } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Menu, Text, TouchableRipple } from "react-native-paper";
import OTPTextInput from 'react-native-otp-textinput'

function VerifyEmail() {
    let otpInput = useRef<HTMLInputElement>(null);

    const clearText = () => {
        (otpInput?.current as any)?.clear();
    }

    const setText = () => {
        (otpInput?.current as any)?.setValue("1234");
    }




    return (
        <SafeScreen>
            <ScrollView>
                <PaddedScreen styles={wHFull}>

                    <PageTitle
                        title=""
                        onPress={() => router.back()}
                    />

                    <View style={[flexCol, gap(32)]}>

                        <View style={[flexCol, gap(0), wFull, itemsCenter]}>
                            <Text style={[neurialGrotesk, fw500, fs(32), colorBlack]}>Verify Email</Text>
                            <Text style={[neurialGrotesk, fw500, fs(12), c(Colors.light.darkGrey)]}>
                                Kindly Input the code we sent to your email
                            </Text>
                        </View>

                        <View style={[flexCol, gap(5)]}>
                            <OTPTextInput
                                ref={e => { }}
                                textInputStyle={{
                                    borderWidth: 0.7,
                                    borderRadius: 10,
                                    backgroundColor: '#F9F7F8',
                                    borderColor: false ? Colors.light.error : '#D7D7D7'
                                }}
                            />
                            {true && (<Text style={[neurialGrotesk, fw500, fs10, c('#CF0707'), textCenter]}>Code doesn’t match with what we sent you, Try again.</Text>)}
                        </View>

                        <TouchableRipple
                            onPress={() => { }} rippleColor={colors.white} style={[h(50), rounded(10), flexCol, wFull, itemsCenter, justifyCenter, bg(Colors.light.background), mb(30), mt(30)]}>
                            <Text style={[fw700, fs18, colorWhite, neurialGrotesk,]}>Verify</Text>
                        </TouchableRipple>

                    </View>

                </PaddedScreen>
            </ScrollView>
        </SafeScreen>
    )
}

export default VerifyEmail;