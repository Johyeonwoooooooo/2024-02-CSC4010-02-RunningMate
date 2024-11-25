import { LineChart, BarChart } from "react-native-chart-kit";
import { View, Text, Dimensions, StyleSheet } from 'react-native';
console.log('1111')
const WeeklyStatsChart = ({ records }) => {
  const [data, setData] = useState([]);
  const screenWidth = Dimensions.get("window").width - 32;
  console.log(data, 'grach')
  useEffect(() => {
    if (records && records.length > 0) {
      const processedData = records.map(item => ({
        ...item,
        date: new Date(item.recordDate).toLocaleDateString('ko-KR', {
          month: 'numeric',
          day: 'numeric'
        }),
        dayName: new Date(item.recordDate).toLocaleDateString('ko-KR', {
          weekday: 'short'
        })
      })).sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate));
      console.log(processedData, 'ppppp')
      setData(processedData);
    }
  }, [records]);

  // 차트 설정
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#3b82f6"
    }
  };

  // 거리 데이터
  const distanceData = {
    labels: data.map(item => item.dayName),
    datasets: [{
      data: data.map(item => item.dailyDistance || 0),
    }],
    legend: ["거리 (km)"]
  };

  // 칼로리 데이터
  const caloriesData = {
    labels: data.map(item => item.dayName),
    datasets: [{
      data: data.map(item => item.weekCalories || 0)
    }],
    legend: ["칼로리 (kcal)"]
  };

  return (
    <View style={styles.chartContainer}>
      {/* 거리 그래프 */}
      <Text style={styles.chartTitle}>일일 달린 거리 (km)</Text>
      {data.length > 0 && (
        <LineChart
          data={distanceData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
          fromZero
          yAxisSuffix="km"
        />
      )}

      {/* 칼로리 그래프 */}
      <Text style={styles.chartTitle}>일일 소모 칼로리 (kcal)</Text>
      {data.length > 0 && (
        <BarChart
          data={caloriesData}
          width={screenWidth}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
          fromZero
          yAxisSuffix="kcal"
        />
      )}

      {/* 일별 데이터 박스 */}
      <View style={styles.dayBoxContainer}>
        {data.map((day, index) => (
          <View
            key={day.recordDate}
            style={[
              styles.dayBox,
              { backgroundColor: index === data.length - 1 ? '#3b82f6' : '#eff6ff' }
            ]}
          >
            <Text style={[
              styles.dayBoxText,
              styles.dayBoxTitle,
              { color: index === data.length - 1 ? 'white' : 'black' }
            ]}>
              {day.dayName}
            </Text>
            <Text style={[
              styles.dayBoxText,
              styles.dayBoxDate,
              { color: index === data.length - 1 ? 'white' : 'black' }
            ]}>
              {day.date}
            </Text>
            <Text style={[
              styles.dayBoxText,
              styles.dayBoxDistance,
              { color: index === data.length - 1 ? 'white' : 'black' }
            ]}>
              {day.dailyDistance || 0}km
            </Text>
            <Text style={[
              styles.dayBoxText,
              styles.dayBoxCalories,
              { color: index === data.length - 1 ? 'white' : 'black' }
            ]}>
              {day.weekCalories || 0}kcal
            </Text>
          </View>
        ))}
      </View>

      {/* 총계 정보 */}
      <View style={styles.totalInfoContainer}>
        <View style={styles.totalInfoItem}>
          <Text style={styles.totalInfoLabel}>총 거리</Text>
          <Text style={styles.totalInfoValue}>
            {totalDistance.toFixed(2)} km
          </Text>
        </View>
        <View style={styles.totalInfoItem}>
          <Text style={styles.totalInfoLabel}>총 칼로리</Text>
          <Text style={styles.totalInfoValue}>
            {totalCalories.toFixed(2)} kcal
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#1a1a1a',
  },
  dayBoxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  dayBox: {
    width: '13.5%',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8
  },
  dayBoxText: {
    textAlign: 'center',
  },
  dayBoxTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dayBoxDate: {
    fontSize: 12,
  },
  dayBoxDistance: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  dayBoxCalories: {
    fontSize: 12,
  },
  totalInfoContainer: {
    padding: 16,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  totalInfoItem: {
    alignItems: 'center',
  },
  totalInfoLabel: {
    color: '#1e3a8a',
    fontSize: 14,
  },
  totalInfoValue: {
    color: '#1e3a8a',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default WeeklyStatsChart;