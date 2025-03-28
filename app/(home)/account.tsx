import {
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Platform,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ActivityIndicator, Button, Snackbar, Text } from "react-native-paper";
import React, { useEffect, useState } from "react";
import SafeScreen from "@/components/shared/safeScreen";
import { image, wHFull } from "@/utils/imageStyles";
import {
  bg,
  border,
  flex,
  flexCenter,
  flexCol,
  gap,
  h,
  itemsCenter,
  justifyBetween,
  justifyCenter,
  mb,
  mr,
  mt,
  pb,
  px,
  py,
  relative,
  rounded,
  w,
  wFull,
} from "@/utils/styles";
import Colors, { colors } from "@/constants/Colors";
import PaddedScreen from "@/components/shared/paddedScreen";
import {
  c,
  colorBlack,
  fs12,
  fs14,
  fw400,
  fw500,
  fw700,
  neurialGrotesk,
} from "@/utils/fontStyles";
import { Ionicons } from "@expo/vector-icons";
import { pages } from "@/constants/pages";
import { Href, router } from "expo-router";
import PageTitle from "@/components/shared/pageTitle";
import { useSession } from "@/contexts/userSignedInContext";
import { useSnackbar } from "@/contexts/snackbar.context";
import { homeImgs } from "@/constants/images/home";
import sharedImg from "@/constants/images/shared";
import PageNavigator from "@/components/account/pageNavigator";
import accountImgs from "@/constants/images/account";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import tw from "@/constants/tw";
import { setUserState } from "@/state/slices/user";
import { useStorageState } from "@/hooks/useStorageState";

