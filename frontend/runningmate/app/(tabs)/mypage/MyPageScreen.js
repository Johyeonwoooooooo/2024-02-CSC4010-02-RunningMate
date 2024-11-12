import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import WeeklyStatsChart from "./WeeklyStatsChart";
//import { Tabs } from "expo-router";

export default function MyPageScreen() {
  const { user, API_URL } = useAuth();
  const navigation = useNavigation();

  const [selectedTab, setSelectedTab] = useState("runningStats");
  const [weeklyStats, setWeeklyStats] = useState({
    labels: [],
    distances: [],
    calories: [],
  });
  // if (!user) {
  //   // 로그인 오류
  //   return (
  //     <SafeAreaView style={styles.safeArea}>
  //       <Text style={styles.message}>로그인이 필요합니다.</Text>
  //     </SafeAreaView>
  //   );
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/Record`);
        const records = await response.json();
        const userRecords = records.filter(
          (record) => record.userId === user.userid
        );
        const processedData = processData(userRecords);
        setWeeklyStats(processedData);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchData();
  }, [user, API_URL]);

  const processData = (data) => {
    const weeklyData = data.reduce((acc, record) => {
      const date = new Date(record.runningTime);
      const week = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      if (!acc[week]) {
        acc[week] = { distance: 0, calories: 0 };
      }
      acc[week].distance += record.distance;
      acc[week].calories += record.calories;
      return acc;
    }, {});

    const labels = Object.keys(weeklyData);
    const distances = labels.map((label) => weeklyData[label].distance);
    const calories = labels.map((label) => weeklyData[label].calories);

    return { labels, distances, calories };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 개인 프로필 */}
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
            }} // replace with your profile image URL
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

        {/* 상단 탭 */}
        <View style={styles.tabContainer}>
          {/* 달리기 통계 확인 탭 */}
          <TouchableOpacity
            onPress={() => setSelectedTab("runningStats")}
            style={[
              styles.tab,
              selectedTab === "runningStats" && styles.selectedTab,
            ]}
          >
            <Text
              style={
                selectedTab === "runningStats"
                  ? styles.selectedTabText
                  : styles.tabText
              }
            >
              달리기 통계 확인
            </Text>
          </TouchableOpacity>

          {/* 작성한 글 확인 탭 */}
          <TouchableOpacity
            onPress={() => setSelectedTab("writtenPosts")}
            style={[
              styles.tab,
              selectedTab === "writtenPosts" && styles.selectedTab,
            ]}
          >
            <Text
              style={
                selectedTab === "writtenPosts"
                  ? styles.selectedTabText
                  : styles.tabText
              }
            >
              작성한 글 확인
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === "runningStats" ? (
          // 달리기 통계 내용
          <WeeklyStatsChart weeklyStats={weeklyStats} />
        ) : (
          // 작성한 글 내용
          <View style={styles.contentContainer}>
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
          </View>
        )}
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
    backgroundColor: "#fff",
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
  selectedTabText: {
    fontWeight: "bold",
    color: "#000",
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
