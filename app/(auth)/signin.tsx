import {
  View,
  Pressable,
  StyleSheet,
  TextInput,
  Platform,
  ScrollView,
  Dimensions,
  ViewStyle,
  TextStyle,
} from "react-native";
import React, { useState } from "react";
import { Href, Link, Redirect, router } from "expo-router";
import { useSession } from "../../contexts/userSignedInContext";
import SafeScreen from "../../components/shared/safeScreen";
import {
  ActivityIndicator,
  MD2Colors,
  Snackbar,
  Text,
} from "react-native-paper";
import { fonts } from "../../constants/fonts";
import {
  wFull,
  wHFull,
  flexCol,
  itemsStart,
  justifyCenter,
  justifyEnd,
  flex,
  itemsCenter,
  justifyBetween,
  mXAuto,
  py,
  mt,
  bg,
  mb,
} from "../../utils/styles";
import Colors, { colors } from "../../constants/Colors";
import PaddedScreen from "@/components/shared/paddedScreen";
import { useSnackbar } from "@/contexts/snackbar.context";
import { useSession as userTokenSession } from "@/contexts/userTokenContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import tw from "@/constants/tw";
import FetchService from "@/services/api/fetch.service";
import { pages } from "@/constants/pages";
import { setItemAsync } from "expo-secure-store";
import { useAppDispatch } from "@/state/hooks/useReduxToolkit";
import { setUserState } from "@/state/slices/user";

const {
  signInTitle,
  textInput,
  form,
  forgotPassword,
  signInBtn,
  signInText,
  noAccount,
  signupLink,
  invalidEntryText,
} = StyleSheet.create({
  signInTitle: {
    fontWeight: "500",
    fontSize: 32,
    lineHeight: 32.08,
    color: MD2Colors.black,
    fontFamily: fonts.neurialGrotesk,
  },
  form: {
    width: "100%",
    height: "auto",
  },
  textInput: {
    borderColor: "#D7D7D7",
    borderWidth: 0.7,
    borderRadius: 10,
    width: "100%",
    height: 50,
    paddingHorizontal: 24,
    backgroundColor: "#F9F7F8",
  },
  forgotPassword: {
    fontFamily: fonts.neurialGrotesk,
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18.48,
    color: MD2Colors.black,
    marginLeft: "auto",
  },
  signInBtn: {
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    height: 50,
  },
  signInText: {
    color: colors.white,
    fontFamily: fonts.neurialGrotesk,
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 23.76,
  },
  noAccount: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 16.66,
    textAlign: "center",
    color: colors.black,
  },
  signupLink: {
    color: Colors.light.background,
    paddingLeft: 2,
  },
  invalidEntryText: {
    color: Colors.light.error,
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18.48,
  },
});

interface ISigninFormData {
  email: string;
  pin: string;
}

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  pin: Yup.string()
    .min(4, "Pin must be at least 4 characters")
    .max(6, "Pin must be 6-digits")
    .required("Pin is required"),
});

const { height } = Dimensions.get("screen");

