import Colors, { colors } from "@/constants/Colors";
import { fonts } from "@/constants/fonts";
import accountImgs from "@/constants/images/account";
import { homeImgs } from "@/constants/images/home";
import sharedImg from "@/constants/images/shared";
import tripImgs from "@/constants/images/trip";
import {
  c,
  colorBlack,
  fs12,
  fs14,
  fw400,
  fw500,
  fw700,
} from "@/utils/fontStyles";
import {
  bg,
  borderB,
  borderGrey,
  flex,
  flexCol,
  gap,
  h,
  hFull,
  itemsCenter,
  justifyBetween,
  justifyCenter,
  justifyStart,
  mb,
  mt,
  pb,
  pt,
  px,
  py,
  rounded,
  w,
  wFull,
} from "@/utils/styles";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { Text } from "react-native-paper";
import PaddedScreen from "../shared/paddedScreen";
import { image } from "@/utils/imageStyles";
import CtaBtn from "../shared/ctaBtn";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import TicketOtpSheet from "./ticketOtpSheet";
import { router, usePathname } from "expo-router";
import ArrivedPickupSheet from "./arrivedPickupSheet";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { setRideState } from "@/state/slices/ride";
import { RootState } from "@/state/store";
import { useEffect, useState } from "react";
import { EQuery, IRequest, IRiderRideDetails } from "@/state/types/ride";
import FetchService from "@/services/api/fetch.service";
import { useStorageState } from "@/hooks/useStorageState";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import tw from "@/constants/tw";
import { useSnackbar } from "@/contexts/snackbar.context";
import { RideConstants } from "@/constants/ride";
import { supabase } from "@/supabase/supabase.config";
import { Swiper } from "../shared/swiper";
import { useTooltip } from "@/contexts/use-tooltip";
import { useCountdown } from "@/contexts/useCountdown";
// import { useTooltip } from "@/hooks/useTooltip";

