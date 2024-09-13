import FileUploadTile from "@/components/shared/fileUploadTile";
import MenuTile from "@/components/shared/menuTile";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import { c, colorBlack, colorWhite, fs, fs14, fs18, fw400, fw500, fw700, leading, neurialGrotesk, textCenter } from "@/utils/fontStyles";
import { wHFull } from "@/utils/imageStyles";
import { bg, flexYCenter, h, mt, w, wFull, absolute, b, border, flex, itemsCenter, justifyBetween, rounded, py, px, pYAuto, flexCol, gap, my, justifyCenter, m, mb, pl, } from "@/utils/styles";
import { Entypo } from "@expo/vector-icons";
import { Href, Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Menu, Text, TouchableRipple } from "react-native-paper";


function CarInfoUpload() {

    return (
        <SafeScreen>
            <ScrollView>
                <PaddedScreen styles={wHFull}>

                    <PageTitle
                        title=""
                        onPress={() => router.back()}
                    />
                    <View style={[flexCol, gap(0)]}>
                        <Text style={[neurialGrotesk, c(colors.black), fw500, fs(32), leading(36),]}>Upload Car</Text>
                        <Text style={[neurialGrotesk, c(colors.black), fw700, fs(32), leading(36),]}>Information </Text>
                    </View>

                    <View style={[flexCol, gap(16), mt(32)]}>
                        {[
                            { label: 'Car Type', options: ['Camry'], onSelect: () => { } },
                            { label: 'Car Year', options: ['Camry'], onSelect: () => { } },
                            { label: 'Car Model', options: ['Camry'], onSelect: () => { } },
                            { label: 'Car Color', options: ['Red', 'Yellow', 'Blue'], onSelect: () => { } },
                        ].map(({ label, onSelect, options }, index) => (
                            <MenuTile
                                label={label}
                                onSelect={onSelect}
                                options={options}
                                key={index}
                            />
                        ))}
                        {/* //!Number of seats */}
                        <TextInput
                            style={[wFull, flex, itemsCenter, justifyBetween, border(0.7, '#D7D7D7'), rounded(10), wFull, h(50), bg('#F9F7F8'), py('auto'), px(24), true ? { borderColor: Colors.light.error } : undefined]}
                            placeholder='Number of seats'
                            value={''}
                            keyboardType="number-pad"
                            cursorColor={Colors.light.darkGrey}
                            onChangeText={() => { }}
                            onBlur={() => { }}
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={Colors.light.darkGrey}
                        />
                        {/* //!Number of seats */}

                        {/* //!Plate number */}
                        <TextInput
                            style={[wFull, flex, itemsCenter, justifyBetween, border(0.7, '#D7D7D7'), rounded(10), wFull, h(50), bg('#F9F7F8'), py('auto'), px(24), false ? { borderColor: Colors.light.error } : undefined]}
                            placeholder='Plate number'
                            value={''}
                            keyboardType="number-pad"
                            cursorColor={Colors.light.darkGrey}
                            onChangeText={() => { }}
                            onBlur={() => { }}
                            underlineColorAndroid={colors.transparent}
                            placeholderTextColor={Colors.light.darkGrey}
                        />
                        {/* //!Plate number */}
                    </View>

                    <Text style={[neurialGrotesk, c(colors.black), fw700, fs(18), leading(18), my(20)]}>Vehicle pictures</Text>

                    <View style={[flexCol, gap(16),]}>
                        <FileUploadTile
                            label="Front View"
                            layout="stack"
                            styles={{ container: {}, label: {} }}
                            placeholder={{ condition: true, hasError: false, uploadHelper: () => { } }}
                        />
                        <FileUploadTile
                            label="Back View"
                            layout="stack"
                            styles={{ container: {}, label: {} }}
                            placeholder={{ condition: false, hasError: false, uploadHelper: () => { } }}
                        />
                        <FileUploadTile
                            label="Side View"
                            layout="stack"
                            styles={{ container: {}, label: {} }}
                            placeholder={{ condition: false, hasError: true, uploadHelper: () => { } }}
                        />
                        <FileUploadTile
                            label="Interior"
                            layout="stack"
                            styles={{ container: {}, label: {} }}
                            placeholder={{ condition: true, hasError: true, uploadHelper: () => { } }}
                        />
                    </View>

                    <TouchableRipple
                        onPress={() => router.replace(`/(auth)/signup` as Href)} rippleColor={colors.white} style={[h(50), rounded(10), flexCol, wFull, itemsCenter, justifyCenter, bg(Colors.light.background), mb(30), mt(30)]}>
                        <Text style={[fw700, fs18, colorWhite, neurialGrotesk,]}>Continue</Text>
                    </TouchableRipple>

                    <View style={[wFull, flex, justifyCenter, itemsCenter, gap(8), mb(50)]}>
                        <Text style={[fw400, fs14, textCenter, colorBlack, leading(16.66)]}>Already have an account?</Text>
                        <Link href={'/(auth)/signin' as Href} asChild>
                            <Pressable>
                                <Text style={[pl(2), c(Colors.light.background)]}>Sign in</Text>
                            </Pressable>
                        </Link>
                    </View>

                </PaddedScreen>

            </ScrollView>
        </SafeScreen>
    )
}

export default CarInfoUpload;