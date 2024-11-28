import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import CustomButton from "@/components/CustomButton";
import axios from "axios";

export default function EditProfileScreen() {
  const { user, login } = useAuth();
  const [nickname, setNickname] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // 프로필 데이터 불러오기 함수
  const fetchProfileData = async () => {
    try {
      const BASE_URL = "http://43.200.193.236:8080";

      const response = await axios.get(`${BASE_URL}/user/profile`);
      if (response.data) {
        setNickname(response.data.userNickname || "");
        setHeight(
          response.data.userHeight ? response.data.userHeight.toString() : ""
        );
        setWeight(
          response.data.userWeight ? response.data.userWeight.toString() : ""
        );
        // 전역 상태 업데이트
        login(response.data);
        console.log(response.data, "ddd");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData();
    }, [])
  );

  // 초기 데이터 설정
  useEffect(() => {
    if (user) {
      setNickname(user.userNickname || "");
      setHeight(user.userHeight ? user.userHeight.toString() : "");
      setWeight(user.userWeight ? user.userWeight.toString() : "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!nickname || !height || !weight) {
      Alert.alert("입력 오류", "모든 필드를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);

      const updateData = {
        userNickname: nickname,
        userWeight: parseInt(weight, 10),
        userHeight: parseInt(height, 10),
      };

      const BASE_URL = "http://43.200.193.236:8080";

      const response = await axios.post(
        `${BASE_URL}/user/profile/update`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);

      if (response.status === 200 || response.status === 201) {
        const updatedUser = {
          ...user,
          ...updateData,
        };
        login(updatedUser);
        fetchProfileData(); // 데이터 새로고침
        Alert.alert("성공", "프로필이 성공적으로 업데이트되었습니다.", [
          {
            text: "확인",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }
    } catch (error) {
      console.error(
        "Profile update error:",
        error.response?.data || error.message
      );
      Alert.alert(
        "오류",
        "프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
        }}
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
        title={isLoading ? "업데이트 중..." : "개인 정보 수정"}
        onPress={handleSave}
        buttonStyle="skyblue"
        disabled={isLoading}
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