export default function Account() {
  const { signIn, loadingState, userSession } = useSession();
  const { closeSnackbar, snackbarVisible, Snackbar } = useSnackbar();
  const { user, wallet } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const [[_, __], setSession] = useStorageState("user");
  const [[___, ____], setToken] = useStorageState("token");

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { code, loading, msg } = fetchState;

  const signOut = () => {
    setFetchState((prev) => ({ ...prev, loading: true }));

    dispatch(setUserState({ key: "user", value: null }));
    dispatch(setUserState({ key: "token", value: null }));
    setSession(null);
    setToken(null);

    setTimeout(() => {
      setFetchState((prev) => ({ ...prev, loading: false }));
      router.replace("/(auth)/signin" as Href);
    }, 1500);
  };

  return (
    <SafeScreen>
      <ScrollView style={[wHFull as ViewStyle, relative]}>
        <PaddedScreen>
          <PageTitle title="Account" />

          <View style={[wFull, flexCol, gap(32)]}>
            <TouchableOpacity
              onPress={() => router.push(`/(account)/profileInfo` as Href)}
              style={[wFull, flex, itemsCenter, justifyBetween]}
            >
              <View style={[flex, gap(14), itemsCenter, { flex: 0.8 }]}>
                <Image
                  source={{
                    uri: (user?.picture as string) || (user?.avatar as string),
                  }}
                  style={[image.w(60), image.h(60), image.rounded(60)]}
                />

                <View style={[flexCol, gap(16)]}>
                  <Text
                    style={[
                      c(Colors.light.darkGrey),
                      fs12,
                      fw400,
                      neurialGrotesk,
                    ]}
                  >
                    Welcome back
                  </Text>
                  <Text style={[colorBlack, fw700, fs14]}>
                    {user?.fullName}
                  </Text>
                </View>
              </View>

              <Ionicons
                style={[mr(16)] as TextStyle[]}
                name="chevron-forward"
                size={20}
                color={Colors.light.darkGrey}
              />
            </TouchableOpacity>

            {/* Wallet Block */}

            <View
              style={[
                wFull,
                flex,
                gap(10),
                justifyBetween,
                itemsCenter,
                bg("#EDEDFD"),
                rounded(10),
                h(94),
                py(17),
                px(9),
                {},
              ]}
            >
              <View style={[flexCol, gap(16), w(126), h(60)]}>
                <View style={[flex, itemsCenter, { gap: 16 }]}>
                  <Image
                    style={[image.w(19), image.h(18)]}
                    source={sharedImg.walletImage}
                  />

                  <Text
                    style={[
                      neurialGrotesk,
                      fs12,
                      c(Colors.light.darkGrey),
                      fw400,
                    ]}
                  >
                    wallet balance
                  </Text>
                </View>

                <Text style={[colorBlack, fw700, { fontSize: 22 }]}>
                   ₦{wallet?.balance || "0000.00"}
                </Text>
              </View>

              <TouchableOpacity>
                <View
                  style={[
                    flex,
                    itemsCenter,
                    justifyBetween,
                    w(124),
                    h(45),
                    px(16),
                    rounded(100),
                    bg(colors.white),
                    {
                      borderWidth: 0.7,
                      borderColor: "#D7D7D7",
                    },
                  ]}
                >
                  <View
                    style={[
                      w(24),
                      h(24),
                      rounded(1000),
                      border(0.7, Colors.light.darkGrey),
                      flex,
                      itemsCenter,
                      justifyCenter,
                    ]}
                  >
                    <Image
                      style={[image.w(19), image.h(19)]}
                      source={sharedImg.minusImage}
                    />
                  </View>
                  <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>
                    Top Up
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* //!Wallet Block */}

            <View style={[wFull, flexCol, gap(16), bg(colors.white), pb(80)]}>
              <PageNavigator
                title="My Vehicle"
                navigate
                page={`/(account)/myVehicle`}
                source={accountImgs.greyBgCar}
                imageStyle={[image.w(18), image.h(16.36)]}
              />

              <PageNavigator
                navigate
                title="Personal Documents"
                page={`/(account)/personalDocument`}
                source={accountImgs.personalDocument}
                imageStyle={[image.w(24), image.h(24)]}
              />

              <PageNavigator
                title="Account Security"
                navigate
                page={`/(account)/accountSecurity`}
                source={accountImgs.securityImg}
                imageStyle={[image.w(18), image.h(22)]}
              />

              <PageNavigator
                title="Bank Details"
                // navigate={false}
                // page={`/(account)/bankDetails`}
                page={`/(earnings)/`}
                source={accountImgs.paymentCard}
                imageStyle={[image.w(18), image.h(14)]}
              />

              <PageNavigator
                title="Earnings"
                page={`/(earnings)/`}
                navigate
                source={accountImgs.paymentCard}
                imageStyle={[image.w(18), image.h(14)]}
              />

              <PageNavigator
                title="Terms and Condition"
                navigate={false}
                page={`/(account)/termsAndCondition`}
                source={accountImgs.personalDocument}
                imageStyle={[image.w(18), image.h(19)]}
              />

              <PageNavigator
                title="Notifications"
                navigate
                page={`/(account)/notifications`}
                source={accountImgs.notificationImage}
                imageStyle={[image.w(18), image.h(19)]}
              />

              <PageNavigator
                navigate={false}
                title="Rate Us"
                source={accountImgs.rateStarImg}
                imageStyle={[image.w(18), image.h(17.13)]}
              />

              <PageNavigator
                title="Contact Support"
                navigate={false}
                page={`/(account)/contactSupport`}
                source={accountImgs.headPhoneImage}
                imageStyle={[image.w(18), image.h(14.73)]}
              />

              <PageNavigator
                navigate
                title="Notification messages"
                source={accountImgs.notificationImage}
                page={`/(account)/notificationsMessages`}
                imageStyle={[image.w(18), image.h(19)]}
              />

              {!loading ? (
                <Button
                  onPress={() => signOut()}
                  labelStyle={[neurialGrotesk, fs14, fw500]}
                  textColor={Colors.light.error}
                  style={[mb(20)]}
                >
                  Logout
                </Button>
              ) : (
                <ActivityIndicator
                  style={[mb(20)]}
                  color={Colors.light.background}
                  size={"small"}
                />
              )}

              <Snackbar
                msg={msg}
                onDismiss={() => closeSnackbar()}
                snackbarVisible={snackbarVisible}
              />
            </View>
            {/* //!Wallet Block */}
          </View>
        </PaddedScreen>
      </ScrollView>
    </SafeScreen>
  );
}
