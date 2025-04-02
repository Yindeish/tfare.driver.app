import GoOnlineOptionTile from "@/components/home/goOnlineOptionTile";
import PresetRouteSheet from "@/components/home/presetRouteSheet";
import SearchingOrder from "@/components/home/searchingOrderSheet";
import CtaBtn from "@/components/shared/ctaBtn";
import PaddedScreen from "@/components/shared/paddedScreen";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import sharedImg from "@/constants/images/shared";
import tripImgs from "@/constants/images/trip";
import { RideConstants } from "@/constants/ride";
import tw from "@/constants/tw";
import { useSnackbar } from "@/contexts/snackbar.context";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { useSession } from "@/contexts/userSignedInContext";
import { useStorageState } from "@/hooks/useStorageState";
import FetchService from "@/services/api/fetch.service";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { setRideState } from "@/state/slices/ride";
import { setUserState } from "@/state/slices/user";
import { RootState } from "@/state/store";
import { EQuery } from "@/state/types/ride";
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
    const { showBottomSheet, hideBottomSheet } = useBottomSheet()
    const { closeSnackbar, snackbarVisible, openSnackbar } = useSnackbar();
    const {selectedRoute, pickupBusstopInput,dropoffBusstopInput, driverOnline,driverEligible, query} = useAppSelector((state: RootState) => state.ride);
    const dispatch = useAppDispatch();
    const { token, wallet} = useAppSelector((state:RootState) => state.user);
    // const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);

    const [options, updateOptions] = useState(
        [
            { name: 'I have a charged battery' },
            { name: 'I have enough fuel' },
            { name: 'My car is in good condition' },
        ].map((option, index) => ({ ...option, checked: false, id: index + 1 }))
    );

     const [fetchState, setFetchState] = useState({
        loading: false,
      });
      const { loading } = fetchState;

    const getUserWallet = async () => {
        setFetchState({ loading: true });
        const returnedData = await FetchService.getWithBearerToken({ url: '/user/me', token: token as string });
    
        const wallet = returnedData?.wallet;
        setFetchState({ loading: false });
        if (wallet) {
            console.log({wallet})
            
            dispatch(setUserState({
                key: 'wallet', value: wallet
            }))
        }
    }

    useEffect(() => {
        !wallet && getUserWallet()
    }, [])

    const goOnline = () => {
        if (driverEligible && driverOnline) {
            // dispatch(setRideState({key:'driverOnline', value: true}))
            router.push('/(acceptRide)/acceptRide' as Href);
            // setQuery(RideConstants.query.searching);
            dispatch(setRideState({key: 'query', value: RideConstants.query.searching}))
            showBottomSheet([300], <SearchingOrder />, true)
            return;
        }
        // if (driverOnline) {
        //     router.push('/(acceptRide)/acceptRide' as Href)
        //     setQuery(RideConstants.query.searching);
        // }
        else {
            // setQuery(RideConstants.query.preset_route);
            dispatch(setRideState({key: 'query', value: RideConstants.query.preset_route}))
            // showBottomSheet([650, 750], <PresetRouteSheet />)
            // if (Platform.OS === 'android') ToastAndroid.show("You're not eligible to go online", 2000);
            // if (Platform.OS === 'ios') openSnackbar();
            return;
        }
    }

    // !Updating eligibility status
    useEffect(() => {
        const eligible = options.every((option) => Boolean(option.checked) === true);

        if (eligible) {
            dispatch(setRideState({key:'driverEligible', value: true}))
            dispatch(setRideState({key:'driverOnline', value: true}))
        }
        else {
            dispatch(setRideState({key:'driverEligible', value: false}))
            dispatch(setRideState({key:'driverOnline', value: false}))
        }
    }, [options])
    // !Updating eligibility status

    // !Updating the preset route pop up
    useEffect(() => {
        if (!selectedRoute) { //testing .This conditon will be modified during api calls
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
                                <Text style={[fs(22), fw700, colorBlack]}>₦ {Number(wallet?.balance).toFixed(2) || '0000.00'}</Text>
                            </View>

                            <TouchableOpacity 
                            onPress={() => {
                                hideBottomSheet();
                                router.push('/(earnings)')
                            }}
                            style={[flex, gap(10), itemsCenter, borderGrey(0.7), rounded(1000), py(10), px(16), tw ``]}>
                                <View style={[w(24), h(24), flex, itemsCenter, justifyCenter, rounded(1000), borderGrey(0.7)]}>
                                    <Image style={[image.w(22), image.h(8),]} source={sharedImg.minusImage} />
                                </View>
                                <Text style={[fw500, fs12, neurialGrotesk, colorBlack, tw `w-[65px]`]}>Withdraw</Text>
                            </TouchableOpacity>
                        </View>
                        {/* //!Earnings Block */}

                        {/* //!Pick up-Drop off Block */}
                        {(pickupBusstopInput && dropoffBusstopInput) && <View style={[wFull, h(112), flexCol, pt(16), px(32), borderGrey(0.7), bg(colors.white), rounded(10), gap(10)]}>
                            {/* //!Pick up Block */}
                            <View style={[wFull, flex, gap(16), itemsCenter, justifyStart, borderB(0.7, Colors.light.border), pb(16)]}>
                                <Image style={[image.w(14), image.h(20)]} source={tripImgs.greenBgLocation} />
                                <Text style={[fw500, fs14, colorBlack]}>{pickupBusstopInput?.name}</Text>
                            </View>
                            {/* //!Pick up Block */}

                            {/* //!Drop off Block */}
                            <View style={[wFull, flex, gap(16), itemsCenter, justifyStart,]}>
                                <Image style={[image.w(14), image.h(20)]} source={tripImgs.redBgLocation} />
                                <Text style={[fw500, fs14, colorBlack]}>{dropoffBusstopInput?.name}</Text>
                            </View>
                            {/* //!Drop off Block */}
                        </View>}
                        {/* //!Pick up-Drop off Block */}

                        {/* //!Route CTAs */}
                        {(pickupBusstopInput && dropoffBusstopInput) && <View style={[wFull, h(45), flex, justifyBetween,]}>
                            {/* //!Change Route CTA */}
                            <TouchableOpacity onPress={() => showBottomSheet([650, 750], <PresetRouteSheet />)} style={[w('45%'), hFull, rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.blueBackground)]}>
                                <Text style={[neurialGrotesk, fw700, fs18, c(colors.white),]}>Change Route</Text>

                                <Image style={[image.w(24), image.h(24),]} source={tripImgs.whiteBgShuffle} />
                            </TouchableOpacity>
                            {/* //!Change Route CTA */}

                            {/* //!Edit Route CTA */}
                            <TouchableOpacity onPress={() => router.push('/(route)/customizeRoute')} style={[w('45%'), hFull, rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background)]}>
                                <Text style={[neurialGrotesk, fw700, fs18, c(colors.white),]}>Edit Route</Text>

                                <Image style={[image.w(24), image.h(24),]} source={tripImgs.whiteBgEditBtn} />
                            </TouchableOpacity>
                            {/* //!Edit Route CTA */}

                        </View>}
                        {/* //!Route CTAs */}

                    </View>
                </PaddedScreen>
                {/* //!Header */}

                {/* //!Go Online Block */}
                <View style={[wFull, selectedRoute && !driverEligible && !driverOnline ? borderT(0.7, Colors.light.darkGrey) : {}, flexCol, gap(40), itemsCenter, pt(20), pb(35), bg(selectedRoute && !driverEligible && !driverOnline ? colors.white : colors.transparent), mTAuto, absolute, b('8%'), left0, zIndex(4)]}>

                    {/* //!Options */}
                    {selectedRoute && !driverEligible && !driverOnline && <View style={[flexCol, gap(16)]}>
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
                                if (!selectedRoute && !driverEligible) {
                                    showBottomSheet([650, 750], <PresetRouteSheet />)
                                } else goOnline()
                            }}
                            text={{ name: !selectedRoute ? 'CHOOSE ROUTE' : 'GO ONLINE' }}
                            bg={{ color: !selectedRoute ? Colors.light.background : '#27AE65' }}
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