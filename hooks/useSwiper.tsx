import { useState } from "react";
import { Animated, PanResponder } from "react-native";

export const useSwiper = (totalSlides: number) => {
  const [index, setIndex] = useState(0);
  const translateX = new Animated.Value(0);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
    onPanResponderMove: (_, gesture) => {
      translateX.setValue(gesture.dx);
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -50 && index < totalSlides - 1) {
        // Swipe Left
        setIndex((prev) => prev + 1);
      } else if (gesture.dx > 50 && index > 0) {
        // Swipe Right
        setIndex((prev) => prev - 1);
      }
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
    },
  });

  return { index, panResponder };
};
