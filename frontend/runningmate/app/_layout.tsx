import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// https://docs.expo.dev/router/advanced/tabs/ *참고*

function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  // 로딩 완료 시, 로딩 화면(splash screen)을 숨김
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // 로그인 여부에 따라 화면 이동
  useEffect(() => {
    if (loaded) {
      if (isLoggedIn) {
        router.replace("/(tabs)"); // 네비게이션 스택의 첫 화면으로 이동
      } else {
        router.replace("/LoginScreen"); // 로그인 화면으로 이동
      }
    }
  }, [isLoggedIn, loaded]);

  if (!loaded) {
    return null;
  }

  return (
    // <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}> // 다크모드 적용
    <Stack>
      <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
      <Stack.Screen
        name="RegisterScreen"
        options={{
          title: "",
          headerStyle: { backgroundColor: "#8dccff" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitle: "로그인 페이지로",
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="+not-found" /> */}
    </Stack>
    // </ThemeProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}
