import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const PasswordInput = ({ style }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={[styles.passwordContainer, style]}>
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        placeholderTextColor="#6e6e6e"
        secureTextEntry={!passwordVisible}
      />
      <TouchableOpacity
        onPress={() => setPasswordVisible(!passwordVisible)}
        style={styles.toggleButton}
      >
        <Icon
          name={passwordVisible ? "visibility-off" : "visibility"} // 아이콘 이름
          size={24} // 아이콘 크기
          color="#000" // 아이콘 색상
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F4F7",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#F2F4F7",
    paddingHorizontal: 10,
    width: 300,
    height: 45,
    alignSelf: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    color: "#000",
    height: "100%",
    paddingLeft: 10,
  },
  toggleButton: {
    marginLeft: 10,
    marginRight: 5,
  },
});

export default PasswordInput;
