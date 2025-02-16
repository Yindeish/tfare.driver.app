import {
  View,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  TextStyle,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import { Href, Link, router } from "expo-router";
import { useSignup } from "@/contexts/signupContext";
import SafeScreen from "@/components/shared/safeScreen";
import PaddedScreen from "@/components/shared/paddedScreen";
import { Text, Menu, ActivityIndicator, Snackbar } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { genders } from "@/constants/gender";
import { fonts } from "@/constants/fonts";
import Colors, { colors } from "@/constants/Colors";
import {
  bg,
  flex,
  flexCenter,
  flexCol,
  flexYCenter,
  gap,
  hFull,
  itemsCenter,
  itemsStart,
  justifyBetween,
  justifyCenter,
  justifyEnd,
  justifyStart,
  mb,
  mt,
  pt,
  py,
  rounded,
  w,
  wFull,
  wHFull,
} from "@/utils/styles";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  c,
  colordarkGrey,
  fs,
  fs14,
  fw500,
  leading,
  neurialGrotesk,
  textCenter,
} from "@/utils/fontStyles";
import { useSnackbar } from "@/contexts/snackbar.context";
import { pages } from "@/constants/pages";
import { image } from "@/utils/imageStyles";
import authImgs from "@/constants/images/auth";
import FetchService from "@/services/api/fetch.service";

const {
  textInput,
  form,
  signUpBtn,
  signUpText,
  noAccount,
  signupLink,
  invalidEntryText,
  checkbox,
} = StyleSheet.create({
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
    paddingTop: "auto",
    paddingBottom: "auto",
    backgroundColor: "#F9F7F8",
  },
  signUpBtn: {
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    height: 50,
  },
  signUpText: {
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
  checkbox: {
    marginRight: 12,
  },
});

const SignupSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  pin: yup
    .string()
    .min(4, "Pin must be at least 4 characters")
    .required("Required"),
  confirmedPin: yup
    .string()
    .oneOf([yup.ref("pin")], "Passwords must match")
    .required("Required"),
  profileName: yup.string().required("Required"),
  phoneNumber: yup.string().required("Required"),
  agree: yup
    .boolean()
    .oneOf([true], "You need to accept the terms and conditions"),
});