function AcceptOrderSheet() {
  const dispatch = useAppDispatch()
  const { showBottomSheet, hideBottomSheet } = useBottomSheet()
  const { token } = useAppSelector((state: RootState) => state.user)
  const { ridersOffers, currentRiderOfferIndex, ridesAccepted, unAcceptedRequests } = useAppSelector((state: RootState) => state.ride)
  const { selectedRoute, allRequests } = useAppSelector((state: RootState) => state.ride)
  const { Snackbar, snackbarVisible, notify, closeSnackbar } = useSnackbar()
  const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query)
  const { showTooltip, hideTooltip } = useTooltip()
  const { seconds, restart, reset, start } = useCountdown({})

  const path = usePathname()

  const { width } = Dimensions.get("window")

  const [fetchState, setFetchState] = useState<{
    loading: "idle" | "loading-requests" | "accepting" | "declining"
    msg: string
    code: number | null
  }>({
    loading: "idle",
    msg: "",
    code: null,
  })
  const { code, msg, loading } = fetchState


  const currentUnacceptedRequest = unAcceptedRequests[Number(currentRiderOfferIndex)]

  const acceptOffer = async (requestId: string) => {
    showTooltip()
    setFetchState((prev) => ({
      ...prev,
      loading: "accepting",
      msg: "",
      code: null,
    }))
    await FetchService.postWithBearerToken({
      url: `/user/driver/me/ride/accept-ride/${selectedRoute?._id}`,
      data: {
        riderRideId: requestId,
      },
      token: token as string,
    })
      .then(async (res) => {
        const data = res?.body ? await res.body : res
        const code = data?.code
        const msg = data?.msg
        const riderRideAccepted: IRiderRideDetails | null = data?.riderRideAccepted || data?.rideAlreadyAccepted
        const currentRide = data?.currentRideSaved || data?.existingCurrentRideSaved || data?.currentRide
        console.log({ currentRide })

        setFetchState((prev) => ({ ...prev, loading: "idle", msg, code }))

        if (code && (code == 200 || code == 201) && riderRideAccepted && currentRide) {
          // const rideSaved = ridesAccepted.find(
          //   (ride) => ride._id == riderRideAccepted?._id
          // );
          // if (!rideSaved) {
          //   dispatch(
          //     setRideState({
          //       key: "ridesAccepted",
          //       value: [...ridesAccepted, riderRideAccepted],
          //     })
          //   );
          //   setFetchState((prev) => ({
          //     ...prev,
          //     ridersOffers,
          //   }));

          //   dispatch(setRideState({ key: "currentRide", value: currentRide }));

          //   // if (ridersOffers.length > Number(currentRiderOfferIndex)) {
          //   if (Number(allRequests.length) < Number(currentRiderOfferIndex)) {
          //     dispatch(
          //       setRideState({ key: "currentRiderOfferIndex", value: 1 })
          //     );
          //   } else {
          //     dispatch(
          //       setRideState({
          //         key: "currentRiderOfferIndex",
          //         value: Number(currentRiderOfferIndex) + 1,
          //       })
          //     );
          //     // dispatch(
          //     //   setRideState({
          //     //     key: "rideAcceptStage",
          //     //     value: EQuery.arrived_pickup,
          //     //   })
          //     // );
          //     // showBottomSheet([500, 600], <ArrivedPickupSheet />);
          //   }
          // }
          const requests = allRequests.map((request) => {
            if (request?._id == riderRideAccepted?._id) {
              return {
                ...request,
                rideStatus: riderRideAccepted?.rideStatus || "accepted",
              }
            }
            return request
          })
          dispatch(setRideState({ key: "allRequests", value: requests }))

          if (requests.length == 1) {
            dispatch(
              setRideState({
                key: "currentRequest",
                value: requests[0],
              }),
            )
            dispatch(
              setRideState({
                key: "rideAcceptStage",
                value: EQuery.arrived_pickup,
              }),
            )
            showBottomSheet([350, 400], <ArrivedPickupSheet />)
          }

          dispatch(
            setRideState({
              key: "currentRiderOfferIndex",
              value:
                currentRiderOfferIndex == allRequests.length - 1
                  ? 0
                  : Math.min(Number(currentRiderOfferIndex) + 1, allRequests.length - 1),
            }),
          )
        }
      })
      .catch((err) => {
        console.log({ err })

        setTimeout(() => router.back(), 1000)
      })
  }

  const cancelOffer = () => {
    hideBottomSheet()
    dispatch(setRideState({ key: "selectedRoute", value: null }))
    dispatch(setRideState({ key: "driverEligible", value: false }))
    dispatch(setRideState({ key: "driverOnline", value: false }))
    dispatch(setRideState({ key: "dropoffBusstopInput", value: null }))
    dispatch(setRideState({ key: "pickupBusstopInput", value: null }))
    dispatch(setRideState({ key: "ridersOffers", value: [] }))
    router.push(`/(home)`)
  }

  const getRidersOffers = async () => {
    setFetchState((prev) => ({ ...prev, loading: "loading-requests" }))
    await FetchService.getWithBearerToken({
      url: `/user/driver/me/ride/requests/${selectedRoute?._id}`,
      token: token as string,
    })
      .then(async (res) => {
        setFetchState((prev) => ({ ...prev, loading: "idle" }))

        const data = res?.body ? await res.body : res
        const code = data?.code
        const msg = data?.msg
        const ridersOffers = data?.todayRidersRides
        console.log({
          ridersOffers1: ridersOffers[0]?._doc,
          "ridersOffers[0]?.ridr": ridersOffers[0]?.rider,
        })

        if (code && code == 200 && ridersOffers && Number(ridersOffers?.length) > 0) {
          dispatch(setRideState({ key: "ridersOffers", value: ridersOffers }))
          setFetchState((prev) => ({
            ...prev,
            ridersOffers,
          }))
          dispatch(setRideState({ key: "currentRiderOfferIndex", value: 0 }))
        }
      })
      .catch((err) => {
        setFetchState((prev) => ({ ...prev, loading: "idle" }))
        console.log({ err })
      })
  }

  const channel = supabase.channel(RideConstants.channel.ride_requesting)

  useEffect(() => {
    if (allRequests.length == 0) setQuery(RideConstants.query.searching)
  }, [allRequests.length])

  // useEffect(() => {
  //   setUnAcceptedRequests(
  //     allRequests.filter((req) => {
  //       return req?.rideStatus === "pending" || req?.rideStatus == "requesting"
  //     }),
  //   )
  // }, [allRequests])

  // useEffect(() => {
  //   if (seconds == 0 && Number(unAcceptedRequests.length) > 1) {
  //     console.log({ unaccepReq: unAcceptedRequests.length, seconds })
  //     restart()
  //     start()

  //     dispatch(
  //       setRideState({
  //         key: "currentRiderOfferIndex",
  //         value: Number(currentRiderOfferIndex) >= unAcceptedRequests.length - 1 ? 0 : Number(currentRiderOfferIndex) + 1,
  //       }),
  //     )
  //   }
  // }, [seconds, unAcceptedRequests.length])

  channel
    .on("broadcast", { event: RideConstants.event.ride_requested }, (payload) => {
      console.log("====================================")
      console.log("RideConstants.event.ride_requested", payload?.payload?.ride, path, query)
      console.log("====================================")

      if (path == "/acceptRide" && query == EQuery.accepting) {
        const ride = payload?.payload?.ride as IRiderRideDetails
        console.log("ride: ", ride)

        if (!allRequests) return // Ensure allRequests is defined

        const requestPresent = allRequests.find((request) => String(request?._id) === String(ride?._id))

        const newRequest = {
          _id: ride?._id,
          dropoffId: ride?.dropoffBusstop?._id,
          dropoffName: ride?.dropoffBusstop?.name,
          pickupId: ride?.pickupBusstop?._id,
          pickupName: ride?.pickupBusstop?.name,
          riderCounterOffer: ride?.riderCounterOffer,
          riderId: ride?.riderId,
          rideStatus: ride?.rideStatus,
          riderName: ride?.rider?.fullName,
          riderPicture: ride?.rider?.picture,
        }

        if (!requestPresent) {
          const requests = [...allRequests, newRequest] // Append ride correctly
          dispatch(setRideState({ key: "allRequests", value: requests }));

          const newUnAcceptedRequests = requests.map((request) => (request?.rideStatus == 'pending' || request?.rideStatus == 'requesting'));

          dispatch(setRideState({key: 'unAcceptedRequests', value: newUnAcceptedRequests}));

          if (seconds == 0 && Number(newUnAcceptedRequests.length) > 1) {
            console.log('seconds == 0 && Number(newUnAcceptedRequests.length) > 1')
            reset()
            restart()
            start()
          }

          dispatch(
            setRideState({
              key: "currentRiderOfferIndex",
              value: Number(currentRiderOfferIndex) >= unAcceptedRequests.length ? 0 : Number(currentRiderOfferIndex) + 1,
            }),
          )
        }
      }
    })
    .subscribe()

  return (
    <PaddedScreen>
      <View style={tw`w-full h-full`}>
        <View>
          <View
            style={[
              flexCol,
              bg(colors.white),
              h(205),
              gap(32),
              mt(40),
              mb(20),
              // w(width * 0.9),
              tw`w-full h-full mr-2`,
            ]}
          >
            {/* //!Rider Details Block */}
            <TouchableOpacity
              onPress={() => {
                dispatch(
                  setRideState({
                    key: "currentRequest",
                    value: currentUnacceptedRequest,
                  }),
                )
                dispatch(
                  setRideState({
                    key: "rideAcceptStage",
                    value: EQuery.arrived_pickup,
                  }),
                )
                showBottomSheet([350, 400], <ArrivedPickupSheet />)
              }}
              style={[wFull, flex, justifyBetween, itemsCenter, { height: 61 }]}
            >
              <View style={[flex, justifyBetween, { gap: 14 }]}>
                <View>
                  <Image
                    style={[{ width: 60, height: 60, objectFit: "cover" }, tw`rounded-full`]}
                    source={{
                      uri: currentUnacceptedRequest?.riderPicture as string,
                    }}
                  />
                </View>

                <View style={[hFull, flexCol, justifyCenter, gap(12)]}>
                  <Text style={[c(colors.black), fw700, fs14]}>{currentUnacceptedRequest?.riderName}</Text>
                  {/* <Text style={[c(Colors.light.darkGrey), fw400, fs12]}>{'5 min'} away</Text> */}
                  {/* <Text style={[c(Colors.light.darkGrey), fw400, fs12]}>
                  {"some mins"} away
                </Text> */}
                  <Text style={[c(Colors.light.darkGrey), fw400, fs12]}>
                    {"some mins"} {currentUnacceptedRequest?._id?.slice(0, 7)} {`index ${currentRiderOfferIndex}`} away
                  </Text>
                </View>
              </View>

              <TouchableOpacity>
                <Text style={[fw500, fs14, colorBlack]}>₦ {currentUnacceptedRequest?.riderCounterOffer}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
            {/* //!Rider Details Block */}

            {/* //!Pick up-Drop off Block */}
            <View
              style={[
                wFull,
                h(112),
                flexCol,
                pt(16),
                px(32),
                borderGrey(0.7),
                bg(colors.white),
                rounded(10),
                gap(10),
                { shadowColor: colors.black, shadowRadius: 10 },
              ]}
            >
              {/* //!Pick up Block */}
              <View
                style={[wFull, flex, gap(16), itemsCenter, justifyStart, borderB(0.7, Colors.light.border), pb(16)]}
              >
                <Image style={[image.w(14), image.h(20)]} source={tripImgs.greenBgLocation} />
                <Text style={[fw500, fs14, colorBlack]}>{currentUnacceptedRequest?.pickupName}</Text>
              </View>
              {/* //!Pick up Block */}

              {/* //!Drop off Block */}
              <View style={[wFull, flex, gap(16), itemsCenter, justifyStart]}>
                <Image style={[image.w(14), image.h(20)]} source={tripImgs.redBgLocation} />
                <Text style={[fw500, fs14, colorBlack]}>{currentUnacceptedRequest?.dropoffName}</Text>
              </View>
              {/* //!Drop off Block */}
            </View>
            {/* //!Pick up-Drop off Block */}

            {/* //!Accept-Decline Order CTA */}
            <View style={[flex, gap(16), justifyBetween]}>
              {loading === "accepting" ? (
                <ActivityIndicator />
              ) : (
                <CtaBtn
                  img={{ src: sharedImg.proceedIcon, w: 20, h: 20 }}
                  // onPress={() => riderOffer?.rideStatus === 'accepted'? {} :acceptOffer(riderOffer?._id)}
                  onPress={() => acceptOffer(currentUnacceptedRequest?._id)}
                  text={{ name: "Accept", color: colors.white }}
                  bg={{ color: Colors.light.background }}
                  // style={{ baseContainer: { ...w("48%"), opacity: riderOffer?.rideStatus === 'accepted'?0.5:1 } }}
                  style={{ baseContainer: { ...w("48%") } }}
                />
              )}
              {loading === "declining" ? (
                <ActivityIndicator />
              ) : (
                <CtaBtn
                  img={{ src: sharedImg.cancelImage, w: 20, h: 20 }}
                  onPress={() => cancelOffer()}
                  text={{ name: "Decline", color: Colors.light.darkGrey }}
                  bg={{ color: "#F9F7F8", borderColor: Colors.light.border }}
                  style={{ baseContainer: { ...w("48%") } }}
                />
              )}
            </View>
            {/* //!Accept-Decline Order CTA */}
          </View>
        </View>

        <Snackbar msg={msg} onDismiss={() => closeSnackbar()} snackbarVisible={snackbarVisible} />
      </View>
    </PaddedScreen>
  )
}

