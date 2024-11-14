import React, { useState } from "react";
import { Image, Text, TextInput, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "@/components/CustomButton";

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
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
        }} // replace with your profile image URL
        style={styles.profileImage}
      />
      <Text style={styles.title}>프로필 수정</Text>
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        placeholderTextColor="#6e6e6e"
        value={nickname}
        onChangeText={setNickname}
      />
      <TextInput
        style={styles.input}
        placeholder="신장 (cm)"
        placeholderTextColor="#6e6e6e"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="체중 (kg)"
        placeholderTextColor="#6e6e6e"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <CustomButton
        title="개인 정보 수정"
        onPress={handleSave}
        buttonStyle="skyblue"
      />
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
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
    alignSelf: "center",
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
});
