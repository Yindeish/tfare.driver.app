import FileUploadTile from "@/components/shared/fileUploadTile";
import MenuTile from "@/components/shared/menuTile";
import Modal from "@/components/shared/modal";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import sharedImg from "@/constants/images/shared";
import { closeModal } from "@/state/slices/layout";
import { c, colorBlack, colordarkGrey, colorWhite, fs, fs10, fs14, fs18, fw400, fw500, fw700, leading, neurialGrotesk, textCenter } from "@/utils/fontStyles";
import { image, wHFull } from "@/utils/imageStyles";
import { bg, flexYCenter, h, mt, w, wFull, absolute, b, border, flex, itemsCenter, justifyBetween, rounded, py, px, pYAuto, flexCol, gap, my, justifyCenter, m, mb, pl, p, } from "@/utils/styles";
import { Entypo } from "@expo/vector-icons";
import { Href, Link, router } from "expo-router";
import { useState } from "react";
import { Dimensions, Image, Pressable, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Menu, Text, TouchableRipple } from "react-native-paper";

const { height } = Dimensions.get('window');

type TModalType = 'idle' | 'success' | 'failed';

function DocsUpload() {
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState<TModalType>('idle');

    const showModal = (modalType: TModalType) => {
        setVisible(true)
        setModalType(modalType)
    };
    const hideModal = () => {
        setVisible(false)
        setModalType('idle')
    };


    return (
        <SafeScreen>
            <ScrollView>
                <PaddedScreen styles={[wHFull,]}>

                    <PageTitle
                        title="Your documents"
                        onPress={() => router.back()}
                    />
                    {true && <Text style={[fw500, fs10, colorWhite, neurialGrotesk, c('#CF0707'), textCenter, mt(-10)]}>Kindly upload all required documents</Text>}


                    <View style={[wFull, h(height * 0.75), flexCol, justifyBetween]}>
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

                        <View style={[flex, wFull, justifyBetween]}>
                            <TouchableOpacity
                                onPress={() => router.back()} style={[h(50), rounded(10), flexCol, w('46%'), itemsCenter, justifyCenter, bg(colors.white), mb(30), mt(30), border(1, Colors.light.background)]}>
                                <Text style={[fw700, fs18, c(Colors.light.background), neurialGrotesk,]}>Go back</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => showModal('success')} style={[h(50), rounded(10), flexCol, w('46%'), itemsCenter, justifyCenter, bg(Colors.light.background), mb(30), mt(30)]}>
                                <Text style={[fw700, fs18, colorWhite, neurialGrotesk,]}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* //!Modals */}
                    {/* //!Success */}
                    <Modal
                        hideModal={hideModal}
                        showModal={() => showModal('success')}
                        visible={visible && modalType === 'success'}
                    >
                        <View style={[wFull, p(10), flexCol, gap(10), itemsCenter]}>
                            <Image style={[image.w(80), image.h(80)]} source={sharedImg.modalSuccessful} />

                            <View style={[flexCol, itemsCenter]}>
                                <Text style={[neurialGrotesk, fw700, fs(22), colorBlack, leading(25)]}>Document Submitted</Text>
                                <Text style={[neurialGrotesk, fw700, fs(22), colorBlack, leading(25)]}>for Verifcation</Text>
                            </View>

                            <View style={[flexCol, itemsCenter]}>
                                <Text style={[neurialGrotesk, fw500, fs(12), colordarkGrey, leading(13)]}>
                                    We’ll get in touch with you just in
                                </Text>
                                <Text style={[neurialGrotesk, fw500, fs(12), colordarkGrey, leading(13)]}>
                                    time for you to start you role
                                </Text>
                                <Text style={[neurialGrotesk, fw500, fs(12), colordarkGrey, leading(13)]}>
                                    as a driver on Tfare!
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={hideModal} style={[h(50), rounded(10), flexCol, wFull, itemsCenter, justifyCenter, bg(Colors.light.background),]}>
                                <Text style={[fw700, fs18, colorWhite, neurialGrotesk,]}>Okay</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    {/* //!Success */}

                    {/* //!Failed */}
                    <Modal
                        hideModal={hideModal}
                        showModal={() => showModal('failed')}
                        visible={visible && modalType === 'failed'}
                    >
                        <View style={[wFull, p(10), flexCol, gap(10), itemsCenter]}>
                            <Image style={[image.w(80), image.h(80)]} source={sharedImg.modalFailed} />

                            <View style={[flexCol, itemsCenter]}>
                                <Text style={[neurialGrotesk, fw700, fs(22), colorBlack, leading(25)]}>We couldn’t Verify</Text>
                                <Text style={[neurialGrotesk, fw700, fs(22), colorBlack, leading(25)]}>your Documents</Text>
                            </View>

                            <View style={[flexCol, itemsCenter]}>
                                <Text style={[neurialGrotesk, fw500, fs(12), colordarkGrey, leading(13)]}>
                                    We’ll get in touch with you just in
                                </Text>
                                <Text style={[neurialGrotesk, fw500, fs(12), colordarkGrey, leading(13)]}>
                                    time for you to start you role
                                </Text>
                                <Text style={[neurialGrotesk, fw500, fs(12), colordarkGrey, leading(13)]}>
                                    as a driver on Tfare!
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={hideModal} style={[h(50), rounded(10), flexCol, wFull, itemsCenter, justifyCenter, bg(Colors.light.background),]}>
                                <Text style={[fw700, fs18, colorWhite, neurialGrotesk,]}>Try again</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    {/* //!Failed */}
                    {/* //!Modals */}
                </PaddedScreen>
            </ScrollView>
        </SafeScreen>
    )
}

export default DocsUpload;