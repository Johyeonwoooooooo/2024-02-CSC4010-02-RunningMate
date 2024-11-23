import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const RunningScreen = () => {
  const [distance, setDistance] = useState(0);
  const [previousLocation, setPreviousLocation] =
    useState<Location.LocationObject | null>(null);
  const [runningTime, setRunningTime] = useState(0);
  const [calories, setCalories] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardRecord[]>([]);

  // 헤더 가리기
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const dummyData = [
    {
      username: "John Doe",
      rank: 4,
      distance: "10.9 km",
      rankChange: "▲",
      rankChangeColor: "green",
      isMyRecord: false,
    },
    {
      username: "you",
      rank: 5,
      distance: "10.6 km",
      rankChange: "▼",
      rankChangeColor: "red",
      isMyRecord: true,
    },
    {
      username: "Jane Smith",
      rank: 6,
      distance: "11.2 km",
      rankChange: "▲",
      rankChangeColor: "green",
      isMyRecord: false,
    },
  ];

  // Location tracking useEffect remains the same
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | undefined;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          if (previousLocation && previousLocation.coords) {
            const newDistance = getDistance(
              previousLocation.coords.latitude,
              previousLocation.coords.longitude,
              location.coords.latitude,
              location.coords.longitude
            );
            setDistance((prevDistance) => prevDistance + newDistance);
            setCalories(
              (prevCalories) =>
                prevCalories + calculateCalories({ distance: newDistance })
            );
          }
          setPreviousLocation(location);
        }
      );
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [previousLocation]);

  interface LeaderboardRecord {
    rank: number;
    userNickname: string;
    rankChange: "up" | "down" | "same";
    isMyRecord: boolean;
    distance: string;
  }

  const updateLeaderboard = (leaderboardResponseList: LeaderboardRecord[]) => {
    return leaderboardResponseList.map((record) => ({
      ...record,
      rankChangeIcon:
        record.rankChange === "up"
          ? "▲"
          : record.rankChange === "down"
          ? "▼"
          : "-",
      rankChangeColor:
        record.rankChange === "up"
          ? "green"
          : record.rankChange === "down"
          ? "red"
          : "black",
    }));
  };

  // Updated useEffect with API call
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(async () => {
        setRunningTime((prevTime) => prevTime + 1);

        // Format running time as ISO 8601 duration
        const hours = Math.floor(runningTime / 3600);
        const minutes = Math.floor((runningTime % 3600) / 60);
        const seconds = runningTime % 60;
        const duration = `PT${hours}H${minutes}M${seconds}S`;

        // Prepare data for API
        const runningData = {
          recordId: recordId,
          runningTime: duration,
          calories: Math.round(calories),
          distance: Number(distance.toFixed(2)) * 1000, // convert km to m
        };
        //console.log("Running data:", runningData);
        try {
          const response = await fetch(
            "http://43.200.193.236:8080/running/update",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(runningData),
            }
          );

          if (!response.ok) {
            console.error("Failed to update running data");
          } else {
            const responseBody = await response.json();
            console.log("Response body:", responseBody);

            const leaderboard = updateLeaderboard(
              responseBody.leaderboardResponseList
            );
            setLeaderboard(leaderboard);
          }
        } catch (error) {
          console.error("Error updating running data:", error);
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, runningTime, calories, distance]);

  // Rest of the component remains the same...
  interface Coordinates {
    latitude: number;
    longitude: number;
  }

  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon1 - lon2) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d / 1000; // in km
  };

  interface CalculateCaloriesParams {
    distance: number;
  }

  const calculateCalories = ({ distance }: CalculateCaloriesParams): number => {
    const weight = 70; // assume weight in kg
    const caloriesBurnedPerKm = 60; // average calories burned per km
    return (distance * caloriesBurnedPerKm * weight) / 1000;
  };

  interface FormatTimeParams {
    time: number;
  }

  const formatTime = ({ time }: FormatTimeParams): string => {
    const getSeconds = `0${time % 60}`.slice(-2);
    const minutes = `${Math.floor(time / 60)}`;
    const getMinutes = `0${parseInt(minutes) % 60}`.slice(-2);
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2);

    return `${getHours}:${getMinutes}:${getSeconds}`;
  };
  const params = useLocalSearchParams();
  const { recordId } = params;
  console.log(recordId, "recordId");
  const handleStopRunning = () => {
    setIsRunning(false);
    router.push({
      pathname: "./leaderboard",
      params: { recordId: recordId },
    });
  };

  return (
    <View style={styles.container}>
      {/* Rank List */}
      <View style={styles.rankList}>
        {/* Rank List */}
        <View style={styles.rankList}>
          {leaderboard.map((user, index) => (
            <View
              key={index}
              style={[
                styles.rankItem,
                user.isMyRecord ? styles.currentUser : null,
              ]}
            >
              <Text style={styles.rankNumber}>{user.rank}</Text>
              <Text style={styles.name}>{user.userNickname}</Text>
              <Text style={styles.distance}>{user.distance} km</Text>
              <Text
                style={[styles.rankChange, { color: user.rankChangeColor }]}
              >
                {user.rankChangeIcon}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Running Info */}
      <View style={styles.runningInfo}>
        <Text style={styles.runningTimeLabel}>Running time</Text>
        <Text style={styles.runningTime}>
          {formatTime({ time: runningTime })}
        </Text>
        <View style={styles.runningStats}>
          <Text style={styles.stat}>🏃 {distance.toFixed(2)} km</Text>
          <Text style={styles.stat}>🔥 {calories.toFixed(2)} kcal</Text>
        </View>
      </View>

      {/* End Button */}
      <TouchableOpacity style={styles.endButton} onPress={handleStopRunning}>
        <Text style={styles.endButtonText}>운동 종료</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  rankList: {
    flex: 4,
    justifyContent: "center",
  },
  rankItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
  currentUser: {
    backgroundColor: "#e0f7fa",
  },
  rankNumber: {
    width: 40,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  distance: {
    width: 80,
    textAlign: "right",
    fontSize: 16,
  },
  rankChange: {
    width: 30,
    textAlign: "center",
    fontSize: 16,
  },
  runningInfo: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  runningTimeLabel: {
    fontSize: 24,
    fontWeight: "semibold",
  },
  runningTime: {
    fontSize: 64,
    fontWeight: "bold",
    marginVertical: 5,
  },
  runningStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  stat: {
    fontSize: 24,
  },
  endButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#40A9FF",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  endButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RunningScreen;
