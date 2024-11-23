import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

const LeaderboardScreen = () => {
  const navigation = useNavigation();

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

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Leaderboard</Text>
      </View> */}

      {/* Top 3 Section */}
      <View style={styles.topThreeContainer}>
        {/* Second Place */}
        <View style={styles.secondUser}>
          <View style={styles.circle}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
              }}
              style={styles.circleImage}
            />
          </View>
          <Text style={styles.name}>{leaderboardData[1].username}</Text>
          <Text style={styles.distance}>{leaderboardData[1].distance}</Text>
        </View>

        {/* First Place */}
        <View style={[styles.firstUser]}>
          <View style={styles.circle}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
              }}
              style={styles.circleImage}
            />
          </View>
          <Text style={styles.name}>{leaderboardData[0].username}</Text>
          <Text style={styles.distance}>{leaderboardData[0].distance}</Text>
        </View>

        {/* Third Place */}
        <View style={styles.tirthUser}>
          <View style={styles.circle}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
              }}
              style={styles.circleImage}
            />
          </View>
          <Text style={styles.name}>{leaderboardData[2].username}</Text>
          <Text style={styles.distance}>{leaderboardData[2].distance}</Text>
        </View>
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
          {leaderboardData.map((item, index) => (
            <View
              key={index}
              style={[
                styles.listItem,
                item.isMyRecord ? styles.currentUser : null,
              ]}
            >
              <Text style={styles.rank}>{item.rank}</Text>
              <View style={styles.avatar} />
              <Text style={styles.listName}>{item.username}</Text>
              <Text style={styles.listDistance}>{item.distance}</Text>
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
  tirthUser: {
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
