import FileUploadTile from "@/components/shared/fileUploadTile";
import MenuTile from "@/components/shared/menuTile";
import Modal from "@/components/shared/modal";
import PaddedScreen from "@/components/shared/paddedScreen";
import PageTitle from "@/components/shared/pageTitle";
import SafeScreen from "@/components/shared/safeScreen";
import Colors, { colors } from "@/constants/Colors";
import authImgs from "@/constants/images/auth";
import { useAppSelector } from "@/state/hooks/useReduxToolkit";
import { RootState } from "@/state/store";
import {
  c,
  colorBlack,
  fs14,
  fw500,
  neurialGrotesk,
  textCenter,
} from "@/utils/fontStyles";
import { image, wHFull } from "@/utils/imageStyles";
import { flexCol, gap, itemsCenter, wFull, mt } from "@/utils/styles";
import { Href, router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { launchImageLibraryAsync } from "expo-image-picker";
import FetchService from "@/services/api/fetch.service";

function PersonalDocument() {
  const { user, token } = useAppSelector((state: RootState) => state.user);
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: string | ImagePicker.ImagePickerSuccessResult;
  }>({});
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>(
    {}
  );

  const personalDocuments = user?.driverProfile?.personalDocuments;

  const [fetchState, setFetchState] = useState({
    loading: false,
    msg: "",
    code: null,
  });
  const { code, msg, loading } = fetchState;

  const uploadPicture = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setSelectedFiles((prev) => ({
        ...prev,
        picture: pickerResult?.assets[0]?.uri,
      }));

      setFetchState((prev) => ({
        ...prev,
        loading: true,
        msg: "",
        code: null,
      }));
  
      await FetchService.patchWithBearerToken({
        url: '/user/account/user/edit',
        data: {
          picture: pickerResult?.assets[0]?.uri,
        },
        token: token as string,
      })
        .then(async (res) => {
          const data = res?.body ? await res.body : res;
          const code = data?.code;
          const msg = data?.msg;
  
          console.log({ res });
  
          setFetchState((prev) => ({ ...prev, loading: false, msg, code }));
  
          if (code && code == 201) {
          }
        })
        .catch((err) => {
          console.log({ err });
  
          setTimeout(() => router.back(), 1000);
        });
    }
  };

  const updateDocInDB = async (key: string, value: string) => {
    setFetchState((prev) => ({
      ...prev,
      loading: true,
      msg: "",
      code: null,
    }));

    await FetchService.postWithBearerToken({
      url: "/user/account/driver/personal-docs/edit-info",
      data: {
        [key]: value,
      },
      token: token as string,
    })
      .then(async (res) => {
        const data = res?.body ? await res.body : res;
        const code = data?.code;
        const msg = data?.msg;

        console.log({ res });

        setFetchState((prev) => ({ ...prev, loading: false, msg, code }));

        if (code && code == 201) {
        }
      })
      .catch((err) => {
        console.log({ err });

        setTimeout(() => router.back(), 1000);
      });
  };

  const uploadDocs = async (key: string) => {
    try {
      let result = await launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        updateDocInDB(key, result?.assets[0].uri);
        handleFileUpload(key, result?.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  const handleFileUpload = (key: string, uri: string) => {
    console.log({ uri });

    if (!uri) {
      setErrorMessages((prev) => ({
        ...prev,
        [key]: "File upload failed. Please try again.",
      }));
    } else {
      setSelectedFiles((prev) => ({ ...prev, [key]: uri }));
      setErrorMessages((prev) => ({ ...prev, [key]: "" }));
    }
  };

  return (
    <SafeScreen>
      <ScrollView>
        <PaddedScreen styles={[wHFull] as ViewStyle[]}>
          <PageTitle
            title="Personal Documents"
            onPress={() => router.push("/(home)/account" as Href)}
          />
          <View style={[flexCol, gap(32)]}>
            <TouchableOpacity
              onPress={uploadPicture}
              style={[flexCol, gap(16), itemsCenter, wFull]}
            >
              <Image
                style={[image.w(65), image.h(65), image.rounded(65)]}
                source={
                  selectedFiles.picture
                    ? { uri: selectedFiles.picture }
                    : authImgs.imageUpload
                }
              />
              <Text
                style={
                  [
                    fs14,
                    fw500,
                    neurialGrotesk,
                    c(colors.black),
                    textCenter,
                    wFull,
                  ] as TextStyle[]
                }
              >
                Kindly Upload a portrait picture of yourself showing your full
                face
              </Text>
            </TouchableOpacity>

            <View style={[flexCol, gap(0)]}>
              {[
                {
                  doc: "Road Worthiness Certificate",
                  src: personalDocuments?.roadWorthinessCertImage,
                },
                {
                  doc: "Car Insurance Certificate",
                  src: personalDocuments?.vehicleInsuranceCertImage,
                },
                {
                  doc: "Your License",
                  src: personalDocuments?.driverLicenseImage,
                },
                {
                  doc: "Vehicle Ownership Certificate",
                  src: personalDocuments?.vehicleOwnershipCertImage,
                },
              ].map(({ doc, src }, index) => (
                <FileUploadTile
                  key={index}
                  label={
                    <Text style={[fw500, fs14, c(colors.black)]}>{doc}</Text>
                  }
                  layout="flat"
                  styles={{ container: [mt(index > 0 ? -10 : 0)] }}
                  placeholder={{
                    success: !!selectedFiles[doc] || src != "",
                    hasError: !!errorMessages[doc] || src != "",
                    uploadHelper: () => {
                      // handleFileUpload(doc, selectedFiles[doc] as string || '')
                      uploadDocs(doc);
                    }, // Simulated upload function
                    imgNotClear: false,
                  }}
                />
              ))}
            </View>
          </View>
        </PaddedScreen>
      </ScrollView>
    </SafeScreen>
  );
}

export default PersonalDocument;
