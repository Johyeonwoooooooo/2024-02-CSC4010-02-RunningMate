import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

// 오늘 날짜부터 일주일 동안의 날짜 생성
const generateWeekLabels = () => {
  const labels = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    labels.unshift(`${date.getMonth() + 1}/${date.getDate()}`);
  }
  return labels;
};

const WeeklyStatsChart = ({ weeklyStats }) => {
  // 오늘 날짜부터 일주일 동안의 날짜 생성
  const weekLabels = generateWeekLabels();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.contentText}>주간 달리기 통계</Text>
        {/* 차트 */}
        <LineChart
          data={{
            labels: weekLabels,
            datasets: [
              {
                data: weeklyStats.distances,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: weeklyStats.calories,
                color: (opacity = 1) => `rgba(244, 65, 134, ${opacity})`,
                strokeWidth: 2,
              },
            ],
            legend: ["거리", "칼로리"],
          }}
          width={Dimensions.get("window").width - 64} // 조절 필요
          height={220}
          chartConfig={{
            backgroundColor: "#8dccff",
            backgroundGradientFrom: "#8dccff",
            backgroundGradientTo: "#8dccff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "0",
              stroke: "#fff",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
        {/* 총 거리와 칼로리 출력 */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            총 거리:{" "}
            {weeklyStats.distances
              .reduce((acc, cur) => acc + cur, 0)
              .toFixed(2)}{" "}
            km
          </Text>
          <Text style={styles.summaryText}>
            총 칼로리:{" "}
            {weeklyStats.calories.reduce((acc, cur) => acc + cur, 0).toFixed(2)}{" "}
            kcal
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  contentText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  summaryContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#CDE9FF",
    borderRadius: 8,
    borderColor: "#CDE9FF",
    borderWidth: 1,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});

export default WeeklyStatsChart;
