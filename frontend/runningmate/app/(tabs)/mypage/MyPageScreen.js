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
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import WeeklyStatsChart from "./WeeklyStatsChart";

export default function MyPageScreen() {
  const { API_URL } = useAuth();
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState("runningStats");
  const [weeklyStats, setWeeklyStats] = useState({
    labels: [],
    distances: [],
    calories: [],
  });
  // 유저 게시글 
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  // 사용자 게시글 가져오기
  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/user/posts`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('User posts:', data);
        setUserPosts(data);
      } else {
        console.error('Failed to fetch user posts');
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTab === 'writtenPosts') {
      fetchUserPosts();
    }
  }, [selectedTab]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/user/profile`, {
          method: "GET",
          //credentials: "include", // Include cookies for session
        });
        console.log("response:", response);

        if (response.status === 200) {
          const userData = await response.json();
          setUser(userData);
        } else {
          const errorMessage = await response.text();
          console.error("Error fetching user profile:", errorMessage);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [API_URL]);

  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/Record`, {
          method: "GET",
          credentials: "include", // Include cookies for session
        });
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

    if (user) {
      fetchData();
    }
  }, [user, API_URL]);
*/
  const processData = (data) => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);

    const weeklyData = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      weeklyData[dateString] = { distance: 0, calories: 0 };
    }

    data.forEach((record) => {
      const date = new Date(record.runningTime);
      const dateString = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      if (weeklyData[dateString]) {
        weeklyData[dateString].distance += record.distance;
        weeklyData[dateString].calories += record.calories;
      }
    });

    const labels = Object.keys(weeklyData).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    const distances = labels.map((label) => weeklyData[label].distance);
    const calories = labels.map((label) => weeklyData[label].calories);

    return { labels, distances, calories };
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.message}>로그인이 필요합니다.</Text>
      </SafeAreaView>
    );
  }

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
          <Text>달리기 통계 내용</Text>
        ) : (
          // 작성한 글 내용
          <View style={styles.contentContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : userPosts.length > 0 ? (
              userPosts.map((post) => (
                <View key={post.postId} style={styles.postContainer}>
                  <Text style={styles.postTitle}>{post.postTitle}</Text>
                  <Text style={styles.postDate}>{formatDate(post.postDate)}</Text>
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
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  postContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 32,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  postBodyPlaceholder: {
    height: 100,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f0f0f0', // placeholder color
  },
  postContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden', // 이미지가 container를 벗어나지 않도록
  },
 });