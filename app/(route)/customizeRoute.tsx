import CustomizeRouteInputTile from "@/components/home/customizeRouteInputTile";
import InTripDropoffDeleteTile from "@/components/home/inTripDropoffDeleteTile";
import InTripDropffTile, {
  EditableInTripDropffTile,
} from "@/components/home/inTripDropoffTile";
import CtaBtn from "@/components/shared/ctaBtn";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import { homeImgs } from "@/constants/images/home";
import sharedImg from "@/constants/images/shared";
import { images } from "@/constants/images/splash";
import tripImgs from "@/constants/images/trip";
import tw from "@/constants/tw";
import { useSnackbar } from "@/contexts/snackbar.context";
import { useStorageState } from "@/hooks/useStorageState";
import FetchService from "@/services/api/fetch.service";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import { setRideState } from "@/state/slices/ride";
import { RootState } from "@/state/store";
import { IAddress } from "@/state/types/account";
import { IBusStop, ICity, IPlan } from "@/state/types/ride";
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
import { router, useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "react-native-paper";

interface IDropoff {
  name: string;
  city: ICity;
  order: number;
  plan: IPlan;
}

function CustomizeRoute() {
  const { selectedRoute, dropoffBusstopInput, pickupBusstopInput } =
    useAppSelector((state: RootState) => state.ride);
  const dispatch = useAppDispatch();
  const [[tokenLoading, token], setTokenSession] = useStorageState("token");
  const {Snackbar, snackbarVisible, notify, closeSnackbar} = useSnackbar();
  const {id} = useGlobalSearchParams();

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
    pickupSearchText: "",
    dropoffSearchText: "",
    dropoffs:
      selectedRoute?.inTripDropoffs?.map((dropoff, index) => ({
        ...dropoff,
        id: index,
      })) || [],
    matchDropoffs: [] as IDropoff[],
    inputtingPickup: false,
    inputtingDropoff: false,
  });
  const {
    code,
    msg,
    loading,
    dropoffs,
    matchDropoffs,
    dropoffSearchText,
    pickupSearchText,
    inputtingDropoff,
    inputtingPickup,
  } = fetchState;

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

  const removeDropoff = (dropoffId: number) => {
    const arr = dropoffs.filter((dropoff) => dropoff.id != dropoffId);
    setFetchState((prev) => ({ ...prev, dropoffs: arr }));
  };

  const addDropoff = () => {
    // const dropoff = {};
    // setFetchState((prev) => ({...prev, dropoffs: [...dropoffs, dropoff]}));
  };

  // const searchBustop = (searchText: string) => {
  //   const arr = dropoffs.filter(
  //     (dropoff) =>
  //       dropoff?.name?.toLowerCase() == searchText.toLowerCase() || dropoff?.name.toLowerCase().includes(searchText.toLowerCase())
  //   );

  //   setFetchState((prev) => ({
  //     ...prev,
  //     matchDropoffs: searchText == '' ? [] : arr,
  //   }));
  // };

  const searchBusstops = async (query: string) => {
    setFetchState((prev) => ({ ...prev, loading: true }));

    const returnedData = await FetchService.getWithBearerToken({
      url: `/ride/busstop/search?searchValue=${query}`,
      token: token as string,
    });

    setFetchState((prev) => ({ ...prev, loading: false }));

    const busstops = returnedData?.matchSearchBusStops as IDropoff[];
    console.log({ busstops });
    if (busstops) {
      setFetchState((prev) => ({ ...prev, matchDropoffs: query == '' ? [] : busstops }));
    }
  };
  
  const saveRoute = async () => {
    dispatch(setRideState({key: 'dropoffsInput', value: matchDropoffs.map((dropoff) => ({name: dropoff?.name, city: dropoff?.city, order: dropoff?.order}))}));

    setFetchState((prev) => ({...prev, loading: true}))

    await FetchService.patchWithBearerToken({
        url: `/user/driver/me/route/${selectedRoute?._id || id}/edit`,
        data: {
            pickupBusstop: pickupBusstopInput || selectedRoute?.pickupBusstop, 
            dropoffBusstop: dropoffBusstopInput || selectedRoute?.dropoffBusstop,
            city: selectedRoute?.city, 
            inTripDropoffs: dropoffs ?? selectedRoute?.inTripDropoffs
        },
        token: token as string,
      })
        .then(async (res) => {
          const data = res?.body ? await res.body : res;
          const code = data?.code;
          const msg = data?.msg;
          const routeSaved = data?.routeSaved;
  
          setFetchState((prev) => ({ ...prev, loading: false, }));

          notify({msg})
  
          if (code && code == 201 && routeSaved) {
            dispatch(setRideState({key: 'selectedRoute', value: routeSaved}))
            router.push("/(home)");
          }
        })
        .catch((err: any) => {
          console.log({ err });
          setFetchState((prev) => ({ ...prev, msg: err?.message, loading: false }));
          notify({msg: err?.message as string})
        });
  };

