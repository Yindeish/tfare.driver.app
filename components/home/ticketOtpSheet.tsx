import Colors, { colors } from "@/constants/Colors";
import { fonts } from "@/constants/fonts";
import accountImgs from "@/constants/images/account";
import { homeImgs } from "@/constants/images/home";
import sharedImg from "@/constants/images/shared";
import tripImgs from "@/constants/images/trip";
import { c, colorBlack, colordarkGrey, fs12, fs14, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { bg, borderB, borderGrey, flex, flexCol, gap, h, hFull, itemsCenter, justifyBetween, justifyCenter, justifyStart, mb, mt, pb, pt, px, py, rounded, w, wFull } from "@/utils/styles";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper"
import PaddedScreen from "../shared/paddedScreen";
import { image, mXAuto } from "@/utils/imageStyles";
import CtaBtn from "../shared/ctaBtn";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { OtpInput } from "react-native-otp-entry";

function TicketOtpSheet() {


    return (
        <PaddedScreen>
            <View style={[wFull, flexCol, bg(colors.white), h(205), gap(32), mt(40), mb(20)]}>
                {/* //!Rider Details Block */}
                <View style={[wFull, flex, justifyBetween, itemsCenter, { height: 61, }]}>
                    <View style={[flex, justifyBetween, { gap: 14 }]}>
                        <View>
                            <Image
                                style={[{ width: 60, height: 60, objectFit: 'cover' }]}
                                source={homeImgs.userProfileImg}
                            />
                        </View>

                        <View style={[hFull, flexCol, justifyCenter, gap(12)]}>
                            <Text style={[c(colors.black), fw700, fs14]}>King John</Text>
                            <Text style={[c(Colors.light.darkGrey), fw400, fs12]}>Arrived location</Text>
                        </View>
                    </View>

                    <TouchableOpacity>
                        <Text style={[fw500, fs14, colorBlack]}>₦ {'0000.00'}</Text>
                    </TouchableOpacity>

                </View>
                {/* //!Rider Details Block */}

                {/* //!Chat-Call CTAs */}
                <View style={[flex, itemsCenter, gap(20), mXAuto]}>
                    <TouchableOpacity onPress={() => { }} style={[flex, rounded(100), gap(10), py(13), px(26), itemsCenter, bg('#F9F7F8'), { borderColor: Colors.light.border, borderWidth: 0.7 }]}>
                        <Image source={sharedImg.chatImage} style={[image.w(18), image.h(18),]} />

                        <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>Chat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { }} style={[flex, rounded(100), gap(10), py(13), px(26), itemsCenter, bg('#F9F7F8'), { borderColor: Colors.light.border, borderWidth: 0.7 }]}>
                        <Image source={sharedImg.phoneImage} style={[image.w(18), image.h(18),]} />

                        <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>Call</Text>
                    </TouchableOpacity>
                </View>
                {/* //!Chat-Call CTAs */}

                {/* //!Ticket ID Block */}
                <View style={[flexCol, gap(12), itemsCenter, wFull]}>
                    <Text style={[colordarkGrey, fs14, fw500, neurialGrotesk]}>Enter Ticket ID</Text>

                    <OtpInput
                        numberOfDigits={4}
                        blurOnFilled
                        autoFocus={false}
                        onTextChange={(text) => console.log(text)}
                        type="alphanumeric"
                        theme={{ containerStyle: { ...w('70%'), ...gap(12), }, }} />
                </View>
                {/* //!Ticket ID Block */}

                {/* //!Start-Cancel Trip CTAs */}
                <View style={[flexCol, gap(20)]}>
                    <CtaBtn
                        img={{
                            src: sharedImg.redBgCautionImage
                        }}
                        onPress={() => { }}
                        text={{ name: 'View Trip Details' }}
                        bg={{ color: Colors.light.background }}
                    />

                    <CtaBtn
                        img={{
                            src: sharedImg.cancelImage
                        }}
                        onPress={() => { }}
                        text={{ name: 'Cancel Order', color: Colors.light.darkGrey }}
                        bg={{ color: '#F9F7F8', borderColor: Colors.light.border }}
                        style={{ container: { ...w('80%'), ...mXAuto } }}
                    />
                </View>
                {/* //!Start-Cancel Trip CTAs */}
            </View>
        </PaddedScreen>
    )
}

export default TicketOtpSheet;