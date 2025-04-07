import {
  Href,
  Redirect,
  Stack,
  Tabs,
  useGlobalSearchParams,
  usePathname,
} from "expo-router";
import {
  Dimensions,
  View,
  Image,
  TouchableOpacity,
  TextStyle,
  Text,
} from "react-native";
import { useEffect, useState } from "react";
import { pages } from "@/constants/pages";
import { FontAwesome } from "@expo/vector-icons";
import { tabs } from "@/constants/tabs";
import Colors, { colors } from "@/constants/Colors";
import { router } from "expo-router";
import tw from "@/constants/tw";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import {
  absolute,
  b,
  bg,
  flexCenter,
  h,
  l,
  mb,
  t,
  wFull,
  zIndex,
} from "@/utils/styles";
import CtaBtn from "@/components/shared/ctaBtn";
import { indices } from "@/constants/zIndices";
import FetchService from "@/services/api/fetch.service";
import { ActivityIndicator } from "react-native";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { useSnackbar } from "@/contexts/snackbar.context";
import { openURL } from "expo-linking";
import { useStorageState } from "@/hooks/useStorageState";
import { RideConstants } from "@/constants/ride";
import { images } from "@/constants/images/splash";
import tripImgs from "@/constants/images/trip";
import { setTripState } from "@/state/slices/trip";
import { useTooltip } from "@/components/shared/tooltip";
import { IBusStop } from "@/state/types/ride";

const {height} = Dimensions.get("window");

export default function TripDetailsLayout() {
  const dispatch = useAppDispatch();
  const { showBottomSheet } = useBottomSheet();
  const searchParams = useGlobalSearchParams();
  const { selectedAvailableRideId, requestId } = useGlobalSearchParams();
  const path = usePathname();
  const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);
  const { riderCounterOffer } = useGlobalSearchParams<{
    query?: string;
    riderCounterOffer?: string;
  }>();
  const { token } = useAppSelector((state: RootState) => state.user);
  const {
    currentPresetTrip,
    currentUpcomingTrip,
    intripDropoffsInput,
    departureDateInput,
    departureTimeInput,
    pickupBusstopInput,
    dropoffBusstopInput,
  } = useAppSelector((state: RootState) => state.trip);
  const {setTooltipState} = useTooltip()

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { code, loading, msg } = fetchState;

  const createTrip = async () => {
    setFetchState((prev) => ({ ...prev, loading: true, msg: "", code: null }));
    await FetchService.postWithBearerToken({
      url: "/user/driver/me/trip/customize",
      token: token as string,
      data: {
        tripTemplateId: currentPresetTrip?._id,
        departureDate: departureDateInput,
        departureTime: departureTimeInput,
        routeId: currentPresetTrip?.routeId,
        pickupBusstop: pickupBusstopInput,
        dropoffBusstop: dropoffBusstopInput,
        city: currentPresetTrip?.route?.city,
        inTripDropoffs: (intripDropoffsInput as (IBusStop & {number: number})[]).map(({number, ...dropoffItem}) => dropoffItem),
      },
    })
      .then(async (res) => {
        const data = res?.body ? await res.body : res;
        const code = data?.code;
        const msg = data?.msg;
        const newTrip = data?.newTrip;

        setTooltipState({key:'visible', value: true});
        setTooltipState({key:'message', value: msg});

        setFetchState((prev) => ({ ...prev, loading: false, msg, code }));

        if (code && code == 201 && newTrip) {
          dispatch(
            setTripState({ key: "currentUpcomingTrip", value: newTrip })
          );
          dispatch(setTripState({ key: "currentPresetTrip", value: null }));

          router.push("/(home)/trip" as Href);
        }
      })
      .catch((err) => console.log({ err }))
      .finally(() => {
        setFetchState((prev) => ({ ...prev, loading: false }));
      });
  };

  return (
    <View style={tw`w-full h-full flex flex-col relative`}>
      {/* //!Create Trip CTA */}
      {currentPresetTrip &&
        !currentUpcomingTrip &&
        (path === "/tripDetails" || path === "/customizeTrip") && (
         <View style={[tw `fixed px-[20px]`, {zIndex: 10000000, top: '80%'}]}>
           <CtaBtn
            img={{ src: tripImgs.whiteBgTripImage, h: 20, w: 20 }}
            onPress={() => {
              createTrip();
            }}
            text={{ name: "Create Trip", color: colors.white }}
            bg={{ color: Colors.light.background }}
            style={{ container: {  } }}
            loading={loading}
            loaderProps={{
              color: Colors.light.border,
              style: [tw`w-[20px] h-[20px]`],
            }}
          />
         </View>
        )}
      {/* //!Create Trip CTA */}

      {/* Loading Spinner */}
      {loading && (
        <View
          style={[
            tw`w-full h-[35px] flex items-center justify-center absolute top-1/2 z-10`,
            { zIndex: 100000000 },
          ]}
        >
          <ActivityIndicator />
        </View>
      )}
      {/* Loading Spinner */}

      <Stack
        screenOptions={{
          animation: "slide_from_left",
          headerShown: false,
        }}
      >
        <Stack.Screen name={"tripDetails"} />
        <Stack.Screen name={"customizeTrip"} />
      </Stack>
    </View>
  );
}
