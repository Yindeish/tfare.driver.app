"use client";

import { type ReactNode, useImperativeHandle, forwardRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import {
  useCountdown,
  type UseCountdownProps,
  type CountdownTimeData,
} from "@/contexts/useCountdown";
import { bg, flexCol, gap, h, itemsCenter, justifyCenter, rounded, w } from "@/utils/styles";
import { colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { colorBlack, colordarkGrey, fs, fw400, neurialGrotesk } from "@/utils/fontStyles";
import tw from "@/constants/tw";

export interface CountdownProps extends UseCountdownProps {
  // Styling
  containerStyle?: ViewStyle;
  digitStyle?: TextStyle;

  // Controls
  showControls?: boolean;
  controlsContainerStyle?: ViewStyle;
  startButtonText?: string;
  pauseButtonText?: string;
  resetButtonText?: string;
  buttonStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;

  // Children
  children?:
    | ReactNode
    | ((
        timeData: CountdownTimeData & {
          isRunning: boolean;
          restart: () => void;
        }
      ) => ReactNode);
}

// Create a ref type for external control
export interface CountdownRef {
  start: () => void;
  pause: () => void;
  reset: () => void;
  restart: () => void;
}

export const Countdown = forwardRef<CountdownRef, CountdownProps>(
  (
    {
      // Hook props passed through
      targetDate,
      duration,
      autoStart = true,
      onComplete,
      onTick,
      interval = 1000,

      // Styling
      containerStyle,
      digitStyle,

      // Controls
      showControls = false,
      controlsContainerStyle,
      startButtonText = "Start",
      pauseButtonText = "Pause",
      resetButtonText = "Reset",
      buttonStyle,
      buttonTextStyle,

      // Children
      children,
    },
    ref
  ) => {
    const countdown = useCountdown({
      targetDate,
      duration,
      autoStart,
      onComplete,
      onTick,
      interval,
    });

    const { seconds, completed, isRunning, start, pause, reset, restart } =
      countdown;

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      start,
      pause,
      reset,
      restart,
    }));

    // Render the countdown timer
    const renderCountdown = () => {
      return (
        <View
          style={[
            flexCol,
            gap(15),
            itemsCenter,
            justifyCenter,
            bg(colors.white),
            w(120),
            h(120),
            rounded(139),
            tw `p-[10px]`
          ]}
        >
          <Ionicons name="timer-outline" size={22} color="#27AE65" />

          <Text style={[fs(30), fw400, colorBlack]}>{seconds}</Text>

          <Text style={[fs(13), fw400, colordarkGrey, neurialGrotesk]}>
            seconds
          </Text>
        </View>
      );
    };

    // Render controls
    const renderControls = () => {
      if (!showControls) return null;

      return (
        <View style={[styles.controlsContainer, controlsContainerStyle]}>
          <TouchableOpacity
            style={[styles.button, buttonStyle]}
            onPress={isRunning ? pause : start}
          >
            <Text style={[styles.buttonText, buttonTextStyle]}>
              {isRunning ? pauseButtonText : startButtonText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, buttonStyle]}
            onPress={reset}
          >
            <Text style={[styles.buttonText, buttonTextStyle]}>
              {resetButtonText}
            </Text>
          </TouchableOpacity>
        </View>
      );
    };

    // If children is a function, call it with the current time data
    if (typeof children === "function") {
      return (
        <View style={styles.wrapper}>
          {children({ seconds, completed, isRunning, restart })}
          {renderControls()}
        </View>
      );
    }

    // If children is provided as ReactNode, render it alongside the countdown
    if (children) {
      return (
        <View style={styles.wrapper}>
          {renderCountdown()}
          {children}
          {renderControls()}
        </View>
      );
    }

    // Default rendering
    return (
      <View style={styles.wrapper}>
        {renderCountdown()}
        {renderControls()}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  digit: {
    fontSize: 48,
    fontWeight: "bold",
  },
  controlsContainer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
