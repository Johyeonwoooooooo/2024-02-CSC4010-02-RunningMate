import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";

export default function RunningScreen() {
  const [distance, setDistance] = useState(0);
  const [previousLocation, setPreviousLocation] = useState(null);

  useEffect(() => {
    let locationSubscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          if (previousLocation) {
            const newDistance = getDistance(
              previousLocation.coords.latitude,
              previousLocation.coords.longitude,
              location.coords.latitude,
              location.coords.longitude
            );
            setDistance((prevDistance) => {
              const updatedDistance = prevDistance + newDistance;
              console.log(
                `Updated Distance: ${(updatedDistance / 1000).toFixed(3)} km`
              );
              return updatedDistance;
            });
          }
          setPreviousLocation(location);
        }
      );
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [previousLocation]);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Running</Text>
      </View>
      <Text style={styles.distance}>
        Distance: {(distance / 1000).toFixed(3)} km
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  distance: {
    fontSize: 20,
    marginTop: 20,
  },
});
