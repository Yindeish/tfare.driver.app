import { Image, View, TouchableOpacity, ScrollView, Pressable, Platform } from 'react-native'
import { ActivityIndicator, Button, Snackbar, Text } from 'react-native-paper'
import React, { useEffect } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { image, wHFull } from '@/utils/imageStyles'
import { bg, border, flex, flexCenter, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, mb, mr, mt, pb, px, py, relative, rounded, w, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import PaddedScreen from '@/components/shared/paddedScreen'
import { c, colorBlack, fs12, fs14, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import { Ionicons } from '@expo/vector-icons'
import { pages } from '@/constants/pages'
import { Href, router } from 'expo-router'
import PageTitle from '@/components/shared/pageTitle'
import { useSession } from '@/contexts/userSignedInContext'
import { useSnackbar } from '@/contexts/snackbar.context'
import { homeImgs } from '@/constants/images/home'
import sharedImg from '@/constants/images/shared'
import PageNavigator from '@/components/account/pageNavigator'

export default function Account() {
    const { signIn, loadingState, userSession, msg, code, signOut } = useSession();
    const { closeSnackbar, snackbarVisible } = useSnackbar()

    return (
        <SafeScreen>
            <ScrollView style={[wHFull, relative]}>
                <PaddedScreen>
                    <PageTitle
                        title='Account'
                    />

                    <View style={[wFull, flexCol, gap(32),]}>

                        <TouchableOpacity onPress={() => router.push(`/(account)/profileInfo` as Href)} style={[wFull, flex, itemsCenter, justifyBetween]}>
                            <View style={[flex, gap(14), itemsCenter, { flex: 0.8 }]}>
                                <Image source={homeImgs.userProfileImg} style={[image.w(60), image.h(60),]} />

                                <View style={[flexCol, gap(16)]}>
                                    <Text style={[c(Colors.light.darkGrey), fs12, fw400, neurialGrotesk]}>Welcome back</Text>
                                    <Text style={[colorBlack, fw700, fs14]}>King John</Text>
                                </View>
                            </View>

                            <Ionicons style={[mr(16)]} name="chevron-forward" size={20} color={Colors.light.darkGrey} />
                        </TouchableOpacity>

                        {/* Wallet Block */}

                        <View style={[wFull, flex, gap(10), justifyBetween, itemsCenter, bg('#EDEDFD'), rounded(10), h(94), py(17), px(9), {}]}>
                            <View style={[flexCol, gap(16), w(126), h(60)]}>

                                <View style={[flex, itemsCenter, { gap: 16 }]}>

                                    <Image style={[image.w(19), image.h(18)]} source={sharedImg.walletImage} />

                                    <Text style={[neurialGrotesk, fs12, c(Colors.light.darkGrey), fw400,]}>wallet balance</Text>

                                </View>

                                <Text style={[colorBlack, fw700, { fontSize: 22 }]}> ₦{'0000.00'}</Text>
                            </View>

                            <TouchableOpacity>
                                <View style={[flex, itemsCenter, justifyBetween, w(124), h(45), px(16), rounded(100), bg(colors.white), {
                                    borderWidth: 0.7, borderColor: '#D7D7D7',
                                }]}>

                                    <View style={[w(24), h(24), rounded('100%'), border(0.7, Colors.light.darkGrey), flex, itemsCenter, justifyCenter]}>
                                        <Image style={[image.w(19), image.h(19)]} source={sharedImg.minusImage} />
                                    </View>
                                    <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>Top Up</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* //!Wallet Block */}

                        <View style={[wFull, flexCol, gap(16), bg(colors.white), pb(80)]}>

                            <PageNavigator
                                title='My Vehicle'
                                navigate
                                page={`/(account)/myVehicle`}
                                source={sharedImg.blackBgPlusIcon} imageStyle={[image.w(18), image.h(16.36)]} />

                            <PageNavigator
                                navigate
                                title='Personal Documents'
                                page={`/(account)/personalDocument`}
                                source={sharedImg.blackBgPlusIcon} imageStyle={[image.w(15), image.h(20)]} />

                            <PageNavigator
                                title='Account Security'
                                navigate
                                page={`/(account)/accountSecurity`}
                                source={sharedImg.blackBgPlusIcon} imageStyle={[image.w(18), image.h(14)]} />

                            <PageNavigator
                                title='Bank Details'
                                navigate
                                page={`/(account)/bankDetails`}
                                source={sharedImg.blackBgPlusIcon} imageStyle={[image.w(18), image.h(22)]} />

                            <PageNavigator
                                title='Terms and Condition'
                                navigate
                                page={`/(account)/termsAndCondition`}
                                source={sharedImg.blackBgPlusIcon} imageStyle={[image.w(18), image.h(19)]} />

                            <PageNavigator
                                title='Notifications'
                                navigate
                                page={`/(account)/notifications`}
                                source={sharedImg.blackBgPlusIcon} imageStyle={[image.w(18), image.h(14.73)]} />

                            <PageNavigator navigate={false} title='Rate Us' source={sharedImg.blackBgPlusIcon} imageStyle={[image.w(18), image.h(17.13)]} />

                            <PageNavigator
                                title='Contact Support'
                                navigate
                                page={`/(account)/contactSupport`}
                                source={sharedImg.blackBgPlusIcon} imageStyle={[image.w(18), image.h(14.73)]} />

                            <PageNavigator navigate={false} title='Rate Us' source={sharedImg.blackBgPlusIcon} imageStyle={[image.w(18), image.h(17.13)]} />

                            {loadingState === 'idle' ?
                                (<Button
                                    onPress={() => signOut()}
                                    labelStyle={[neurialGrotesk, fs14, fw500]}
                                    textColor={Colors.light.error}
                                    style={[mb(20)]}
                                >Logout</Button>)
                                :
                                (<ActivityIndicator style={[mb(20)]} color={Colors.light.background} size={'small'} />)
                            }

                            {/* Snackbar */}
                            {Platform.OS === 'ios' && <Snackbar
                                style={[]}
                                visible={snackbarVisible}
                                onDismiss={() => closeSnackbar()}
                                action={{
                                    label: 'close',
                                    onPress: () => {
                                    },
                                }}>
                                {msg}
                            </Snackbar>}
                            {/* Snackbar */}
                        </View>
                        {/* //!Wallet Block */}
                    </View>
                </PaddedScreen>
            </ScrollView>
        </SafeScreen>
    )
}

