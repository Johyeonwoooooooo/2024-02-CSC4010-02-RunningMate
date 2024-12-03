import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
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
          title: "홈",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              source={{
                uri: focused
                  ? "https://runningmatebucket1.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20241128_160545855_01.png"
                  : "https://runningmatebucket1.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20241128_160545855.png",
              }}
              style={{ tintColor: color }}
            />
          ),
        }}
      />
      {/* running page */}
      <Tabs.Screen
        name="running"
        options={{
          title: "러닝",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              source={{
                uri: focused
                  ? "https://runningmatebucket1.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20241128_160545855_05.png"
                  : "https://runningmatebucket1.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20241128_160545855_04.png",
              }}
              style={{ tintColor: color }}
            />
          ),
        }}
      />
      {/* community page */}
      <Tabs.Screen
        name="community"
        options={{
          title: "커뮤니티",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              source={{
                uri: focused
                  ? "https://runningmatebucket1.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20241128_160545855_07.png"
                  : "https://runningmatebucket1.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20241128_160545855_06.png",
              }}
              style={{ tintColor: color }}
            />
          ),
        }}
      />
      {/* my page */}
      <Tabs.Screen
        name="mypage"
        options={{
          title: "마이페이지",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              source={{
                uri: focused
                  ? "https://runningmatebucket1.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20241128_160545855_03.png"
                  : "https://runningmatebucket1.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20241128_160545855_02.png",
              }}
              style={{ tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
