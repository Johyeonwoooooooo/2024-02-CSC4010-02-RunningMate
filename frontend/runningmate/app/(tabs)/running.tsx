import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Platform,
  Text,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const DIFFICULTY_LEVELS = [
  { id: 'BEGINNER', label: '초보' },
  { id: 'INTERMEDIATE', label: '중수' },
  { id: 'ADVANCED', label: '고수' },
  { id: 'EXPERT', label: '선수' }
];

const RoomCard = ({ level, title, time, distance }) => (
  <TouchableOpacity style={styles.roomCard}>
    <View style={styles.roomHeader}>
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>{level || '레벨 미정'}</Text>
      </View>
      <Text style={styles.timeText}>목표 시간: {time || '미정'}</Text>
    </View>
    <Text style={styles.titleText}>{title || '제목 없음'}</Text>
    <Text style={styles.distanceText}>목표 거리: {distance || '미정'}</Text>
  </TouchableOpacity>
);

export default function RunningMateSearch() {
  const [runningRooms, setRunningRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedTimeText, setSelectedTimeText] = useState('러닝 시작 시간 입력');
  
  const navigation = useNavigation();
  const router = useRouter();

  const fetchRunningRooms = async () => {
    try {
      const response = await fetch('http://localhost:8080/running');
      if (!response.ok) throw new Error('Failed to fetch rooms');
      const data = await response.json();
      
      const formattedRooms = data.map(room => ({
        id: room.groupId,
        level: convertGroupTag(room.groupTag),
        title: room.groupTitle,
        time: formatTime(room.startTime, room.endTime),
        distance: `${room.targetDistance}km`
      }));

      setRunningRooms(formattedRooms);
    } catch (error) {
      console.error('Error fetching running rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRunningRooms();
  }, []);

  const convertGroupTag = (tag) => {
    const levels = {
      'BEGINNER': '초보',
      'INTERMEDIATE': '중수',
      'ADVANCED': '고수',
      'EXPERT': '선수'
    };
    return levels[tag] || '초보';
  };

  const formatTime = (start, end) => {
    const formatDateTime = (dateStr) => {
      const date = new Date(dateStr);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };
    return `${formatDateTime(start)} ~ ${formatDateTime(end)}`;
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
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
        ) : runningRooms.length > 0 ? (
          runningRooms.map(room => (
            <RoomCard
              key={room.id}
              level={room.level}
              title={room.title}
              time={room.time}
              distance={room.distance}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>현재 생성된 방이 없습니다.</Text>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/participation/participationMain')}
        >
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
  loadingIndicator: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});