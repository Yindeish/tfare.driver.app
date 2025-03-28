import { useSwiper } from "@/hooks/useSwiper";
import { IRequest } from "@/state/types/ride";
import React from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

type SwiperProps = {
  slides: IRequest[];
  SlideComponent: React.FC<{ slide: IRequest }>;
};

export const Swiper: React.FC<SwiperProps> = ({ slides, SlideComponent }) => {
  const { index, panResponder } = useSwiper(slides.length);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.slide, { transform: [{ translateX: -index * width }] }]}
        {...panResponder.panHandlers}
      >
        {slides.map((slide, i) => (
          // <View key={i} style={[styles.page, { width }]}>
          //   <Text style={styles.text}>{slide}</Text>
          // </View>
          <SlideComponent key={i} slide={slide} />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  slide: { flexDirection: "row" },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: { fontSize: 24, fontWeight: "bold" },
});
