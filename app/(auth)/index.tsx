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

const { ctaBtn } = StyleSheet.create({

    ctaBtn: {
        borderRadius: 10,
        backgroundColor: Colors.light.tabIconDefault,
        height: 50
    },

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