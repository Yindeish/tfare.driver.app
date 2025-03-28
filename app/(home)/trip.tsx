import { Image, View, TouchableOpacity, ScrollView, Pressable, Platform, TextInput, Dimensions, FlatList, TextStyle, RefreshControl } from 'react-native'
import { FontAwesome6 } from '@expo/vector-icons';
import { ActivityIndicator, Button, Snackbar, Text, } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
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
import { useAppDispatch, useAppSelector } from '@/state/hooks/useReduxToolkit';
import { RootState } from '@/state/store';
import FetchService from '@/services/api/fetch.service';
import { setRideState } from '@/state/slices/ride';


function Trip() {
    const dispatch = useAppDispatch();
    const {presetRoutes: allPresetRoutes} = useAppSelector((state: RootState) => state.ride);
    const {token} = useAppSelector((state: RootState) => state.user);

    const [fetchState, setFetchState] = useState({
        loading: false,
        msg: "",
        code: null,
        presetRoutes: allPresetRoutes
      });
      const { code, msg, loading, presetRoutes } = fetchState;
    
      const getPresetRoutes = async () => {
        setFetchState((prev) => ({ ...prev, loading: true, msg: '', code: null }));
        await FetchService.getWithBearerToken({
          url: "/ride/routes",
          token: token as string,
        })
        .then(async res => {
            
            const data = res?.body? await res.body:res;
            const code = data?.code;
            const msg = data?.msg;
            const presetRoutes = data?.presetRoutes;
            console.log({presetRoutes})
        
            setFetchState((prev) => ({ ...prev, loading: false, msg, code }));
        
            if (code && code == 200 && presetRoutes) {
              dispatch(setRideState({key:'presetRoutes', value: presetRoutes}))
              setFetchState((prev) => ({
                ...prev,
                presetRoutes
              }));
            }
        })
        .catch(err => console.log({err}))
        .finally(() => {
            setFetchState((prev) => ({ ...prev, loading: false }));
        })
        ;
        
      };

    return (
        <SafeScreen>
            <ScrollView refreshControl={<RefreshControl onRefresh={getPresetRoutes} refreshing={loading} />}>
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
                            ] as TextStyle[]}
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
                        {presetRoutes.map((route, index) => (
                            <PresetRouteSheetTile route={route} key={index} />
                        ))}
                    </View>
                    {/* //!Routes */}
                    {/* //!Preset Route */}

                    {/* //!Create Custom Route CTA */}
                    <TouchableOpacity onPress={() => { }}>
                        <View style={[w('60%'), h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(colors.white), borderGrey(0.7), mb(70), { shadowColor: '#000000', shadowOpacity: 0.05, shadowRadius: 10 }]}>
                            <Image style={[image.w(20), image.h(20),]} source={sharedImg.blackBgPlusIcon} />

                            <Text style={[neurialGrotesk, fw700, fs18, c(colors.black),]}>Create Custom Trip</Text>
                        </View>
                    </TouchableOpacity>
                    {/* //!Create Custom Route CTA */}
                </View>
            </ScrollView>
        </SafeScreen>
    )
}

export default Trip;

