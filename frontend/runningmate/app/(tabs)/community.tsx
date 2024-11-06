import React from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, View } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';

// 플로팅 버튼
const FloatingActionButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.fab}
      onPress={() => router.push('/community/create')} // 새 게시물 작성 페이지로 이동
    >
      <Ionicons name="add" size={24} color="#000000" />
    </TouchableOpacity>
  );
};

const PostCard = () => {
  return (
    <ThemedView style={styles.postCard}>
      <ThemedView style={styles.postHeader}>
        <ThemedView style={styles.userInfo}>
          <ThemedView style={styles.profileCircle} />
          <ThemedText style={styles.userName}>공유 레츠고</ThemedText>
        </ThemedView>
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={20} color="#808080" />
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.grayArea} />
      <ThemedView style={styles.postActions}>
        <ThemedView style={styles.likeComment}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={24} color="#808080" />
            <ThemedText style={styles.actionCount}>12</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#808080" />
            <ThemedText style={styles.actionCount}>3</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      <ThemedText style={styles.caption}>오늘의 러닝!</ThemedText>
    </ThemedView>
  );
};

const CommunityScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
      >
        <PostCard />
        <PostCard />
        <PostCard />
      </ScrollView>
      <FloatingActionButton />
    </SafeAreaView>
  );
};

const ExerciseScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <PostCard />
        <PostCard />
      </ScrollView>
    </SafeAreaView>
  );
};

const Tab = createMaterialTopTabNavigator();

export default function CommunityTabs() {
  return (
    <View style={styles.container}>
      {/* Stack 설정으로 상단 겹침 해결 */}
      <Stack.Screen 
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' }
        }} 
      />
      
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabelStyle: { fontSize: 14 },
          tabBarIndicatorStyle: { backgroundColor: 'tomato' },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { marginTop: Platform.OS === 'ios' ? 47 : 0 }, // iOS에서 상단 여백 추가
        })}
      >
        <Tab.Screen name="러닝 스팟 공유" component={CommunityScreen} />
        <Tab.Screen name="운동 인증" component={ExerciseScreen} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingTop: 20,
  },
  postCard: {
    marginBottom: 10,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
  },
  grayArea: {
    width: '100%',
    height: 300,
    backgroundColor: '#E0E0E0',
  },
  postActions: {
    padding: 10,
  },
  likeComment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionCount: {
    marginLeft: 5,
    color: '#808080',
  },
  caption: {
    padding: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});