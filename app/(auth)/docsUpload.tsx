import CloudinaryServices from "@/cloudinary/cloudinary.services";
import FileUploadTile from "@/components/shared/fileUploadTile";
import MenuTile from "@/components/shared/menuTile";
import Modal from "@/components/shared/modal";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import sharedImg from "@/constants/images/shared";
import { useSnackbar } from "@/contexts/snackbar.context";
import FetchService from "@/services/api/fetch.service";
import { useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import {
  c,
  colorBlack,
  colordarkGrey,
  colorWhite,
  fs,
  fs10,
  fs14,
  fs18,
  fw400,
  fw500,
  fw700,
  leading,
  neurialGrotesk,
  textCenter,
} from "@/utils/fontStyles";
import { image, wHFull } from "@/utils/imageStyles";
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
  p,
} from "@/utils/styles";
import { Entypo } from "@expo/vector-icons";
import {
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { Href, Link, router, useGlobalSearchParams } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import {
    ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Menu, Text, TouchableRipple } from "react-native-paper";
import { ObjectSchema, string } from "yup";

const { height } = Dimensions.get("window");

type TModalType = "idle" | "success" | "failed";

function DocsUpload() {
  const [visible, setVisible] = useState(false);
  const [modalType, setModalType] = useState<TModalType>("idle");
  const { Snackbar, notify, snackbarVisible, closeSnackbar } = useSnackbar();
  const { token } = useAppSelector((state: RootState) => state.user);
  const {email} = useGlobalSearchParams();

  const showModal = (modalType: TModalType) => {
    setVisible(true);
    setModalType(modalType);
  };
  const hideModal = () => {
    setVisible(false);
    setModalType("idle");
  };

  const [fetchState, setFetchState] = useState({
    msg: "",
    code: null,
    loading: false,
  });
  const { msg, loading, code } = fetchState;

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: {
      roadWorthinessCertImage: "",
      vehicleInsuranceCertImage: "",
      driverLicenseImage: "",
      vehicleOwnershipCertImage: "",
    },
    validationSchema: new ObjectSchema({
      roadWorthinessCertImage: string().required(
        "Road Worthiness certificate is required!"
      ),
      vehicleInsuranceCertImage: string().required(
        "Insurance Certificate certificate is required!"
      ),
      driverLicenseImage: string().required(
        "Driver License certificate is required!"
      ),
      vehicleOwnershipCertImage: string().required(
        "Ownership certificate is required!"
      ),
    }),
    onSubmit: async ({
      driverLicenseImage,
      roadWorthinessCertImage,
      vehicleInsuranceCertImage,
      vehicleOwnershipCertImage,
    }) => {
      try {
        console.log({ "uploading....": "uploading......" });
        setFetchState((prev) => ({ ...prev, loading: true, msg: "" }));

        const returnedData = await FetchService.postWithBearerToken({
          token: token,
          data: {
            driverLicenseImage,
            roadWorthinessCertImage,
            vehicleInsuranceCertImage,
            vehicleOwnershipCertImage,
          },
          url: "/user/driver/me/personal-docs/upload-info",
        });

        console.log({returnedData})

        await FetchService.post({
            url: "/auth/send-otp",
            data: {
                email
            }
          }).then(() => {
            console.log('sent otp')
            // notify({msg: 'Sent otp'})
          })
          .catch((err) => {
            console.log({err})
            notify({msg: 'Error in sending otp'})
        })

        const msg = returnedData?.msg;
        const code = returnedData?.code;

        setFetchState((prev) => ({
          ...prev,
          msg: returnedData?.msg,
          code: returnedData?.code,
          loading: false,
        }));

        if (code === 201) showModal("success");
        else notify({ msg });
      } catch (error: any) {
        console.log({ error });
        setFetchState((prev) => ({
          ...prev,
          msg: error?.message || "Error in uploading documents",
          code: 400 as never,
          loading: false,
        }));

        notify({ msg: error?.message || "Error in uploading documents" });
      }
    },
  });

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

  const uploadPicture = async ({ field }: { field: string }) => {
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

    uploadImgToCloudinary({
      folderName: "driversImages",
      imagePath: uri,
      field,
    });
  };

  return (
    <SafeScreen>
      <ScrollView>
        <PaddedScreen styles={[wHFull] as ViewStyle[]}>
          <PageTitle title="Your documents" onPress={() => router.back()} />
          {true && (
            <Text
              style={
                [
                  fw500,
                  fs10,
                  colorWhite,
                  neurialGrotesk,
                  c("#CF0707"),
                  textCenter,
                  mt(-10),
                ] as TextStyle[]
              }
            >
              Kindly upload all required documents
            </Text>
          )}

          <View style={[wFull, h(height * 0.75), flexCol, justifyBetween]}>
            <View style={[flexCol, gap(0)]}>
              <FileUploadTile
                label={
                  <View style={[flexCol, gap(3)]}>
                    <Text style={[fw500, fs14, c(colors.black)]}>
                      Road Worthiness
                    </Text>
                    <Text style={[fw500, fs14, c(colors.black)]}>
                      Certificate
                    </Text>
                  </View>
                }
                layout="flat"
                styles={{ label: {} }}
                placeholder={{
                  success: values.roadWorthinessCertImage != "",
                  hasError: errors.roadWorthinessCertImage == "",
                  uploadHelper: () => {
                    uploadPicture({ field: "roadWorthinessCertImage" });
                  },
                  imgNotClear: false,
                }}
              />
              <FileUploadTile
                label={
                  <View style={[flexCol, gap(3)]}>
                    <Text style={[fw500, fs14, c(colors.black)]}>
                      Car Insurance
                    </Text>
                    <Text style={[fw500, fs14, c(colors.black)]}>
                      Certificate
                    </Text>
                  </View>
                }
                layout="flat"
                styles={{ container: [mt(-10)], label: {} }}
                placeholder={{
                  success: values.vehicleInsuranceCertImage != "",
                  hasError: errors.vehicleInsuranceCertImage == "",
                  uploadHelper: () => {
                    uploadPicture({ field: "vehicleInsuranceCertImage" });
                  },
                  imgNotClear: false,
                }}
              />
              <FileUploadTile
                label={
                  <View style={[flexCol, gap(3)]}>
                    <Text style={[fw500, fs14, c(colors.black)]}>
                    Vehicle Ownership
                    </Text>
                    <Text style={[fw500, fs14, c(colors.black)]}>
                      Certificate
                    </Text>
                  </View>
                }
                layout="flat"
                styles={{ container: [mt(-10)], label: {} }}
                placeholder={{
                  success: values.vehicleOwnershipCertImage != "",
                  hasError: errors.vehicleOwnershipCertImage == "",
                  uploadHelper: () => {
                    uploadPicture({ field: "vehicleOwnershipCertImage" });
                  },
                  imgNotClear: false,
                }}
              />
              <FileUploadTile
                label={
                  <Text style={[fw500, fs14, c(colors.black)]}>
                    Your License
                  </Text>
                }
                layout="flat"
                styles={{ container: [mt(-10)], label: {} }}
                placeholder={{
                  success: values.driverLicenseImage != "",
                  hasError: errors.driverLicenseImage == "",
                  uploadHelper: () => {
                    uploadPicture({ field: "driverLicenseImage" });
                  },
                  imgNotClear: false,
                }}
              />
            </View>

            <View style={[flex, wFull, justifyBetween]}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={[
                  h(50),
                  rounded(10),
                  flexCol,
                  w("46%"),
                  itemsCenter,
                  justifyCenter,
                  bg(colors.white),
                  mb(30),
                  mt(30),
                  border(1, Colors.light.background),
                ]}
              >
                <Text
                  style={[
                    fw700,
                    fs18,
                    c(Colors.light.background),
                    neurialGrotesk,
                  ]}
                >
                  Go back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSubmit()}
                style={[
                  h(50),
                  rounded(10),
                  flex,
                  w("46%"),
                  itemsCenter,
                  justifyCenter,
                  bg(Colors.light.background),
                  mb(30),
                  mt(30),
                ]}
              >
                <Text style={[fw700, fs18, colorWhite, neurialGrotesk]}>
                  Next
                </Text>
                {loading && <ActivityIndicator color={'white'} size='small' />}
              </TouchableOpacity>
            </View>
          </View>

          {/* //!Modals */}
          {/* //!Success */}
          <Modal
            hideModal={hideModal}
            showModal={() => showModal("success")}
            visible={visible && modalType === "success"}
          >
            <View style={[wFull, p(10), flexCol, gap(10), itemsCenter]}>
              <Image
                style={[image.w(80), image.h(80)]}
                source={sharedImg.modalSuccessful}
              />

              <View style={[flexCol, itemsCenter]}>
                <Text
                  style={[
                    neurialGrotesk,
                    fw700,
                    fs(22),
                    colorBlack,
                    leading(25),
                  ]}
                >
                  Document Submitted
                </Text>
                <Text
                  style={[
                    neurialGrotesk,
                    fw700,
                    fs(22),
                    colorBlack,
                    leading(25),
                  ]}
                >
                  for Verifcation
                </Text>
              </View>

              <View style={[flexCol, itemsCenter]}>
                <Text
                  style={[
                    fw500,
                    fs(12),
                    colordarkGrey,
                    leading(13),
                  ]}
                >
                  We’ll get in touch with you just in
                </Text>
                <Text
                  style={[
                    fw500,
                    fs(12),
                    colordarkGrey,
                    leading(13),
                  ]}
                >
                  time for you to start you role
                </Text>
                <Text
                  style={[
                    fw500,
                    fs(12),
                    colordarkGrey,
                    leading(13),
                  ]}
                >
                  as a driver on Tfare!
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                    hideModal();
                    router.replace(`/(auth)/verifyEmail?email=${email}`)
                }}
                style={[
                  h(50),
                  rounded(10),
                  flexCol,
                  wFull,
                  itemsCenter,
                  justifyCenter,
                  bg(Colors.light.background),
                ]}
              >
                <Text style={[fw700, fs18, colorWhite, neurialGrotesk]}>
                  Okay
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          {/* //!Success */}

          {/* //!Failed */}
          <Modal
            hideModal={hideModal}
            showModal={() => showModal("failed")}
            visible={visible && modalType === "failed"}
          >
            <View style={[wFull, p(10), flexCol, gap(10), itemsCenter]}>
              <Image
                style={[image.w(80), image.h(80)]}
                source={sharedImg.modalFailed}
              />

              <View style={[flexCol, itemsCenter]}>
                <Text
                  style={[
                    neurialGrotesk,
                    fw700,
                    fs(22),
                    colorBlack,
                    leading(25),
                  ]}
                >
                  We couldn’t Verify
                </Text>
                <Text
                  style={[
                    neurialGrotesk,
                    fw700,
                    fs(22),
                    colorBlack,
                    leading(25),
                  ]}
                >
                  your Documents
                </Text>
              </View>

              <View style={[flexCol, itemsCenter]}>
                <Text
                  style={[
                    neurialGrotesk,
                    fw500,
                    fs(12),
                    colordarkGrey,
                    leading(13),
                  ]}
                >
                  We’ll get in touch with you just in
                </Text>
                <Text
                  style={[
                    neurialGrotesk,
                    fw500,
                    fs(12),
                    colordarkGrey,
                    leading(13),
                  ]}
                >
                  time for you to start you role
                </Text>
                <Text
                  style={[
                    neurialGrotesk,
                    fw500,
                    fs(12),
                    colordarkGrey,
                    leading(13),
                  ]}
                >
                  as a driver on Tfare!
                </Text>
              </View>

              <TouchableOpacity
                onPress={hideModal}
                style={[
                  h(50),
                  rounded(10),
                  flexCol,
                  wFull,
                  itemsCenter,
                  justifyCenter,
                  bg(Colors.light.background),
                ]}
              >
                <Text style={[fw700, fs18, colorWhite, neurialGrotesk]}>
                  Try again
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          {/* //!Failed */}
          {/* //!Modals */}
        </PaddedScreen>
      </ScrollView>
    </SafeScreen>
  );
}

export default DocsUpload;
