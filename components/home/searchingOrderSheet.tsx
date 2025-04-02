import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { Href, router, usePathname } from "expo-router";
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
import { EQuery, IRequest, IRiderRideDetails } from "@/state/types/ride";
import tw from "@/constants/tw";
import ErrorMsg from "../shared/error_msg";
import { supabase } from "@/supabase/supabase.config";
import { RideConstants } from "@/constants/ride";
import { IUserAccount } from "@/state/types/account";

const SearchingOrder = () => {
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const { token } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const {
    pickupBusstopInput,
    dropoffBusstopInput,
    selectedRoute,
    allRequests,
    query
  } = useAppSelector((state: RootState) => state.ride);
  // const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);

  const path = usePathname();

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
      url: `/user/driver/me/ride/requests/${selectedRoute?._id}`,
      token: token as string,
    })
      .then(async (res) => {
        const data = res?.body ? await res.body : res;
        const code = data?.code;
        const msg = data?.msg;
        const ridersOffers = data?.todayRidersRides;

        setFetchState((prev) => ({ ...prev, loading: false, msg, code }));

        if (
          code &&
          code == 200 &&
          ridersOffers &&
          Number(ridersOffers?.length) > 0
        ) {
          dispatch(setRideState({ key: "ridersOffers", value: ridersOffers }));
          setFetchState((prev) => ({
            ...prev,
            ridersOffers,
          }));
          dispatch(setRideState({ key: "currentRiderOfferIndex", value: 1 }));
          // setQuery(RideConstants.query.accepting)
          dispatch(setRideState({key: 'query', value: RideConstants.query.accepting}))
          // showBottomSheet([400], <AcceptOrderSheet />, true);
        }
      })
      .catch((err) => {
        console.log({ err });

        setTimeout(() => router.back(), 1000);
      });
  };

  useEffect(() => {
    if(allRequests.length > 0) {
      // setQuery(RideConstants.query.accepting);
      dispatch(setRideState({key: 'query', value: RideConstants.query.accepting}));
      showBottomSheet([400], <AcceptOrderSheet />, true)
  }
    // else getRidersOffers();
  }, [router])

  // const channel = supabase.channel(`${RideConstants.channel.ride_requesting}${selectedRoute?._id}`);
  // channel
  //   .on(
  //     "broadcast",
  //     { event: RideConstants.event.ride_requested },
  //     (payload) => {
  //       console.log('====================================');
  //       console.log('RideConstants.event.ride_requested', '{ride: payload?.payload?.ride}', {path}, {query});
  //       console.log('====================================');
  //       // if (path == "/acceptRide" && query == RideConstants.query.searching) {
  //       if (path === "/acceptRide" && query === RideConstants.query.searching) { // testing
  //         console.log("I'm here")
  //         const ride = payload?.payload?.ride as (IRiderRideDetails & {rider: IUserAccount});

  //         const requestPresent = allRequests.find(
  //           (request) => String(request?._id) == String(ride?._id)
  //         );
          
  //         console.log('====================================');
  //         console.log({requestPresent}, {allRequests});
  //         console.log('====================================');

  //         if (requestPresent) {
  //           // setQuery(RideConstants.query.accepting);
  //           dispatch(setRideState({key: 'query', value: RideConstants.query.accepting}))
  //           showBottomSheet([400], <AcceptOrderSheet />, true)
  //           return;
  //         }

  //         const newRequest = {
  //           _id: ride?._id,
  //           number:  (Number(allRequests[allRequests.length - 1]?.number) || 0) +1,
  //           dropoffId: ride?.dropoffBusstop?._id,
  //           dropoffName: ride?.dropoffBusstop?.name,
  //           pickupId: ride?.pickupBusstop?._id,
  //           pickupName: ride?.pickupBusstop?.name,
  //           riderCounterOffer: ride?.riderCounterOffer,
  //           riderId: ride?.riderId,
  //           rideStatus: ride?.rideStatus,
  //           riderName: ride?.rider?.fullName,
  //           riderPhoneNo: ride?.rider?.phoneNo,
  //           riderPicture: ride?.rider?.picture || ride?.rider?.avatar,
  //           shown: false,
  //           zIndex:
  //             (Number(allRequests[allRequests.length - 1]?.zIndex) || 10000) +
  //             1,
  //         };

  //         const requests = [...allRequests, newRequest];

  //         dispatch(setRideState({ key: "allRequests", value: requests }));

  //         const newUnAcceptedRequests = requests.filter((request) => (request?.rideStatus == 'pending' || request?.rideStatus == 'requesting'));

  //         dispatch(setRideState({key: 'unAcceptedRequests', value: newUnAcceptedRequests}));
  //         console.log('surving here!')

  //         // setQuery(RideConstants.query.accepting);
  //         dispatch(setRideState({key: 'query', value: RideConstants.query.accepting}))
  //         showBottomSheet([400], <AcceptOrderSheet />, true)
  //         console.log('surving here too!')

  //         // getRidersOffers(); // let's try just the real time data for now.
  //       }
  //     }
  //   )
  //   .subscribe();

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

        <View style={tw`w-full flex flex-row justify-center`}>
          {code !== 200 && <ErrorMsg msg={msg} />}
        </View>
      </View>
    </PaddedScreen>
  );
};

export default SearchingOrder;
