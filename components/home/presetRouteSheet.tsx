import { Image, View, TouchableOpacity, ScrollView, Pressable, Platform, TextInput, Dimensions, FlatList, TextStyle } from 'react-native'
import { FontAwesome6 } from '@expo/vector-icons';
import { Text, } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import { image, imgAbsolute, wHFull } from '@/utils/imageStyles'
import { absolute, bg, borderGrey, flex, flexCenter, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, maxh, mb, ml, mr, mt, p, pb, pl, px, py, relative, rounded, w, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import { c, colorBlack, fs12, fs14, fs18, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import tripImgs from '@/constants/images/trip';
import PresetRouteSheetTile from './presetRouteSheetTile';
import sharedImg from '@/constants/images/shared';
import { Href, router } from 'expo-router';
import { useBottomSheet } from '@/contexts/useBottomSheetContext';
import FetchService from '@/services/api/fetch.service';
import { useAppDispatch, useAppSelector } from '@/state/hooks/useReduxToolkit';
import { RootState } from '@/state/store';
import { useStorageState } from '@/hooks/useStorageState';
import Spinner from '../shared/spinner';
import { setRideState } from '@/state/slices/ride';



function PresetRouteSheet() {
    const dispatch = useAppDispatch();
    const { hideBottomSheet } = useBottomSheet();
    const {dropoffBusstopInput, pickupBusstopInput, } = useAppSelector((state: RootState) => state.ride);
    const [[isLoading, session], setSession] = useStorageState("token");

    const [fetchState, setFetchState] = useState({
        loading: false,
        msg: "",
        code: null,
        presetRoutes: []
      });
      const { code, msg, loading, presetRoutes } = fetchState;
    
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
              dispatch(setRideState({key:'currentRoute', value: presetRoutes}))
              setFetchState((prev) => ({
                ...prev,
                presetRoutes
              }));
            }
        })
        .catch(err => console.log({err}))
        ;
        
      };

      useEffect(() => {
        presetRoutes.length == 0 && getPresetRoutes();
      }, [presetRoutes])

    return (
        <View style={[flexCol, gap(32), p(20)]}>
            {/* //!Search Block */}
            <TouchableOpacity onPress={() => {
                hideBottomSheet()
                router.push('/(route)/searchRoute' as Href)
            }} style={[wFull, rounded(1000), borderGrey(0.7), bg('#F9F7F8'), flex, itemsCenter, gap(20), px(25), h(50), relative]}>
                {/* //! */}
                <Image style={[image.w(20), image.h(20),]} source={tripImgs.search} />
                {/* //! */}

                <Text
                    style={[
                        rounded(1000) as TextStyle, c(Colors.light.darkGrey)
                    ]}

                >Search Bus stop</Text>
            </TouchableOpacity>
            {/* //!Search Block */}

            <View style={[wFull, flex, itemsCenter, justifyBetween]}>
                <Text style={[fw700, fs14, neurialGrotesk]}>Preset Routes</Text>

                <TouchableOpacity>
                    <Image style={[image.w(18), image.h(16)]} source={tripImgs.settings} />
                </TouchableOpacity>
            </View>

            <View style={[wFull, flexCol, gap(24)]}>
                {presetRoutes.map((route, index) => (
                    <PresetRouteSheetTile route={route} key={index} />
                ))}
            </View>

            <TouchableOpacity onPress={() => router.push('/(route)/customizeRoute')}>
                <View style={[w('60%'), h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(colors.white), borderGrey(0.7), { shadowColor: '#000000', shadowOpacity: 0.05, shadowRadius: 10 }]}>
                    <Image style={[image.w(20), image.h(20),]} source={sharedImg.blackBgPlusIcon} />

                    <Text style={[neurialGrotesk, fw700, fs18, c(colors.black),]}>Create Custom Route</Text>
                </View>
            </TouchableOpacity>

            <Spinner visible={loading} />
        </View>
    )
}

export default PresetRouteSheet;