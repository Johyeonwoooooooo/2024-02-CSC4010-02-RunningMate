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
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const DIFFICULTY_LEVELS = [
  { id: 'BEGINNER', label: '초보' },
  { id: 'INTERMEDIATE', label: '중수' },
  { id: 'ADVANCED', label: '고수' },
  { id: 'EXPERT', label: '선수' }
];

const RoomCard = ({ room, onPress }) => (
  <TouchableOpacity style={styles.roomCard} onPress={() => onPress(room)}>
    <View style={styles.roomHeader}>
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>{room.level || '레벨 미정'}</Text>
      </View>
      <Text style={styles.timeText}>목표 시간: {room.time || '미정'}</Text>
    </View>
    <Text style={styles.titleText}>{room.title || '제목 없음'}</Text>
    <Text style={styles.distanceText}>목표 거리: {room.distance || '미정'}</Text>
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
  const [joiningRoom, setJoiningRoom] = useState(false);
  
  const navigation = useNavigation();
  const router = useRouter();

  const fetchRunningRooms = async () => {
    setLoading(true);
    try {
      console.log('Fetching running rooms...');
      const response = await fetch('http://localhost:8080/running');
      
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      
      const data = await response.json();
      console.log('Fetched rooms:', data);
      
      const formattedRooms = data.map(room => ({
        id: room.groupId,
        level: convertGroupTag(room.groupTag),
        title: room.groupTitle,
        time: formatTime(room.startTime, room.endTime),
        distance: `${room.targetDistance}km`,
        startTime: room.startTime,
        endTime: room.endTime,
        targetDistance: room.targetDistance,
        maxParticipants: room.maxParticipants
      }));

      setRunningRooms(formattedRooms);
    } catch (error) {
      console.error('Error fetching running rooms:', error);
      Alert.alert('오류', '러닝방 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (room) => {
    if (joiningRoom) return;
    
    setJoiningRoom(true);
    try {
      console.log('Joining room with ID:', room.id);
      
      const response = await fetch(`http://localhost:8080/running/${room.id}/participate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // 에러 응답인 경우 (400, 500 등)
      if (!response.ok) {
        // 서버에서 받은 에러 메시지를 그대로 사용
        throw new Error(responseText);
      }

      // 성공 응답의 경우에만 JSON 파싱
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Success response parsing error:', e);
        throw new Error('서버 응답을 처리하는데 실패했습니다.');
      }

      // recordId 확인
      if (!result.recordId) {
        throw new Error('참가 기록 ID를 받지 못했습니다.');
      }

      // 참가 성공 시 대기실로 이동
      router.push({
        pathname: '../participation/waitingRoom',
        params: {
          roomId: room.id,
          recordId: result.recordId,
          roomTitle: room.title,
          startTime: room.startTime,
          endTime: room.endTime,
          targetDistance: room.targetDistance,
          maxParticipants: room.maxParticipants,
          selectedType: room.level
        }
      });

      Alert.alert('성공', '러닝 방 참가가 완료되었습니다.');

    } catch (error) {
      console.error('Joining room error:', error);
      Alert.alert(
        '참가 실패', 
        error.message,
        [{ text: '확인' }]
      );
    } finally {
      setJoiningRoom(false);
    }
  };

  // 화면이 포커스를 받을 때마다 실행
  useFocusEffect(
    React.useCallback(() => {
      fetchRunningRooms();
      return () => {
        // 화면을 벗어날 때 cleanup
        setRunningRooms([]);
        setLoading(true);
      };
    }, [])
  );

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
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      setSelectedTimeText(`${hours}:${minutes}`);
    }
  };

  // 검색과 필터링을 적용한 러닝방 목록
  const filteredRooms = runningRooms.filter(room => {
    const matchesSearch = room.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesLevel = selectedLevel ? room.level === convertGroupTag(selectedLevel) : true;
    return matchesSearch && matchesLevel;
  });

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
          <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onPress={handleJoinRoom}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>
            {searchText || selectedLevel ? '검색 결과가 없습니다.' : '현재 생성된 방이 없습니다.'}
          </Text>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
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