import InTripDropffTile from "@/components/home/inTripDropoffTile";
import PresetRouteSheet from "@/components/home/presetRouteSheet";
import CtaBtn from "@/components/shared/ctaBtn";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import { homeImgs } from "@/constants/images/home";
import sharedImg from "@/constants/images/shared";
import { images } from "@/constants/images/splash";
import tripImgs from "@/constants/images/trip";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import FetchService from "@/services/api/fetch.service";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { setRideState } from "@/state/slices/ride";
import { RootState } from "@/state/store";
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
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { Text } from "react-native-paper";

function RouteDetails() {
  const {showBottomSheet} = useBottomSheet()
  const { selectedRoute } = useAppSelector((state: RootState) => state.ride);
  const dispatch = useAppDispatch();
  const { id } = useGlobalSearchParams();
  const { token } = useAppSelector((state: RootState) => state.user);

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
              <PageTitle
                // title="Trip Details"
                title="Route Details"
                onPress={() => {
                  showBottomSheet([650, 750], <PresetRouteSheet />)
                }}
              />
              {/* //!Page Title */}

              {/* //!Customize CTA */}
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    setRideState({ key: "selectedRoute", value: selectedRoute })
                  );
                  router.push(`/(route)/customizeRoute?id=${id}` as Href);
                }}
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
              {/* //!Customize CTA */}
            </View>
          </PaddedScreen>
          {/* //!Page Header */}

          {/* //!Route Block */}
          <View
            style={[
              flex,
              itemsCenter,
              justifyBetween,
              bg("#FFF7E6"),
              borderY(0.7, Colors.light.border),
              py(15),
              px(20),
            ]}
          >
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
          {/* //!Route Block */}

          <PaddedScreen>
            {/* //!In Trip Dropoffs */}
            <View style={[flexCol, mt(32), mb(30)]}>
              <View style={[borderB(0.7, Colors.light.border), pb(16)]}>
                <Text style={[fw700, fs14, c(colors.black)]}>
                  In-Trip Dropoffs
                </Text>
              </View>

              <View style={[flexCol, gap(16), { overflow: "scroll" }]}>
                {selectedRoute?.inTripDropoffs.map((dropoff, index) => (
                  <InTripDropffTile
                    dropoff={dropoff}
                    index={index + 1}
                    key={index}
                  />
                ))}
              </View>
            </View>
            {/* //!In Trip Dropoffs */}

            {/* //!Select Route CTA */}
            <CtaBtn
              img={{ src: tripImgs.whiteBgTripImage, h: 20, w: 20 }}
              onPress={() => {
                dispatch(
                  setRideState({
                    key: "pickupBusstopInput",
                    value: selectedRoute?.pickupBusstop,
                  })
                );
                dispatch(
                  setRideState({
                    key: "dropoffBusstopInput",
                    value: selectedRoute?.dropoffBusstop,
                  })
                );
                dispatch(setRideState({key: 'selectedRoute', value: selectedRoute}))
                router.push("/(home)");
              }}
              text={{ name: "Select Route", color: colors.white }}
              bg={{ color: Colors.light.background }}
              style={{ container: { ...mb(30) } }}
            />
            {/* //!Select Route CTA */}
          </PaddedScreen>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default RouteDetails;
