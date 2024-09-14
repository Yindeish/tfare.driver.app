import InTripDropffTile from "@/components/home/inTripDropoffTile";
import CtaBtn from "@/components/shared/ctaBtn";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import { homeImgs } from "@/constants/images/home";
import sharedImg from "@/constants/images/shared";
import { images } from "@/constants/images/splash";
import tripImgs from "@/constants/images/trip";
import { c, colorBlack, fs12, fs14, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { image, wHFull } from "@/utils/imageStyles";
import { absolute, bg, borderB, borderGrey, borderY, flex, flexCol, gap, itemsCenter, justifyBetween, justifyEnd, mb, ml, mr, mt, p, pb, px, py, r, relative, rounded, t } from "@/utils/styles";
import { router } from "expo-router";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";


function RouteDetails() {


    return (
        <SafeScreen>
            <ScrollView>
                <View style={[wHFull, relative]}>
                    {/* //!Page Header */}
                    <PaddedScreen>
                        <View style={[flex, itemsCenter, justifyBetween, mb(10),]}>
                            {/* //!Page Title */}
                            <PageTitle
                                title="Trip Details"
                            />
                            {/* //!Page Title */}

                            {/* //!Customize CTA */}
                            <TouchableOpacity style={[bg('#F9F7F8'), borderGrey(0.7), gap(10), rounded(10), p(10), flex, itemsCenter, gap(16), absolute, t(47), r(0)]}>
                                <Image style={[image.w(24), image.h(24)]} source={sharedImg.editBtn2} />

                                <Text style={[fs12, fw500, neurialGrotesk, colorBlack]}>Customize</Text>
                            </TouchableOpacity>
                            {/* //!Customize CTA */}
                        </View>
                    </PaddedScreen>
                    {/* //!Page Header */}

                    {/* //!Route Block */}
                    <View style={[flex, itemsCenter, justifyBetween, bg('#FFF7E6'), borderY(0.7, Colors.light.border), py(15), px(20)]}>
                        <View style={[flexCol, gap(8)]}>
                            <View style={[flex, gap(8)]}>
                                <Image style={[image.w(14), image.h(20)]} source={tripImgs.greenBgLocation} />
                                <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.darkGrey)]}>Startoff</Text>
                            </View>
                            <Text style={[fw700, fs14, c(colors.black)]}>Ojoo Bus Stop</Text>
                        </View>

                        <Image style={[image.w(90), image.h(5), { objectFit: 'contain' }]} source={tripImgs.tripDirection} />

                        <View style={[flexCol, gap(8)]}>
                            <View style={[flex, gap(8), justifyEnd]}>
                                <Image style={[image.w(14), image.h(20)]} source={tripImgs.redBgLocation} />
                                <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.darkGrey)]}>Endpoint</Text>
                            </View>
                            <Text style={[fw700, fs14, c(colors.black)]}>Ojoo Bus Stop</Text>
                        </View>
                    </View>
                    {/* //!Route Block */}

                    <PaddedScreen>
                        {/* //!In Trip Dropoffs */}
                        <View style={[flexCol, mt(32), mb(30)]}>
                            <View style={[borderB(0.7, Colors.light.border), pb(16)]}>
                                <Text style={[fw700, fs14, c(colors.black),]}>In-Trip Dropoffs</Text>
                            </View>

                            <View style={[flexCol, gap(16), { overflow: 'scroll' }]}>
                                {Array.from({ length: 7 }).map((_, index) => (
                                    <InTripDropffTile
                                        key={index}
                                    />
                                ))}
                            </View>

                        </View>
                        {/* //!In Trip Dropoffs */}

                        {/* //!Select Route CTA */}
                        <CtaBtn
                            img={{ src: tripImgs.whiteBgTripImage, h: 20, w: 20 }}
                            onPress={() => { }}
                            text={{ name: 'Select Route', color: colors.white }}
                            bg={{ color: Colors.light.background }}
                            style={{ container: { ...mb(30) } }}
                        />
                        {/* //!Select Route CTA */}
                    </PaddedScreen>
                </View>
            </ScrollView>
        </SafeScreen>
    )
}

export default RouteDetails;