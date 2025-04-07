import InTripDropffTile from "@/components/home/inTripDropoffTile";
import CtaBtn from "@/components/shared/ctaBtn";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import { useTooltip } from "@/components/shared/tooltip";
import Colors, { colors } from "@/constants/Colors";
import { homeImgs } from "@/constants/images/home";
import sharedImg from "@/constants/images/shared";
import { images } from "@/constants/images/splash";
import tripImgs from "@/constants/images/trip";
import FetchService from "@/services/api/fetch.service";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { setRideState } from "@/state/slices/ride";
import { setTripState } from "@/state/slices/trip";
import { RootState } from "@/state/store";
import { Utils } from "@/utils";
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
import { image, wHFull } from "@/utils/imageStyles";
import {
  absolute,
  bg,
  borderB,
  borderGrey,
  borderY,
  flex,
  flexCol,
  gap,
  itemsCenter,
  justifyBetween,
  justifyEnd,
  mb,
  ml,
  mr,
  mt,
  p,
  pb,
  px,
  py,
  r,
  relative,
  rounded,
  t,
} from "@/utils/styles";
import { Href, router, useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "react-native-paper";

function TripDetails() {
  const { currentPresetTrip, currentUpcomingTrip } = useAppSelector((state: RootState) => state.trip);
  const { id } = useGlobalSearchParams();
  const { token } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const {setTooltipState} = useTooltip()

  const [showCustomize, setShowCustomize] = useState(currentPresetTrip?.driverId);
  const [disabled, setDisabled] = useState(!showCustomize && Number(currentUpcomingTrip?.ridersRides?.length) > 0);
  const trip = currentPresetTrip || currentUpcomingTrip;
  const route = currentPresetTrip?.route || currentUpcomingTrip?.route;

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { code, msg, loading } = fetchState;

  const getRouteDetails = async () => {
    setFetchState((prev) => ({ ...prev, loading: true, msg: "", code: null }));
    await FetchService.getWithBearerToken({
      url: `/ride/route/${id}`,
      token: token as string,
    })
      .then(async (res) => {
        const data = res?.body ? await res.body : res;
        const code = data?.code;
        const msg = data?.msg;
        const routeDetails = data?.route;

        setFetchState((prev) => ({ ...prev, loading: false, msg, code }));

        if (code && code == 200 && routeDetails) {
          dispatch(setRideState({ key: "selectedRoute", value: routeDetails }));
          setFetchState((prev) => ({
            ...prev,
          }));
        }
      })
      .catch((err) => console.log({ err }))
      .finally(() => {
        setFetchState((prev) => ({ ...prev, loading: false }));
      });
  };

  const deleteTrip = async () => {
    setFetchState((prev) => ({ ...prev, loading: true, msg: "", code: null }));
    await FetchService.deleteWithBearerToken({
      url: `user/driver/me/trip/${currentPresetTrip?._id}/delete`,
      token: token as string,
    })
      .then(async (res) => {
        const data = res?.body ? await res.body : res;
        const code = data?.code;
        const msg = data?.msg;

        setTooltipState({key:'visible', value: true});
        setTooltipState({key:'message', value: msg});

        setFetchState((prev) => ({ ...prev, loading: false, msg, code }));

        if (code && (code == 201 || code == 200)) {
          router.push("/(home)/trip" as Href);
        }
      })
      .catch((err) => console.log({ err }))
      .finally(() => {
        setFetchState((prev) => ({ ...prev, loading: false }));
      });
  };

  // Mounting the inputs
    useEffect(() => {
      dispatch(
        setTripState({
          key: "pickupBusstopInput",
          value: currentPresetTrip?.route?.pickupBusstop,
        })
      );
      dispatch(
        setTripState({
          key: "dropoffBusstopInput",
          value: currentPresetTrip?.route?.dropoffBusstop,
        })
      );
      dispatch(
        setTripState({
          key: "intripDropoffsInput",
          value: currentPresetTrip?.route?.inTripDropoffs.map(
            (dropoff, index) => ({ ...dropoff, number: index + 1 })
          ),
        })
      );
    }, []);
    // Mounting the inputs

  return (
    <SafeScreen>
      <ScrollView
        // refreshControl={
        //   <RefreshControl onRefresh={getRouteDetails} refreshing={loading} />
        // }
      >
        <View style={[wHFull as ViewStyle, relative, pb(150)]}>
          {/* //!Page Header */}
          <PaddedScreen>
            <View style={[flex, itemsCenter, justifyBetween, mb(10)]}>
              {/* //!Page Title */}
              <PageTitle title="Trip Details" backBtnColor={colors.grey600} />
              {/* //!Page Title */}

              {/* //!Edit-Delete CTAs */}
              {!showCustomize && ( //testing
                <View style={[absolute, t(47), r(0), flex, gap(10)]}>
                  <TouchableOpacity
                    style={[
                      bg("#F9F7F8"),
                      borderGrey(0.7),
                      gap(16),
                      rounded(10),
                      py(10),
                      px(16),
                      flex,
                      itemsCenter,
                      gap(16),
                      { opacity: disabled ? 0.3 : 1 },
                    ]}
                    onPress={() => {
                      router.push("/(trip)/customizeTrip" as Href);
                    }}
                  >
                    <Image
                      style={[image.w(24), image.h(24)]}
                      source={sharedImg.editBtn2}
                    />

                    <Text style={[fs12, fw500, neurialGrotesk, colorBlack]}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={deleteTrip}
                    style={[
                      bg("#F9F7F8"),
                      borderGrey(0.7),
                      gap(16),
                      rounded(10),
                      py(10),
                      px(16),
                      flex,
                      itemsCenter,
                      { opacity: disabled ? 0.3 : 1 },
                    ]}
                  >
                   {!loading ? (<Image
                      style={[image.w(24), image.h(24)]}
                      source={tripImgs.redBgDeleteBtn}
                    />) : (<ActivityIndicator color={'#CF0707'} size={'small'} />)}
                  </TouchableOpacity>
                </View>
              )}
              {/* //!Edit-Delete CTAs */}

              {/* //!Customize CTA */}
              {showCustomize && ( //testing
                <TouchableOpacity
                  onPress={() => router.push("/(trip)/customizeTrip" as Href)}
                  style={[
                    bg("#F9F7F8"),
                    borderGrey(0.7),
                    gap(16),
                    rounded(10),
                    py(10),
                    px(16),
                    flex,
                    itemsCenter,
                    gap(16),
                    absolute,
                    t(47),
                    r(0),
                  ]}
                >
                  <Image
                    style={[image.w(24), image.h(24)]}
                    source={sharedImg.editBtn2}
                  />

                  <Text style={[fs12, fw500, neurialGrotesk, colorBlack]}>
                    Customize
                  </Text>
                </TouchableOpacity>
              )}
              {/* //!Customize CTA */}
            </View>
          </PaddedScreen>
          {/* //!Page Header */}

          {/* //!Trip Block */}
          <View
            style={[
              flexCol,
              gap(32),
              bg("#FFF7E6"),
              borderY(0.7, Colors.light.border),
              py(15),
              px(20),
            ]}
          >
            {/* //!Startoff-Endpoint Block */}
            <View style={[flex, itemsCenter, justifyBetween]}>
              <View style={[flexCol, gap(8)]}>
                <View style={[flex, gap(8)]}>
                  <Image
                    style={[image.w(14), image.h(20)]}
                    source={tripImgs.greenBgLocation}
                  />
                  <Text
                    style={[
                      neurialGrotesk,
                      fw400,
                      fs12,
                      c(Colors.light.darkGrey),
                    ]}
                  >
                    Startoff
                  </Text>
                </View>
                <Text style={[fw700, fs14, c(colors.black)]}>
                  {route?.pickupBusstop?.name}
                </Text>
              </View>

              <Image
                style={[image.w(90), image.h(5), { objectFit: "contain" }]}
                source={tripImgs.tripDirection}
              />

              <View style={[flexCol, gap(8)]}>
                <View style={[flex, gap(8), justifyEnd]}>
                  <Image
                    style={[image.w(14), image.h(20)]}
                    source={tripImgs.redBgLocation}
                  />
                  <Text
                    style={[
                      neurialGrotesk,
                      fw400,
                      fs12,
                      c(Colors.light.darkGrey),
                    ]}
                  >
                    Endpoint
                  </Text>
                </View>
                <Text style={[fw700, fs14, c(colors.black)]}>
                  {route?.dropoffBusstop?.name}
                </Text>
              </View>
            </View>
            {/* //!Startoff-Endpoint Block */}

            {/* //!Date and Time */}
            <View style={[flex, itemsCenter, justifyBetween]}>
              {/* //!Startoff Date Block */}
              <View style={[flexCol, gap(16)]}>
                <View style={[flex, gap(16)]}>
                  <Image
                    style={[image.w(18), image.h(18)]}
                    source={tripImgs.clockImage}
                  />

                  <Text style={[fw400, fs12, neurialGrotesk, colordarkGrey]}>
                    Date
                  </Text>
                </View>
                <Text style={[fw500, fs14, colorBlack]}>{Utils.formatDate(trip?.departureTime as unknown as string)}</Text>
              </View>
              {/* //!Startoff Date Block */}

              {/* //!Startoff Time Block */}
              <View style={[flexCol, gap(16)]}>
                <View style={[flex, gap(16)]}>
                  <Image
                    style={[image.w(18), image.h(18)]}
                    source={tripImgs.clockImage}
                  />

                  <Text style={[fw400, fs12, neurialGrotesk, colordarkGrey]}>
                    Time
                  </Text>
                </View>
                <Text style={[fw500, fs14, colorBlack]}>{Utils.formatTime(trip?.departureTime as unknown as string)}</Text>
              </View>
              {/* //!Startoff Time Block */}
            </View>
            {/* //!Date and Time */}
          </View>
          {/* //!Trip Block */}

          <PaddedScreen>
            {/* //!In Trip Dropoffs */}
            <View style={[flexCol, mt(32), mb(30)]}>
              <View style={[borderB(0.7, Colors.light.border), pb(16)]}>
                <Text style={[fw700, fs14, c(colors.black)]}>
                  In-Trip Dropoffs
                </Text>
              </View>

              <View style={[flexCol, gap(16), { overflow: "scroll" }]}>
                {route?.inTripDropoffs?.map((dropoff, index) => (
                  <InTripDropffTile
                    index={index + 1}
                    dropoff={dropoff}
                    key={index}
                  />
                ))}
              </View>
            </View>
            {/* //!In Trip Dropoffs */}

           
          </PaddedScreen>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default TripDetails;
