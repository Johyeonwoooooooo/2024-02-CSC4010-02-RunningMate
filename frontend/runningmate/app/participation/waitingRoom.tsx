// screens/participation/RunningWaitingRoom.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { router, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ParticipantCard = ({ name }) => (
  <View style={styles.participantCard}>
    <View style={styles.participantInfo}>
      <Ionicons name="person-circle-outline" size={24} color="#666" />
      <Text style={styles.participantName}>{name}</Text>
    </View>
    {/* <View style={[styles.levelBadge, styles[`level${level}`]]}>
      <Text style={styles.levelText}>{level}</Text>
    </View> */}
  </View>
);

const RunningWaitingRoom = ({ route, navigation }) => {
    const params = useLocalSearchParams();
    const { roomTitle, startTime, endTime, targetDistance, maxParticipants } = params;
  
    console.log('Received params:', params);  // 파라미터 확인용 로그
    
    const [timeLeft, setTimeLeft] = useState('');
    const [participants, setParticipants] = useState([
      { id: 1, name: '방장' },
      { id: 2, name: '참가자1'},
      { id: 3, name: '참가자2'},
    ]);

  // 남은 시간 계산 함수
  const calculateTimeLeft = () => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;

    if (diff <= 0) {
      // 시작 시간이 되면 러닝 화면으로 자동 이동
      router.push('../(tabs)/running') // 이건 지금 러닝 참가 첫 화면 변경해야함.
      return '러닝 시작!';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 방 나가기
  const handleLeaveRoom = () => {
    Alert.alert(
      "방 나가기",
      "정말로 방을 나가시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        { 
          text: "나가기", 
          onPress: () => router.push('../(tabs)/running'),
          style: "destructive"
        }
      ]
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{roomTitle}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>러닝 시작까지</Text>
          <Text style={styles.timeLeft}>{timeLeft}</Text>
        </View>

        <View style={styles.runningInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>목표 거리</Text>
            <Text style={styles.infoValue}>{targetDistance}km</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>러닝 시간</Text>
            <Text style={styles.infoValue}>
              {new Date(startTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} ~ 
              {new Date(endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.participantsContainer}>
        <Text style={styles.sectionTitle}>
          참가자 ({participants.length}/{maxParticipants})
        </Text>
        <ScrollView style={styles.participantsList}>
          {participants.map(participant => (
            <ParticipantCard 
              key={participant.id}
              name={participant.name}
            />
          ))}
        </ScrollView>
      </View>

      {/* 하단 나가기 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.leaveButton}
          onPress={handleLeaveRoom}
        >
          <Text style={styles.leaveButtonText}>러닝방 나가기</Text>
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  // 버튼 컨테이너 스타일 수정
  buttonContainer: {
    padding: 16,
    paddingBottom: 34, // Safe area 고려
  },
  // 나가기 버튼 스타일 수정
  leaveButton: {
    backgroundColor: '#FF4444',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    width: '100%',
  },
  leaveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timeLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  timeLeft: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  runningInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  participantsContainer: {
    flex: 1,
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  participantsList: {
    flex: 1,
  },
  participantCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantName: {
    marginLeft: 8,
    fontSize: 16,
  },
  levelBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  level초보: {
    backgroundColor: '#e3f2fd',
  },
  level중수: {
    backgroundColor: '#e8f5e9',
  },
  level고수: {
    backgroundColor: '#fff3e0',
  },
  level선수: {
    backgroundColor: '#fce4ec',
  },
  levelText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RunningWaitingRoom;