import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].tint,
        headerShown: false,
      }}
    >
      {/* home page */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              source={
                focused
                  ? require("../../assets/icons/home_color.png")
                  : require("../../assets/icons/home.png")
              }
              style={{ tintColor: color }}
            />
          ),
        }}
      />
      {/* running page */}
      <Tabs.Screen
        name="running"
        options={{
          title: "Running",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              source={
                focused
                  ? require("../../assets/icons/running_color.png")
                  : require("../../assets/icons/running.png")
              }
              style={{ tintColor: color }}
            />
          ),
        }}
      />
      {/* community page */}
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              source={
                focused
                  ? require("../../assets/icons/community_color.png")
                  : require("../../assets/icons/community.png")
              }
              style={{ tintColor: color }}
            />
          ),
        }}
      />
      {/* my page */}
      <Tabs.Screen
        name="mypage"
        options={{
          title: "My Page",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              source={
                focused
                  ? require("../../assets/icons/mypage_color.png")
                  : require("../../assets/icons/mypage.png")
              }
              style={{ tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
