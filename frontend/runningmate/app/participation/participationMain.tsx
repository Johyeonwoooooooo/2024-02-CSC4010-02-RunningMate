import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  SafeAreaView,
  Alert,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

const LEVEL_MAPPING = {
  초보: "BEGINNER",
  중수: "INTERMEDIATE",
  고수: "ATHLETE",
  선수: "EXPERT",
};

const CreateRunningRoom = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      //title: "", // 헤더의 제목을 빈 문자열로 설정
    });
  }, [navigation]);

  // 초기 시간 설정
  const initTimes = (() => {
    const now = new Date();
    const defaultStart = new Date(now.getTime() + 30 * 60 * 1000);
    const defaultEnd = new Date(defaultStart.getTime() + 60 * 60 * 1000);
    return {
      defaultStartTime: defaultStart,
      defaultEndTime: defaultEnd,
    };
  })();

  // 상태 관리
  const [formData, setFormData] = useState({
    roomTitle: "",
    selectedType: "초보",
    targetDistance: "",
    maxParticipants: "",
  });

  const [timeData, setTimeData] = useState(() => {
    const today = new Date();
    const now = new Date(today.getTime() + 9 * 60 * 60 * 1000);
    const endTime = new Date(today.getTime() + 9 * 60 * 60 * 1000);
    console.log(now, '하씨발')
    return {
        startTime: now,
        endTime: endTime,
        showStartPicker: false,
        showEndPicker: false,
        tempStartTime: now,
        tempEndTime: endTime,
    };
  });

  const [errors, setErrors] = useState({
    targetDistance: false,
    maxParticipants: false,
  });

  // 입력값 변경 핸들러
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 숫자 입력 검증
  const validateNumber = (value, field) => {
    const isValid = value === "" || /^\d+$/.test(value);
    setErrors((prev) => ({
      ...prev,
      [field]: !isValid,
    }));
    return isValid;
  };

  // 시간 포맷팅
  const formatTime = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return "시간 선택";
    
    const displayDate = new Date(date.getTime());
    displayDate.setHours(displayDate.getHours() - 9);  // 현재 시간에서 9시간을 뺌
    const hours = displayDate.getHours().toString().padStart(2, '0');
    const minutes = displayDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};




  console.log("startTime", timeData.startTime);
  console.log("endTime", timeData.endTime);
  // 시간 검증
  const validateTimes = (start, end) => {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9); // 현재 시간을 KST로 변환
    const errors = {};

    const minStartTime = currentTime;
    if (start < minStartTime) {
        errors.startTime = "시작 시간은 현재 시간 이후여야 합니다.";
    }

    const minEndTime = new Date(start.getTime() + 30 * 60 * 1000);
    if (end < minEndTime) {
        errors.endTime = "종료 시간은 시작 시간으로부터 최소 30분 이후여야 합니다.";
    }

    return errors;
  };

  // 시간 선택 핸들러
  const handleStartTimeChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
        setTimeData((prev) => ({ ...prev, showStartPicker: false }));
    }
    
    if (selectedDate) {
        // 선택된 시간에 9시간을 더해서 KST로 저장
        const kstDate = new Date(selectedDate.getTime() + 9 * 60 * 60 * 1000);
        setTimeData(prev => ({
            ...prev,
            tempStartTime: kstDate,
        }));
    }
  };


  // 확인 버튼 핸들러 추가
  const handleConfirmStartTime = () => {
    const timeErrors = validateTimes(timeData.tempStartTime, timeData.endTime);
    if (timeErrors.startTime) {
        Alert.alert("시간 오류", timeErrors.startTime);
        return;
    }

    // 종료 시간도 KST 기준으로 설정
    const newEndTime = new Date(timeData.tempStartTime);
    newEndTime.setHours(newEndTime.getHours() + 1);

    setTimeData(prev => ({
        ...prev,
        startTime: prev.tempStartTime,
        endTime: newEndTime,
        tempEndTime: newEndTime,
        showStartPicker: false,
    }));
  };
   
  const handleEndTimeChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
        setTimeData((prev) => ({ ...prev, showEndPicker: false }));
    }
    
    if (selectedDate) {
        // 선택된 시간에 9시간을 더해서 KST로 저장
        const kstDate = new Date(selectedDate.getTime() + 9 * 60 * 60 * 1000);
        setTimeData(prev => ({
            ...prev,
            tempEndTime: kstDate,
        }));
    }
  };

