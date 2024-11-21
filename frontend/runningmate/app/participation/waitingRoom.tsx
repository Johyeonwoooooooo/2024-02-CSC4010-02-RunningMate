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
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const RunningWaitingRoom = () => {
  const params = useLocalSearchParams();
  const { 
    roomTitle, 
    startTime, 
    endTime, 
    targetDistance, 
    maxParticipants,
    recordId,
    roomId,
    selectedType
  } = params;

  
  
  const [timeLeft, setTimeLeft] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 참가자 목록 조회 함수
  const fetchParticipants = async () => {
    try {
      const numericRoomId = parseInt(roomId, 10); // roomId를 숫자로 변환
      console.log('Fetching participants for roomId:', numericRoomId);

      const response = await fetch(`http://localhost:8080/running/${numericRoomId}/participants`);
      console.log('API Response status:', response.status);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Participants data:', data);
      
      if (data && Array.isArray(data.participants)) {
        const formattedParticipants = data.participants.map((name, index) => ({
          id: index + 1,
          name: name
        }));
        
        setParticipants(formattedParticipants);
        setError(null);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('Error fetching participants:', err);
      setError('참가자 목록을 불러오는데 실패했습니다.');
    }
  };

  // 방 나가기 API 호출 함수
  const cancelParticipation = async () => {
    setIsLoading(true);
    try {
      const numericRoomId = parseInt(roomId, 10);
      const numericRecordId = parseInt(recordId, 10);

      console.log('Sending cancel request with:', {
        groupId: numericRoomId,
        recordId: numericRecordId
      });

      const response = await fetch('http://localhost:8080/running/cancel', {
        method: 'DELETE',  
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          groupId: numericRoomId,
          recordId: numericRecordId
        })
      });

      // 응답 상태 및 데이터 로깅
      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = '취소 요청이 실패했습니다.';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }

      setIsActive(false);
      Alert.alert(
        "알림",
        "러닝방에서 나가셨습니다.",
        [
          {
            text: "확인",
            onPress: () => {
              setIsLoading(false);
              router.push('../(tabs)/running');
            }
          }
        ]
      );
    } catch (err) {
      console.error('Error in cancelParticipation:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack
      });
      
      Alert.alert(
        "오류",
        `방 나가기에 실패했습니다. (${err.message})`,
        [{ 
          text: "확인",
          onPress: () => setIsLoading(false)
        }]
      );
    }
  };

  // 남은 시간 계산 함수
  const calculateTimeLeft = () => {
    if (!isActive) return;
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;

    if (diff <= 0) {
      router.push('./runningRecord');
      return '러닝 시작!';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 참가자 목록 주기적 업데이트
  useEffect(() => {
    if (roomId) {  // roomId로 조건 변경
      fetchParticipants();

      const participantsInterval = setInterval(() => {
        fetchParticipants();
      }, 5000);

      return () => clearInterval(participantsInterval);
    } else {
      console.log('No roomId available');
    }
  }, [roomId]);  // roomId로 의존성 변경


  // 타이머 업데이트
  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isActive, startTime]);

  // 방 나나기 처리 함수
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
          onPress: async () => {
            await cancelParticipation();
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{roomTitle}</Text>
        
        <View style={styles.timeSection}>
          <Text style={styles.timeLabel}>러닝 시작까지</Text>
          <Text style={styles.timeLeft}>{timeLeft}</Text>
        </View>

        <View style={styles.infoSection}>
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

        <View style={styles.participantsHeader}>
          <Text style={styles.participantsTitle}>
            참가자 ({participants.length}/{maxParticipants})
          </Text>
          <View style={[styles.levelBadge, styles[`level${selectedType}`]]}>
            <Text style={styles.levelBadgeText}>{selectedType}</Text>
          </View>
        </View>

        <ScrollView style={styles.participantsList}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            participants.map(participant => (
              <View key={participant.id} style={styles.participantItem}>
                <View style={styles.participantInfo}>
                  <Ionicons name="person-circle-outline" size={24} color="#666" />
                  <Text style={styles.participantName}>{participant.name}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <TouchableOpacity 
        style={[
          styles.leaveButton,
          isLoading && styles.leaveButtonDisabled
        ]}
        onPress={handleLeaveRoom}
        disabled={isLoading}
      >
        <Text style={styles.leaveButtonText}>
          {isLoading ? "처리 중..." : "러닝방 나가기"}
        </Text>
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
  leaveButtonDisabled: {
    backgroundColor: '#FFB4B4',
  },
  leaveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
});

export default RunningWaitingRoom;