import { Image, View, TouchableOpacity, ScrollView, Pressable, Platform, TextInput, Dimensions, FlatList } from 'react-native'
import { FontAwesome6 } from '@expo/vector-icons';
import { ActivityIndicator, Button, Snackbar, Text, } from 'react-native-paper'
import React, { useEffect } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { image, imgAbsolute, wHFull } from '@/utils/imageStyles'
import { absolute, bg, borderGrey, flex, flexCenter, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, maxh, mb, ml, mr, mt, p, pb, pl, px, py, relative, rounded, w, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import PaddedScreen from '@/components/shared/paddedScreen'
import { c, colorBlack, fs12, fs14, fs18, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import tripImgs from '@/constants/images/trip';
import sharedImg from '@/constants/images/shared';
import PageTitle from '@/components/shared/pageTitle';
import { router } from 'expo-router';
import PresetRouteSheetTile from '@/components/trip/presetRouteSheetTile';


function Trip() {

    return (
        <SafeScreen>
            <ScrollView>
                <View style={[flexCol, gap(32), p(20),]}>
                    {/* //!Page Title */}
                    <PageTitle
                        title='Trips'
                    />
                    {/* //!Page Title */}

                    {/* //!Search Block */}
                    <View style={[wFull, rounded(1000), bg(colors.transparent), h(50), mt(-20), relative]}>
                        {/* //! */}
                        <Image style={[image.w(20), image.h(20), imgAbsolute, image.t('30%'), image.l(20), image.zIndex(3)]} source={tripImgs.search} />
                        {/* //! */}

                        <TextInput
                            style={[
                                wHFull, pl(43), borderGrey(0.7), rounded(1000), bg('#F9F7F8')
                            ]}
                            placeholder='Search Bus stop'
                            placeholderTextColor={Colors.light.darkGrey}
                            value={''}
                            onChangeText={() => { }}

                        />
                    </View>
                    {/* //!Search Block */}

                    {/* //!Preset Route */}
                    {/* //!Header */}
                    <View style={[wFull, flex, itemsCenter, justifyBetween]}>
                        <Text style={[fw700, fs14, neurialGrotesk, colorBlack]}>Preset Routes</Text>

                        <TouchableOpacity>
                            <Image style={[image.w(18), image.h(16)]} source={tripImgs.settings} />
                        </TouchableOpacity>
                    </View>
                    {/* //!Header */}

                    {/* //!Routes */}
                    <View style={[wFull, flexCol, gap(24)]}>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <PresetRouteSheetTile key={index} />
                        ))}
                    </View>
                    {/* //!Routes */}
                    {/* //!Preset Route */}

                    {/* //!Create Custom Route CTA */}
                    <TouchableOpacity onPress={() => { }}>
                        <View style={[w('60%'), h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(colors.white), borderGrey(0.7), mb(70), { shadowColor: '#000000', shadowOpacity: 0.05, shadowRadius: 10 }]}>
                            <Image style={[image.w(20), image.h(20),]} source={sharedImg.blackBgPlusIcon} />

                            <Text style={[neurialGrotesk, fw700, fs18, c(colors.black),]}>Create Custom Route</Text>
                        </View>
                    </TouchableOpacity>
                    {/* //!Create Custom Route CTA */}
                </View>
            </ScrollView>
        </SafeScreen>
    )
}

export default Trip;

