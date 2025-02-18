import CustomizeRouteInputTile from "@/components/home/customizeRouteInputTile";
import InTripDropoffDeleteTile from "@/components/home/inTripDropoffDeleteTile";
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
import { useStorageState } from "@/hooks/useStorageState";
import FetchService from "@/services/api/fetch.service";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import {
  c,
  colorBlack,
  colorWhite,
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
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "react-native-paper";

function CustomizeRoute() {
  const { selectedRoute, dropoffBusstopInput, pickupBusstopInput } =
    useAppSelector((state: RootState) => state.ride);
  const dispatch = useAppDispatch();
  const [[tokenLoading, token], setTokenSession] = useStorageState("token");

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { code, msg, loading } = fetchState;

  const customizeRoute = async () => {
    setFetchState((prev) => ({ ...prev, loading: true }));
    const returnedData = await FetchService.postWithBearerToken({
      url: "/user/rider/me/available-rides/find",
      data: {
        pickupBusstopId: pickupBusstopInput?._id,
        dropoffBusstopId: dropoffBusstopInput?._id,
      },
      token: token as string,
    });

    const code = returnedData?.code;
    const msg = returnedData?.msg;

    setFetchState((prev) => ({ ...prev, loading: false, msg, code }));

    // if (code && code == 201) {
    //     hideBottomSheet();
    //     router.push(`/${pages.availableRides}` as Href)
    //     setFetchState((prev) => ({ ...prev, loading: false, msg: '', code: null }));
    // }
    // else if (code && code == 400) {
    //     showBottomSheet([477, 601], <RideRouteDetails code={code} msg={msg} />)
    //     setFetchState((prev) => ({ ...prev, loading: false, msg: '', code: null }));
    // }
  };

  return (
    <SafeScreen>
      <ScrollView>
        <View style={[wHFull as ViewStyle, relative]}>
          <PaddedScreen>
            {/* //!Page Header */}
            <View style={[flex, itemsCenter, justifyBetween, mb(10)]}>
              {/* //!Page Title */}
              <PageTitle title="Customize" />
              {/* //!Page Title */}

              {/* //!Customize CTA */}
              <TouchableOpacity
                style={[
                  bg(Colors.light.background),
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
                  source={tripImgs.whiteBgEditBtn}
                />

                <Text style={[fs12, fw500, neurialGrotesk, colorWhite]}>
                  Save
                </Text>
              </TouchableOpacity>
              {/* //!Customize CTA */}
            </View>
            {/* //!Page Header */}

            {/* //!Startoff-Endpoint Inputs Block */}
            <View style={[flexCol, gap(32)]}>
              <CustomizeRouteInputTile label="Startoff Bus Stop" />

              <CustomizeRouteInputTile label="Endpoint Bus Stop" />
            </View>
            {/* //!Startoff-Endpoint Inputs Block */}

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
          </PaddedScreen>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default CustomizeRoute;
