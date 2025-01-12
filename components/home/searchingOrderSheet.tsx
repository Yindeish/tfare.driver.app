import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { Href, router } from "expo-router";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Pressable,
  Button,
  Dimensions,
} from "react-native";
import PaddedScreen from "../shared/paddedScreen";
import {
  absolute,
  bg,
  flex,
  flexCol,
  gap,
  h,
  hFull,
  itemsCenter,
  itemsEnd,
  itemsStart,
  justifyBetween,
  justifyCenter,
  justifyStart,
  left0,
  mLAuto,
  mRAuto,
  mXAuto,
  ml,
  mt,
  p,
  pLAuto,
  pXAuto,
  pb,
  pl,
  px,
  py,
  relative,
  right0,
  rounded,
  t,
  top0,
  w,
  wFull,
  wHFull,
  zIndex,
} from "@/utils/styles";
import { Text, Portal, Dialog, Paragraph } from "react-native-paper";
import {
  c,
  colorBlack,
  colorBlueBg,
  colorBorderGrey,
  colorWhite,
  fs12,
  fs14,
  fs16,
  fs18,
  fw400,
  fw500,
  fw700,
  neurialGrotesk,
} from "@/utils/fontStyles";
import { image } from "@/utils/imageStyles";
import sharedImg from "@/constants/images/shared";
import Colors from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { useStorageState } from "@/hooks/useStorageState";
import { useEffect, useState } from "react";
import FetchService from "@/services/api/fetch.service";
import { RootState } from "@/state/store";
import { setRideState } from "@/state/slices/ride";
import ScaleUpDown from "../shared/scale_animator";
import AcceptOrderSheet from "./acceptOrderSheet";

const SearchingOrder = () => {
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const [[isLoading, session], setSession] = useStorageState("token");
  const dispatch = useAppDispatch();
  const { pickupBusstopInput, dropoffBusstopInput } = useAppSelector(
    (state: RootState) => state.ride
  );

  // setTimeout(() => {
  //     // hideBottomSheet();
  //     // router.push(`/`)
  // }, 3000)

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
    ridersOffers: [],
  });
  const { code, msg, loading, ridersOffers } = fetchState;

  const getRidersOffers = async () => {
    setFetchState((prev) => ({ ...prev, loading: true, msg: "", code: null }));
    await FetchService.getWithBearerToken({
      url: `user/driver/me/ride/requests?pickupBusstopId=${pickupBusstopInput?._id}&dropoffBusstopId=${dropoffBusstopInput?._id}`,
      token: session as string,
    })
      .then(async (res) => {
        console.log({ res });

        const data = res?.body ? await res.body : res;
        const code = data?.code;
        const msg = data?.msg;
        const ridersOffers = data?.ridersOffers;

        setFetchState((prev) => ({ ...prev, loading: false, msg, code }));

        if (code && code == 200 && ridersOffers) {
          dispatch(setRideState({ key: "ridersOffers", value: ridersOffers }));
          setFetchState((prev) => ({
            ...prev,
            ridersOffers,
          }));
          dispatch(setRideState({key: 'currentRiderOfferIndex', value: 0}));
          showBottomSheet([400], <AcceptOrderSheet />)
        }
      })
      .catch((err) => console.log({ err }));
  };

  useEffect(() => {
    ridersOffers.length == 0 && getRidersOffers();
  }, [ridersOffers]);

  return (
    <PaddedScreen>
      <View style={[wHFull, flexCol, itemsCenter, gap(44)]}>
        <View style={[flexCol, itemsCenter, gap(16)]}>
          <View style={[flex, gap(16)]}>
            <Image
              style={[image.w(30), image.h(25.91)]}
              source={sharedImg.yellowTripImage}
            />

            <Text style={[neurialGrotesk, fw700, colorBlack, { fontSize: 22 }]}>
              Searching for Orders
            </Text>
          </View>

          <Text style={[c(Colors.light.darkGrey), neurialGrotesk, fw400, fs12]}>
            Searching for nearby available orders
          </Text>
        </View>

        <ScaleUpDown>
          <Image
            style={[image.w(120), image.h(120)]}
            source={sharedImg.searchingOrderImage}
          />
        </ScaleUpDown>
      </View>
    </PaddedScreen>
  );
};

export default SearchingOrder;