export default AcceptOrderSheet;

//  {/* <ScrollView horizontal={true} style={tw`w-auto h-full flex flex-row gap-1`}>
//           {/* {ridersOffers.map((riderOffer, index) => ( */}
//           {allRequests.map((request, index) => (
//             <View
//               style={[
//                 flexCol,
//                 bg(colors.white),
//                 h(205),
//                 gap(32),
//                 mt(40),
//                 mb(20),
//                 w(width * 0.9),
//                 tw`h-full mr-2`,
//               ]}
//               key={index}
//             >
//               {/* //!Rider Details Block */}
//               <TouchableOpacity
//               onPress={() => {
//                 dispatch(setRideState({key:'currentRequest', value: request}))
//                 dispatch(
//                     setRideState({
//                       key: "rideAcceptStage",
//                       value: EQuery.arrived_pickup,
//                     })
//                   );
//                   showBottomSheet([350, 400], <ArrivedPickupSheet />);
//               }}
//                 style={[
//                   wFull,
//                   flex,
//                   justifyBetween,
//                   itemsCenter,
//                   { height: 61 },
//                 ]}
//               >
//                 <View style={[flex, justifyBetween, { gap: 14 }]}>
//                   <View>
//                     <Image
//                       style={[{ width: 60, height: 60, objectFit: "cover", }, tw `rounded-full`]}
//                       source={{uri: request?.riderPicture as string }}
//                     />
//                   </View>

