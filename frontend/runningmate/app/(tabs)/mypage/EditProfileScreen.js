import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function EditProfileScreen() {
  const { user, login } = useAuth();
  const [nickname, setNickname] = useState(user.userNickname);
  const [height, setHeight] = useState(user.userHeight.toString());
  const [weight, setWeight] = useState(user.userWeight.toString());
  const navigation = useNavigation();

  const handleSave = () => {
    const updatedUser = {
      ...user,
      userNickname: nickname,
      userHeight: parseInt(height, 10),
      userWeight: parseInt(weight, 10),
    };
    login(updatedUser);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>프로필 수정</Text>
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={nickname}
        onChangeText={setNickname}
      />
      <TextInput
        style={styles.input}
        placeholder="신장 (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="체중 (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <Button title="저장" onPress={handleSave} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    paddingHorizontal: 10,
  },
});
