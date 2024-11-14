import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

type TabBarIconProps = {
  style?: StyleProp<ImageStyle>;
  source: any;
};

export function TabBarIcon({ style, source }: TabBarIconProps) {
  return (
    <Image
      source={source}
      style={[{ width: 28, height: 28, marginBottom: -3 }, style]}
    />
  );
}
