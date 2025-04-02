import {
  View,
  ImageSourcePropType,
  Image,
  ScrollView,
  FlatList,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Text, TextInput } from "react-native-paper";
import React, { useEffect, useState } from "react";
import SafeScreen from "@/components/shared/safeScreen";
import PaddedScreen from "@/components/shared/paddedScreen";
import { image, mXAuto, wHFull } from "@/utils/imageStyles";
import {
  bg,
  flex,
  flexCol,
  gap,
  h,
  hFull,
  itemsCenter,
  justifyBetween,
  justifyCenter,
  mt,
  px,
  py,
  relative,
  rounded,
  w,
  wFull,
} from "@/utils/styles";
import Colors, { colors } from "@/constants/Colors";
import {
  c,
  colorBlack,
  colordarkGrey,
  colorWhite,
  fs12,
  fs14,
  fw400,
  fw500,
  neurialGrotesk,
} from "@/utils/fontStyles";
import AccountPageTitle from "@/components/shared/pageTitle";
import { Href, router } from "expo-router";
import { tabs } from "@/constants/tabs";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  setProfileCta,
  setUserProfileInfo,
  setUserProfileInfoFeild,
} from "@/state/slices/account";
import { IStateInputProfile } from "@/state/types/account";
import { useSession } from "@/contexts/userSignedInContext";
import sharedImg from "@/constants/images/shared";
import tripImgs from "@/constants/images/trip";
import AccountTextField from "@/components/account/accountTextFeild";
import { homeImgs } from "@/constants/images/home";
import MenuTile from "@/components/shared/menuTile";
import { useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";

function MyVehicle() {
  const [profileCta, setProfileCta] = useState("edit");
  const { user } = useAppSelector((state: RootState) => state.user);
  console.log({user})

  const vehicle = user?.driverProfile?.vehicle;
  const vehicleImages = vehicle?.vehicleImages;

  const editProfile = () => {
    setProfileCta("save");
  };

  const saveProfile = () => {
    setProfileCta("edit");
  };

  return (
    <SafeScreen>
      <View style={[wHFull] as ViewStyle[]}>
        {/* //!Page Header */}
        <PaddedScreen>
          <AccountPageTitle
            title="My Vehicle"
            onPress={() => router.push(`/(home)/account` as Href)}
            style={[]}
          >
            {/* //!Edit / Save profile Btn */}

            {profileCta === "edit" ? (
              <TouchableOpacity
                onPress={editProfile}
                style={[
                  flex,
                  rounded(100),
                  gap(10),
                  py(13),
                  px(26),
                  itemsCenter,
                  bg("#F9F7F8"),
                  { borderColor: Colors.light.border, borderWidth: 0.7 },
                ]}
              >
                <Image
                  source={sharedImg.editBtn}
                  style={[image.w(18), image.h(18)]}
                />

                <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>
                  Edit
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={saveProfile}
                style={[
                  flex,
                  rounded(100),
                  gap(10),
                  py(13),
                  px(26),
                  itemsCenter,
                  bg(Colors.light.background),
                  { borderColor: Colors.light.border, borderWidth: 0.7 },
                ]}
              >
                <Image
                  source={tripImgs.whiteBgEditBtn}
                  style={[image.w(18), image.h(18)]}
                />

                <Text style={[neurialGrotesk, fs12, fw500, colorWhite]}>
                  Save
                </Text>
              </TouchableOpacity>
            )}

            {/* //!Edit / Save profile Btn */}
          </AccountPageTitle>
        </PaddedScreen>
        {/* //!Page Header */}

        <PaddedScreen>
          <View style={[flexCol, gap(32)]}>
            <Text style={[neurialGrotesk, fw400, fs14, colordarkGrey]}>
              Vehicle Images
            </Text>

            {/* <ScrollView horizontal style={[flex, gap(10), h(100),]}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            
                        ))}
                    </ScrollView> */}
            <FlatList
              horizontal
              data={[
                vehicleImages?.backViewImage,
                vehicleImages?.frontViewImage,
                vehicleImages?.interiorImage,
                vehicleImages?.sideViewImage,
              ]}
              renderItem={({ index, item }) => (
                <Image
                  style={[image.h("100%"), image.w(100), image.mr(10)]}
                  source={{ uri: item as string }}
                  key={index}
                />
              )}
              style={[flex, gap(10), h(100)]}
            />
          </View>
        </PaddedScreen>

        <View
          style={[flexCol, gap(16), mt(32), w("90%"), mXAuto] as ViewStyle[]}
        >
          <MenuTile
            label={"Vehicle Type"}
            onSelect={() => {}}
            options={["automatic", "manual"]}
          />

          <TextInput
            onChangeText={() => {}}
            value={vehicle?.vehicleType}
            placeholder={"Vehicle Year"}
            style={
              [
                py(0),
                px(10),
                rounded(10),
                bg(colors.transparent),
                colorBlack,
                fs14,
                fw500,
                h(50),
                { borderWidth: 0.7, borderColor: Colors.light.border },
              ] as TextStyle[]
            }
            keyboardType="numeric"
            cursorColor={colors.transparent}
            selectionColor={colors.transparent}
            underlineColorAndroid={colors.transparent}
            placeholderTextColor={Colors.light.darkGrey}
          />

          <TextInput
            onChangeText={() => {}}
            value={vehicle?.vehicleModel}
            placeholder={"Vehicle Model"}
            style={
              [
                py(0),
                px(10),
                rounded(10),
                bg(colors.transparent),
                colorBlack,
                fs14,
                fw500,
                h(50),
                { borderWidth: 0.7, borderColor: Colors.light.border },
              ] as TextStyle[]
            }
            cursorColor={colors.transparent}
            selectionColor={colors.transparent}
            underlineColorAndroid={colors.transparent}
            placeholderTextColor={Colors.light.darkGrey}
          />

          <MenuTile
            label={"Vehicle Color"}
            onSelect={() => {}}
            options={["red", "green", "yellow", "blue", "purple"]}
          />

          <TextInput
            onChangeText={() => {}}
            value={String(vehicle?.vehicleYear)}
            placeholder={"License Plate"}
            style={
              [
                py(0),
                px(10),
                rounded(10),
                bg(colors.transparent),
                colorBlack,
                fs14,
                fw500,
                h(50),
                { borderWidth: 0.7, borderColor: Colors.light.border },
              ] as TextStyle[]
            }
            keyboardType="numeric"
            cursorColor={colors.transparent}
            selectionColor={colors.transparent}
            underlineColorAndroid={colors.transparent}
            placeholderTextColor={Colors.light.darkGrey}
          />
        </View>
      </View>
    </SafeScreen>
  );
}

export default MyVehicle;
