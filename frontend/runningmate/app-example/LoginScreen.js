import React from "react";
import { View, Text, Button } from "react-native";

const LoginScreen = ({ navigation }) => {
  const handleLogin = () => {
    // 로그인 로직을 여기에 추가합니다.
    // 로그인 성공 시 (tabs)로 전환합니다.
    navigation.replace("(tabs)");
  };

  return (
    <View>
      <Text>Login Screen</Text>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
