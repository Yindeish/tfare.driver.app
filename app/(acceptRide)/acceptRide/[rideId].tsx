import GoOnlineOptionTile from "@/components/home/goOnlineOptionTile";
import PresetRouteSheet from "@/components/home/presetRouteSheet";
import CtaBtn from "@/components/shared/ctaBtn";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import sharedImg from "@/constants/images/shared";
import tripImgs from "@/constants/images/trip";
import { useSnackbar } from "@/contexts/snackbar.context";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { useSession } from "@/contexts/userSignedInContext";
import { c, colorBlack, colordarkGrey, colorWhite, fs, fs10, fs12, fs14, fs18, fw400, fw500, fw700, neurialGrotesk, textCenter } from "@/utils/fontStyles";
import { image, imgAbsolute, mXAuto, wHFull } from "@/utils/imageStyles";
import { absolute, b, bg, borderB, borderGrey, borderT, bottom0, flex, flexCol, gap, h, hFull, itemsCenter, justifyBetween, justifyCenter, justifyStart, left0, mb, mt, mTAuto, p, pb, pt, px, py, r, relative, rounded, t, top0, w, wFull, zIndex } from "@/utils/styles";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Image, Platform, ToastAndroid, TouchableOpacity, View } from "react-native";
import { Snackbar, Text, Tooltip } from "react-native-paper";

function AcceptRide() {
    const [showOnline, setShowOnline] = useState(true);//testing
    const [showDropoff, setShowDropoff] = useState(true);//testing


    return (
        <SafeScreen>
            <View style={[wHFull, relative,]}>
                {/* //!Backlay */}
                <Image style={[imgAbsolute, image.t(0), image.l(0), wHFull, image.zIndex(-1)]} source={sharedImg.mapImage} />
                {/* //!Backlay */}

                {/* //!Header */}
                <PaddedScreen>
                    {/* //!Page Title */}
                    <PageTitle
                        title=""
                    />
                    {/* //!Page Title */}

                    <View style={[zIndex(3)]}>

                        {/* //!Online Status Block */}
                        {showOnline && <TouchableOpacity style={[w(152), h(50), bg('#27AE65'), rounded('100%'), flex, itemsCenter, relative,]}>
                            <Text style={[fw700, fs14, colorWhite, neurialGrotesk, textCenter, { flexBasis: '65%' }]}>ONLINE</Text>
                            <View style={[w(40), h(40), rounded('100%'), bg(colors.white), absolute, t(5), r(10), { shadowColor: colors.black, shadowRadius: 10 }]} />
                        </TouchableOpacity>}

                        {/* //!Online Status Block */}

                        {/* //!Pick up-Drop off Block */}
                        {showDropoff && <View style={[wFull, h(112), flexCol, pt(16), px(32), borderGrey(0.7), bg(colors.white), rounded(10), gap(10)]}>
                            {/* //!Pick up Block */}
                            <View style={[wFull, flex, gap(16), itemsCenter, justifyStart, borderB(0.7, Colors.light.border), pb(16)]}>
                                <Image style={[image.w(14), image.h(20)]} source={tripImgs.greenBgLocation} />
                                <Text style={[fw500, fs14, colorBlack]}>{'Sangotedo Bus Stop'}</Text>
                            </View>
                            {/* //!Pick up Block */}

                            {/* //!Drop off Block */}
                            <View style={[wFull, flex, gap(16), itemsCenter, justifyStart,]}>
                                <Image style={[image.w(14), image.h(20)]} source={tripImgs.redBgLocation} />
                                <Text style={[fw500, fs14, colorBlack]}>{'Ojodu Berger Bus Stop'}</Text>
                            </View>
                            {/* //!Drop off Block */}
                        </View>}
                        {/* //!Pick up-Drop off Block */}

                    </View>
                </PaddedScreen>
                {/* //!Header */}

            </View>
        </SafeScreen>
    )
}

export default AcceptRide;