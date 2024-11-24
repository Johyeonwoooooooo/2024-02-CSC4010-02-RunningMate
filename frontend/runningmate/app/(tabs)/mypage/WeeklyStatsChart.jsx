import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';

console.log('aa')
const WeeklyStatsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/user/records');
        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다');
        }
        const jsonData = await response.json();
        
        const processedData = jsonData.map(item => ({
          ...item,
          date: new Date(item.recordDate).toLocaleDateString('ko-KR', {
            month: 'numeric',
            day: 'numeric'
          }),
          dayName: new Date(item.recordDate).toLocaleDateString('ko-KR', {
            weekday: 'short'
          })
        })).sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate));
        
        setData(processedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ textAlign: 'center' }}>데이터를 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ textAlign: 'center', color: 'red' }}>에러: {error}</Text>
      </View>
    );
  }

  // 총계 계산
  const totalDistance = data.reduce((acc, cur) => acc + cur.dailyDistance, 0);
  const totalCalories = data.reduce((acc, cur) => acc + cur.weekCalories, 0);

  return (
    <View style={{ padding: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        주간 달리기 통계
      </Text>

      {/* 차트 영역을 대체할 빈 컨테이너 */}
      <View style={{
        height: 220,
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0'
      }}>
      </View>

      {/* 일별 데이터 박스 */}
      <View style={{ 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        marginBottom: 16 
      }}>
        {data.map((day, index) => (
          <View
            key={day.recordDate}
            style={{
              width: '13.5%',
              backgroundColor: index === data.length - 1 ? '#3b82f6' : '#eff6ff',
              padding: 8,
              borderRadius: 8,
              marginBottom: 8
            }}
          >
            <Text style={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: index === data.length - 1 ? 'white' : 'black',
              marginBottom: 4
            }}>
              {day.dayName}
            </Text>
            <Text style={{
              textAlign: 'center',
              fontSize: 12,
              color: index === data.length - 1 ? 'white' : 'black'
            }}>
              {day.date}
            </Text>
            <Text style={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginTop: 8,
              color: index === data.length - 1 ? 'white' : 'black'
            }}>
              {day.dailyDistance}km
            </Text>
            <Text style={{
              textAlign: 'center',
              fontSize: 12,
              color: index === data.length - 1 ? 'white' : 'black'
            }}>
              {day.weekCalories}kcal
            </Text>
          </View>
        ))}
      </View>

      {/* 총계 정보 */}
      <View style={{
        padding: 16,
        backgroundColor: '#eff6ff',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-around'
      }}>
        <View>
          <Text style={{ color: '#1e3a8a', fontSize: 14 }}>총 거리</Text>
          <Text style={{ color: '#1e3a8a', fontSize: 18, fontWeight: 'bold' }}>
            {totalDistance.toFixed(2)} km
          </Text>
        </View>
        <View>
          <Text style={{ color: '#1e3a8a', fontSize: 14 }}>총 칼로리</Text>
          <Text style={{ color: '#1e3a8a', fontSize: 18, fontWeight: 'bold' }}>
            {totalCalories.toFixed(2)} kcal
          </Text>
        </View>
      </View>
    </View>
  );
};

export default WeeklyStatsChart;