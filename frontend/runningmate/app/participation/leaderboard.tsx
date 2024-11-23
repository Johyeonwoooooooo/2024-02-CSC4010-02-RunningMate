import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";

const API_URL = "http://43.200.193.236:8080/running/leaderboard";

interface LeaderboardRecord {
  ranking: number;
  userNickname: string;
  yourRecord: boolean;
  distance: number;
}

const LeaderboardScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [leaderboard, setLeaderboard] = useState<LeaderboardRecord[]>([]);
  const params = useLocalSearchParams();
  const { recordId } = params;
  console.log(recordId, "recordId");
  // Dummy data
  const leaderboardData = [
    { username: "Davis Curtis", rank: 1, isMyRecord: false, distance: "15km" },
    { username: "Alena Donin", rank: 2, isMyRecord: false, distance: "13km" },
    { username: "Craig Gouse", rank: 3, isMyRecord: false, distance: "12km" },
    {
      username: "Madelyn Dias",
      rank: 4,
      isMyRecord: false,
      distance: "11.2km",
    },
    { username: "you", rank: 5, isMyRecord: true, distance: "10.9km" },
    {
      username: "Madelyn Dias",
      rank: 6,
      isMyRecord: false,
      distance: "10.6km",
    },
    {
      username: "Madelyn Dias",
      rank: 7,
      isMyRecord: false,
      distance: "10.3km",
    },
    {
      username: "Madelyn Dias",
      rank: 8,
      isMyRecord: false,
      distance: "10.1km",
    },
    { username: "Madelyn Dias", rank: 9, isMyRecord: false, distance: "9.8km" },
    {
      username: "Madelyn Dias",
      rank: 10,
      isMyRecord: false,
      distance: "9.5km",
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerStyle: { backgroundColor: "#8dccff" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerTitleAlign: "center", // 타이틀 중앙 정렬
        title: "Leaderboard",
      });
    }, [navigation])
  );

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_URL}?recordId=${recordId}`);
        if (!response.ok) {
          console.error(
            `Failed to fetch leaderboard data: ${response.status} ${response.statusText}`
          );
          return;
        }
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.navigate("/running")}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Leaderboard</Text>
      </View>

      {/* Top 3 Section */}
      <View style={styles.topThreeContainer}>
        {/* Second Place */}
        {leaderboard[1] && (
          <View style={styles.secondUser}>
            <View style={styles.circle}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
                }}
                style={styles.circleImage}
              />
            </View>
            <Text style={styles.name}>{leaderboard[1].userNickname}</Text>
            <Text style={styles.distance}>{leaderboard[1].distance} km</Text>
          </View>
        )}

        {/* First Place */}
        {leaderboard[0] && (
          <View style={[styles.firstUser]}>
            <View style={styles.circle}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
                }}
                style={styles.circleImage}
              />
            </View>
            <Text style={styles.name}>{leaderboard[0].userNickname}</Text>
            <Text style={styles.distance}>{leaderboard[0].distance} km</Text>
          </View>
        )}

        {/* Third Place */}
        {leaderboard[2] && (
          <View style={styles.thirdUser}>
            <View style={styles.circle}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
                }}
                style={styles.circleImage}
              />
            </View>
            <Text style={styles.name}>{leaderboard[2].userNickname}</Text>
            <Text style={styles.distance}>{leaderboard[2].distance} km</Text>
          </View>
        )}
      </View>

      {/* Podium Image */}
      <ImageBackground
        source={require("../../assets/images/podium.png")}
        style={styles.podiumBackground}
        imageStyle={styles.podiumImage}
      >
        <View style={styles.emptyContainer}></View>
        {/* List Section */}
        <ScrollView style={styles.listContainer}>
          {leaderboard.map((item, index) => (
            <View
              key={index}
              style={[
                styles.listItem,
                item.yourRecord ? styles.currentUser : null,
              ]}
            >
              <Text style={styles.rank}>{item.ranking}</Text>
              <View style={styles.avatar} />
              <Text style={styles.listName}>{item.userNickname}</Text>
              <Text style={styles.listDistance}>{item.distance} km</Text>
            </View>
          ))}
        </ScrollView>
      </ImageBackground>
    </View>
  );
};
const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9F4FF",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    fontSize: 16,
    color: "blue",
  },
  topThreeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginBottom: 30,
    paddingHorizontal: 15, // 순위들 간격 조정
  },
  firstUser: {
    marginBottom: 20,
    alignItems: "center",
  },
  secondUser: {
    marginBottom: -10,
    alignItems: "center",
  },
  thirdUser: {
    marginBottom: -30,
    alignItems: "center",
  },
  // 이거 잘 만져야 함
  podiumBackground: {
    width: screenWidth,
    height: screenWidth * 1.43,
    // marginBottom: 20,
    alignSelf: "center",
  },
  podiumImage: {
    resizeMode: "contain",
  },
  emptyContainer: {
    flex: 0.8,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    marginBottom: 10,
  },
  firstCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#D9D9D9",
  },
  circleText: {
    display: "none",
  },
  circleImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  distance: {
    fontSize: 14,
    color: "#666",
  },
  listContainer: {
    flex: 8,
    padding: 10,
    backgroundColor: "#E9F4FF",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  currentUser: {
    backgroundColor: "#D9EFFF",
  },
  rank: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D9D9D9",
    marginRight: 10,
  },
  listName: {
    flex: 1,
    fontSize: 16,
  },
  listDistance: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LeaderboardScreen;
