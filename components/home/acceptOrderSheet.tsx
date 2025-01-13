import Colors, { colors } from "@/constants/Colors";
import { fonts } from "@/constants/fonts";
import accountImgs from "@/constants/images/account";
import { homeImgs } from "@/constants/images/home";
import sharedImg from "@/constants/images/shared";
import tripImgs from "@/constants/images/trip";
import { c, colorBlack, fs12, fs14, fw400, fw500, fw700 } from "@/utils/fontStyles";
import { bg, borderB, borderGrey, flex, flexCol, gap, h, hFull, itemsCenter, justifyBetween, justifyCenter, justifyStart, mb, mt, pb, pt, px, py, rounded, w, wFull } from "@/utils/styles";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper"
import PaddedScreen from "../shared/paddedScreen";
import { image } from "@/utils/imageStyles";
import CtaBtn from "../shared/ctaBtn";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import TicketOtpSheet from "./ticketOtpSheet";
import { router } from "expo-router";
import ArrivedPickupSheet from "./arrivedPickupSheet";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { setRideState } from "@/state/slices/ride";
import { RootState } from "@/state/store";
import { useEffect } from "react";
import { ERideAcceptStage } from "@/state/types/ride";


function AcceptOrderSheet() {
    const dispatch = useAppDispatch()
    const { showBottomSheet, hideBottomSheet } = useBottomSheet();
    const {ridersOffers, currentRiderOfferIndex} = useAppSelector((state: RootState) => state.ride);

    const acceptOffer = async () => {

    }

    const cancelOffer = () => {
        hideBottomSheet()
        dispatch(setRideState({key:'currentRoute', value: null}));
        dispatch(setRideState({key:'driverEligible', value: false}));
        dispatch(setRideState({key:'driverOnline', value: false}));
        dispatch(setRideState({key:'dropoffBusstopInput', value: null}));
        dispatch(setRideState({key:'pickupBusstopInput', value: null}));
        dispatch(setRideState({key:'ridersOffers', value: []}));
        router.push(`/(home)`);
    }

    useEffect(() => {
        dispatch(setRideState({key:'rideAcceptStage', value: ERideAcceptStage.accepting}));
    }, [])

    // useEffect(() => {
    //     if(!currentRiderOfferIndex) hideBottomSheet();
    // }, [])

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
                                <Text style={[c(colors.black), fw700, fs14]}>{ridersOffers[currentRiderOfferIndex as number]?.rider?.name}</Text>
                                {/* <Text style={[c(Colors.light.darkGrey), fw400, fs12]}>{'5 min'} away</Text> */}
                                <Text style={[c(Colors.light.darkGrey), fw400, fs12]}>{'some mins'} away</Text>
                            </View>
                        </View>

                        <TouchableOpacity>
                            <Text style={[fw500, fs14, colorBlack]}>₦ {ridersOffers[currentRiderOfferIndex as number]?.riderCounterOffer}</Text>
                        </TouchableOpacity>

                    </View>
                    {/* //!Rider Details Block */}

                    {/* //!Pick up-Drop off Block */}
                    <View style={[wFull, h(112), flexCol, pt(16), px(32), borderGrey(0.7), bg(colors.white), rounded(10), gap(10), { shadowColor: colors.black, shadowRadius: 10 }]}>
                        {/* //!Pick up Block */}
                        <View style={[wFull, flex, gap(16), itemsCenter, justifyStart, borderB(0.7, Colors.light.border), pb(16)]}>
                            <Image style={[image.w(14), image.h(20)]} source={tripImgs.greenBgLocation} />
                            <Text style={[fw500, fs14, colorBlack]}>{ridersOffers[currentRiderOfferIndex as number]?.pickupBusstopId} Busstop</Text>
                        </View>
                        {/* //!Pick up Block */}

                        {/* //!Drop off Block */}
                        <View style={[wFull, flex, gap(16), itemsCenter, justifyStart,]}>
                            <Image style={[image.w(14), image.h(20)]} source={tripImgs.redBgLocation} />
                            <Text style={[fw500, fs14, colorBlack]}>{ridersOffers[currentRiderOfferIndex as number]?.dropoffBusstopId} Busstop</Text>
                        </View>
                        {/* //!Drop off Block */}
                    </View>
                    {/* //!Pick up-Drop off Block */}

                    {/* //!Accept-Decline Order CTA */}
                    <View style={[flex, gap(16), justifyBetween]}>
                        <CtaBtn
                            img={{ src: sharedImg.proceedIcon, w: 20, h: 20 }}
                            onPress={() => showBottomSheet([300], <ArrivedPickupSheet />)}
                            text={{ name: 'Accept', color: colors.white }}
                            bg={{ color: Colors.light.background }}
                            style={{ baseContainer: { ...w('48%') } }}
                        />
                        <CtaBtn
                            img={{ src: sharedImg.cancelImage, w: 20, h: 20 }}
                            onPress={() => cancelOffer()}
                            text={{ name: 'Decline', color: Colors.light.darkGrey }}
                            bg={{ color: '#F9F7F8', borderColor: Colors.light.border }}
                            style={{ baseContainer: { ...w('48%') } }}
                        />
                    </View>
                    {/* //!Accept-Decline Order CTA */}
                </View>

            </View>
        </PaddedScreen>
    )
}

export default AcceptOrderSheet;