import PaddedScreen from "@/components/shared/paddedScreen";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import { fonts } from "@/constants/fonts";
import { colorWhite, fs18, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { wHFull } from "@/utils/imageStyles";
import { bg, flexCol, itemsCenter, justifyCenter, justifyEnd, pb, wFull } from "@/utils/styles";
import { Href, router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

const { container, containerWrapper, skipLink, skipText, slide, slideImage, slideText, text, wrapper, activeDotStyle, ctaBtn, ctaText } = StyleSheet.create({
    containerWrapper: {
        backgroundColor: Colors.light.background,
    },
    skipLink: {
        marginLeft: 'auto',
        marginRight: 20,
        marginTop: 102,
    },
    skipText: {
        lineHeight: 17,
    },
    container: {
        width: '100%',
        paddingHorizontal: 20,
        height: '60%',
        backgroundColor: colors.transparent,
        marginBottom: 30
    },
    wrapper: {
    },
    slide: {
        backgroundColor: colors.transparent,
        gap: 15
    },
    slideImage: {
        height: '55%',
    },
    slideText: {
        fontSize: 22,
        lineHeight: 22,
        textAlign: 'center',
        color: 'white'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: fonts.neurialGrotesk
    },
    activeDotStyle: {
        width: 14,
        height: 7,
        borderRadius: 10
    },
    ctaBtn: {
        borderRadius: 10,
        backgroundColor: Colors.light.tabIconDefault,
        height: 50
    },
    ctaText: {

    }
});

function AuthIndex() {


    return (
        <SafeScreen>
            <View style={[wHFull, bg(Colors.light.background), flexCol, justifyEnd, pb(50)]}>
                <PaddedScreen styles={[]}>
                    <View style={[flexCol, wFull, { gap: 16, }]}>
                        <TouchableRipple onPress={() => router.replace(`/(auth)/signin` as Href)} rippleColor={Colors.light.tabIconDefault} style={[ctaBtn, flexCol, wFull, itemsCenter, justifyCenter, bg(Colors.light.blueBackground)]}>
                            <Text style={[fw700, fs18, colorWhite, neurialGrotesk,]}>Sign In</Text>
                        </TouchableRipple>

                        <TouchableRipple
                            onPress={() => router.replace(`/(auth)/signup` as Href)} rippleColor={colors.white} style={[ctaBtn, flexCol, wFull, itemsCenter, justifyCenter, { backgroundColor: colors.transparent, borderWidth: 1, borderColor: colors.white }]}>
                            <Text style={[fw700, fs18, colorWhite, neurialGrotesk,]}>Sign Up</Text>
                        </TouchableRipple>
                    </View>
                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}

export default AuthIndex;