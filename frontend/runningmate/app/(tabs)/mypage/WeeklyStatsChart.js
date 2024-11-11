import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

const WeeklyStatsChart = ({ weeklyStats }) => {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.contentText}>주간 달리기 통계</Text>
      <LineChart
        data={{
          labels: weeklyStats.labels,
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
        width={Dimensions.get("window").width - 32}
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
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
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
});

export default WeeklyStatsChart;
