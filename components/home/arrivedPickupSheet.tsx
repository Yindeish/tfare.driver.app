import Colors, { colors } from "@/constants/Colors";
import { fonts } from "@/constants/fonts";
import accountImgs from "@/constants/images/account";
import { homeImgs } from "@/constants/images/home";
import sharedImg from "@/constants/images/shared";
import tripImgs from "@/constants/images/trip";
import { c, colorBlack, fs12, fs14, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { bg, borderB, borderGrey, flex, flexCol, gap, h, hFull, itemsCenter, justifyBetween, justifyCenter, justifyStart, mb, mt, pb, pt, px, py, rounded, w, wFull } from "@/utils/styles";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper"
import PaddedScreen from "../shared/paddedScreen";
import { image, mXAuto } from "@/utils/imageStyles";
import CtaBtn from "../shared/ctaBtn";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import TicketOtpSheet from "./ticketOtpSheet";


function ArrivedPickupSheet() {
    const { showBottomSheet } = useBottomSheet()

    return (
        <PaddedScreen>
            <View>

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
                                <Text style={[c(Colors.light.darkGrey), fw400, fs12]}>{'5 min'} away</Text>
                            </View>
                        </View>

                        <TouchableOpacity>
                            <Text style={[fw500, fs14, colorBlack]}>₦ {'0000.00'}</Text>
                        </TouchableOpacity>

                    </View>
                    {/* //!Rider Details Block */}

                    {/* //!Call-Chat Rider Block */}
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
                    {/* //!Call-Chat Rider Block */}

                    {/* //!Arrived Pickup CTA */}
                    <CtaBtn
                        img={{ src: tripImgs.arrivedpickupImage, w: 20, h: 20 }}
                        onPress={() => showBottomSheet([500, 600], <TicketOtpSheet />)}
                        text={{ name: 'Arrived Pickup', color: colors.white }}
                        bg={{ color: Colors.light.background }}
                    />
                    {/* //!Arrived Pickup CTA */}
                </View>

            </View>
        </PaddedScreen>
    )
}

export default ArrivedPickupSheet;