//                   <View style={[hFull, flexCol, justifyCenter, gap(12)]}>
//                     <Text style={[c(colors.black), fw700, fs14]}>
//                       {
//                         request?.riderName
//                       }
//                     </Text>
//                     {/* <Text style={[c(Colors.light.darkGrey), fw400, fs12]}>{'5 min'} away</Text> */}
//                     <Text style={[c(Colors.light.darkGrey), fw400, fs12]}>
//                       {"some mins"} away
//                     </Text>
//                   </View>
//                 </View>

//                 <TouchableOpacity>
//                   <Text style={[fw500, fs14, colorBlack]}>
//                     ₦{" "}
//                     {
//                       request
//                         ?.riderCounterOffer
//                     }
//                   </Text>
//                 </TouchableOpacity>
//               </TouchableOpacity>
//               {/* //!Rider Details Block */}

//               {/* //!Pick up-Drop off Block */}
//               <View
//                 style={[
//                   wFull,
//                   h(112),
//                   flexCol,
//                   pt(16),
//                   px(32),
//                   borderGrey(0.7),
//                   bg(colors.white),
//                   rounded(10),
//                   gap(10),
//                   { shadowColor: colors.black, shadowRadius: 10 },
//                 ]}
//               >
//                 {/* //!Pick up Block */}
//                 <View
//                   style={[
//                     wFull,
//                     flex,
//                     gap(16),
//                     itemsCenter,
//                     justifyStart,
//                     borderB(0.7, Colors.light.border),
//                     pb(16),
//                   ]}
//                 >
//                   <Image
//                     style={[image.w(14), image.h(20)]}
//                     source={tripImgs.greenBgLocation}
//                   />
//                   <Text style={[fw500, fs14, colorBlack]}>
//                     {
//                       request
//                         ?.pickupName
//                     }
//                   </Text>
//                 </View>
//                 {/* //!Pick up Block */}

