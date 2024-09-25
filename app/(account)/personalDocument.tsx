import FileUploadTile from "@/components/shared/fileUploadTile";
import MenuTile from "@/components/shared/menuTile";
import Modal from "@/components/shared/modal";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import authImgs from "@/constants/images/auth";
import sharedImg from "@/constants/images/shared";
import { c, colorBlack, colordarkGrey, colorWhite, fs, fs10, fs14, fs18, fw400, fw500, fw700, leading, neurialGrotesk, textCenter } from "@/utils/fontStyles";
import { image, wHFull } from "@/utils/imageStyles";
import { bg, flexYCenter, h, mt, w, wFull, absolute, b, border, flex, itemsCenter, justifyBetween, rounded, py, px, pYAuto, flexCol, gap, my, justifyCenter, m, mb, pl, p, } from "@/utils/styles";
import { Entypo } from "@expo/vector-icons";
import { Href, Link, router } from "expo-router";
import { useState } from "react";
import { Dimensions, Image, Pressable, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Menu, Text, TouchableRipple } from "react-native-paper";


function PersonalDocument() {


    return (
        <SafeScreen>
            <ScrollView>
                <PaddedScreen styles={[wHFull,]}>

                    <PageTitle
                        title="Personal Documents"
                        onPress={() => router.push('/(home)/account' as Href)}
                    />

                    <View style={[flexCol, gap(32)]}>
                        <View style={[flexCol, gap(16), itemsCenter, wFull]}>
                            <Image style={[image.w(65), image.h(65), image.rounded(65)]} source={authImgs.imageUpload} />
                            <Text style={[fs14, fw500, neurialGrotesk, leading(17), c(colors.black), textCenter, w('80%')]}>
                                Kindly Upload a potrait picture of yourself showing your full face
                            </Text>
                        </View>

                        <View style={[flexCol, gap(0),]}>
                            <FileUploadTile
                                label={
                                    <View style={[flexCol, gap(3)]}>
                                        <Text style={[fw500, fs14, c(colors.black)]}>Road Worthiness</Text>
                                        <Text style={[fw500, fs14, c(colors.black)]}>Certificate</Text>
                                    </View>
                                }
                                layout="flat"
                                styles={{ label: {} }}
                                placeholder={{ success: true, hasError: false, uploadHelper: () => { }, imgNotClear: false }}
                            />
                            <FileUploadTile
                                label={
                                    <View style={[flexCol, gap(3)]}>
                                        <Text style={[fw500, fs14, c(colors.black)]}>Car Insurance</Text>
                                        <Text style={[fw500, fs14, c(colors.black)]}>Certificate</Text>
                                    </View>
                                }
                                layout="flat"
                                styles={{ container: [mt(-10)], label: {} }}
                                placeholder={{ success: false, hasError: false, uploadHelper: () => { }, imgNotClear: false }}
                            />
                            <FileUploadTile
                                label={
                                    <View style={[flexCol, gap(3)]}>
                                        <Text style={[fw500, fs14, c(colors.black)]}>Car Insurance</Text>
                                        <Text style={[fw500, fs14, c(colors.black)]}>Certificate</Text>
                                    </View>
                                }
                                layout="flat"
                                styles={{ container: [mt(-10)], label: {} }}
                                placeholder={{ success: true, hasError: true, uploadHelper: () => { }, imgNotClear: false }}
                            />
                            <FileUploadTile
                                label={
                                    <Text style={[fw500, fs14, c(colors.black)]}>Your License</Text>
                                }
                                layout="flat"
                                styles={{ container: [mt(-10)], label: {} }}
                                placeholder={{ success: true, hasError: false, uploadHelper: () => { }, imgNotClear: true }}
                            />

                        </View>
                    </View>

                </PaddedScreen>
            </ScrollView>
        </SafeScreen>
    )
}

export default PersonalDocument;