export default function Signin() {
  const { closeSnackbar, snackbarVisible, Snackbar, notify } = useSnackbar();
  const { tokenSession, signIn: signinToken } = userTokenSession();
  const dispatch = useAppDispatch()

  // signinToken('x')

  // if (userSession) return <Redirect href={"/(home)/" as Href} />;

  const [fetchState, setFetchState] = useState({
    msg: "",
    code: null,
    loading: false,
  });
  const { msg, loading, code } = fetchState;

  const formik = useFormik({
    initialValues: {
      email: "",
      pin: "",
    },
    validationSchema: SignInSchema,
    onSubmit: async (values) => {
      try {
        setFetchState((prev) => ({ ...prev, loading: true, msg: "" }));

        const returnedData = await FetchService.post({
          data: { ...values, role: "driver" },
          url: "/auth/signin",
        });

        notify({ msg: returnedData?.msg });
        const signedUpUser = returnedData?.signedUpUser;

        setFetchState((prev) => ({
          ...prev,
          msg: returnedData?.msg,
          code: returnedData.code,
          loading: false,
        }));
       
        if (returnedData.code === 200 || returnedData.code === 201)
          {
            const signedinTime = new Date();
            const user = returnedData?.user;
            const token = returnedData?.token;
  
            try {
              await setItemAsync('user', JSON.stringify(user));
              await setItemAsync('token', token);
              await setItemAsync('signedinTime', JSON.stringify(signedinTime));
  
              dispatch(setUserState({key:'user', value: user}));
              dispatch(setUserState({key:'token', value: token}));

              router.replace('/(home)')
            } catch (error: any) {
              throw new Error(error?.message)
            }
  
            router.replace(`/(home)` as Href);
          }
      } catch (error: any) {
        console.log({ error });
        setFetchState((prev) => ({
          ...prev,
          msg: error?.message || "Error in signing in",
          code: 400 as never,
          loading: false,
        }));
        notify({msg: error?.message || "Error in signing in"})
      }
    },
  });

  return (
    <SafeScreen>
      <ScrollView style={[wHFull]}>
        <PaddedScreen styles={[wHFull]}>
          <View
            style={[wHFull, flexCol, itemsStart, justifyCenter, { gap: 40 }]}
          >
            <View style={[flexCol, wFull, mt(height * 0.3), { gap: 2 }]}>
              <Text style={[signInTitle, py(5)] as TextStyle[]}>Sign in</Text>
              <Text style={signInTitle as TextStyle}>to continue</Text>
            </View>

            <View style={[form, { gap: 16 }] as ViewStyle[]}>
              <TextInput
                style={
                  [
                    textInput,
                    formik.errors.email && formik.touched.email
                      ? { borderColor: Colors.light.error }
                      : undefined,
                  ] as TextStyle[]
                }
                placeholder="Email Address"
                placeholderTextColor={Colors.light.darkGrey}
                keyboardType="email-address"
                value={formik.values.email}
                onChangeText={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
                autoFocus
              />

              {formik.errors.email && formik.touched.email && (
                <Text style={invalidEntryText as TextStyle}>
                  {formik.errors.email}
                </Text>
              )}

              <TextInput
                style={
                  [
                    textInput,
                    formik.errors.pin && formik.touched.pin
                      ? { borderColor: Colors.light.error }
                      : undefined,
                  ] as TextStyle[]
                }
                placeholder="4-Digit Pin Code"
                placeholderTextColor={Colors.light.darkGrey}
                keyboardType="number-pad"
                value={formik.values.pin}
                secureTextEntry
                onChangeText={formik.handleChange("pin")}
                onBlur={formik.handleBlur("pin")}
              />
              {formik.errors.pin && formik.touched.pin && (
                <Text style={invalidEntryText as TextStyle}>
                  {formik.errors.pin}
                </Text>
              )}

              <View style={[wFull, flex, itemsCenter, justifyEnd]}>
                <Text style={[forgotPassword] as TextStyle[]}>Forgot Pin?</Text>
              </View>
            </View>

            <Pressable
              style={
                [
                  wFull,
                  signInBtn,
                  flex,
                  itemsCenter,
                  justifyCenter,
                ] as ViewStyle[]
              }
              disabled={loading}
              onPress={() => formik.handleSubmit()}
            >
              {!loading ? (
                <Text style={[signInText] as TextStyle[]}>Sign In</Text>
              ) : (
                <ActivityIndicator color={colors.white} size="small" />
              )}
            </Pressable>

            {Platform.OS == "android" && (
              <Text style={tw`text-[10px] font-medium text-red-500`}>
                {msg}
              </Text>
            )}

            <Text style={[noAccount, mXAuto, mb(50)] as TextStyle[]}>
              Don't have an account?
              <Link href={"/signup"}>
                <Text style={signupLink as TextStyle}>Sign Up</Text>
              </Link>
            </Text>
          </View>

          <Snackbar
            msg={msg}
            onDismiss={() => closeSnackbar()}
            snackbarVisible={snackbarVisible}
          />
        </PaddedScreen>
      </ScrollView>
    </SafeScreen>
  );
}
