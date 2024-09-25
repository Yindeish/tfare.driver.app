import { Image, View, TouchableOpacity, ScrollView, Pressable, Platform } from 'react-native'
import { ActivityIndicator, Button, Snackbar, Text } from 'react-native-paper'
import React, { useEffect } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { image, wHFull } from '@/utils/imageStyles'
import { bg, border, flex, flexCenter, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, mb, mr, mt, pb, px, py, relative, rounded, w, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import PaddedScreen from '@/components/shared/paddedScreen'
import { c, colorBlack, fs12, fs14, fs16, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
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


function NotificationsMessages() {


    return (
        <SafeScreen>
            <ScrollView style={[wHFull, relative]}>
                <PaddedScreen>
                    <PageTitle
                        title='Account'
                        onPress={() => router.push('/(home)/account')}
                    />

                    <View style={[wFull, flexCol, gap(12)]}>
                        <View style={[wFull, flex, itemsCenter, justifyBetween]}>
                            <Text style={[fw700, fs14, neurialGrotesk, colorBlack]}>Today</Text>

                            <View style={[flex, itemsCenter, gap(16)]}>
                                <Text style={[fw400, fs14, neurialGrotesk, colorBlack]}>Mark all as read</Text>
                                <Ionicons name="checkmark-done-outline" size={24} color="black" />
                            </View>
                        </View>

                        <View style={[flexCol, gap(16)]}>
                            {Array.from({ length: 12 }).map((_, index) => (
                                <View style={[flexCol, gap(7)]} key={index}>
                                    <Text style={[fw500, fs16, colorBlack]}>Frenponq cancelled ride</Text>

                                    <Text style={[fw400, fs12, c(Colors.light.darkGrey)]}>
                                        Lorem ipsum dolor sit amet consectetur. Cras faucibus nibh accumsan scelerisque ultrices
                                        morbi et nibh sit. Porttitor consequat vitae cursus dui eget purus in massa.
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </PaddedScreen>
            </ScrollView>
        </SafeScreen>
    )
}

export default NotificationsMessages;