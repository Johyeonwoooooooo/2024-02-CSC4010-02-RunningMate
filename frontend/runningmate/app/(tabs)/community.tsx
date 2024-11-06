import React, { useState } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import { 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Platform, 
  View,
  Modal,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.5;

const CommentsModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>댓글</ThemedText>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.commentsList}>
                <View style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <View style={styles.smallProfileCircle} />
                    <View>
                      <ThemedText style={styles.commentUserName}>User 1</ThemedText>
                      <ThemedText style={styles.commentTime}>2시간 전</ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.commentText}>멋진 러닝이네요!</ThemedText>
                </View>

                <View style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <View style={styles.smallProfileCircle} />
                    <View>
                      <ThemedText style={styles.commentUserName}>User 2</ThemedText>
                      <ThemedText style={styles.commentTime}>1시간 전</ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.commentText}>저도 오늘 러닝했어요!</ThemedText>
                </View>

                <View style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <View style={styles.smallProfileCircle} />
                    <View>
                      <ThemedText style={styles.commentUserName}>User 2</ThemedText>
                      <ThemedText style={styles.commentTime}>1시간 전</ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.commentText}>저도 오늘 러닝했어요!</ThemedText>
                </View>
              </ScrollView>

              <View style={styles.commentInputContainer}>
                <View style={styles.commentInput}>
                  <ThemedText style={styles.placeholder}>댓글을 입력하세요...</ThemedText>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// 플로팅 버튼
const FloatingActionButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.fab}
      onPress={() => router.push('/community/feedCreate')}
    >
      <Ionicons name="add" size={24} color="#000000" />
    </TouchableOpacity>
  );
};

const PostCard = () => {
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);

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
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setIsCommentsModalVisible(true)}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#808080" />
            <ThemedText style={styles.actionCount}>3</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      <ThemedText style={styles.caption}>오늘의 러닝!</ThemedText>

      <CommentsModal 
        visible={isCommentsModalVisible}
        onClose={() => setIsCommentsModalVisible(false)}
      />
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
          tabBarStyle: { marginTop: Platform.OS === 'ios' ? 47 : 0 },
        })}
      >
        <Tab.Screen name="러닝 스팟 공유" component={CommunityScreen} />
        <Tab.Screen name="운동 인증" component={ExerciseScreen} />
      </Tab.Navigator>
      <FloatingActionButton />
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: MODAL_HEIGHT,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentsList: {
    flex: 1,
    marginVertical: 10,
  },
  commentItem: {
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  smallProfileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  commentUserName: {
    fontWeight: 'bold',
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
  },
  commentText: {
    marginLeft: 42,
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  commentInput: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    minHeight: 40,
    justifyContent: 'center',
  },
  placeholder: {
    color: '#666',
    fontSize: 14,
  },
  // 탭 네비게이션 스타일
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none',
  },
  tabIndicator: {
    backgroundColor: 'tomato',
    height: 2,
  },
});