const handleConfirmEndTime = () => {
  const timeErrors = validateTimes(timeData.startTime, timeData.tempEndTime);
  if (timeErrors.endTime) {
    Alert.alert("시간 오류", timeErrors.endTime);
    return;
  }

  setTimeData(prev => ({
    ...prev,
    endTime: prev.tempEndTime,
    showEndPicker: false,
  }));
};

  // 방 생성 핸들러
  const handleCreateRoom = async () => {
    if (!formData.roomTitle.trim()) {
      Alert.alert("입력 오류", "방 제목을 입력해주세요.");
      return;
    }

    if (!formData.targetDistance || !formData.maxParticipants) {
      Alert.alert("입력 오류", "목표 거리와 최대 참가 인원을 입력해주세요.");
      return;
    }

    const timeErrors = validateTimes(timeData.startTime, timeData.endTime);
    if (Object.keys(timeErrors).length > 0) {
      Alert.alert("시간 오류", Object.values(timeErrors).join("\n"));
      return;
    }

    try {
      const requestData = {
        groupTitle: formData.roomTitle,
        startTime: timeData.startTime.toISOString(),
        endTime: timeData.endTime.toISOString(),
        targetDistance: parseInt(formData.targetDistance),
        groupTag: LEVEL_MAPPING[formData.selectedType],
        maxParticipants: parseInt(formData.maxParticipants),
      };

      console.log("Request Data:", requestData);

      const response = await fetch(
        "http:localhost:8080/running/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (!response.ok) {
        throw new Error(responseText || "방 생성에 실패했습니다.");
      }

      const data = JSON.parse(responseText);
      console.log("Success data:", data);

      // 성공 시 대기실로 이동
      console.log("생성된 recordID : ", data.recordId?.toString());
      router.push({
        pathname: "/participation/waitingRoom",
        params: {
          roomId: data.groupId?.toString(),
          recordId: data.recordId?.toString(),
          roomTitle: formData.roomTitle,
          startTime: timeData.startTime.toISOString(),
          endTime: timeData.endTime.toISOString(),
          targetDistance: formData.targetDistance,
          maxParticipants: formData.maxParticipants,
          selectedType: formData.selectedType,
        },
      });
    } catch (error) {
      console.error("Error creating room:", error);
      Alert.alert("오류", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>러닝 방 생성</Text>

          <TextInput
            style={styles.input}
            placeholder="방 제목을 입력하세요"
            value={formData.roomTitle}
            onChangeText={(text) => handleInputChange("roomTitle", text)}
          />

          <View style={styles.typeButtons}>
            {["초보", "중수", "고수", "선수"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  formData.selectedType === type && styles.selectedTypeButton,
                ]}
                onPress={() => handleInputChange("selectedType", type)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    formData.selectedType === type &&
                      styles.selectedTypeButtonText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.timeSection}>
            <TouchableOpacity
              style={styles.timeSelector}
              onPress={() =>
                setTimeData((prev) => ({ ...prev, showStartPicker: true }))
              }
            >
              <Ionicons name="time-outline" size={24} color="#666" />
              <Text style={styles.timeSelectorText}>
                시작 시간: {formatTime(new Date(timeData.startTime.getTime()))}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.timeSelector}
              onPress={() =>
                setTimeData((prev) => ({ ...prev, showEndPicker: true }))
              }
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="#666"
              />
              <Text style={styles.timeSelectorText}>
                종료 시간: {formatTime(new Date(timeData.endTime.getTime()))}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <View
              style={[
                styles.inputBox,
                errors.targetDistance && styles.inputBoxError,
              ]}
            >
              <Text style={styles.inputLabel}>목표 거리 (km)</Text>
              <TextInput
                style={styles.boxInput}
                value={formData.targetDistance}
                onChangeText={(text) => {
                  if (validateNumber(text, "targetDistance")) {
                    handleInputChange("targetDistance", text);
                  }
                }}
                keyboardType="numeric"
                placeholder="숫자만 입력해주세요"
              />
            </View>

            <View
              style={[
                styles.inputBox,
                errors.maxParticipants && styles.inputBoxError,
              ]}
            >
              <Text style={styles.inputLabel}>최대 참가 인원</Text>
              <TextInput
                style={styles.boxInput}
                value={formData.maxParticipants}
                onChangeText={(text) => {
                  if (validateNumber(text, "maxParticipants")) {
                    handleInputChange("maxParticipants", text);
                  }
                }}
                keyboardType="numeric"
                placeholder="숫자만 입력해주세요"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Time Picker Modals */}
      {timeData.showStartPicker &&
        (Platform.OS === "ios" ? (
          <Modal
            transparent={true}
            animationType="slide"
            visible={timeData.showStartPicker}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <DateTimePicker
                  value={new Date(timeData.startTime.getTime() - 9 * 60 * 60 * 1000)}
                  mode="time"
                  display="spinner"
                  onChange={handleStartTimeChange}
                  minuteInterval={5}
                  timeZoneName="Asia/Seoul"
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() =>
                      setTimeData((prev) => ({
                        ...prev,
                        showStartPicker: false,
                        tempStartTime: prev.startTime,  // 취소 시 이전 값으로 복원
                      }))
                    }
                  >
                    <Text style={styles.modalButtonText}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonConfirm]}
                    onPress={handleConfirmStartTime}
                  >
                    <Text style={styles.modalButtonTextConfirm}>확인</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={new Date(timeData.startTime.getTime() - 9 * 60 * 60 * 1000)}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleStartTimeChange}
            minuteInterval={5}
            timeZoneName="Asia/Seoul"
          />
        ))}

      {timeData.showEndPicker &&
        (Platform.OS === "ios" ? (
          <Modal
            transparent={true}
            animationType="slide"
            visible={timeData.showEndPicker}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <DateTimePicker
                  value={new Date(timeData.endTime.getTime() - 9 * 60 * 60 * 1000)}
                  mode="time"
                  display="spinner"
                  onChange={handleEndTimeChange}
                  minuteInterval={5}
                  timeZoneName="Asia/Seoul"
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() =>
                      setTimeData((prev) => ({ ...prev, showEndPicker: false }))
                    }
                  >
                    <Text style={styles.modalButtonText}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonConfirm]}
                    onPress={() =>
                      setTimeData((prev) => ({ ...prev, showEndPicker: false }))
                    }
                  >
                    <Text style={styles.modalButtonTextConfirm}>확인</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={new Date(timeData.endTime.getTime() - 9 * 60 * 60 * 1000)}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleEndTimeChange}
            minuteInterval={5}
            timeZoneName="Asia/Seoul"
          />
        ))}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateRoom}
        >
          <Text style={styles.createButtonText}>러닝 방 생성</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    padding: 30,
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    marginBottom: 24,
    fontSize: 16,
  },
  typeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  typeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    minWidth: 80,
    alignItems: "center",
  },
  selectedTypeButton: {
    backgroundColor: "#8DCCFF",
  },
  typeButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedTypeButtonText: {
    color: "white",
    fontWeight: "600",
  },
  timeSection: {
    marginBottom: 24,
    gap: 12,
  },
  timeSelector: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "white",
  },
  timeSelectorText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  inputSection: {
    gap: 16,
    marginBottom: 24,
  },
  inputBox: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputBoxError: {
    borderColor: "#ff4444",
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  boxInput: {
    fontSize: 16,
    color: "#333",
    padding: 0,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
  },
  createButton: {
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
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  // Modal Styles
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 30,
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
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  modalButtonConfirm: {
    backgroundColor: "#8DCCFF",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#666",
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  // Error Styles
  errorContainer: {
    marginTop: 4,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
  },
  // Additional Time Picker Styles
  timePickerContainer: {
    backgroundColor: "white",
    padding: 20,
  },
  timePickerText: {
    fontSize: 16,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  // Disabled State Styles
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#999",
  },
  // Input Focus Styles
  inputFocused: {
    borderColor: "#8DCCFF",
    borderWidth: 2,
  },
  // Loading State Styles
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});

export default CreateRunningRoom;