// Updating search Texts
  useEffect(() => {
    if (inputtingPickup) {
    searchBusstops(pickupSearchText)
    }
    if(inputtingDropoff) {
    searchBusstops(dropoffSearchText)
    }
  }, [inputtingDropoff, inputtingPickup, pickupSearchText, dropoffSearchText]);
  // Updating search Texts

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
              onPress={saveRoute}
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

                {loading && <ActivityIndicator color={colors.white} size={'small'} />}
              </TouchableOpacity>
              {/* //!Customize CTA */}
            </View>
            {/* //!Page Header */}

            {/* //!Startoff-Endpoint Inputs Block */}
            <View style={[flexCol, gap(32), tw``]}>
              <CustomizeRouteInputTile
                value={pickupSearchText}
                onChangeText={(text) => {
                  setFetchState((prev) => ({
                    ...prev,
                    inputtingPickup: true,
                    pickupSearchText: text,
                  }));
                  //   searchBustop(text);
                }}
                onFocus={() => {
                  // setFetchState((prev) => ({...prev, inputtingPickup: true}))
                }}
                onBlur={() => {
                  //   setFetchState((prev) => ({
                  //     ...prev,
                  //     inputtingPickup: false,
                  //   }));
                }}
                label="Startoff Bus Stop"
              />

              <CustomizeRouteInputTile
                value={dropoffSearchText}
                onChangeText={(text) => {
                  setFetchState((prev) => ({
                    ...prev,
                    inputtingDropoff: true,
                    dropoffSearchText: text,
                  }));
                  //   searchBustop(text);
                }}
                onFocus={() => {
                  // setFetchState((prev) => ({...prev, inputtingDropoff: true}))
                }}
                onBlur={() => {
                  //   setFetchState((prev) => ({...prev, inputtingDropoff: false}))
                }}
                label="Endpoint Bus Stop"
              />

              {/* Dropdown */}
              {(inputtingPickup || inputtingDropoff) && (
                <View
                  style={[
                    tw`w-full absolute left-0 z-5 bg-gray-100 h-auto p-3 max-h-[150px]`,
                    {
                      top: inputtingPickup
                        ? 90
                        : inputtingDropoff
                        ? "100%"
                        : "100%",
                    },
                  ]}
                >
                  <ScrollView
                    style={tw`w-full h-auto flex flex-col gap-[16px] bg-red-70`}
                  >
                    {matchDropoffs?.map((dropoff, index) => (
                      <Text
                        onPress={() => {
                          if (inputtingPickup) {
                            dispatch(
                              setRideState({
                                key: "pickupBusstopInput",
                                value: dropoff,
                              })
                            );
                            setFetchState((prev) => ({
                              ...prev,
                              pickupSearchText:
                                pickupBusstopInput?.name as string,
                              inputtingPickup: false,
                            }));
                          }
                          if (inputtingDropoff) {
                            dispatch(
                              setRideState({
                                key: "dropoffBusstopInput",
                                value: dropoff,
                              })
                            );
                            setFetchState((prev) => ({
                              ...prev,
                              dropoffSearchText:
                                dropoffBusstopInput?.name as string,
                              inputtingDropoff: false,
                            }));
                          }
                        }}
                        style={tw`text-[16px] text-black`}
                        key={index}
                      >
                        {dropoff?.name}
                      </Text>
                    ))}
                  </ScrollView>
                </View>
              )}
              {/* Dropdown */}
            </View>
            {/* //!Startoff-Endpoint Inputs Block */}

            {/* //!In Trip Dropoffs */}
            <View style={[flexCol, mt(32), mb(30)]}>
              <View style={[borderB(0.7, Colors.light.border), pb(16)]}>
                <Text style={[fw700, fs14, c(colors.black)]}>
                  In-Trip Dropoffs
                </Text>
              </View>

              {
                <View style={[flexCol, gap(16), { overflow: "scroll" }]}>
                  {dropoffs.map((dropoff, index) => (
                    <EditableInTripDropffTile
                      dropoff={dropoff}
                      index={index + 1}
                      onPress={() => removeDropoff(index)}
                      key={index}
                    />
                  ))}
                </View>
              }
            </View>
            {/* //!In Trip Dropoffs */}
          </PaddedScreen>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default CustomizeRoute;
