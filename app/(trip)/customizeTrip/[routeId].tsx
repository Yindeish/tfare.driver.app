import CustomizeRouteInputTile from "@/components/home/customizeRouteInputTile";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import InTripDropoffDeleteTile from "@/components/home/inTripDropoffDeleteTile";
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
import { c, colorBlack, colordarkGrey, colorWhite, fs12, fs14, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { image, wHFull } from "@/utils/imageStyles";
import { absolute, bg, borderB, borderGrey, borderY, flex, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, justifyEnd, mb, ml, mr, mt, p, pb, px, py, r, relative, rounded, t } from "@/utils/styles";
import { router } from "expo-router";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { Href } from "expo-router";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from "react";

type TDateTime = 'time' | 'date';

function CustomizeTrip() {
    const [date, setDate] = useState(new Date(1598051730000));
    const [time, setTime] = useState(new Date(1598051730000));
    const [mode, setMode] = useState<TDateTime | null>(null);
    const [show, setShow] = useState(true);

    const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        const currentDate = selectedDate;
        setDate(currentDate as Date);
        setTime(currentDate as Date);
    };

    const showMode = (currentMode: TDateTime) => {
        // setShow(true);
        setMode(currentMode);
    };

    const setModepicker = (mode: TDateTime) => {
        showMode(mode);
    };

    return (
        <SafeScreen>
            <ScrollView>
                <View style={[wHFull, relative]}>
                    <PaddedScreen>
                        {/* //!Page Header */}
                        <View style={[flex, itemsCenter, justifyBetween, mb(10),]}>
                            {/* //!Page Title */}
                            <PageTitle
                                title="Customize"
                            />
                            {/* //!Page Title */}

                            {/* //!Customize CTA */}
                            <TouchableOpacity style={[bg(Colors.light.background), borderGrey(0.7), gap(16), rounded(10), py(10), px(16), flex, itemsCenter, gap(16), absolute, t(47), r(0)]}>
                                <Image style={[image.w(24), image.h(24)]} source={tripImgs.whiteBgEditBtn} />

                                <Text style={[fs12, fw500, neurialGrotesk, colorWhite]}>Save</Text>
                            </TouchableOpacity>
                            {/* //!Customize CTA */}
                        </View>
                        {/* //!Page Header */}

                        {/* //!Startoff-Endpoint Inputs Block */}
                        <View style={[flexCol, gap(32)]}>
                            <CustomizeRouteInputTile label="Startoff Bus Stop" />

                            <CustomizeRouteInputTile label="Endpoint Bus Stop" />

                            {/* //!Date-Time Input Block */}
                            <View style={[flex, gap(16),]}>

                                {/* //!Date */}
                                <View style={[flexCol, gap(16), { flexBasis: '55%' }]}>
                                    <View style={[flex, itemsCenter, gap(16)]}>
                                        <Image style={[image.w(20), image.h(20)]} source={sharedImg.calendarImage} />

                                        <Text style={[neurialGrotesk, fw400, fs12, colordarkGrey]}>Date</Text>
                                    </View>

                                    <TouchableOpacity onPress={() => setModepicker('date')} style={[bg('#F9F7F8'), rounded(10), h(50), flex, itemsCenter, justifyCenter, gap(16), borderGrey(0.7),]}>

                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={date}
                                            mode={'date'}
                                            is24Hour={true}
                                            onChange={onChange}
                                            style={[fs14, fw500, colorBlack]}
                                        />

                                        <FontAwesome6 name="chevron-down" size={20} color={Colors.light.darkGrey} />
                                    </TouchableOpacity>
                                </View>
                                {/* //!Date */}

                                {/* //!Time */}
                                <View style={[flexCol, gap(16), { flexBasis: '40%' }]}>
                                    <View style={[flex, itemsCenter, gap(16)]}>
                                        <Image style={[image.w(20), image.h(20)]} source={sharedImg.calendarImage} />

                                        <Text style={[neurialGrotesk, fw400, fs12, colordarkGrey]}>Time</Text>
                                    </View>

                                    <TouchableOpacity onPress={() => setModepicker('time')} style={[bg('#F9F7F8'), rounded(10), h(50), flex, itemsCenter, justifyCenter, gap(16), borderGrey(0.7),]}>
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={date}
                                            mode={'time'}
                                            is24Hour={true}
                                            onChange={onChange}
                                            style={[fs14, fw500, colorBlack]}
                                        />
                                        <View style={[py(7), px(5), bg(Colors.light.background), rounded(5)]}>
                                            <Text style={[neurialGrotesk, fs14, fw500, colorWhite]}>AM</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {/* //!Time */}
                            </View>
                            {/* //!Date-Time Input Block */}
                        </View>
                        {/* //!Startoff-Endpoint Inputs Block */}

                        {/* //!In Trip Dropoffs */}
                        <View style={[flexCol, mt(32), mb(30)]}>
                            <View style={[borderB(0.7, Colors.light.border), pb(16)]}>
                                <Text style={[fw700, fs14, c(colors.black),]}>In-Trip Dropoffs</Text>
                            </View>

                            <View style={[flexCol, gap(16), { overflow: 'scroll' }]}>
                                {Array.from({ length: 7 }).map((_, index) => (
                                    <InTripDropoffDeleteTile
                                        key={index}
                                    />
                                ))}
                            </View>

                        </View>
                        {/* //!In Trip Dropoffs */}

                        {/* //!Create Trip CTA */}
                        <CtaBtn
                            img={{ src: tripImgs.whiteBgTripImage, h: 20, w: 20 }}
                            onPress={() => {
                                router.push('/(trip)/trips' as Href)
                            }}
                            text={{ name: 'Create Trip', color: colors.white }}
                            bg={{ color: Colors.light.background }}
                            style={{ container: { ...mb(30) } }}
                        />
                        {/* //!Create Trip CTA */}
                    </PaddedScreen>
                </View>
            </ScrollView>
        </SafeScreen>
    )
}

export default CustomizeTrip;