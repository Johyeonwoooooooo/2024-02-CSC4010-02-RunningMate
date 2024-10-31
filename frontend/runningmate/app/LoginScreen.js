import React from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CustomButton from "../components/CustomButton";

const LoginScreen = () => {
  const router = useRouter();

  const handleLogin = () => {
    // 로그인 로직을 여기에 추가합니다.
    // 로그인 성공 시 (tabs)로 전환합니다.
    // router.replace("(tabs)");
    router.navigate("(tabs)");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomButton title="로그인" onPress={handleLogin} />
        <CustomButton
          title="회원가입"
          onPress={() => router.navigate("Register")}
          buttonColor="#fff"
          borderColor="#8dccff"
          textColor="#8dccff"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
});

export default LoginScreen;
