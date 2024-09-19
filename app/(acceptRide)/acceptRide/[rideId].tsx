import GoOnlineOptionTile from "@/components/home/goOnlineOptionTile";
import Ionicons from '@expo/vector-icons/Ionicons';
import PresetRouteSheet from "@/components/home/presetRouteSheet";
import SearchingOrder from "@/components/home/searchingOrderSheet";
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
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import AcceptOrderSheet from "@/components/home/acceptOrderSheet";

function AcceptRide() {
    const { showBottomSheet } = useBottomSheet()

    const [showOnline, setShowOnline] = useState(true);//testing
    const [showDropoff, setShowDropoff] = useState(false);//testing
    const [showNextBusstop, setShowNextBusstop] = useState(false);//testing
    const [duration, setDuration] = useState(0.5)
    const [countdownShown, setCountdownShown] = useState(true)
    const [riderArrived, setRiderArrived] = useState(false);

    useEffect(() => {
        showBottomSheet([300], <SearchingOrder />)
        setTimeout(() => {
            showBottomSheet([400], <AcceptOrderSheet />)
        }, 3000)
    }, [])


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
                        {showOnline &&
                            <TouchableOpacity style={[w(152), h(50), bg('#27AE65'), rounded('100%'), flex, itemsCenter, relative,]}>
                                <Text style={[fw700, fs14, colorWhite, neurialGrotesk, textCenter, { flexBasis: '65%' }]}>ONLINE</Text>
                                <View style={[w(40), h(40), rounded('100%'), bg(colors.white), absolute, t(5), r(7), { shadowColor: colors.black, shadowRadius: 10 }]} />
                            </TouchableOpacity>}
                        {/* //!Online Status Block */}

                        {/* //!Drop off Block */}
                        {showDropoff && <View style={[wFull, h(112), flexCol, pt(16), px(32), borderGrey(0.7), bg(colors.white), rounded(10), gap(10)]}>
                            {/* //!Dropoff lable Block */}
                            <View style={[wFull, flex, gap(16), itemsCenter, justifyStart, borderB(0.7, Colors.light.border), pb(16)]}>
                                <Image style={[image.w(14), image.h(20)]} source={tripImgs.redBgLocation} />
                                <Text style={[fw700, fs14, colorBlack, neurialGrotesk]}>Dropoff Bus Stop</Text>
                            </View>
                            {/* //!Dropoff lable Block */}

                            {/* //!Drop off Input Block */}
                            <View style={[wFull, flex, gap(16), itemsCenter, justifyStart,]}>
                                <Text style={[fw500, fs14, colorBlack]}>{'Ojodu Berger Bus Stop'}</Text>
                            </View>
                            {/* //!Drop off Input Block */}
                        </View>}
                        {/* //!Drop off Block */}

                        {/* //!Next Bus Stop Block */}
                        {showNextBusstop && <View style={[wFull, h(112), flexCol, pt(16), px(32), borderGrey(0.7), bg(colors.white), rounded(10), gap(10)]}>
                            {/* //!Next Bus Stop Lable Block */}
                            <View style={[wFull, flex, gap(16), itemsCenter, justifyStart, borderB(0.7, Colors.light.border), pb(16)]}>
                                <Image style={[image.w(14), image.h(20)]} source={tripImgs.locationImage} />
                                <Text style={[fw700, fs14, colorBlack, neurialGrotesk]}>Next Stop</Text>
                            </View>
                            {/* //!Next Bus Stop Lable Block */}

                            {/* //!Next Bus Stop Value Block */}
                            <View style={[wFull, flex, gap(16), itemsCenter, justifyStart,]}>
                                <Text style={[fw500, fs14, colorBlack]}>{'Ojodu Berger Bus Stop'}</Text>
                            </View>
                            {/* //!Next Bus Stop Value Block */}
                        </View>}
                        {/* //!Next Bus Stop Block */}

                    </View>
                </PaddedScreen>
                {/* //!Header */}

                {/* //!Time Down Block */}
                {countdownShown && <View style={[absolute, t('45%'), wFull, h(144), flex, itemsCenter, justifyCenter, bg(colors.transparent)]}>
                    {/* <View style={[w(144), h(144), bg(colors.white), rounded('100%')]}> */}
                    <CountdownCircleTimer
                        isPlaying
                        duration={duration * 60}
                        strokeWidth={5}
                        colors={['#27AE65', '#27AE65', '#27AE65', '#27AE65']}
                        colorsTime={[7, 5, 2, 0]}
                        size={144}
                        trailColor={colors.transparent}
                        onComplete={() => setCountdownShown(false)}
                    >
                        {({ remainingTime, }) => (
                            <View style={[flexCol, gap(15), itemsCenter, justifyCenter, bg(colors.white), w(139), h(139), rounded('100%')]}>
                                <Ionicons name="timer-outline" size={24} color="#27AE65" />

                                <Text style={[fs(32), fw400, colorBlack]}>{remainingTime}</Text>

                                <Text style={[fs(14), fw400, colordarkGrey, neurialGrotesk]}>seconds</Text>
                            </View>
                        )}
                    </CountdownCircleTimer>
                    {/* </View> */}
                </View>}
                {/* //!Time Down Block */}

            </View>
        </SafeScreen>
    )
}

export default AcceptRide;