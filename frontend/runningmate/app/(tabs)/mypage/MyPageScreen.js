import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyPageScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();

  if (!user) {
    // 로그인 오류
    return (
      <View style={styles.container}>
        <Text style={styles.message}>로그인이 필요합니다.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: "https://example.com/profile-icon.png" }} // replace with your profile image URL
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.nickname}>{user.userNickname}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.info}>키: {user.userHeight} cm</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.info}>몸무게: {user.userWeight} kg</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("EditProfileScreen")} // add navigation prop
              >
                <Ionicons
                  name="pencil"
                  size={16}
                  color="black"
                  style={styles.editIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <Text style={styles.tab}>달리기 통계 확인</Text>
          <Text style={styles.selectedTab}>작성한 글 확인</Text>
        </View>

        <View style={styles.postContainer}>
          <Text style={styles.postTitle}>제목</Text>
          <Text style={styles.postDate}>2024/10/13</Text>
          <View style={styles.postBodyPlaceholder}></View>
        </View>

        <View style={styles.postContainer}>
          <Text style={styles.postTitle}>제목</Text>
          <Text style={styles.postDate}>2024/10/8</Text>
          <View style={styles.postBodyPlaceholder}></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: "#ccc",
    marginRight: 16,
  },
  profileInfo: {
    flexDirection: "column",
  },
  nickname: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  info: {
    fontSize: 14,
    color: "#666",
  },
  editIcon: {
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "left",
    marginBottom: 16,
  },
  tab: {
    fontSize: 16,
    color: "#999",
    paddingHorizontal: 8,
  },
  selectedTab: {
    fontSize: 16,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingHorizontal: 8,
  },
  postContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  postDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  postBodyPlaceholder: {
    height: 100,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
});
