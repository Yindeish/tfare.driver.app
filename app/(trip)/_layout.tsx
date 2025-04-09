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
import { IRequest } from "@/state/types/trip";
import {
  DropoffTile,
  NextBusstop,
  RequestCountdown,
} from "@/components/trip/tripDetailsComponents";
import NewRequestTile from "@/components/ride/new-request-tile";

const { height } = Dimensions.get("window");

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
    unAcceptedRequests,
    allRequests,
  } = useAppSelector((state: RootState) => state.trip);
  const { setTooltipState } = useTooltip();

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { code, loading, msg } = fetchState;

  const [state, setState] = useState({
    // Counter state
    counterDuration: 30,
    // UI visibility states
    dropoffShown: false,
    nextBusstopShown: false,
    countdownShown: false,
    newRequestsShown: false,
    // New requests state
    newRequests: [] as IRequest[],

    topRequestId: null,
  });

  const {
    counterDuration,
    dropoffShown,
    countdownShown,
    newRequestsShown,
    nextBusstopShown,
    newRequests,
    topRequestId,
  } = state;

  const currentUnacceptedRequest = unAcceptedRequests.find(
    (reqItem) => reqItem?.shown == true
  );

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
        inTripDropoffs: (
          intripDropoffsInput as (IBusStop & { number: number })[]
        ).map(({ number, ...dropoffItem }) => dropoffItem),
      },
    })
      .then(async (res) => {
        const data = res?.body ? await res.body : res;
        const code = data?.code;
        const msg = data?.msg;
        const newTrip = data?.newTrip;

        setTooltipState({ key: "visible", value: true });
        setTooltipState({ key: "message", value: msg });

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

  // Consolidated useEffect for UI states
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      // Show countdown when accepting/searching and there are unaccepted requests
      countdownShown:
        (query === RideConstants.query.accepting ||
          query === RideConstants.query.searching) &&
        unAcceptedRequests.length > 0,

      // Show dropoff UI when trip has started
      dropoffShown:
        (query === RideConstants.query.start_trip ||
          query === RideConstants.query.arrived_pickup ||
          query === RideConstants.query.accepting ||
          query === RideConstants.query.pause_trip) &&
        allRequests.some((req) => req?.rideStatus == "started") &&
        allRequests.filter((req) => req.rideStatus == "started").length == 1,

      nextBusstopShown:
        (query === RideConstants.query.start_trip ||
          query === RideConstants.query.arrived_pickup ||
          query === RideConstants.query.accepting ||
          query === RideConstants.query.pause_trip) &&
        allRequests.some((req) => req?.rideStatus == "started") &&
        allRequests.filter((req) => req.rideStatus == "started").length > 1,

      // Show new requests when not in accepting/searching mode
      newRequestsShown:
      query != null && (query !== RideConstants.query.accepting &&
        query !== RideConstants.query.searching),
    }));
    // }, [query, unAcceptedRequests.length]);
  }, [query, unAcceptedRequests.length, allRequests.length]);

  console.log({query})


  return (
    <View style={tw`w-full h-full flex flex-col relative`}>
      {/* Statuses */}
      {(unAcceptedRequests.length >= 1) &&(dropoffShown || nextBusstopShown || countdownShown || newRequestsShown) && 
      <View
        style={[
          zIndex(10000000),
          { position: "absolute", top: '25%' },
          tw`w-full h-[230px] bg-red-700`,
        ]}
      >
        {/* //!Drop off Block */}
        {dropoffShown && <DropoffTile />}
        {/* //!Drop off Block */}

        {/* //!Next Bus Stop Block */}
        {nextBusstopShown && <NextBusstop />}
        {/* //!Next Bus Stop Block */}

        {/* //!Time Down Block */}
        {/* {countdownShown && ( */}
        {countdownShown && (
          <RequestCountdown
            request={
              (currentUnacceptedRequest as IRequest) || unAcceptedRequests[0]
            }
          />
        )}
        {/* //!Time Down Block */}

        {/* New Requests */}
        {newRequestsShown && (
          <View
            style={[tw`w-full h-[40px] relative mt-[20px]`, { zIndex: 999 }]}
          >
            {[...unAcceptedRequests].map((req, index) => {
              const topPosition = (unAcceptedRequests.length - 1 - index) * 5;

              return (
                <NewRequestTile
                  props={{
                    style: [
                      tw``,
                      { top: topPosition, zIndex: Number(req?.zIndex) },
                    ],
                  }}
                  request={req}
                  key={index}
                />
              );
            })}
          </View>
        )}
        {/* New Requests */}
      </View>}
      {/* Statuses */}

      {/* //!Create Trip CTA */}
      {currentPresetTrip &&
        !currentUpcomingTrip &&
        (path === "/tripDetails" || path === "/customizeTrip") && (
          <View style={[tw`fixed px-[20px]`, { zIndex: 10000000, top: "80%" }]}>
            <CtaBtn
              img={{ src: tripImgs.whiteBgTripImage, h: 20, w: 20 }}
              onPress={() => {
                createTrip();
              }}
              text={{ name: "Create Trip", color: colors.white }}
              bg={{ color: Colors.light.background }}
              style={{ container: {} }}
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
          headerTitle: "",
        }}
      >
        <Stack.Screen
          name={"tripDetails"}
          options={{ headerShown: false, headerTitle: "" }}
        />
        <Stack.Screen
          name={"customizeTrip"}
          options={{ headerShown: false, headerTitle: "" }}
        />
      </Stack>
    </View>
  );
}