//                 {/* //!Drop off Block */}
//                 <View style={[wFull, flex, gap(16), itemsCenter, justifyStart]}>
//                   <Image
//                     style={[image.w(14), image.h(20)]}
//                     source={tripImgs.redBgLocation}
//                   />
//                   <Text style={[fw500, fs14, colorBlack]}>
//                     {
//                       request?.dropoffName
//                     }
//                   </Text>
//                 </View>
//                 {/* //!Drop off Block */}
//               </View>
//               {/* //!Pick up-Drop off Block */}

//               {/* //!Accept-Decline Order CTA */}
//               <View style={[flex, gap(16), justifyBetween]}>
//                 {loading === "accepting" ? (
//                   <ActivityIndicator />
//                 ) : (
//                   <CtaBtn
//                     img={{ src: sharedImg.proceedIcon, w: 20, h: 20 }}
//                     // onPress={() => riderOffer?.rideStatus === 'accepted'? {} :acceptOffer(riderOffer?._id)}
//                     onPress={() => acceptOffer(request?._id)}
//                     text={{ name: "Accept", color: colors.white }}
//                     bg={{ color: Colors.light.background }}
//                     // style={{ baseContainer: { ...w("48%"), opacity: riderOffer?.rideStatus === 'accepted'?0.5:1 } }}
//                     style={{ baseContainer: { ...w("48%")} }}
//                   />
//                 )}
//                 {loading === "declining" ? (
//                   <ActivityIndicator />
//                 ) : (
//                   <CtaBtn
//                     img={{ src: sharedImg.cancelImage, w: 20, h: 20 }}
//                     onPress={() => cancelOffer()}
//                     text={{ name: "Decline", color: Colors.light.darkGrey }}
//                     bg={{ color: "#F9F7F8", borderColor: Colors.light.border }}
//                     style={{ baseContainer: { ...w("48%") } }}
//                   />
//                 )}
//               </View>
//               {/* //!Accept-Decline Order CTA */}
//             </View>
//           ))}
//         </ScrollView>

// {/* <Swiper
//           slides={allRequests}
//           SlideComponent={({ slide }) => (
//             <View
//               style={[
//                 flexCol,
//                 bg(colors.white),
//                 h(205),
//                 gap(32),
//                 mt(40),
//                 mb(20),
//                 // w(width * 0.9),
//                 tw`w-full h-full mr-2`,
//               ]}
//             >
//               {/* //!Rider Details Block */}
//               <TouchableOpacity
//                 onPress={() => {
//                   dispatch(
//                     setRideState({ key: "currentRequest", value: slide })
//                   );
//                   dispatch(
//                     setRideState({
//                       key: "rideAcceptStage",
//                       value: EQuery.arrived_pickup,
//                     })
//                   );
//                   showBottomSheet([350, 400], <ArrivedPickupSheet />);
//                 }}
//                 style={[
//                   wFull,
//                   flex,
//                   justifyBetween,
//                   itemsCenter,
//                   { height: 61 },
//                 ]}
//               >
//                 <View style={[flex, justifyBetween, { gap: 14 }]}>
//                   <View>
//                     <Image
//                       style={[
//                         { width: 60, height: 60, objectFit: "cover" },
//                         tw`rounded-full`,
//                       ]}
//                       source={{ uri: currentUnacceptedRequest?.riderPicture as string }}
//                     />
//                   </View>

