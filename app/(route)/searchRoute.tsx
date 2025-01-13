import { Image, View, TouchableOpacity, ScrollView, Pressable, Platform, TextInput, Dimensions, FlatList, TextStyle } from 'react-native'
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
import PresetRouteSheetTile from '@/components/home/presetRouteSheetTile';
import sharedImg from '@/constants/images/shared';
import PageTitle from '@/components/shared/pageTitle';
import { router } from 'expo-router';
import FetchService from '@/services/api/fetch.service';
import { useAppDispatch, useAppSelector } from '@/state/hooks/useReduxToolkit';
import { RootState } from '@/state/store';
import { useStorageState } from '@/hooks/useStorageState';
import { setRideState } from '@/state/slices/ride';
import { IRoute } from '@/state/types/ride';

const { height } = Dimensions.get('window')

function SearchRoute() {
    const {presetRoutes: allPresetRoutes} = useAppSelector((state: RootState) => state.ride);
    const dispatch = useAppDispatch();
    const [[_, session], __] = useStorageState('token');


    const [fetchState, setFetchState] = useState<{
        loading: boolean,
        msg: string,
        code: number | null,
        presetRoutes: IRoute[]
      }>({
        loading: false,
        msg: "",
        code: null,
        presetRoutes: allPresetRoutes
      });
      const { code, msg, loading, presetRoutes } = fetchState;
      const [searchText, setSearchText] = useState('')
    
      const getPresetRoutes = async () => {
        setFetchState((prev) => ({ ...prev, loading: true, msg: '', code: null }));
        await FetchService.getWithBearerToken({
          url: "/user/driver/me/routes/preset-routes",
          token: session as string,
        })
        .then(async res => {
            
            const data = res?.body? await res.body:res;
            const code = data?.code;
            const msg = data?.msg;
            const presetRoutes = data?.presetRoutes;
        
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
        ;
        
      };

      const searchRoute = () => {
        const filterList = (presetRoutes as IRoute[]).filter(route => route?.pickupBusstop.name?.includes(searchText) || route?.dropoffBusstop.name?.includes(searchText));

        if(searchText == '') setFetchState((prev) => ({...prev, presetRoutes: filterList}))
        else setFetchState((prev) => ({...prev, presetRoutes: filterList}));
      }

    //   useEffect(() => {
    //     presetRoutes.length == 0 && getPresetRoutes();
    //   }, [presetRoutes])

    return (
        <SafeScreen>
            <ScrollView>
                <View style={[flexCol, gap(32), p(20)]}>
                    {/* //!Page Title */}
                    <PageTitle
                        title='Home'
                        onPress={() => router.back()}
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
                            onChangeText={(text) => { 
                                setSearchText(text);
                                searchRoute();
                            }}
                        />
                    </View>
                    {/* //!Search Block */}

                    {/* //!Preset Route */}
                    <View style={[wFull, flex, itemsCenter, justifyBetween]}>
                        <Text style={[fw700, fs14, neurialGrotesk, colorBlack]}>Preset Routes</Text>

                        <TouchableOpacity>
                            <Image style={[image.w(18), image.h(16)]} source={tripImgs.settings} />
                        </TouchableOpacity>
                    </View>
                    {/* //!Preset Route */}

                    {/* //!Routes */}
                    <View style={[wFull, flexCol, gap(24)]}>
                        {presetRoutes.map((route, index) => (
                            <PresetRouteSheetTile route={route} key={index} />
                        ))}
                    </View>
                    {/* //!Routes */}

                    {/* //!Create Custom Route CTA */}
                    <TouchableOpacity onPress={() => { }}>
                        <View style={[w('60%'), h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(colors.white), borderGrey(0.7), mb(20), { shadowColor: '#000000', shadowOpacity: 0.05, shadowRadius: 10 }]}>
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

export default SearchRoute;