import InTripDropffTile from "@/components/home/inTripDropoffTile";
import CtaBtn from "@/components/shared/ctaBtn";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import { homeImgs } from "@/constants/images/home";
import sharedImg from "@/constants/images/shared";
import { images } from "@/constants/images/splash";
import tripImgs from "@/constants/images/trip";
import FetchService from "@/services/api/fetch.service";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { setRideState } from "@/state/slices/ride";
import { RootState } from "@/state/store";
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
import { useState } from "react";
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
  const { selectedRoute } = useAppSelector((state: RootState) => state.ride);
  const { id } = useGlobalSearchParams();
  const { token } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  console.log({token})

  const [disabled, setDisabled] = useState(false);
  const [showCustomize, setShowCustomize] = useState(selectedRoute?.editable);

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
        console.log({ routeDetails });

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

  return (
    <SafeScreen>
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={getRouteDetails} refreshing={loading} />
        }
      >
        <View style={[wHFull as ViewStyle, relative]}>
          {/* //!Page Header */}
          <PaddedScreen>
            <View style={[flex, itemsCenter, justifyBetween, mb(10)]}>
              {/* //!Page Title */}
              <PageTitle title="Trip Details" />
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
                    <Image
                      style={[image.w(24), image.h(24)]}
                      source={tripImgs.redBgDeleteBtn}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {/* //!Edit-Delete CTAs */}

              {/* //!Customize CTA */}
              {showCustomize && ( //testing
                <TouchableOpacity
                  onPress={() => router.push("/(trip)/customizeTrip/1" as Href)}
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
                  {selectedRoute?.pickupBusstop?.name}
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
                  {selectedRoute?.dropoffBusstop?.name}
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
                <Text style={[fw500, fs14, colorBlack]}>{"April 14"}</Text>
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
                <Text style={[fw500, fs14, colorBlack]}>{"7:30 AM"}</Text>
              </View>
              {/* //!Startoff Time Block */}
            </View>
            {/* //!Date and Time */}
          </View>
          {/* //!Trip Block */}

          <PaddedScreen>
            {/* //!In Trip Dropoffs */}
            {loading? (<ActivityIndicator />) : (<View style={[flexCol, mt(32), mb(30)]}>
              <View style={[borderB(0.7, Colors.light.border), pb(16)]}>
                <Text style={[fw700, fs14, c(colors.black)]}>
                  In-Trip Dropoffs
                </Text>
              </View>

              <View style={[flexCol, gap(16), { overflow: "scroll" }]}>
                {selectedRoute?.inTripDropoffs?.map((dropoff, index) => (
                  <InTripDropffTile
                    index={index + 1}
                    dropoff={dropoff}
                    key={index}
                  />
                ))}
              </View>
            </View>)}
            {/* //!In Trip Dropoffs */}

            {/* //!Create Trip CTA */}
            <CtaBtn
              img={{ src: tripImgs.whiteBgTripImage, h: 20, w: 20 }}
              onPress={() => {
                router.push("/(trip)/trips" as Href);
              }}
              text={{ name: "Create Trip", color: colors.white }}
              bg={{ color: Colors.light.background }}
              style={{ container: { ...mb(30) } }}
            />
            {/* //!Create Trip CTA */}
          </PaddedScreen>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default TripDetails;
