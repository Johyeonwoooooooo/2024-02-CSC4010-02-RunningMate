import { Stack } from "expo-router";
import React from "react";

export default function MyPageLayout() {
  return (
    <Stack>
      <Stack.Screen name="MyPageScreen" options={{ headerShown: false }} />
      <Stack.Screen
        name="EditProfileScreen"
        options={{
          headerShown: true,
          title: "",
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#000",
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
}
