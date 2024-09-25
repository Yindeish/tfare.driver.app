import { Image, View, TouchableOpacity, ScrollView, Pressable, Platform } from 'react-native'
import { ActivityIndicator, Button, Snackbar, Text } from 'react-native-paper'
import React, { useEffect } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { image, wHFull } from '@/utils/imageStyles'
import { bg, border, borderB, borderGrey, borderY, flex, flexCenter, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, mb, mr, mt, pb, px, py, relative, rounded, w, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import PaddedScreen from '@/components/shared/paddedScreen'
import { c, colorBlack, colordarkGrey, fs12, fs14, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import { Ionicons } from '@expo/vector-icons'
import { pages } from '@/constants/pages'
import { Href, router } from 'expo-router'
import PageTitle from '@/components/shared/pageTitle'
import { useSession } from '@/contexts/userSignedInContext'
import { useSnackbar } from '@/contexts/snackbar.context'
import { homeImgs } from '@/constants/images/home'
import sharedImg from '@/constants/images/shared'
import PageNavigator from '@/components/account/pageNavigator'
import accountImgs from '@/constants/images/account'

function Index() {


    return (
        <SafeScreen>
            <ScrollView style={[wHFull, relative]}>
                <PaddedScreen>
                    <PageTitle
                        title='Earnings'
                        onPress={() => router.push('/(home)/account')}
                    />

                    <View style={[wFull, flexCol, gap(32),]}>

                        {/* //!Wallet Block */}
                        <View style={[wFull, flex, gap(10), justifyBetween, itemsCenter, bg('#EDEDFD'), rounded(10), h(94), py(17), px(9), {}]}>
                            <View style={[flexCol, gap(16), w(126), h(60)]}>

                                <View style={[flex, itemsCenter, { gap: 16 }]}>

                                    <Image style={[image.w(19), image.h(18)]} source={sharedImg.walletImage} />

                                    <Text style={[neurialGrotesk, fs12, c(Colors.light.darkGrey), fw400,]}>wallet balance</Text>

                                </View>

                                <Text style={[colorBlack, fw700, { fontSize: 22 }]}> ₦{'0000.00'}</Text>
                            </View>

                            <TouchableOpacity onPress={() => router.push('/(earnings)/withdraw')}>
                                <View style={[flex, itemsCenter, justifyBetween, w(124), h(45), px(16), rounded(100), bg(colors.white), {
                                    borderWidth: 0.7, borderColor: '#D7D7D7',
                                }]}>

                                    <View style={[w(24), h(24), rounded(24), border(0.7, Colors.light.darkGrey), flex, itemsCenter, justifyCenter]}>
                                        <Image style={[image.w(19), image.h(19)]} source={sharedImg.minusImage} />
                                    </View>
                                    <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>Top Up</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/* //!Wallet Block */}

                        <View style={[wFull, flexCol, gap(32)]}>
                            {/* //!Header */}
                            <View style={[wFull, flex, justifyBetween, itemsCenter, borderB(0.7, Colors.light.border), pb(16)]}>
                                <Text style={[fw400, fs14, colorBlack]}>This June</Text>

                                <View style={[flex, gap(10)]}>
                                    <Text style={[fw400, fs12, colorBlack]}>In: {'₦ 200,000'}</Text>
                                    <Text style={[fw400, fs12, colorBlack]}>Out: {'₦ 75,000'}</Text>
                                </View>
                            </View>
                            {/* //!Header */}

                            <View style={[flexCol, gap(10)]}>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <View style={[flexCol, h('auto'), gap(32), borderB(0.7, Colors.light.border), pb(16)]} key={index}>
                                        <View style={[flex, itemsCenter, justifyBetween]}>
                                            <Text style={[fw400, fs14, colorBlack]}>Frenponq Jacksonne</Text>
                                            <Text style={[fw700, fs14, colorBlack]}> ₦ {'4,000.00'}</Text>
                                        </View>

                                        <View style={[flex, itemsCenter, justifyBetween]}>
                                            <Text style={[fw400, fs12, colordarkGrey]}>25mins drive | Tuesday, 5th December</Text>
                                            <Text style={[fw700, fs12, colordarkGrey]}> {'09:53'} AM</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>

                        </View>
                    </View>
                </PaddedScreen>
            </ScrollView>
        </SafeScreen>
    )
}

export default Index;