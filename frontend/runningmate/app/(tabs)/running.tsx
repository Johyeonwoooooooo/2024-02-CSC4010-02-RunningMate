import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const DIFFICULTY_LEVELS = [
  { id: "BEGINNER", label: "초보" },
  { id: "INTERMEDIATE", label: "중수" },
  { id: "ADVANCED", label: "고수" },
  { id: "EXPERT", label: "선수" },
];

const RoomCard = ({ room, onPress }) => (
  <TouchableOpacity style={styles.roomCard} onPress={() => onPress(room)}>
    <View style={styles.roomHeader}>
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>{room.level || "레벨 미정"}</Text>
      </View>
      <Text style={styles.timeText}>목표 시간: {room.time || "미정"}</Text>
    </View>
    <Text style={styles.titleText}>{room.title || "제목 없음"}</Text>
    <Text style={styles.distanceText}>
      목표 거리: {room.distance || "미정"}
    </Text>
  </TouchableOpacity>
);

const RunningMateSearch = () => {
  const [runningRooms, setRunningRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedTimeText, setSelectedTimeText] =
    useState("러닝 시작 시간 입력");
  const [joiningRoom, setJoiningRoom] = useState(false);

  const navigation = useNavigation();
  const router = useRouter();

  const executeSearch = () => {
    const trimmedText = inputText.trim();
    setSearchQuery(trimmedText);

    // 검색어가 변경된 후 API 호출
    setTimeout(() => {
      fetchRunningRooms();
    }, 0);
  };

  const fetchRunningRooms = async () => {
    setLoading(true);
    try {
      let url = "http://43.200.193.236:8080/running";

      if (selectedLevel || searchQuery.trim()) {
        const params = new URLSearchParams();

        if (selectedLevel) {
          params.append("groupTag", selectedLevel);
        }

        if (searchQuery.trim()) {
          params.append("searchWord", searchQuery.trim());
        }

        url = `http://43.200.193.236:8080/running/filtering?${params.toString()}`;
      }

      console.log("Fetching URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!responseText.trim()) {
        setRunningRooms([]);
        return;
      }

      const data = JSON.parse(responseText);
      console.log("Parsed data:", data);

      if (!data || !Array.isArray(data) || data.length === 0) {
        setRunningRooms([]);
        return;
      }

      const formattedRooms = data.map((room) => ({
        id: room.groupId,
        level: convertGroupTag(room.groupTag),
        title: room.groupTitle,
        time: formatTime(room.startTime, room.endTime),
        distance: `${room.targetDistance}km`,
        startTime: room.startTime,
        endTime: room.endTime,
        targetDistance: room.targetDistance,
        maxParticipants: room.maxParticipants,
      }));

      setRunningRooms(formattedRooms);
    } catch (error) {
      console.error("Error fetching running rooms:", error);
      setRunningRooms([]);
      Alert.alert("오류", "러닝방 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (room) => {
    if (joiningRoom) return;

    setJoiningRoom(true);
    try {
      const response = await fetch(
        `http://43.200.193.236:8080/running/${room.id}/participate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Success response parsing error:", e);
        throw new Error("서버 응답을 처리하는데 실패했습니다.");
      }

      if (!result.recordId) {
        throw new Error("참가 기록 ID를 받지 못했습니다.");
      }

      router.push({
        pathname: "../participation/waitingRoom",
        params: {
          roomId: room.id,
          recordId: result.recordId,
          roomTitle: room.title,
          startTime: room.startTime,
          endTime: room.endTime,
          targetDistance: room.targetDistance,
          maxParticipants: room.maxParticipants,
          selectedType: room.level,
        },
      });

      Alert.alert("성공", "러닝 방 참가가 완료되었습니다.");
    } catch (error) {
      console.error("Joining room error:", error);
      Alert.alert("참가 실패", error.message, [{ text: "확인" }]);
    } finally {
      setJoiningRoom(false);
    }
  };

  const handleLevelSelect = async (levelId) => {
    console.log("Selected level:", levelId); // 선택된 레벨 로깅

    // 현재 선택된 레벨과 같은 레벨을 클릭한 경우 필터 해제
    const newLevel = selectedLevel === levelId ? null : levelId;
    setSelectedLevel(newLevel);

    try {
      let url = "http://43.200.193.236:8080/running";

      // 검색어나 레벨 필터가 있는 경우에만 필터링 URL 사용
      if (newLevel || searchQuery.trim()) {
        const params = new URLSearchParams();

        if (newLevel) {
          params.append("groupTag", newLevel);
        }

        if (searchQuery.trim()) {
          params.append("searchWord", searchQuery.trim());
        }

        url = `http://43.200.193.236:8080/running/filtering?${params.toString()}`;
      }

      console.log("Fetching URL after level select:", url); // URL 로깅
      setLoading(true);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const responseText = await response.text();
      console.log("Response after level select:", responseText); // 응답 로깅

      if (!responseText.trim()) {
        setRunningRooms([]);
        return;
      }

      const data = JSON.parse(responseText);

      const formattedRooms = data.map((room) => ({
        id: room.groupId,
        level: convertGroupTag(room.groupTag),
        title: room.groupTitle,
        time: formatTime(room.startTime, room.endTime),
        distance: `${room.targetDistance}km`,
        startTime: room.startTime,
        endTime: room.endTime,
        targetDistance: room.targetDistance,
        maxParticipants: room.maxParticipants,
      }));

      setRunningRooms(formattedRooms);
    } catch (error) {
      console.error("Error during level filtering:", error);
      setRunningRooms([]);
      Alert.alert("오류", "러닝방 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const convertGroupTag = (tag) => {
    const levels = {
      BEGINNER: "초보",
      INTERMEDIATE: "중수",
      ADVANCED: "고수",
      EXPERT: "선수",
    };

    // 이미 한글인 경우 그대로 반환
    if (Object.values(levels).includes(tag)) {
      return tag;
    }

    return levels[tag] || "초보";
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchRunningRooms();
      return () => {
        setRunningRooms([]);
        setLoading(true);
        setSearchQuery("");
        setInputText("");
        setSelectedLevel(null);
      };
    }, [])
  );

  const formatTime = (start, end) => {
    const formatDateTime = (dateStr) => {
      const date = new Date(dateStr);
      return `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    };
    return `${formatDateTime(start)} ~ ${formatDateTime(end)}`;
  };

  const handleTimeChange = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setSelectedTime(selectedDate);
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      setSelectedTimeText(`${hours}:${minutes}`);
    }
  };
  const handleQuickJoin = async () => {
    try {
      const response = await fetch(
        "http://43.200.193.236:8080/running/quickrunning/participate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "빠른 참가에 실패했습니다.");
      }

      const data = await response.json();
      console.log("Quick join success:", data);

      // 성공 시 러닝방으로 이동
      router.push({
        pathname: "/participation/runningRecord",
        params: {
          roomId: data.groupId?.toString(),
          recordId: data.recordId?.toString(),
          roomTitle: data.roomTitle,
          startTime: data.startTime,
          endTime: data.endTime,
          targetDistance: data.targetDistance,
          maxParticipants: data.maxParticipants,
          selectedType: data.selectedType,
        },
      });
    } catch (error) {
      console.error("Error in quick join:", error);
      Alert.alert("오류", error.message);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="방 이름을 검색하세요."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={executeSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchIcon} onPress={executeSearch}>
            <Ionicons name="search" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.levelContainer}>
          {DIFFICULTY_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelButton,
                selectedLevel === level.id && styles.selectedLevel,
              ]}
              onPress={() => handleLevelSelect(level.id)}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  selectedLevel === level.id && styles.selectedLevelText,
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.timeSelector}
          onPress={() => setShowTimePicker(true)}
        >
          <Ionicons name="time-outline" size={24} color="#000" />
          <Text style={styles.timeSelectorText}>{selectedTimeText}</Text>
          <Ionicons name="chevron-down" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>클럽에서 참가</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchRunningRooms}
        >
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.roomList}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loadingIndicator}
          />
        ) : (
          <>
            {runningRooms.length > 0 ? (
              runningRooms.map((room) => (
                <RoomCard key={room.id} room={room} onPress={handleJoinRoom} />
              ))
            ) : (
              <Text style={styles.emptyText}>
                {searchQuery || selectedLevel
                  ? "검색 결과가 없습니다."
                  : "현재 생성된 방이 없습니다."}
              </Text>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/participation/participationMain")}
        >
          <Text style={styles.buttonText}>러닝 방 생성</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.joinButton]}
          onPress={handleQuickJoin}
        >
          <Text style={styles.buttonText}>빠른 참가</Text>
        </TouchableOpacity>
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
          style={styles.timePicker}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F3F8",
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 44,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
  },
  searchIcon: {
    padding: 8,
  },
  levelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  levelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  selectedLevel: {
    backgroundColor: "#8DCCFF",
    borderColor: "#8DCCFF",
  },
  levelButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedLevelText: {
    color: "#fff",
    fontWeight: "600",
  },
  timeSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeSelectorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  refreshButton: {
    padding: 8,
  },
  roomList: {
    flex: 1,
    padding: 16,
  },
  roomCard: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: "#F0F3F8",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  levelText: {
    color: "#8DCCFF",
    fontSize: 14,
    fontWeight: "600",
  },
  timeText: {
    color: "#666",
    fontSize: 14,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  distanceText: {
    color: "#666",
    fontSize: 14,
  },
  buttonContainer: {
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#8DCCFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  joinButton: {
    backgroundColor: "#6BADE3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  timePicker: {
    backgroundColor: "white",
    width: Platform.OS === "ios" ? "100%" : "auto",
  },
  loadingIndicator: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  // 모달 관련 스타일
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#8DCCFF",
    fontWeight: "600",
  },
});

export default RunningMateSearch;
