import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Platform,
  Text,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const DIFFICULTY_LEVELS = [
  { id: 'beginner', label: '초보' },
  { id: 'intermediate', label: '중수' },
  { id: 'advanced', label: '고수' },
  { id: 'expert', label: '선수' }
];

const RoomCard = ({ level, title, time, distance }) => (
  <TouchableOpacity style={styles.roomCard}>
    <View style={styles.roomHeader}>
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>{level}</Text>
      </View>
      <Text style={styles.timeText}>목표 시간: {time}</Text>
    </View>
    <Text style={styles.titleText}>{title}</Text>
    <Text style={styles.distanceText}>목표 거리: {distance}</Text>
  </TouchableOpacity>
);

export default function RunningMateSearch() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedTimeText, setSelectedTimeText] = useState('러닝 시작 시간 입력');

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleTimeChange = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setSelectedTime(selectedDate);
      setSelectedTimeText(formatTime(selectedDate));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="방 이름을 검색하세요."
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchIcon}>
            <Ionicons name="search" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.levelContainer}>
          {DIFFICULTY_LEVELS.map(level => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelButton,
                selectedLevel === level.id && styles.selectedLevel
              ]}
              onPress={() => setSelectedLevel(level.id)}
            >
              <Text style={[
                styles.levelButtonText,
                selectedLevel === level.id && styles.selectedLevelText
              ]}>
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

      <Text style={styles.sectionTitle}>클럽에서 참가</Text>

      <ScrollView style={styles.roomList}>
        <RoomCard
          level="초보"
          title="현재 생성되어 있는 러닝 방"
          time="7:30 ~ 8:15"
          distance="3km"
        />
        <RoomCard
          level="중수"
          title="마라톤 준비"
          time="7:30 ~ 8:15"
          distance="5km"
        />
        <RoomCard
          level="고수"
          title="모의 마라톤 할 사람"
          time="7:30 ~ 8:15"
          distance="7km"
        />
        <RoomCard
          level="중수"
          title="1일 1시간 러닝"
          time="7:30 ~ 8:15"
          distance="5km"
        />
        <RoomCard
          level="선수"
          title="1일 1시간 러닝"
          time="7:30 ~ 8:15"
          distance="5km"
        />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>러닝 방 생성</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.joinButton]}>
          <Text style={styles.buttonText}>빠른 참가</Text>
        </TouchableOpacity>
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
          style={styles.timePicker}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F3F8',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchIcon: {
    padding: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  levelButton: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedLevel: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  levelButtonText: {
    color: '#666',
  },
  selectedLevelText: {
    color: '#fff',
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  timeSelectorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
  roomList: {
    flex: 1,
    padding: 10,
  },
  roomCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: '#F0F3F8',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  levelText: {
    color: '#007AFF',
    fontSize: 14,
  },
  timeText: {
    color: '#666',
    fontSize: 14,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  distanceText: {
    color: '#666',
    fontSize: 14,
  },
  buttonContainer: {
    padding: 16,
    gap: 8,
  },
  button: {
    backgroundColor: '#8DCCFF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#6BADE3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timePicker: {
    backgroundColor: 'white',
    width: Platform.OS === 'ios' ? '100%' : 'auto',
  },
});