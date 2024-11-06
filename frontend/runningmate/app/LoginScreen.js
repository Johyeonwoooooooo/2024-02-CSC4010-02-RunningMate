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
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
  // 계정
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  // modal(alert) state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    // log
    console.log("login input:", { email, password });

    /* input error 검증 */
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

    /* 서버에 로그인 요청 */
    try {
      const response = await fetch("http://192.168.45.114:3001/User"); // TODO : Json 서버 주소 package.json에서 삭제후 다시 넣어줘야함
      console.log("response status:", response.status);
      const users = await response.json();
      //console.log("users:", users);
      const user = users.find(
        (u) => u.userEmail === email && u.userPassword === password
      );

      if (user) {
        login(user);
        router.replace("(tabs)");
      } else {
        setModalMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setModalMessage("로그인 중 통신 오류가 발생했습니다.");
      setModalVisible(true);
    }
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
