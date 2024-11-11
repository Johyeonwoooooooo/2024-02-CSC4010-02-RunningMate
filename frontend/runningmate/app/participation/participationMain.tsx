
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Platform,  // Platform import 추가
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateRunningRoom = ({ navigation }) => {
  // 현재 시간 관련 유틸리티 함수들
  const getCurrentTime = () => {
    const now = new Date();
    // 한국 시간으로 변환 (UTC+9)
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    return {
      // Date 객체
      dateObject: koreaTime,
      // HH:mm 형식 (24시간)
      time24: `${String(koreaTime.getHours()).padStart(2, '0')}:${String(koreaTime.getMinutes()).padStart(2, '0')}`,
      // hh:mm AM/PM 형식 (12시간)
      time12: koreaTime.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      // 개별 시간 단위
      hours: koreaTime.getHours(),
      minutes: koreaTime.getMinutes(),
      // 1시간 뒤 시간
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

  const formatTime = (time) => {
    return time.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // 시간 검증 함수
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

  // DateTimePicker 핸들러
  const handleStartTimeChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      const timeErrors = validateTimes(selectedDate, endTime);
      if (timeErrors.startTime) {
        alert(timeErrors.startTime);
        return;
      }
      setStartTime(selectedDate);
    }
  };

  const handleEndTimeChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      const timeErrors = validateTimes(startTime, selectedDate);
      if (timeErrors.endTime) {
        alert(timeErrors.endTime);
        return;
      }
      setEndTime(selectedDate);
    }
  };
  const router = useRouter();
  // 방 생성 시 최종 유효성 검사
  const handleCreateRoom = () => {
    const timeErrors = validateTimes(startTime, endTime);
    if (Object.keys(timeErrors).length > 0) {
      alert(Object.values(timeErrors).join('\n'));
      return;
    }
    // 생성된 방으로 보내기 .
    router.push({
      pathname: './waitingRoom',
      params: {
        roomTitle: roomTitle,
        startTime: startTime.toISOString(), // Date 객체를 문자열로 변환
        endTime: endTime.toISOString(),
        targetDistance: targetDistance,
        maxParticipants: maxParticipants,
        selectedType: selectedType
      }
    });
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

          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              is24Hour={false}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleStartTimeChange}
              minimumDate={startTime}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              is24Hour={false}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleEndTimeChange}
              minimumDate={endTime}
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

      {showStartPicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartTime(selectedDate);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndTime(selectedDate);
          }}
        />
      )}
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
    paddingBottom: 34, // Safe area 고려
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
});

export default CreateRunningRoom;