export default function Signup() {
  // const { signUp, loadingState, code, msg } = useSignup()
  const { closeSnackbar, snackbarVisible, openSnackbar, Snackbar, notify } =
    useSnackbar();

  const [secureTextEntry, setSecureTextEntry] = useState(true);

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
      confirmedPin: "",
      profileName: "",
      phoneNumber: "",
      agree: true,
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      try {
        setFetchState((prev) => ({ ...prev, loading: true, msg: "" }));

        const returnedData = await FetchService.post({
          data: { ...values, fullName: values.profileName, role: "driver" },
          url: "/auth/signup",
        });

        notify({msg});
        const signedUpUser = returnedData?.signedUpUser;

        setFetchState((prev) => ({
          ...prev,
          msg: returnedData?.msg,
          code: returnedData.code,
          loading: false,
        }));
        if (returnedData.code === 201)
          router.replace(`/(auth)/signin` as Href);
      } catch (error: any) {
        console.log({ error });
        setFetchState((prev) => ({
          ...prev,
          msg: error?.message || "Error in signing up",
          code: 400 as never,
          loading: false,
        }));

        notify({msg: error?.message || "Error in signing up",})
      }
    },
  });

  return (
    <SafeScreen>
      <ScrollView>
        <PaddedScreen styles={wHFull}>
          <View
            style={[
              wFull,
              hFull,
              flex,
              flexCol,
              itemsStart,
              justifyEnd,
              pt(70),
              { gap: 40, height: "auto" },
            ]}
          >
            <View style={[flexCol]}>
              <Text
                style={
                  [
                    py(10),
                    fw500,
                    fs(32),
                    leading(20),
                    c(colors.black),
                  ] as TextStyle[]
                }
              >
                Create a
              </Text>
              <Text
                style={
                  [
                    py(10),
                    fw500,
                    fs(32),
                    leading(20),
                    c(colors.black),
                  ] as TextStyle[]
                }
              >
                new account
              </Text>
            </View>

            <View style={[flexCol, gap(16), itemsCenter, wFull]}>
              <Image
                style={[image.w(65), image.h(65), image.rounded(65)]}
                source={authImgs.imageUpload}
              />
              <Text
                style={
                  [
                    fs14,
                    fw500,
                    neurialGrotesk,
                    leading(17),
                    c(colors.black),
                    textCenter,
                    w("80%"),
                  ] as TextStyle[]
                }
              >
                Kindly Upload a potrait picture of yourself showing your full
                face
              </Text>
            </View>

            <View style={[form, flexYCenter, { gap: 16 }] as ViewStyle[]}>
              <TextInput
                style={
                  [
                    textInput,
                    formik.touched.profileName && formik.errors.profileName
                      ? { borderColor: Colors.light.error }
                      : undefined,
                  ] as TextStyle[]
                }
                placeholder="Profile name"
                underlineColorAndroid={colors.transparent}
                placeholderTextColor={Colors.light.darkGrey}
                value={formik.values.profileName}
                cursorColor={Colors.light.darkGrey}
                onChangeText={formik.handleChange("profileName")}
                onBlur={formik.handleBlur("profileName")}
              />
              {formik.touched.profileName && formik.errors.profileName && (
                <Text style={invalidEntryText as TextStyle}>
                  {formik.errors.profileName}
                </Text>
              )}

              <TextInput
                style={
                  [
                    textInput,
                    formik.touched.email && formik.errors.email
                      ? { borderColor: Colors.light.error }
                      : undefined,
                  ] as TextStyle[]
                }
                placeholder="Email"
                underlineColorAndroid={colors.transparent}
                placeholderTextColor={Colors.light.darkGrey}
                value={formik.values.email}
                cursorColor={Colors.light.darkGrey}
                onChangeText={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <Text style={invalidEntryText as TextStyle}>
                  {formik.errors.email}
                </Text>
              )}

              <TextInput
                style={
                  [
                    textInput,
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                      ? { borderColor: Colors.light.error }
                      : undefined,
                  ] as TextStyle[]
                }
                placeholder="Phone number"
                underlineColorAndroid={colors.transparent}
                placeholderTextColor={Colors.light.darkGrey}
                value={formik.values.phoneNumber}
                keyboardType="numeric"
                cursorColor={Colors.light.darkGrey}
                onChangeText={formik.handleChange("phoneNumber")}
                onBlur={formik.handleBlur("phoneNumber")}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <Text style={invalidEntryText as TextStyle}>
                  {formik.errors.phoneNumber}
                </Text>
              )}

              <TextInput
                style={
                  [
                    textInput,
                    formik.touched.pin && formik.errors.pin
                      ? { borderColor: Colors.light.error }
                      : undefined,
                  ] as TextStyle[]
                }
                placeholder="4-Digit Pin Code"
                keyboardType="number-pad"
                underlineColorAndroid={colors.transparent}
                placeholderTextColor={Colors.light.darkGrey}
                value={formik.values.pin}
                secureTextEntry={secureTextEntry}
                onChangeText={formik.handleChange("pin")}
                onBlur={formik.handleBlur("pin")}
              />
              {formik.touched.pin && formik.errors.pin && (
                <Text style={invalidEntryText as TextStyle}>
                  {formik.errors.pin}
                </Text>
              )}

              <TextInput
                style={
                  [
                    textInput,
                    formik.touched.confirmedPin && formik.errors.confirmedPin
                      ? { borderColor: Colors.light.error }
                      : undefined,
                  ] as TextStyle[]
                }
                placeholder="Confirm 4-Digit Pin Code"
                keyboardType="number-pad"
                underlineColorAndroid={colors.transparent}
                placeholderTextColor={Colors.light.darkGrey}
                value={formik.values.confirmedPin}
                secureTextEntry={secureTextEntry}
                onChangeText={formik.handleChange("confirmedPin")}
                onBlur={formik.handleBlur("confirmedPin")}
              />
              {formik.touched.confirmedPin && formik.errors.confirmedPin && (
                <Text style={invalidEntryText as TextStyle}>
                  {formik.errors.confirmedPin}
                </Text>
              )}

              <View
                style={[justifyStart, itemsCenter, wFull, flex, { gap: 12 }]}
              >
                <Checkbox
                  style={checkbox as ViewStyle}
                  value={formik.values.agree}
                  onValueChange={() =>
                    formik.setFieldValue("agree", !formik.values.agree)
                  }
                  color={Colors.light.background}
                />

                <View style={[flex, itemsCenter, gap(2)]}>
                  <Text style={{ color: colors.black }}>I accept Tfare's</Text>
                  <Text style={{ color: Colors.light.background }}>
                    terms and Condition
                  </Text>
                </View>
              </View>
              {formik.touched.agree && formik.errors.agree && (
                <Text style={invalidEntryText as TextStyle}>
                  {formik.errors.agree}
                </Text>
              )}

              <Pressable
                style={
                  [
                    wFull,
                    signUpBtn,
                    flex,
                    itemsCenter,
                    justifyCenter,
                    mt(30),
                  ] as ViewStyle[]
                }
                disabled={loading}
                onPress={() => formik.handleSubmit()}
              >
                {!loading ? (
                  <Text style={[signUpText] as TextStyle[]}>Create</Text>
                ) : (
                  <ActivityIndicator color={colors.white} size="small" />
                )}
              </Pressable>
            </View>

            <View
              style={[wFull, flex, justifyCenter, itemsCenter, gap(8), mb(50)]}
            >
              <Text style={[noAccount] as TextStyle[]}>
                Already have an account?
              </Text>
              <Link href={"/(auth)/signin" as Href} asChild>
                <Pressable>
                  <Text style={signupLink as TextStyle}>Sign in</Text>
                </Pressable>
              </Link>
            </View>
          </View>

          {/* //!Sanckbar */}
          <Snackbar msg={msg} onDismiss={() => closeSnackbar()} snackbarVisible={snackbarVisible} />
          {/* //!Sanckbar */}
        </PaddedScreen>
      </ScrollView>
    </SafeScreen>
  );
}
