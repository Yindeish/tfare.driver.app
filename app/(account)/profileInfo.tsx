import { View, ImageSourcePropType, Image, ViewStyle } from 'react-native'
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
import { IStateInputProfile, IUserAccount } from '@/state/types/account'
import { useSession } from '@/contexts/userSignedInContext'
import sharedImg from '@/constants/images/shared'
import tripImgs from '@/constants/images/trip'
import AccountTextField from '@/components/account/accountTextFeild'
import { homeImgs } from '@/constants/images/home'
import { useStorageState } from '@/hooks/useStorageState'
// import * as ImagePicker from 'expo-image-picker';
// import { UploadApiOptions, upload } from 'cloudinary-react-native'
// import CloudinaryServices from '../../cloudinary/cloudinary.services'


export default function profileInfo() {
    // const { user } = useSession();
    const [[_, userString], setUser] = useStorageState('user');
    const user = JSON.parse(userString as string) as IUserAccount;

    // const { emailInput, nameInput, phoneNoInput, userNameInput, avatarInput, imageInput } = stateInput.profile;
    // const { emailInput, nameInput, phoneNoInput, userNameInput, } = stateInput.profile;
    const [profileCta, setProfileCta] = useState('edit');

    const editProfile = () => {
        setProfileCta('save');
    }

    const saveProfile = () => {
        setProfileCta('edit');
    }

    const pickImage = async () => {
        // let result = await ImagePicker.launchImageLibraryAsync({
        //     mediaTypes: ImagePicker.MediaTypeOptions.All,
        //     allowsEditing: true,
        //     aspect: [4, 3],
        //     quality: 1,
        // });

        // if (!result.canceled) {
        //     // CloudinaryServices.uploadImage({
        //     //     // imagePath: result.assets[0].uri as string, folderName: 'ridersImages', fnToRn: (value) => {
        //     //     //     dispatch(setUserProfileInfoFeild({ key: 'imageInput', value }))
        //     //     // }
        //     // })
        // }
    };

    return (
        <SafeScreen>
            <View style={[wHFull as ViewStyle,]}>
                <PaddedScreen>

                    {/* Page Header */}

                    <AccountPageTitle
                        title='Profile Information'
                        onPress={() => router.push(`/(home)/${tabs.account}` as Href)}
                        style={[]}
                    >
                        {/* Edit / Save profile Btn */}

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

                        {/* Edit / Save profile Btn */}
                    </AccountPageTitle>

                    {/* Page Header */}

                    {/* User avatar */}

                    <View style={[mt(28), flexCol, gap(16), itemsCenter, wFull, h(134)]}>
                        {/* {(user?.picture) ? */}
                        {(user?.picture || user?.avatar) ?
                            (<Image source={user?.picture as any} style={[image.w(100), image.h(100), image.rounded(100)]} />)
                            :
                            // (<Image source={imageInput !== '' || avatarInput !== '' ? { uri: imageInput || avatarInput } : { uri: images.fallbackAvatar }} style={[image.w(100), image.h(100), image.rounded(100)]} />)
                            // (<Image source={false ? {} : images.fallbackAvatar} style={[image.w(100), image.h(100), image.rounded(100)]} />)
                            (<Image source={(user?.picture || user?.avatar) ? {uri: (user?.picture || user?.avatar)} : homeImgs.userProfileImg} style={[image.w(100), image.h(100), image.rounded(100)]} />)
                        }

                        <TouchableOpacity onPress={() => pickImage()}>
                            <Text style={[neurialGrotesk, fw500, fs14, c(Colors.light.background)]}>Upload picture</Text>
                        </TouchableOpacity>

                    </View>

                    {/* User avatar */}

                    <View style={[wFull, flexCol, gap(16), mt(60)]}>

                        <AccountTextField
                            input={{
                                fieldKey: 'nameInput',
                                onChangeText: (key, value) => {
                                    // dispatch(setUserProfileInfoFeild({ key: key as unknown as keyof IStateInputProfile, value }))
                                },
                                palceHolder: '',
                                value: '',
                                editing: profileCta === 'save'
                            }}
                            label={{ text: 'Name' }}
                        />

                        <AccountTextField
                            input={{
                                fieldKey: 'userNameInput',
                                onChangeText: (key, value) => {
                                    // dispatch(setUserProfileInfoFeild({ key: key as unknown as keyof IStateInputProfile, value }))
                                },
                                palceHolder: '',
                                value: '',
                                editing: profileCta === 'save'
                            }}
                            label={{ text: 'Username' }}
                        />

                        <AccountTextField
                            input={{
                                fieldKey: 'emailInput',
                                onChangeText: (key, value) => {
                                    // dispatch(setUserProfileInfoFeild({ key: key as unknown as keyof IStateInputProfile, value }))
                                },
                                palceHolder: '',
                                value: '',
                                editing: profileCta === 'save',
                                keyboardType: 'email-address'
                            }}
                            label={{ text: 'Email' }}
                        />
                        <AccountTextField
                            input={{
                                fieldKey: 'phoneNoInput',
                                onChangeText: (key, value) => {
                                    // dispatch(setUserProfileInfoFeild({ key: key as unknown as keyof IStateInputProfile, value }))
                                },
                                palceHolder: '',
                                value: '',
                                editing: profileCta === 'save',
                                keyboardType: 'numeric'
                            }}
                            label={{ text: 'Phone number' }}
                        />
                    </View>

                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}