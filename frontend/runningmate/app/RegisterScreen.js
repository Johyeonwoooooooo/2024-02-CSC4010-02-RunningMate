import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";
import PasswordInput from "../components/PasswordInput";
import AlertModal from "../components/modal/AlertModal";
import { router } from "expo-router";

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  // modal(alert) state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // 오류 검사 및 회원가입 API 요청
  const handleRegister = () => {
    // TODO : 회원가입 API 처리 및 회원가입 성공/실패시 알림 처리

    // log
    console.log("Registering:", {
      username,
      email,
      password,
      confirmPassword,
      height,
      weight,
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식 정규식
    const heightInt = parseInt(height, 10); // parse Integer
    const weightInt = parseInt(weight, 10); // parse Integer

    // 입력값 검증
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      height === "" ||
      weight === ""
    ) {
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

    // 비밀번호 일치 검증
    if (password !== confirmPassword) {
      setModalMessage("비밀번호가 일치하지 않습니다.");
      setModalVisible(true);
      return;
    }

    // 신장, 체중 검증

    if (
      isNaN(heightInt) ||
      isNaN(weightInt) ||
      heightInt <= 0 ||
      heightInt >= 300 ||
      weightInt <= 0 ||
      weightInt >= 300
    ) {
      setModalMessage("올바른 체형 정보를 입력해주세요.");
      setModalVisible(true);
      return;
    }

    // TODO : 회원가입 API 요청
    // const response = await fetch("API URL", { ~~~~~
    setModalMessage(
      "회원가입이 완료되었습니다. \n이전 화면에서 로그인해주세요."
    );
    setModalVisible(true);
    router.navigate("LoginScreen");
  };

  return (
    <View style={styles.container} backgroundColor={"#fff"}>
      <Text style={styles.title}>회원가입</Text>

      {/* 회원가입 입력 폼 */}
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        placeholderTextColor="#6e6e6e"
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="이메일"
        placeholderTextColor="#6e6e6e"
        onChangeText={setEmail}
      />
      <PasswordInput
        style={styles.passwordInput}
        placeholder="비밀번호"
        onChangeText={setPassword}
      />
      <PasswordInput
        style={styles.passwordInput}
        placeholder="비밀번호 확인"
        onChangeText={setConfirmPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="신장/cm"
        placeholderTextColor="#6e6e6e"
        onChangeText={setHeight}
      />
      <TextInput
        style={styles.input}
        placeholder="체중/kg"
        placeholderTextColor="#6e6e6e"
        onChangeText={setWeight}
      />

      {/* 회원가입 버튼 */}
      <CustomButton
        title="가입하기"
        onPress={handleRegister}
        buttonStyle="skyblue"
      />

      {/* 알림창 (input error 등) */}
      <AlertModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
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
});

export default RegisterScreen;
