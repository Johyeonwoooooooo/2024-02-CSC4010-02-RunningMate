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
    const [isActive, setIsActive] = useState(true); // 타이머 활성화 상태 추가
    const [participants, setParticipants] = useState([
      { id: 1, name: '방장' },
      { id: 2, name: '참가자1'},
      { id: 3, name: '참가자2'},
    ]);

  // 남은 시간 계산 함수
  const calculateTimeLeft = () => {
    if (!isActive) return; // 타이머가 비활성화되면 계산하지 않음
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
          onPress: () => {
            setIsActive(false); // 타이머 중지
            router.push('../(tabs)/running');
          },
          style: "destructive"
        }
      ]
    );
  };

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
    }

    // cleanup 함수
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isActive, params.startTime]); // isActive를 의존성 배열에 추가

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{params.roomTitle}</Text>
        
        <View style={styles.timeSection}>
          <Text style={styles.timeLabel}>러닝 시작까지</Text>
          <Text style={styles.timeLeft}>{timeLeft}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>목표 거리</Text>
            <Text style={styles.infoValue}>{params.targetDistance}km</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>러닝 시간</Text>
            <Text style={styles.infoValue}>
              오후 {new Date(params.startTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} ~
              오후 {new Date(params.endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>

        <View style={styles.participantsHeader}>
          <Text style={styles.participantsTitle}>
            참가자 ({participants.length}/{params.maxParticipants})
          </Text>
          <View style={[styles.levelBadge, styles[`level${params.selectedType}`]]}>
            <Text style={styles.levelBadgeText}>{params.selectedType}</Text>
          </View>
        </View>

        <ScrollView style={styles.participantsList}>
          {participants.map(participant => (
            <View key={participant.id} style={styles.participantItem}>
              <View style={styles.participantInfo}>
                <Ionicons name="person-circle-outline" size={24} color="#666" />
                <Text style={styles.participantName}>{participant.name}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity 
        style={styles.leaveButton}
        onPress={handleLeaveRoom}
      >
        <Text style={styles.leaveButtonText}>러닝방 나가기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  timeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timeLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  timeLeft: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0066FF',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  participantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  participantsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  levelBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  level초보: {
    backgroundColor: '#E3F2FD',
  },
  level중수: {
    backgroundColor: '#E8F5E9',
  },
  level고수: {
    backgroundColor: '#FFF3E0',
  },
  level선수: {
    backgroundColor: '#FCE4EC',
  },
  participantsList: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantName: {
    marginLeft: 10,
    fontSize: 16,
  },
  leaveButton: {
    backgroundColor: '#FF4444',
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 12,
  },
  leaveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RunningWaitingRoom;