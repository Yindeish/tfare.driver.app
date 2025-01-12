import GoOnlineOptionTile from "@/components/home/goOnlineOptionTile";
import PresetRouteSheet from "@/components/home/presetRouteSheet";
import CtaBtn from "@/components/shared/ctaBtn";
import PaddedScreen from "@/components/shared/paddedScreen";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import sharedImg from "@/constants/images/shared";
import tripImgs from "@/constants/images/trip";
import { useSnackbar } from "@/contexts/snackbar.context";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { useSession } from "@/contexts/userSignedInContext";
import { c, colorBlack, colordarkGrey, fs, fs10, fs12, fs14, fs18, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { image, imgAbsolute, mXAuto, wHFull } from "@/utils/imageStyles";
import { absolute, b, bg, borderB, borderGrey, borderT, bottom0, flex, flexCol, gap, h, hFull, itemsCenter, justifyBetween, justifyCenter, justifyStart, left0, mb, mt, mTAuto, p, pb, pt, px, py, relative, rounded, t, top0, w, wFull, zIndex } from "@/utils/styles";
import { Href, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Image, Platform, TextStyle, ToastAndroid, TouchableOpacity, View, ViewStyle } from "react-native";
import { Snackbar, Text, Tooltip } from "react-native-paper";

const { height } = Dimensions.get('window')

const index = () => {
    const { } = useSession()
    const { showBottomSheet } = useBottomSheet()
    const { closeSnackbar, snackbarVisible, openSnackbar } = useSnackbar();

    const [options, updateOptions] = useState(
        [
            { name: 'I have a charged battery' },
            { name: 'I have enough fuel' },
            { name: 'My car is in good condition' },
        ].map((option, index) => ({ ...option, checked: false, id: index + 1 }))
    );

    const [online, setOnline] = useState(false);
    const [eligible, setEligible] = useState(false);
    const [route, setRoute] = useState(false);//testing

    const goOnline = () => {
        const eligible = options.every((option) => option.checked === true);

        if (eligible) {
            setOnline(true);
            router.push('/(acceptRide)/acceptRide/1' as Href)
        }
        else {
            if (Platform.OS === 'android') ToastAndroid.show("You're not eligible to go online", 2000);
            if (Platform.OS === 'ios') openSnackbar();
            return;
        }
    }

    // !Updating eligibility status
    useEffect(() => {
        const eligible = options.every((option) => option.checked === true);

        if (eligible) setEligible(true)
        else setEligible(false)
    }, [options])
    // !Updating eligibility status

    // !Updating the preset route pop up
    useEffect(() => {
        if (!route) { //testing .This conditon will be modified during api calls
            showBottomSheet([650, 750], <PresetRouteSheet />)
        }
    }, [router])
    // !Updating the preset route pop up

    return (
        <SafeScreen>
            <View style={[wHFull as ViewStyle, relative,]}>
                {/* //!Backlay */}
                <Image style={[imgAbsolute, image.t(0), image.l(0), wHFull, image.zIndex(-1)]} source={sharedImg.mapImage} />
                {/* //!Backlay */}

                {/* //!Header */}
                <PaddedScreen>
                    <View style={[zIndex(3), flexCol, gap(20), mt(30),]}>
                        {/* //!Earnings Block */}
                        <View style={[wFull, h(112), flex, itemsCenter, justifyBetween, p(10), borderGrey(0.7), bg(colors.white), rounded(10),]}>
                            <View style={[flexCol, gap(10)]}>
                                <View style={[flex, gap(16)]}>
                                    <Image style={[image.w(19), image.h(18)]} source={sharedImg.walletImage} />
                                    <Text style={[neurialGrotesk, fs12, fw400, colordarkGrey]}>Your earnings</Text>
                                </View>
                                <Text style={[fs(22), fw700, colorBlack]}>₦ {'0000.00'}</Text>
                            </View>

                            <TouchableOpacity style={[flex, gap(10), itemsCenter, borderGrey(0.7), rounded(1000), py(10), px(16)]}>
                                <View style={[w(24), h(24), flex, itemsCenter, justifyCenter, rounded(1000), borderGrey(0.7)]}>
                                    <Image style={[image.w(22), image.h(8),]} source={sharedImg.minusImage} />
                                </View>
                                <Text style={[fw500, fs12, neurialGrotesk, colorBlack]}>Withdraw</Text>
                            </TouchableOpacity>
                        </View>
                        {/* //!Earnings Block */}

                        {/* //!Pick up-Drop off Block */}
                        <View style={[wFull, h(112), flexCol, pt(16), px(32), borderGrey(0.7), bg(colors.white), rounded(10), gap(10)]}>
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
                        </View>
                        {/* //!Pick up-Drop off Block */}

                        {/* //!Route CTAs */}
                        <View style={[wFull, h(45), flex, justifyBetween,]}>
                            {/* //!Change Route CTA */}
                            <TouchableOpacity onPress={() => { }} style={[w('45%'), hFull, rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.blueBackground)]}>
                                <Text style={[neurialGrotesk, fw700, fs18, c(colors.white),]}>Change Route</Text>

                                <Image style={[image.w(24), image.h(24),]} source={tripImgs.whiteBgShuffle} />
                            </TouchableOpacity>
                            {/* //!Change Route CTA */}

                            {/* //!Edit Route CTA */}
                            <TouchableOpacity onPress={() => { }} style={[w('45%'), hFull, rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background)]}>
                                <Text style={[neurialGrotesk, fw700, fs18, c(colors.white),]}>Edit Route</Text>

                                <Image style={[image.w(24), image.h(24),]} source={tripImgs.whiteBgEditBtn} />
                            </TouchableOpacity>
                            {/* //!Edit Route CTA */}

                        </View>
                        {/* //!Route CTAs */}

                    </View>
                </PaddedScreen>
                {/* //!Header */}

                {/* //!Go Online Block */}
                <View style={[wFull, route && !eligible && !online ? borderT(0.7, Colors.light.darkGrey) : {}, flexCol, gap(40), itemsCenter, pt(20), pb(35), bg(route && !eligible && !online ? colors.white : colors.transparent), mTAuto, absolute, b('8%'), left0, zIndex(4)]}>

                    {/* //!Options */}
                    {route && !eligible && !online && <View style={[flexCol, gap(16)]}>
                        {options.map(({ checked, id, name }, index) => (
                            <GoOnlineOptionTile
                                onPress={() => {
                                    let updatedArr = options.map((option) => {
                                        if (option.id === id) {
                                            return { ...option, checked: !option.checked };
                                        } else return option;
                                    });

                                    updateOptions(updatedArr);

                                }}
                                option={{ checked, name }}
                                key={index}
                            />
                        ))}
                    </View>}
                    {/* //!Options */}

                    {/* //!Go Online CTA */}
                    <View style={[wFull,]}>
                        <CtaBtn
                            img={{ src: tripImgs.whiteBgCardinalLocation, w: 22, h: 22 }}
                            onPress={() => {
                                if (!route && !eligible) {
                                    setRoute(true);
                                    showBottomSheet([650, 750], <PresetRouteSheet />)
                                } else goOnline()
                            }}
                            text={{ name: !route ? 'CHOOSE ROUTE' : 'GO ONLINE' }}
                            bg={{ color: !route ? Colors.light.background : '#27AE65' }}
                            style={{ container: { ...rounded(1000), ...w('70%'), ...mXAuto, } as ViewStyle }}
                        />
                    </View>
                    {/* //!Go Online CTA */}
                </View>
                {/* //!Go Online Block */}


                {/* //!Snackbar for Online Ineligibility  */}
                {Platform.OS === 'ios' && (
                    <Snackbar
                        visible={snackbarVisible}
                        onDismiss={() => closeSnackbar()}
                        action={{ label: 'close', onPress: () => closeSnackbar() }}
                    >
                        <Text style={[fs10, fw500, c('#CF0707')]}>You're not eligible to go online</Text>
                    </Snackbar>)
                }
                {/* //!Snackbar for Online Ineligibility  */}
            </View>
        </SafeScreen>
    )
};

export default index;