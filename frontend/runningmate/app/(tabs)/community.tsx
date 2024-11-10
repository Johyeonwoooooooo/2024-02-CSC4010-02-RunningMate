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
  TouchableWithoutFeedback,
  TextInput // TextInput import 추가
} from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import AlertModal from '../../components/modal/AlertModal'

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.6;

// CommentsModal 컴포넌트 수정
const CommentsModal = ({ visible, onClose }) => {
  const [comment, setComment] = useState('');

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
              {/* 헤더 */}
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>댓글</ThemedText>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              {/* 댓글 목록 */}
              <View style={styles.commentsContainer}>
                <ScrollView>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((index) => (
                    <View key={index} style={styles.commentItem}>
                      <View style={styles.commentHeader}>
                        <View style={styles.smallProfileCircle} />
                        <View>
                          <ThemedText style={styles.commentUserName}>
                            User {index}
                          </ThemedText>
                          <ThemedText style={styles.commentTime}>
                            {index}시간 전
                          </ThemedText>
                        </View>
                      </View>
                      <ThemedText style={styles.commentText}>
                        댓글 내용 {index}
                      </ThemedText>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* 입력창 */}
              <View style={styles.commentInputContainer}>
                <View style={styles.commentInputWrapper}>
                  <TextInput
                    style={styles.commentInput}
                    value={comment}
                    onChangeText={setComment}
                    placeholder="댓글을 입력하세요..."
                    placeholderTextColor="#666"
                    multiline
                  />
                  <TouchableOpacity style={styles.sendButton}>
                    <Ionicons name="send" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// + 버튼 글 쓰기
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

// PostCard 컴포넌트
const PostCard = () => {
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // 삭제 모달 상태 추가
  const [isLove, setIsLove] = useState(false); // 좋아요

  // 삭제 처리 함수
  const handleDelete = () => {
    // 삭제 로직 구현
    setIsDeleteModalVisible(false);
  };
  const handleLove = () => {
    setIsLove(false);

  }

  return (
    <ThemedView style={styles.postCard}>
      
      <ThemedView style={styles.postHeader}>
        <ThemedView style={styles.userInfo}>
          <ThemedView style={styles.profileCircle} />
          <ThemedText style={styles.userName}>공유 레츠고</ThemedText>
        </ThemedView>
        <TouchableOpacity onPress={() => setIsDeleteModalVisible(true)}>
          <Ionicons 
            name="trash-outline" size={20} color="#808080" 
          />
        </TouchableOpacity>
        {/* 삭제 확인 모달 */}
        <AlertModal 
          visible={isDeleteModalVisible}
          onClose={() => setIsDeleteModalVisible(false)}
          onConfirm={handleDelete}
          title="글을 삭제하시겠습니까?"
          message="삭제된 글은 복구가 어렵습니다."
        />
      </ThemedView>
      <ThemedView style={styles.grayArea} />
      <ThemedView style={styles.postActions}>
        <ThemedView style={styles.likeComment}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setIsLove(true)}>
            <Ionicons 
              name={isLove ? "heart" : "heart-outline"} // 상태에 따라 아이콘 변경
              size={24} 
              color={isLove ? "#FF69B4" : "#808080"} // 상태에 따라 색상 변경
            />
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

// Tab Navigation 컴포넌트들
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

// 운동인증 
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

// tab 이동
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
          tabBarIndicatorStyle: { backgroundColor: 'black' },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { marginTop: Platform.OS === 'ios' ? 47 : 0 },
        })}
      >
        <Tab.Screen name="러닝 스팟 공유" component={CommunityScreen} />
        <Tab.Screen name="운동 인증" component={ExerciseScreen} />
      </Tab.Navigator>
      {/* 글 쓰기 + 버튼 */}
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
    // paddingTop: 20,
  },
  postCard: {
    marginBottom: 8,          // 간격 조정
    backgroundColor: '#fff',
    borderTopWidth: 1,       // 상단 구분선 추가
    borderBottomWidth: 1,    // 하단 구분선 추가
    borderColor: '#DBDBDB',  // 인스타그램 스타일 구분선 색상
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,             // 패딩 살짝 증가
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCircle: {
    width: 32,              // 프로필 이미지 크기 조정
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  userName: {
    fontWeight: '600',      // 폰트 무게 조정
    fontSize: 14,           // 폰트 크기 조정
  },
  grayArea: {
    width: '100%',
    height: 300,
    backgroundColor: '#E0E0E0',
  },
  postActions: {
    paddingHorizontal: 12,  // 패딩 조정
    paddingVertical: 8,     // 패딩 조정
  },
  likeComment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,        // 간격 조정
  },
  actionCount: {
    marginLeft: 6,
    color: '#262626',       // 텍스트 색상 조정
    fontSize: 13,           // 폰트 크기 조정
  },
  caption: {
    paddingHorizontal: 12,  // 패딩 조정
    paddingBottom: 12,      // 패딩 조정
    fontSize: 14,           // 폰트 크기 조정
    color: '#262626',       // 텍스트 색상 조정
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
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentsList: {
    flex: 1,  // 중요: 남은 공간을 모두 차지
    marginVertical: 10,
    maxHeight: MODAL_HEIGHT - 130, // 헤더와 입력창 높이를 고려한 값
  },
  commentsListContent: {
    flexGrow: 1,          // 내용이 적어도 스크롤 가능하게
  },
  commentsContainer: {
    flex: 1,
    marginBottom: 10,
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
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    maxHeight: 80,
    paddingTop: Platform.OS === 'ios' ? 8 : 4,
    paddingBottom: Platform.OS === 'ios' ? 8 : 4,
  },
  sendButton: {
    paddingLeft: 10,
    paddingBottom: Platform.OS === 'ios' ? 6 : 4,
  },
});