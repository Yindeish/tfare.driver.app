import { Image, View, TouchableOpacity, ScrollView, Pressable, Platform, TextInput, Dimensions, FlatList } from 'react-native'
import { FontAwesome6 } from '@expo/vector-icons';
import { ActivityIndicator, Button, Snackbar, Text, } from 'react-native-paper'
import React, { useEffect } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { image, imgAbsolute, objectContain, wHFull } from '@/utils/imageStyles'
import { absolute, bg, borderGrey, flex, flexCenter, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, maxh, mb, ml, mr, mt, p, pb, pl, px, py, relative, rounded, w, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import PaddedScreen from '@/components/shared/paddedScreen'
import { c, colorBlack, colorWhite, fs12, fs14, fs18, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import tripImgs from '@/constants/images/trip';
import sharedImg from '@/constants/images/shared';
import PageTitle from '@/components/shared/pageTitle';
import { router } from 'expo-router';
import PresetRouteSheetTile from '@/components/trip/presetRouteSheetTile';
import { Href } from 'expo-router';

function UpcomingTripTile() {


    return (
        <View style={[wFull, h(116), py(17), px(9), flexCol, justifyBetween, rounded(10), bg(Colors.light.background)]}>

            <View style={[flex, itemsCenter, justifyBetween]}>
                <Text style={[colorWhite, fs14, fw700]}>Ojoo Bus Stop</Text>

                <Image style={[image.h(10), image.w(70), objectContain]} source={tripImgs.whiteBgTripDirection} />

                <Text style={[colorWhite, fs14, fw700]}>Ojoo Bus Stop</Text>
            </View>

            <View style={[wFull, flex, justifyBetween, itemsCenter]}>
                <View style={[flexCol, gap(16)]}>
                    <Text style={[fw400, fs12, c(colors.white),]}>{'06:00'} AM</Text>
                    <Text style={[fw400, fs12, c(colors.white),]}>{'14/04/2024'}</Text>
                </View>

                <View style={[flex, itemsCenter,]}>
                    <View style={[bg(colors.white), borderGrey(0.7), flex, itemsCenter, gap(10), p(16), rounded('100%')]}>
                        <Image style={[image.w(18), image.h(18),]} source={tripImgs.tripWayImage} />
                        <Text style={[fw500, fs12, c(colors.black)]}>View trip details</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/(trip)/tripDetails/1' as Href)} style={[h(45), w(45), rounded('100%'), bg(Colors.light.blueBackground), flex, itemsCenter, justifyCenter, ml(-15)]}>
                        <FontAwesome6 size={20} name="arrow-right-long" color={colors.white} />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

export default UpcomingTripTile;