import { View, ImageSourcePropType, Image } from 'react-native'
import { Text, } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'
import { image, wHFull } from '@/utils/imageStyles'
import { bg, flex, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, mt, px, py, relative, rounded, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import { c, colorBlack, colorWhite, fs12, fs14, fw500, neurialGrotesk } from '@/utils/fontStyles'
import AccountPageTitle from '@/components/shared/pageTitle'
import { Href, router } from 'expo-router'
import { tabs } from '@/constants/tabs'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { setProfileCta, setUserProfileInfo, setUserProfileInfoFeild } from '@/state/slices/account'
import { IStateInputProfile } from '@/state/types/account'
import { useSession } from '@/contexts/userSignedInContext'
import sharedImg from '@/constants/images/shared'
import tripImgs from '@/constants/images/trip'
import AccountTextField from '@/components/account/accountTextFeild'
import { homeImgs } from '@/constants/images/home'

function MyVehicle() {
    const [profileCta, setProfileCta] = useState('edit');

    const editProfile = () => {
        setProfileCta('save');
    }

    const saveProfile = () => {
        setProfileCta('edit');
    }

    return (
        <SafeScreen>
            <View style={[wHFull,]}>
                <PaddedScreen>

                    {/* //!Page Header */}

                    <AccountPageTitle
                        title='Profile Information'
                        onPress={() => router.push(`/(tab)/${tabs.account}` as Href)}
                        style={[]}
                    >
                        {/* //!Edit / Save profile Btn */}

                        {profileCta === 'edit' ?
                            (<TouchableOpacity onPress={editProfile} style={[flex, rounded(100), gap(10), py(13), px(26), itemsCenter, bg('#F9F7F8'), { borderColor: Colors.light.border, borderWidth: 0.7 }]}>
                                <Image source={sharedImg.editBtn} style={[image.w(18), image.h(18),]} />

                                <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>Edit</Text>
                            </TouchableOpacity>)
                            :
                            (<TouchableOpacity onPress={saveProfile} style={[flex, rounded(100), gap(10), py(13), px(26), itemsCenter, bg(Colors.light.background), { borderColor: Colors.light.border, borderWidth: 0.7 }]}>
                                <Image source={tripImgs.whiteBgEditBtn} style={[image.w(18), image.h(18),]} />

                                <Text style={[neurialGrotesk, fs12, fw500, colorWhite]}>Save</Text>
                            </TouchableOpacity>)
                        }

                        {/* //!Edit / Save profile Btn */}
                    </AccountPageTitle>

                    {/* //!Page Header */}

                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}

export default MyVehicle;