import CloudinaryServices from "@/cloudinary/cloudinary.services";
import FileUploadTile from "@/components/shared/fileUploadTile";
import MenuTile from "@/components/shared/menuTile";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import { useSnackbar } from "@/contexts/snackbar.context";
import FetchService from "@/services/api/fetch.service";
import {
  c,
  colorBlack,
  colorWhite,
  fs,
  fs14,
  fs18,
  fw400,
  fw500,
  fw700,
  leading,
  neurialGrotesk,
  textCenter,
} from "@/utils/fontStyles";
import { wHFull } from "@/utils/imageStyles";
import {
  bg,
  flexYCenter,
  h,
  mt,
  w,
  wFull,
  absolute,
  b,
  border,
  flex,
  itemsCenter,
  justifyBetween,
  rounded,
  py,
  px,
  pYAuto,
  flexCol,
  gap,
  my,
  justifyCenter,
  m,
  mb,
  pl,
} from "@/utils/styles";
import { Entypo } from "@expo/vector-icons";
import {
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { Href, Link, router } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import {
    ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Menu, PaperProvider, Text, TouchableRipple } from "react-native-paper";
import { ObjectSchema, string } from "yup";

function CarInfoUpload() {
    const {Snackbar, notify, snackbarVisible, closeSnackbar} = useSnackbar()

  const [fetchState, setFetchState] = useState({
    msg: "",
    code: null,
    loading: false,
  });
  const { msg, loading, code } = fetchState;

  const uploadImgToCloudinary = async ({
    folderName,
    imagePath,
    field,
  }: {
    imagePath: string;
    folderName: string;
    field: string;
  }) => {
    setFetchState((prev) => ({ ...prev, loading: true }));

    await CloudinaryServices.uploadImage({
      imagePath,
      folderName,
      fnToRn: (value) => {
        setFieldValue(field, value);
      },
    })
      .then((data) => {
        console.log({ data }, "uploading");
      })
      .catch((err) => {
        console.log({ err });
      })
      .finally(() => {
        setFetchState((prev) => ({ ...prev, loading: false }));
      });
  };

  const uploadPicture = async ({
    field,
  }: {
    field: string;
  }) => {
    // Request permission to access the image gallery
    const { status } = await requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    // Launch the image picker and allow user to pick an image
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images, // only images
      allowsEditing: false, // Optional, to allow cropping
      quality: 1, // Set the quality of the image
    });

    // Check if the user canceled the image picker or if there was an error
    if (result.canceled) {
      console.log("User canceled image selection");
      return;
    }

    // Extract the URI of the selected image
    const uri = result?.assets[0]?.uri;
    console.log({ uri });

    uploadImgToCloudinary({ folderName: "driversImages", imagePath: uri, field });
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: {
      carYear: "",
      carType: "",
      carModel: "",
      carColor: "",
      carSeats: "",
      carPlateNumber: "",
      carFrontView: "",
      carSideView: "",
      carBackView: "",
      carInteriorView: "",
    },
    validationSchema: new ObjectSchema({
      carYear: string().required("Required"),
      carType: string().required("Required"),
      carModel: string().required("Required"),
      carColor: string().required("Required"),
      carSeats: string().required("Required"),
      carPlateNumber: string().required("Required"),
      carFrontView: string().required("Required"),
      carSideView: string().required("Required"),
      carBackView: string().required("Required"),
      carInteriorView: string().required("Required"),
    }),
    onSubmit: async ({
      carBackView,
      carColor,
      carFrontView,
      carInteriorView,
      carModel,
      carPlateNumber,
      carSeats,
      carSideView,
      carType,
      carYear,
    }) => {
      try {
        console.log({'uploading....':'uploading......'})
        setFetchState((prev) => ({ ...prev, loading: true, msg: "" }));

        const returnedData = await FetchService.post({
          data: {
            vehicleType: carType,
            vehicleYear: carYear,
            vehicleModel: carModel,
            vehicleColor: carColor,
            plateNumber:carPlateNumber,
            seats: carSeats,
            vehicleImages: {
                frontViewImage: carFrontView,
                backViewImage: carBackView,
                sideViewImage: carSideView,
                interiorImage: carInteriorView
            }
          },
          url: "/user/driver/me/vehicle/upload-info",
        });

        const msg = returnedData?.msg;
        const code = returnedData?.code;

        notify({ msg });

        setFetchState((prev) => ({
          ...prev,
          msg: returnedData?.msg,
          code: returnedData.code,
          loading: false,
        }));
        if (returnedData.code === 201)
            router.replace(`/(auth)/docsUpload` as Href)
      } catch (error: any) {
        console.log({ error });
        setFetchState((prev) => ({
          ...prev,
          msg: error?.message || "Error in signing up",
          code: 400 as never,
          loading: false,
        }));

        notify({ msg: error?.message || "Error in signing up" });
      }
    },
  });

  return (
    <SafeScreen>
      <PaperProvider>
        <ScrollView>
          <PaddedScreen styles={wHFull as ViewStyle}>
            <PageTitle title="" onPress={() => router.back()} />
            <View style={[flexCol, gap(0)]}>
              <Text
                style={[
                  neurialGrotesk,
                  c(colors.black),
                  fw500,
                  fs(32),
                  leading(36),
                ]}
              >
                Upload Car
              </Text>
              <Text
                style={[
                  neurialGrotesk,
                  c(colors.black),
                  fw700,
                  fs(32),
                  leading(36),
                ]}
              >
                Information{" "}
              </Text>
            </View>

            <View style={[flexCol, gap(16), mt(32)]}>
              {[
                {
                  label: values.carType || "Car Type",
                  options: ["Camry"],
                  onSelect: (value: string) => {
                    console.log({value})
                    setFieldValue("carType", value);
                  },
                },
                {
                  label: values.carYear || "Car Year",
                  options: ["Camry"],
                  onSelect: (value: string) => {
                    console.log({value})
                    setFieldValue("carYear", value);
                  },
                },
                {
                  label: values.carModel || "Car Model",
                  options: ["Camry"],
                  onSelect: (value: string) => {
                    console.log({value})
                    setFieldValue("carModel", value);
                  },
                },
                {
                  label: values.carColor || "Car Color",
                  options: ["Red", "Yellow", "Blue"],
                  onSelect: (value: string) => {
                    console.log({value})
                    setFieldValue("carColor", value);
                  },
                },
              ].map(({ label, onSelect, options }, index) => (
                <MenuTile
                  label={label}
                  onSelect={onSelect}
                  options={options}
                  
                  key={index}
                />
              ))}
              {/* //!Number of seats */}
              <TextInput
                style={
                  [
                    wFull,
                    flex,
                    itemsCenter,
                    justifyBetween,
                    border(0.7, "#D7D7D7"),
                    rounded(10),
                    wFull,
                    h(50),
                    bg("#F9F7F8"),
                    py("auto"),
                    px(24),
                    errors?.carSeats != '' ? { borderColor: Colors.light.error } : undefined,
                  ] as TextStyle[]
                }
                placeholder="Number of seats"
                value={values.carSeats}
                keyboardType="number-pad"
                cursorColor={Colors.light.darkGrey}
                onChangeText={handleChange('carSeats')}
                onBlur={handleBlur('carSeats')}
                underlineColorAndroid={colors.transparent}
                placeholderTextColor={Colors.light.darkGrey}
              />
              {/* //!Number of seats */}

              {/* //!Plate number */}
              <TextInput
                style={
                  [
                    wFull,
                    flex,
                    itemsCenter,
                    justifyBetween,
                    border(0.7, "#D7D7D7"),
                    rounded(10),
                    wFull,
                    h(50),
                    bg("#F9F7F8"),
                    py("auto"),
                    px(24),
                    false ? { borderColor: Colors.light.error } : undefined,
                  ] as TextStyle[]
                }
                placeholder="Plate number"
                value={values.carPlateNumber}
                keyboardType="number-pad"
                cursorColor={Colors.light.darkGrey}
                onChangeText={handleChange('carPlateNumber')}
                onBlur={handleBlur('carPlateNumber')}
                underlineColorAndroid={colors.transparent}
                placeholderTextColor={Colors.light.darkGrey}
              />
              {/* //!Plate number */}
            </View>

            <Text
              style={
                [
                  neurialGrotesk,
                  c(colors.black),
                  fw700,
                  fs(18),
                  leading(18),
                  my(20),
                ] as TextStyle[]
              }
            >
              Vehicle pictures
            </Text>

            <View style={[flexCol, gap(16)]}>
              <FileUploadTile
                label="Front View"
                layout="stack"
                styles={{ container: {}, label: {} }}
                placeholder={{
                  success: values.carFrontView != '',
                  hasError: errors.carFrontView != '',
                  uploadHelper: () => {
                    uploadPicture({field: 'carFrontView'})
                  },
                  imgNotClear: false,
                }}
              />
              <FileUploadTile
                label="Back View"
                layout="stack"
                styles={{ container: {}, label: {} }}
                placeholder={{
                    success: values.carBackView != '',
                    hasError: errors.carBackView != '',
                    uploadHelper: () => {
                      uploadPicture({field: 'carBackView'})
                    },
                  imgNotClear: false,
                }}
              />
              <FileUploadTile
                label="Side View"
                layout="stack"
                styles={{ container: {}, label: {} }}
                placeholder={{
                    success: values.carSideView != '',
                    hasError: errors.carSideView != '',
                    uploadHelper: () => {
                      uploadPicture({field: 'carSideView'})
                    },
                  imgNotClear: false,
                }}
              />
              <FileUploadTile
                label="Interior"
                layout="stack"
                styles={{ container: {}, label: {} }}
                placeholder={{
                    success: values.carInteriorView != '',
                    hasError: errors.carInteriorView != '',
                    uploadHelper: () => {
                      uploadPicture({field: 'carInteriorView'})
                    },
                //   imgNotClear: true,
                  imgNotClear: false,
                }}
              />
            </View>

            <TouchableRipple
              onPress={() => handleSubmit()}
              rippleColor={colors.white}
              style={[
                h(50),
                rounded(10),
                flexCol,
                wFull,
                itemsCenter,
                justifyCenter,
                bg(Colors.light.background),
                mb(30),
                mt(30),
              ]}
            >
              {!loading ? (<Text style={[fw700, fs18, colorWhite, neurialGrotesk]}>
                Continue
              </Text>): (
                  <ActivityIndicator color={colors.white} size="small" />
                )}
            </TouchableRipple>

            <View
              style={[wFull, flex, justifyCenter, itemsCenter, gap(8), mb(50)]}
            >
              <Text
                style={[fw400, fs14, textCenter, colorBlack, leading(16.66)]}
              >
                Already have an account?
              </Text>
              <Link href={"/(auth)/signin" as Href} asChild>
                <Pressable>
                  <Text
                    style={[pl(2), c(Colors.light.background)] as TextStyle[]}
                  >
                    Sign in
                  </Text>
                </Pressable>
              </Link>
            </View>
          </PaddedScreen>

          <Snackbar msg={msg} onDismiss={() => closeSnackbar()} snackbarVisible={snackbarVisible} />
        </ScrollView>
      </PaperProvider>
    </SafeScreen>
  );
}

export default CarInfoUpload;
