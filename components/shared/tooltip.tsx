import tw from "@/constants/tw";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";


interface ITooltipProps {
  message: string;
  visible: boolean;
  children: ReactNode;
}

interface IToolTipContext {
  setTooltipState: ({
    key,
    value,
  }: {
    key: keyof ITooltipProps;
    value: any;
  }) => void;
}

const TooltipContext = createContext<IToolTipContext | undefined>(undefined);

const TooltipProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState({
    visible: false,
    message: "",
  });
  const { message, visible } = state;

  const setTooltipState = ({
    key,
    value,
  }: {
    key: keyof ITooltipProps;
    value: any;
  }) => {
    setState((prevState) => ({ ...prevState, [key]: value }));

    setTimeout(() => {
      setState((prevState) => ({ ...prevState, visible: false }));
    }, 2000)
  };

  return (
    <TooltipContext.Provider
      value={{
        setTooltipState,
      }}
    >
      {visible && (<View
        style={[
          tw`w-full h-auto bg-transparent fixed top-0 left-0 px-[20px] pt-[10px]`,
          { zIndex: 100000000 },
        ]}
      >
        <Text style={[tw `bg-gray-500 text-black text-[14px] px-[10px] py-[6px] shadow-md bg-white rounded-[15px]`]}>{message}</Text>
      </View>)}
      {/* {visible && (

          // <Animated.View
          //   entering={FadeIn.duration(300)}
          //   exiting={FadeOut.duration(300)}
          //   style={styles.tooltip}
          // >
          //   <Text style={styles.text}>{'message'}</Text>
          // </Animated.View>
        )} */}
      {/* </View> */}
      {children}
    </TooltipContext.Provider>
  );
};

export default TooltipProvider;

export const useTooltip = () => {
  const context = useContext(TooltipContext);

  if (!context) throw new Error("Tooltip Provider must wrap a base component!");
  else return context;
};

const styles = StyleSheet.create({
  container: { position: "relative", alignItems: "center" },
  tooltip: {
    position: "fixed",
    top: -40,
    // top: 0,
    backgroundColor: "black",
    // padding: 8,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  text: { color: "black", fontSize: 12 },
});
