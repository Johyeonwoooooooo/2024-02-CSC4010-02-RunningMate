import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState, useEffect, useCallback } from "react";
import { LineChart, BarChart } from "react-native-chart-kit";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

// WeeklyStatsChart 컴포넌트 정의
const WeeklyStatsChart = ({ records }) => {
  const [data, setData] = useState([]);
  const screenWidth = Dimensions.get("window").width - 65;

  useEffect(() => {
    if (records && records.length > 0) {
      const processedData = records
        .map((item) => ({
          ...item,
          date: new Date(item.recordDate).toLocaleDateString("ko-KR", {
            month: "numeric",
            day: "numeric",
          }),
          dayName: new Date(item.recordDate).toLocaleDateString("ko-KR", {
            weekday: "short",
          }),
        }))
        .sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate));

      setData(processedData);
    }
  }, [records]);

  const totalDistance = data.reduce(
    (acc, cur) => acc + (cur.dailyDistance || 0),
    0
  );
  const totalCalories = data.reduce(
    (acc, cur) => acc + (cur.weekCalories || 0),
    0
  );

  // 차트 설정
  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#3b82f6",
    },
    // Y축 설정 추가
    formatYLabel: (value) => Math.round(value).toString(),
  };

  // 거리 데이터
  const distanceData = {
    labels: data.map((item) => item.dayName),
    datasets: [
      {
        data: data.map((item) => item.dailyDistance || 0),
      },
    ],
    legend: ["거리 (km)"],
  };

  // 칼로리 데이터 최대값 계산
  const maxCalories = Math.max(...data.map((item) => item.weekCalories || 0));
  // Y축 최대값을 적절히 조정 (여유 공간 20% 추가)
  const yAxisMaximum = Math.ceil((maxCalories * 1.2) / 100) * 100;

  // 칼로리 데이터 준비 부분 수정
  const caloriesData = {
    labels: data.map((item) => item.dayName),
    datasets: [
      {
        data: data.map((item) => item.weekCalories || 0),
      },
    ],
    legend: ["칼로리 (kcal)"],
  };

  return (
    <View style={styles.chartContainer}>
      {/* 거리 그래프 */}
      <Text style={styles.chartTitle}>일일 달린 거리 (km)</Text>
      {data.length > 0 && (
        <LineChart
          data={distanceData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          fromZero
          yAxisSuffix="km"
        />
      )}

      {/* 칼로리 그래프 */}
      <Text style={styles.chartTitle}>일일 소모 칼로리 (kcal)</Text>
      {data.length > 0 && (
        <BarChart
          data={caloriesData}
          width={screenWidth}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          fromZero
          yAxisSuffix="kcal"
          segments={5} // Y축 구간 수 지정
          withInnerLines={true} // 내부 그리드 라인 표시
          showBarTops={false} // 바 위의 값 표시 제거
          yAxisMaximum={yAxisMaximum} // Y축 최대값 설정
        />
      )}

      {/* 일별 데이터 박스 */}
      <View style={styles.dayBoxContainer}>
        {data.map((day, index) => (
          <View
            key={day.recordDate}
            style={[
              styles.dayBox,
              {
                backgroundColor:
                  index === data.length - 1 ? "#3b82f6" : "#eff6ff",
              },
            ]}
          >
            <Text
              style={[
                styles.dayBoxText,
                styles.dayBoxTitle,
                { color: index === data.length - 1 ? "white" : "black" },
              ]}
            >
              {day.dayName}
            </Text>
            <Text
              style={[
                styles.dayBoxText,
                styles.dayBoxDate,
                { color: index === data.length - 1 ? "white" : "black" },
              ]}
            >
              {day.date}
            </Text>
            <Text
              style={[
                styles.dayBoxText,
                styles.dayBoxDistance,
                { color: index === data.length - 1 ? "white" : "black" },
              ]}
            >
              {day.dailyDistance || 0}km
            </Text>
            <Text
              style={[
                styles.dayBoxText,
                styles.dayBoxCalories,
                { color: index === data.length - 1 ? "white" : "black" },
              ]}
            >
              {day.weekCalories || 0}kcal
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.totalInfoContainer}>
        <View style={styles.totalInfoItem}>
          <Text style={styles.totalInfoLabel}>총 거리</Text>
          <Text style={styles.totalInfoValue}>
            {totalDistance.toFixed(2)} km
          </Text>
        </View>
        <View style={styles.totalInfoItem}>
          <Text style={styles.totalInfoLabel}>총 칼로리</Text>
          <Text style={styles.totalInfoValue}>
            {totalCalories.toFixed(2)} kcal
          </Text>
        </View>
      </View>
    </View>
  );
};

// MyPageScreen 컴포넌트
export default function MyPageScreen() {
  const { API_URL } = useAuth();
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState("runningStats");
  const [records, setRecords] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // 새로고침 상태 추가

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await fetch("http:localhost:8080/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // 로그아웃 성공 시
        logout();
        router.replace("/LoginScreen");
      } else {
        // 로그아웃 실패 시
        Alert.alert("오류", "로그아웃에 실패했습니다.");
      }
    } catch (error) {
      //console.error("Error during logout:", error);
      Alert.alert("오류", "로그아웃 중 통신 오류가 발생했습니다.");
    }
  };
  // 데이터 새로고침 함수
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // 프로필 데이터 새로고침
      await fetchUserProfile();

      // 선택된 탭에 따라 데이터 새로고침
      if (selectedTab === "runningStats") {
        await fetchRecords();
      } else if (selectedTab === "writtenPosts") {
        await fetchUserPosts();
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [selectedTab]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: "GET",
      });

      if (response.status === 200) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error("Error fetching user profile:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/user/posts`);
      if (response.ok) {
        const data = await response.json();
        setUserPosts(data);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const fetchRecords = async () => {
    try {
      const response = await fetch("http:localhost:8080/user/records");
      if (!response.ok) {
        throw new Error("네트워크 응답이 올바르지 않습니다");
      }
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  useEffect(() => {
    if (selectedTab === "runningStats" && user) {
      fetchRecords();
    } else if (selectedTab === "writtenPosts" && user) {
      fetchUserPosts();
    }
  }, [selectedTab, user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>로그인이 필요합니다.</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>로그인하기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]} // 안드로이드용 로딩 인디케이터 색상
            tintColor="#3b82f6" // iOS용 로딩 인디케이터 색상
            title="새로고침 중..." // iOS용 텍스트
            titleColor="#3b82f6" // iOS용 텍스트 색상
          />
        }
      >
        {/* 프로필 섹션 */}
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
            }}
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
                onPress={() => navigation.navigate("EditProfileScreen")}
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
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        {/* 탭 섹션 */}
        <View style={styles.tabContainer}>
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

        {/* 컨텐츠 섹션 */}
        {selectedTab === "runningStats" ? (
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>주간 달리기 통계</Text>
            <WeeklyStatsChart records={records} />
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <View key={post.postId} style={styles.postContainer}>
                  <Text style={styles.postTitle}>{post.postTitle}</Text>
                  <Text style={styles.postDate}>
                    {formatDate(post.postDate)}
                  </Text>
                  {post.postImages && post.postImages.length > 0 && (
                    <Image
                      source={{ uri: post.postImages[0] }}
                      style={styles.postImage}
                      resizeMode="cover"
                    />
                  )}
                  <Text style={styles.postContent}>{post.postContent}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>작성한 글이 없습니다.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  logoutText: {
    fontSize: 14,
    color: "#000",
    textDecorationLine: "underline",
    backgroundColor: "#fff",
    padding: 4,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    color: "#666",
  },
  selectedTabText: {
    color: "#000",
    fontWeight: "bold",
  },
  statsContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  chartContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  chartPlaceholder: {
    height: 220,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  dayBoxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dayBox: {
    width: "13.5%",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  dayBoxText: {
    textAlign: "center",
  },
  dayBoxTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  dayBoxDate: {
    fontSize: 12,
  },
  dayBoxDistance: {
    fontWeight: "bold",
    marginTop: 8,
  },
  dayBoxCalories: {
    fontSize: 12,
  },
  totalInfoContainer: {
    padding: 16,
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  totalInfoItem: {
    alignItems: "center",
  },
  totalInfoLabel: {
    color: "#1e3a8a",
    fontSize: 14,
  },
  totalInfoValue: {
    color: "#1e3a8a",
    fontSize: 18,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  postContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  postDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f0f0f0",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 32,
  },
  message: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // 추가적인 통계 관련 스타일
  emptyStatsContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  statsSummary: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  // 목록 관련 스타일
  listContainer: {
    paddingHorizontal: 16,
  },
  // 데이터 로딩 관련 스타일
  loadingText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
  // 탭 컨테이너 추가 스타일
  tabButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  // 날짜 박스 스타일 보강
  dateBoxContainer: {
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
  // 모달 관련 스타일 (필요한 경우)
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  // 새로고침 관련 스타일
  refreshControl: {
    backgroundColor: "transparent",
  },
  // 프로필 이미지 컨테이너 스타일 보강
  profileImageContainer: {
    position: "relative",
  },
  editProfileButton: {
    position: "absolute",
    right: -8,
    bottom: -8,
    backgroundColor: "#3b82f6",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  // 통계 카드 스타일 보강
  statsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statsCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
});
