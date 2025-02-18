import { View, ImageSourcePropType, Image, ScrollView, FlatList } from 'react-native'
import Feather from '@expo/vector-icons/Feather';
import { Menu, Text, TextInput, } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'
import { image, mXAuto, wHFull } from '@/utils/imageStyles'
import { bg, border, flex, flexCol, gap, h, hFull, itemsCenter, justifyBetween, justifyCenter, justifyEnd, mb, mt, my, px, py, relative, rounded, w, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import { c, colorBlack, colordarkGrey, colorWhite, fs, fs12, fs14, fw400, fw500, neurialGrotesk } from '@/utils/fontStyles'
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
import MenuTile from '@/components/shared/menuTile'
import PageTitle from '@/components/shared/pageTitle'


function Withdraw() {
    let [visible, setVisible] = useState(false);

    const toggleMenu = () => setVisible(prev => (!prev));

    const closeMenu = () => setVisible(false);

    return (
        <SafeScreen>
            <ScrollView>
                <PaddedScreen>

                    {/* //!Header */}
                    <PageTitle
                        title="Withdraw"
                    />

                    {/* //!Header */}

                    <View style={[flexCol, gap(16)]}>
                        <TextInput
                            onChangeText={() => { }}
                            value={''} placeholder={'Account number'}
                            style={[py(0), px(10), rounded(10), bg(colors.transparent), colorBlack, fs14, fw500, h(50), { borderWidth: 0.7, borderColor: Colors.light.border }]}
                            keyboardType='numeric'
                            cursorColor={colors.transparent}
                            selectionColor={colors.transparent}
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={Colors.light.darkGrey}
                        />



                        <Menu
                            style={[w('90%'), mt(47), bg(colors.white), border(0.7, colors.transparent), rounded(0), h('auto')]}
                            contentStyle={[w('90%'), mt(47), bg(colors.white), border(0.7, colors.transparent), rounded(0), wFull, h('auto'), { marginTop: 0, paddingTop: 0 }]}
                            visible={visible}
                            onDismiss={closeMenu}
                            anchor={
                                <TouchableOpacity onPress={toggleMenu} style={[wFull, flex, itemsCenter, justifyBetween, gap(16), px(16), py(5), bg('#F9F7F8'), rounded(10)]}>

                                    <View style={[w(42), h(42), rounded(1000), bg('#EAE1FF'), { flexBasis: 42 }]}></View>

                                    <Text style={[fw500, fs(13), colordarkGrey, { flexBasis: '75%' }]}>Select Bank</Text>

                                    <Feather style={[]} name="chevron-right" size={24} color={Colors.light.border} />

                                </TouchableOpacity>
                            }>
                            {['Access Bank', 'Access Bank', 'Access Bank'].map((option, index) => (
                                <Menu.Item style={[bg(colors.white), wFull, index > 0 && mt(-10), my(2)]} onPress={() => {
                                    // onSelect(option)
                                    // handleChange('option')(option);
                                    // setStatus('selected')
                                    // closeMenu()
                                }} title={
                                    <View style={[flex, itemsCenter, gap(16),]}>
                                        <Image style={[image.w(45), image.h(45), image.rounded(45)]} source={sharedImg.mapImage} />
                                        <Text style={[bg(colors.white), wFull, c(Colors.light.darkGrey), fw500, fs14]}>{option}</Text>
                                    </View>} key={index} />
                            ))}
                        </Menu>

                        <View style={[flex, wFull, justifyEnd]}>
                            <Text style={[fw400, fs12, colordarkGrey]}>Bal (NGN) {'115,000.00'}</Text>
                        </View>

                        <TextInput
                            onChangeText={() => { }}
                            value={''} placeholder={'Amount (NGN)'}
                            style={[py(0), px(10), rounded(10), bg(colors.transparent), colorBlack, fs14, fw500, h(50), { borderWidth: 0.7, borderColor: Colors.light.border }]}
                            keyboardType='numeric'
                            cursorColor={colors.transparent}
                            selectionColor={colors.transparent}
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={Colors.light.darkGrey}
                        />
                    </View>
                </PaddedScreen>
            </ScrollView>
        </SafeScreen>
    )
}

export default Withdraw;