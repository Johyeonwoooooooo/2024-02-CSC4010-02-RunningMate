import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "../components/CustomButton";
import PasswordInput from "../components/PasswordInput";
import AlertModal from "../components/modal/AlertModal";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // modal(alert) state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const router = useRouter();

  const handleLogin = () => {
    /* TODO: 로그인 처리 */

    // log
    console.log("Registering:", {
      email,
      password,
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식 정규식

    // 입력값 검증
    if (email === "" || password === "") {
      setModalMessage("모든 항목을 입력해주세요.");
      setModalVisible(true);
      return;
    }

    // 이메일 형식 검증
    if (!emailRegex.test(email)) {
      setModalMessage("이메일 형식이 올바르지 않습니다.");
      setModalVisible(true);
      return;
    }

    // TODO : 로그인 API 요청
    // const response = await fetch("API URL", { ~~~~~

    // if (로그인 성공) {
    // router.replace("(tabs)"); // 이전 페이지로 이동 불가능
    router.navigate("(tabs)"); // 이전 페이지로 스와이프하여 이동 가능 (테스트 용이)
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* 로고 */}
        <Image
          source={require("../assets/icons/loginLogo.png")}
          style={styles.logo}
        />

        {/* Welcome 메시지 */}
        <Text style={styles.title}>
          Running Mate에 오신 것을 {"\n"} 환영합니다!
        </Text>

        {/* 이메일 입력 필드 */}
        <TextInput
          style={styles.input}
          placeholder="이메일"
          placeholderTextColor="#6e6e6e"
          onChangeText={setEmail}
        />

        {/* 비밀번호 입력 필드 */}
        <PasswordInput
          style={styles.passwordInput}
          placeholder="비밀번호"
          onChangeText={setPassword}
        />

        {/* 버튼 */}
        <CustomButton
          title="로그인"
          onPress={handleLogin}
          buttonStyle="skyblue"
        />
        <CustomButton
          title="회원가입"
          onPress={() => router.navigate("/RegisterScreen")}
          buttonStyle="white"
          style={{ marginTop: 10 }}
        />
        {/* 알림창 (input error 등) */}
        <AlertModal
          visible={modalVisible}
          message={modalMessage}
          onClose={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    width: "80%",
    height: "100%",
    alignSelf: "center",
  },
  logo: {
    width: "100%",
    height: "15%",
    aspectRatio: 552 / 375,
    marginBottom: 20,
  },
  title: {
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
    paddingVertical: 10,
    fontSize: 25,
    fontWeight: "bold",
  },
  input: {
    width: 300,
    height: 45,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    alignSelf: "center",
    marginTop: 10,
    paddingLeft: 20,
    borderColor: "#F2F4F7",
    backgroundColor: "#F2F4F7",
  },
  toggleButton: {
    marginLeft: 10,
  },
});

export default LoginScreen;
