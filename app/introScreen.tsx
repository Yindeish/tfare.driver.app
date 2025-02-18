import { View, StyleSheet, Pressable, Image, TextStyle, ViewStyle } from 'react-native'
import { Text, Button, TouchableRipple, MD2Colors } from 'react-native-paper';
import React, { useEffect, useState } from 'react'
// import Swiper from 'react-native-swiper';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { Href, Link, router } from 'expo-router';
import { images } from '../constants/images/splash';
import Colors, { colors } from '@/constants/Colors';
import { fonts } from '@/constants/fonts';
import SafeScreen from '@/components/shared/safeScreen';
import { bg, flex, flexCol, itemsCenter, justifyCenter, w, wFull, wHFull } from '@/utils/styles';
import { colorWhite, fs14, fs18, fw400, fw700, neurialGrotesk } from '@/utils/fontStyles';
import { pages } from '@/constants/pages';
import { image, objectContain } from '@/utils/imageStyles';
import CtaBtn from '@/components/shared/ctaBtn';
import sharedImg from '@/constants/images/shared';

const { container, containerWrapper, skipLink, skipText, slide, slideImage, slideText, text, wrapper, activeDotStyle, ctaBtn, ctaText } = StyleSheet.create({
    containerWrapper: {
        backgroundColor: Colors.light.background,
    },
    skipLink: {
        marginLeft: 'auto',
        marginRight: 20,
        marginTop: 102,
    },
    skipText: {
        lineHeight: 17,
    },
    container: {
        width: '100%',
        paddingHorizontal: 20,
        height: '60%',
        backgroundColor: colors.transparent,
        marginBottom: 30
    },
    wrapper: {
    },
    slide: {
        backgroundColor: colors.transparent,
        gap: 15
    },
    slideImage: {
        height: '55%',
    },
    slideText: {
        fontSize: 22,
        lineHeight: 22,
        textAlign: 'center',
        color: 'white'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: fonts.neurialGrotesk
    },
    activeDotStyle: {
        width: 14,
        height: 7,
        borderRadius: 10
    },
    ctaBtn: {
        borderRadius: 10,
        backgroundColor: Colors.light.tabIconDefault,
        height: 50
    },
    ctaText: {

    }
});

export default function IntroScreen() {

    let [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    return (
        <SafeScreen>
            <View style={[wHFull, flexCol, itemsCenter, containerWrapper] as ViewStyle[]}>

                <Link
                    // href={'/(auth)/signin'}
                    href={'/(auth)/carInfoUpload' as Href}//testing
                    style={skipLink as TextStyle}
                >
                    <Text style={[skipText, colorWhite, fw400, fs14] as TextStyle[]}>Skip</Text>
                </Link>

                <View style={container as ViewStyle}>
                    {/* <Swiper */}
                    <SwiperFlatList
                        style={wrapper as ViewStyle}
                        // showsButtons={false}
                        // dotColor='white'
                        // activeDotColor='#5D5FEF'
                        // activeDotStyle={activeDotStyle as ViewStyle}
                        paginationDefaultColor={'white'}
                        paginationActiveColor={'#5D5FEF'}
                        paginationStyleItem={activeDotStyle as ViewStyle}
                        disableGesture={false}
                        scrollEnabled={true}
                        index={0}
                        autoplay={true}
                        autoplayDelay={1} 
                        autoplayLoop={false}
                        onChangeIndex={({index}) => {
                                setCurrentSlideIndex(index);
                            }}
                        // autoplayTimeout={1}
                        // loop={false}
                        // onIndexChanged={(index) => {
                        //     setCurrentSlideIndex(index);
                        // }}
                    > 
                        {/* <PagerView 
                         scrollEnabled={true}
                         tabIndex={0}
                        style={wrapper as ViewStyle} initialPage={0}> */}
                        <View style={[slide, wHFull, itemsCenter, justifyCenter] as ViewStyle[]}>
                            <Image style={[slideImage as any, wFull, objectContain]} source={images.introScreenImage1} />

                            <Text style={slideText as TextStyle}>
                                Unlock a new way to travel with loved ones through our Family Ride feature.
                            </Text>
                        </View>
                        <View style={[slide, wHFull, itemsCenter, justifyCenter] as ViewStyle[]}>
                            <Image style={[slideImage as any, wFull, objectContain]} source={images.introScreenImage2} />

                            <Text style={slideText as TextStyle}>
                                Experience the freedom of safe travels.
                            </Text>
                        </View>
                        <View style={[slide, wHFull, itemsCenter, justifyCenter] as ViewStyle[]}>
                            <Image style={[slideImage as any, wFull, objectContain]} source={images.introScreenImage3} />

                            <Text style={slideText as TextStyle}>
                                Discover the joy of shared experiences with our Co-Passenger rides.
                            </Text>
                        </View>
                        {/* </PagerView> */}
                    </SwiperFlatList>
                </View>

                {currentSlideIndex === 2 ?
                    // (<View style={[currentSlideIndex === 2 && flexCol, wFull, {
                    //     opacity: currentSlideIndex === 2 ? 1 : 0, gap: 16, paddingHorizontal: 20, display: currentSlideIndex === 2 ? 'flex' : 'none'
                    // }]}>
                    //     <TouchableRipple onPress={() => router.replace(`/(auth)/signup` as Href)} rippleColor={Colors.light.tabIconDefault} style={[ctaBtn, flexCol, wFull, itemsCenter, justifyCenter]}>
                    //         <Text style={[fw700, fs18, colorWhite, neurialGrotesk,]}>Get Started</Text>
                    //     </TouchableRipple>

                    //     <TouchableRipple
                    //         onPress={() => router.replace(`/(auth)/signin` as Href)} rippleColor={colors.white} style={[ctaBtn, flexCol, wFull, itemsCenter, justifyCenter, { backgroundColor: MD2Colors.transparent, borderWidth: 1, borderColor: MD2Colors.white }]}>
                    //         <Text style={[fw700, fs18, colorWhite, neurialGrotesk,]}>Sign in</Text>
                    //     </TouchableRipple>
                    // </View>)
                    (
                        <View style={[currentSlideIndex === 2 && flexCol, wFull, {
                            opacity: currentSlideIndex === 2 ? 1 : 0, gap: 16, paddingHorizontal: 20, display: currentSlideIndex === 2 ? 'flex' : 'none'
                        }]}>
                            <CtaBtn
                                img={{ src: sharedImg.proceedIcon }}
                                onPress={() => router.push('/(auth)/' as Href)}
                                text={{ name: `Let's Get Started`, color: colors.white }}
                                bg={{ color: Colors.light.blueBackground, }}

                            />
                        </View>)
                    :
                    (<View style={[wFull, bg('transparent'), { flex: 1 }]} />)}
            </View>
        </SafeScreen>
    )
}