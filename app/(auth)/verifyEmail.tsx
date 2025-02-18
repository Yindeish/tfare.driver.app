import FileUploadTile from "@/components/shared/fileUploadTile";
import MenuTile from "@/components/shared/menuTile";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import { c, colorBlack, colorWhite, fs, fs10, fs14, fs18, fw400, fw500, fw700, leading, neurialGrotesk, textCenter } from "@/utils/fontStyles";
import { wHFull } from "@/utils/imageStyles";
import { bg, flexYCenter, h, mt, w, wFull, absolute, b, border, flex, itemsCenter, justifyBetween, rounded, py, px, pYAuto, flexCol, gap, my, justifyCenter, m, mb, pl, } from "@/utils/styles";
import { Entypo } from "@expo/vector-icons";
import { Href, Link, router } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, ScrollView, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";
import { Menu, Text, TouchableRipple } from "react-native-paper";
import OTPTextInput from 'react-native-otp-textinput'
import { useFormik } from "formik";
import { ObjectSchema, string } from "yup";
import { useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import FetchService from "@/services/api/fetch.service";
import { useSnackbar } from "@/contexts/snackbar.context";

function VerifyEmail() {
    const {token} = useAppSelector((state: RootState) => state.user);
    const {notify,Snackbar, snackbarVisible, closeSnackbar} = useSnackbar()

    let otpInput = useRef<HTMLInputElement>(null);

    const clearText = () => {
        (otpInput?.current as any)?.clear();
    }

    const setText = () => {
        (otpInput?.current as any)?.setValue("1234");
    }

    const [fetchState, setFetchState] = useState({
        msg: "",
        code: null,
        loading: false,
      });
      const { msg, loading, code } = fetchState;

    const {values, errors, handleSubmit, handleBlur, handleChange} = useFormik({
        initialValues:{otp: ''},
        validationSchema: new ObjectSchema({otp: string().required('Otp is required').min(4, 'Otp must be 4 digits')}),
        onSubmit: async ({otp}) => {
            try {
                console.log({ "uploading....": "uploading......" });
                setFetchState((prev) => ({ ...prev, loading: true, msg: "" }));
        
                const returnedData = await FetchService.postWithBearerToken({
                  token: token,
                  data: {
                   otp
                  },
                  url: "/auth/verify-email",
                });
        
                const msg = returnedData?.msg;
                const code = returnedData?.code;
        
                setFetchState((prev) => ({
                  ...prev,
                  msg: returnedData?.msg,
                  code: returnedData.code,
                  loading: false,
                }));
        
                notify({ msg });
              } catch (error: any) {
                console.log({ error });
                setFetchState((prev) => ({
                  ...prev,
                  msg: error?.message || "Error in verifying your email",
                  code: 400 as never,
                  loading: false,
                }));
        
                notify({ msg: error?.message || "Error in verifying your email" });
              }
        }
    })


    return (
        <SafeScreen>
            <ScrollView>
                <PaddedScreen styles={wHFull as ViewStyle}>

                    <PageTitle
                        title=""
                        onPress={() => router.back()}
                    />

                    <View style={[flexCol, gap(32)]}>

                        <View style={[flexCol, gap(0), wFull, itemsCenter]}>
                            <Text style={[neurialGrotesk, fw500, fs(32), colorBlack]}>Verify Email</Text>
                            <Text style={[neurialGrotesk, fw500, fs(12), c(Colors.light.darkGrey)]}>
                                Kindly Input the code we sent to your email
                            </Text>
                        </View>

                        <View style={[flexCol, gap(5)]}>
                            <OTPTextInput
                                ref={e => { }}
                                textInputStyle={{
                                    borderWidth: 0.7,
                                    borderRadius: 10,
                                    backgroundColor: '#F9F7F8',
                                    borderColor: false ? Colors.light.error : '#D7D7D7'
                                }}
                            />
                            {true && (<Text style={[neurialGrotesk, fw500, fs10, c('#CF0707'), textCenter]}>Code doesn’t match with what we sent you, Try again.</Text>)}
                        </View>

                        <TouchableRipple
                            onPress={() => { }} rippleColor={colors.white} style={[h(50), rounded(10), flexCol, wFull, itemsCenter, justifyCenter, bg(Colors.light.background), mb(30), mt(30)]}>
                            <Text style={[fw700, fs18, colorWhite, neurialGrotesk,]}>Verify</Text>
                        </TouchableRipple>

                    </View>

                </PaddedScreen>
            </ScrollView>
        </SafeScreen>
    )
}

export default VerifyEmail;