//                   <View style={[hFull, flexCol, justifyCenter, gap(12)]}>
//                     <Text style={[c(colors.black), fw700, fs14]}>
//                       {currentUnacceptedRequest?.riderName}
//                     </Text>
//                     {/* <Text style={[c(Colors.light.darkGrey), fw400, fs12]}>{'5 min'} away</Text> */}
//                     {/* <Text style={[c(Colors.light.darkGrey), fw400, fs12]}>
//                   {"some mins"} away
//                 </Text> */}
//                     <Text style={[c(Colors.light.darkGrey), fw400, fs12]}>
//                       {"some mins"}{" "}
//                       {currentUnacceptedRequest?._id?.slice(
//                         0,
//                         7
//                       )}{" "}
//                       {`index ${currentRiderOfferIndex}`} away
//                     </Text>
//                   </View>
//                 </View>

//                 <TouchableOpacity>
//                   <Text style={[fw500, fs14, colorBlack]}>
//                     ₦ {slide?.riderCounterOffer}
//                   </Text>
//                 </TouchableOpacity>
//               </TouchableOpacity>
//               {/* //!Rider Details Block */}

//               {/* //!Pick up-Drop off Block */}
//               <View
//                 style={[
//                   wFull,
//                   h(112),
//                   flexCol,
//                   pt(16),
//                   px(32),
//                   borderGrey(0.7),
//                   bg(colors.white),
//                   rounded(10),
//                   gap(10),
//                   { shadowColor: colors.black, shadowRadius: 10 },
//                 ]}
//               >
//                 {/* //!Pick up Block */}
//                 <View
//                   style={[
//                     wFull,
//                     flex,
//                     gap(16),
//                     itemsCenter,
//                     justifyStart,
//                     borderB(0.7, Colors.light.border),
//                     pb(16),
//                   ]}
//                 >
//                   <Image
//                     style={[image.w(14), image.h(20)]}
//                     source={tripImgs.greenBgLocation}
//                   />
//                   <Text style={[fw500, fs14, colorBlack]}>
//                     {currentUnacceptedRequest?.pickupName}
//                   </Text>
//                 </View>
//                 {/* //!Pick up Block */}

//                 {/* //!Drop off Block */}
//                 <View style={[wFull, flex, gap(16), itemsCenter, justifyStart]}>
//                   <Image
//                     style={[image.w(14), image.h(20)]}
//                     source={tripImgs.redBgLocation}
//                   />
//                   <Text style={[fw500, fs14, colorBlack]}>
//                     {currentUnacceptedRequest?.dropoffName}
//                   </Text>
//                 </View>
//                 {/* //!Drop off Block */}
//               </View>
//               {/* //!Pick up-Drop off Block */}

//               {/* //!Accept-Decline Order CTA */}
//               <View style={[flex, gap(16), justifyBetween]}>
//                 {loading === "accepting" ? (
//                   <ActivityIndicator />
//                 ) : (
//                   <CtaBtn
//                     img={{ src: sharedImg.proceedIcon, w: 20, h: 20 }}
//                     // onPress={() => riderOffer?.rideStatus === 'accepted'? {} :acceptOffer(riderOffer?._id)}
//                     onPress={() =>
//                       acceptOffer(
//                         currentUnacceptedRequest?._id
//                       )
//                     }
//                     text={{ name: "Accept", color: colors.white }}
//                     bg={{ color: Colors.light.background }}
//                     // style={{ baseContainer: { ...w("48%"), opacity: riderOffer?.rideStatus === 'accepted'?0.5:1 } }}
//                     style={{ baseContainer: { ...w("48%") } }}
//                   />
//                 )}
//                 {loading === "declining" ? (
//                   <ActivityIndicator />
//                 ) : (
//                   <CtaBtn
//                     img={{ src: sharedImg.cancelImage, w: 20, h: 20 }}
//                     onPress={() => cancelOffer()}
//                     text={{ name: "Decline", color: Colors.light.darkGrey }}
//                     bg={{ color: "#F9F7F8", borderColor: Colors.light.border }}
//                     style={{ baseContainer: { ...w("48%") } }}
//                   />
//                 )}
//               </View>
//               {/* //!Accept-Decline Order CTA */}
//             </View>
//           )}
//         /> */}
