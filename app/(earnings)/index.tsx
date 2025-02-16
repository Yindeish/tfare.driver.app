import {
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Platform,
  ViewStyle,
  RefreshControl,
} from "react-native";
import { ActivityIndicator, Button, Snackbar, Text } from "react-native-paper";
import React, { useEffect, useState } from "react";
import SafeScreen from "@/components/shared/safeScreen";
import { image, wHFull } from "@/utils/imageStyles";
import {
  bg,
  border,
  borderB,
  borderGrey,
  borderY,
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
  colordarkGrey,
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
import FetchService from "@/services/api/fetch.service";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import { setAccountState } from "@/state/slices/account";
import { setUserState } from "@/state/slices/user";

function Index() {
  const dispatch = useAppDispatch();
  const { token, wallet } = useAppSelector((state: RootState) => state.user);
  const {transactions} = useAppSelector((state: RootState) => state.account);

  const [fetchState, setFetchState] = useState({
    loading: false,
  });
  const { loading } = fetchState;

  const getUserTransactions = async () => {
    await FetchService.getWithBearerToken({
      url: `/user/me/transactions`,
      token: token as string,
    })
      .then(async (res: any) => {
        const data = res?.body ? await res.body : res;
        const code = data?.code;
        const msg = data?.msg;
        const transactions = data?.transactions;

        if (code && code == 200 && transactions) {
          dispatch(
            setAccountState({ key: "transactions", value: transactions })
          );
          setFetchState((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      })
      .catch((err) => {
        console.log({ err });
        setFetchState((prev) => ({
          ...prev,
          loading: false,
        }));
      });
  };

  const getUserWallet = async () => {
    setFetchState({ loading: true });
    const returnedData = await FetchService.getWithBearerToken({ url: '/user/me', token: token as string });

    const wallet = returnedData?.wallet;
    setFetchState({ loading: false });
    if (wallet) {
        console.log({wallet})
        
        dispatch(setUserState({
            key: 'wallet', value: wallet
        }))
    }
}

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long', // Full weekday (e.g., "Tuesday")
    day: 'numeric', // Numeric day
    month: 'long', // Full month (e.g., "December")
  };
  const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);

  // Add suffix to the day (st, nd, rd, th)
  const day = date.getDate();
  const suffix = (day: any) => {
    if (day > 3 && day < 21) return 'th'; // 11th, 12th, 13th...
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${formattedDate.replace(/\d+/, day + suffix(day))}`;
};

const formatTime = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // 12-hour clock format
  };
  return date.toLocaleTimeString('en-US', options);
};

  useEffect(() => {
    getUserWallet();
    getUserTransactions();
  }, []);

  return (
    <SafeScreen>
      <ScrollView 
      refreshControl={<RefreshControl refreshing={loading} onRefresh={() => {
        getUserWallet();
        getUserTransactions()
      }} />}
      style={[wHFull, relative] as ViewStyle[]}>
        <PaddedScreen>
          <PageTitle
            title="Earnings"
            onPress={() => router.push("/(home)/account")}
          />

          <View style={[wFull, flexCol, gap(32)]}>
            {/* //!Wallet Block */}
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

              <TouchableOpacity
                onPress={() => router.push("/(earnings)/withdraw")}
              >
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
                      rounded(24),
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

            <View style={[wFull, flexCol, gap(32)]}>
              {/* //!Header */}
              <View
                style={[
                  wFull,
                  flex,
                  justifyBetween,
                  itemsCenter,
                  borderB(0.7, Colors.light.border),
                  pb(16),
                ]}
              >
                <Text style={[fw400, fs14, colorBlack]}>This Month</Text>

                <View style={[flex, gap(10)]}>
                  <Text style={[fw400, fs12, colorBlack]}>
                    {/* In: {"₦ 200,000"} */}
                    In: 
                  </Text>
                  <Text style={[fw400, fs12, colorBlack]}>
                    {/* Out: {"₦ 75,000"} */}
                    Out: 
                  </Text>
                </View>
              </View>
              {/* //!Header */}

              <View style={[flexCol, gap(10)]}>
                {transactions.map((transaction, index) => (
                  <View
                    style={[
                      flexCol,
                      h("auto"),
                      gap(32),
                      borderB(0.7, Colors.light.border),
                      pb(16),
                    ]}
                    key={index}
                  >
                    <View style={[flex, itemsCenter, justifyBetween]}>
                      <Text style={[fw400, fs14, colorBlack]}>
                        {transaction?.meta_data?.originatorname}
                      </Text>
                      <Text style={[fw700, fs14, colorBlack]}>
                         ₦ {transaction?.data?.amount}
                      </Text>
                    </View>

                    <View style={[flex, itemsCenter, justifyBetween]}>
                      <Text style={[fw400, fs12, colordarkGrey]}>
                      {/* {(new Date()).getUTCDate()} */}
                        {/* 25mins drive | Tuesday, 5th December */}
                        {formatDate(transaction?.data?.created_at)}
                      </Text>
                      <Text style={[fw700, fs12, colordarkGrey]}>
                        {/*  {"09:53"} AM */}
                        {formatTime(transaction?.data?.created_at)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </PaddedScreen>
      </ScrollView>
    </SafeScreen>
  );
}

export default Index;
