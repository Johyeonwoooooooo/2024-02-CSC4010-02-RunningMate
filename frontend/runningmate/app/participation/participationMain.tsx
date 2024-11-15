import React, { useState } from 'react';
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
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const LEVEL_MAPPING = {
  '초보': 'BEGINNER',
  '중수': 'INTERMEDIATE',
  '고수': 'ATHLETE',
  '선수': 'EXPERT'
};

const CreateRunningRoom = ({ navigation }) => {
  const getCurrentTime = () => {
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    return {
      dateObject: koreaTime,
      time24: `${String(koreaTime.getHours()).padStart(2, '0')}:${String(koreaTime.getMinutes()).padStart(2, '0')}`,
      time12: koreaTime.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      hours: koreaTime.getHours(),
      minutes: koreaTime.getMinutes(),
      oneHourLater: new Date(koreaTime.getTime() + (60 * 60 * 1000))
    };
  };

  const [selectedType, setSelectedType] = useState('초보');
  const [roomTitle, setRoomTitle] = useState('');
  const [targetDistance, setTargetDistance] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const currentTime = getCurrentTime();

  const [startTime, setStartTime] = useState(currentTime.dateObject);
  const [endTime, setEndTime] = useState(currentTime.oneHourLater);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [errors, setErrors] = useState({
    targetDistance: false,
    maxParticipants: false
  });

  const validateNumber = (value, field) => {
    const isValid = value === '' || /^\d+$/.test(value);
    setErrors(prev => ({
      ...prev,
      [field]: !isValid
    }));
    return isValid;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '시간 정보 없음';
    
    try {
      const date = new Date(timeString);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error('Time formatting error:', error);
      return '시간 정보 오류';
    }
  };

  const validateTimes = (start, end) => {
    const currentTime = new Date();
    const errors = {};

    if (start < currentTime) {
      errors.startTime = '시작 시간은 현재 시간 이후여야 합니다.';
    }

    if (end <= start) {
      errors.endTime = '종료 시간은 시작 시간 이후여야 합니다.';
    }

    return errors;
  };

  const handleStartTimeChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      const timeErrors = validateTimes(selectedDate, endTime);
      if (timeErrors.startTime) {
        Alert.alert('시간 오류', timeErrors.startTime);
        return;
      }
      setStartTime(selectedDate);
    }
  };


  const router = useRouter();
  const handleCreateRoom = async () => {
    if (!roomTitle.trim()) {
      Alert.alert('입력 오류', '방 제목을 입력해주세요.');
      return;
    }

    if (!targetDistance || !maxParticipants) {
      Alert.alert('입력 오류', '목표 거리와 최대 참가 인원을 입력해주세요.');
      return;
    }

    const timeErrors = validateTimes(startTime, endTime);
    if (Object.keys(timeErrors).length > 0) {
      Alert.alert('시간 오류', Object.values(timeErrors).join('\n'));
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/running/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupTitle: roomTitle,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          targetDistance: parseInt(targetDistance),
          groupTag: LEVEL_MAPPING[selectedType],
          maxParticipants: parseInt(maxParticipants)
        })
      });

      if (!response.ok) {
        throw new Error('방 생성에 실패했습니다.');
      }

      const data = await response.json();
      
      router.push({
        pathname: './waitingRoom',
        params: {
          roomTitle: roomTitle,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          targetDistance: targetDistance,
          maxParticipants: maxParticipants,
          selectedType: selectedType
        }
      });
    } catch (error) {
      Alert.alert('오류', error.message);
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
            value={roomTitle}
            onChangeText={setRoomTitle}
          />
          
          <View style={styles.typeButtons}>
            {['초보', '중수', '고수', '선수'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  selectedType === type && styles.selectedTypeButton
                ]}
                onPress={() => setSelectedType(type)}
              >
                <Text style={[
                  styles.typeButtonText,
                  selectedType === type && styles.selectedTypeButtonText
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.timeSection}>
            <TouchableOpacity 
              style={styles.timeSelector}
              onPress={() => setShowStartPicker(true)}
            >
              <Ionicons name="time-outline" size={24} color="#666" />
              <Text style={styles.timeSelectorText}>
                시작 시간: {formatTime(startTime)}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.timeSelector}
              onPress={() => setShowEndPicker(true)}
            >
              <Ionicons name="checkmark-circle-outline" size={24} color="#666" />
              <Text style={styles.timeSelectorText}>
                종료 시간: {formatTime(endTime)}
              </Text>
            </TouchableOpacity>
          </View>

          
          {showStartPicker && Platform.OS === 'ios' && (
            <Modal
              transparent={true}
              animationType="slide"
              visible={showStartPicker}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="spinner"
                    onChange={handleStartTimeChange}
                    minimumDate={new Date()}
                  />
                  <TouchableOpacity
                    onPress={() => setShowStartPicker(false)}
                    style={styles.closeButton}
                  >
                    <Text>확인</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
          {showStartPicker && Platform.OS === 'android' && (
            <DateTimePicker
              value={startTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleStartTimeChange}
            />
          )}

          {showEndPicker && Platform.OS === 'ios' && (
            <Modal
              transparent={true}
              animationType="slide"
              visible={showEndPicker}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="spinner"
                    onChange={handleEndTimeChange}
                    minimumDate={startTime}
                  />
                  <TouchableOpacity
                    onPress={() => setShowEndPicker(false)}
                    style={styles.closeButton}
                  >
                    <Text>확인</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          {showEndPicker && Platform.OS === 'android' && (
            <DateTimePicker
              value={endTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleEndTimeChange}
            />
          )}
          
          <View style={styles.inputSection}>
            <View style={[
              styles.inputBox,
              errors.targetDistance && styles.inputBoxError
            ]}>
              <Text style={styles.inputLabel}>목표 거리 (km)</Text>
              <TextInput
                style={styles.boxInput}
                value={targetDistance}
                onChangeText={(text) => {
                  if (validateNumber(text, 'targetDistance')) {
                    setTargetDistance(text);
                  }
                }}
                keyboardType="numeric"
                placeholder="숫자만 입력해주세요"
              />
            </View>
            
            <View style={[
              styles.inputBox,
              errors.maxParticipants && styles.inputBoxError
            ]}>
              <Text style={styles.inputLabel}>최대 참가 인원</Text>
              <TextInput
                style={styles.boxInput}
                value={maxParticipants}
                onChangeText={(text) => {
                  if (validateNumber(text, 'maxParticipants')) {
                    setMaxParticipants(text);
                  }
                }}
                keyboardType="numeric"
                placeholder="숫자만 입력해주세요"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateRoom}
        >
          <Text style={styles.createButtonText}>러닝 방 생성</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>생성 취소</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    padding: 12,
    marginBottom: 24,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  selectedTypeButton: {
    backgroundColor: '#8DCCFF',
  },
  typeButtonText: {
    color: '#666',
  },
  selectedTypeButtonText: {
    color: '#fff',
  },
  timeSection: {
    marginBottom: 24,
    gap: 12,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  timeSelectorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  inputSection: {
    gap: 16,
  },
  inputBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
  },
  inputBoxError: {
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  boxInput: {
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 34,
    gap: 8,
  },
  createButton: {
    backgroundColor: '#8DCCFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
});

export default CreateRunningRoom;