import { Slot, Stack } from "expo-router";
import { SessionProvider } from "@/contexts/userSignedInContext";
import { SessionProvider as TokenSessionProvider } from "@/contexts/userTokenContext";
import { PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { fonts } from "../constants/fonts";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { BottomSheetProvider } from "@/contexts/useBottomSheetContext";
import { SignupProvider } from "@/contexts/signupContext";
import { SnackbarProvider } from "@/contexts/snackbar.context";
import { Dimensions, View } from "react-native";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import * as Updates from "expo-updates";
import { TooltipProvider } from "@/contexts/tolltip-provider";

export default function Root() {
  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  useEffect(() => {
    onFetchUpdateAsync();
  }, []);

  const { width, height } = Dimensions.get("window");

  const [fontsLoaded] = useFonts({
    [fonts.neurialGrotesk]: require("@/assets/fonts/Fontspring-DEMO-neurialgrotesk-bold.otf"),
  });

  if (!fontsLoaded) {
    console.log({ fontsLoaded });
    // return <View style={{ width, height, backgroundColor: '#D7D7D7' }} />; //uncomment this after dev. Bad internet causes the problem of font not loading
  }

  SplashScreen.hideAsync();

  return (
    <Provider store={store}>
      <TooltipProvider>
        <GestureHandlerRootView>
          <BottomSheetProvider>
            <PaperProvider>
              <SnackbarProvider>
                <SignupProvider>
                  <TokenSessionProvider>
                    <SessionProvider>
                      <Slot />
                    </SessionProvider>
                  </TokenSessionProvider>
                </SignupProvider>
              </SnackbarProvider>
            </PaperProvider>
          </BottomSheetProvider>
        </GestureHandlerRootView>
      </TooltipProvider>
    </Provider>
  );
}
