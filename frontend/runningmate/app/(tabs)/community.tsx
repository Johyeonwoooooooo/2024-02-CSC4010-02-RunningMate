import React, { useState, useEffect } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from '@react-navigation/native';
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
  TextInput,
  ActivityIndicator,
  Image
} from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import AlertModal from '../../components/modal/AlertModal';
import { useWindowDimensions, RefreshControl } from 'react-native';
const API_URL = 'http://localhost:8080';


// CommentsModal 컴포넌트 수정
const CommentsModal = ({ visible, onClose, postId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  console.log('Modal opened with postId:', postId); // postId 로깅 추가
  // 댓글 목록을 가져오는 함수
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/community/post/${postId}/comments`);
      
      if (!response.ok) {
        throw new Error('댓글을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setComments(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('댓글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // visible이나 postId가 변경될 때 댓글 목록 가져오기
  useEffect(() => {
    if (visible && postId) {
      fetchComments();
    }
  }, [visible, postId]);

  // 댓글 등록 핸들러
  const handleSubmitComment = async () => {
    if (!comment.trim() || !postId) {
      console.error('Missing required data:', { comment: comment.trim(), postId });
      return;
    }
  
    try {
      const commentData = {
        commentContent: comment.trim(),
        postId: postId // postId 추가
      };
  
      console.log('Sending comment request:', {
        url: `${API_URL}/community/post/${postId}/comment`,
        data: commentData
      });
  
      const response = await fetch(`${API_URL}/community/post/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData)
      });
  
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);
  
      if (response.ok) {
        setComment('');
        fetchComments();
      } else {
        Alert.alert('오류', '댓글 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    }
  };

  // 댓글 목록 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      if (!visible || !postId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/community/post/${postId}/comments`);
        if (!response.ok) {
          throw new Error('댓글을 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [visible, postId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}시간 전`;
    }
    return date.toLocaleDateString('ko-KR');
  };

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
                {loading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                  <ThemedText style={styles.errorText}>{error}</ThemedText>
                ) : comments.length === 0 ? (
                  <ThemedText style={styles.emptyText}>댓글이 없습니다.</ThemedText>
                ) : (
                  <ScrollView>
                    {comments.map((item) => (
                      <View key={item.commentId} style={styles.commentItem}>
                        <View style={styles.commentHeader}>
                          <View style={styles.smallProfileCircle} />
                          <View>
                            <ThemedText style={styles.commentUserName}>
                              {item.userNickname}
                            </ThemedText>
                            <ThemedText style={styles.commentTime}>
                              {formatDate(item.commentWriteTime)}
                            </ThemedText>
                          </View>
                        </View>
                        <ThemedText style={styles.commentText}>
                          {item.commentContent}
                        </ThemedText>
                      </View>
                    ))}
                  </ScrollView>
                )}
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
                  <TouchableOpacity 
                    style={styles.sendButton}
                    onPress={handleSubmitComment}
                  >
                    <Ionicons 
                      name="send" 
                      size={24} 
                      color={comment.trim() ? "#36A3FD" : "#666"}
                    />
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
const PostCard = ({ post, onDelete }) => { // onDelete prop 추가
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isLove, setIsLove] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  // 삭제 핸들러
  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/community/post/${post.postId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // 삭제 성공
        onDelete(post.postId); // 부모 컴포넌트에 삭제 알림
        Alert.alert('성공', '게시글이 삭제되었습니다.');
      } else {
        // 삭제 실패
        Alert.alert('오류', '게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  // 좋아요 
  const handleLike = async () => {
    try {
      const response = await fetch(`${API_URL}/community/post/${post.postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // 좋아요 상태 토글
        setIsLove(!isLove);
        // 좋아요 수 업데이트
        setLikeCount(prevCount => isLove ? prevCount - 1 : prevCount + 1);
      } else {
        console.error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  return (
    <ThemedView style={styles.postCard}>
      <ThemedView style={styles.postHeader}>
        <ThemedView style={styles.userInfo}>
          <ThemedView style={styles.profileCircle} />
          <ThemedText style={styles.userName}>{post.userNickname}</ThemedText>
        </ThemedView>
        {/* userId가 일치할 때만 삭제 버튼 표시 */}
        {post.userId === 1 && ( // 현재 로그인한 사용자의 ID와 비교
          <TouchableOpacity onPress={() => setIsDeleteModalVisible(true)}>
            <Ionicons name="trash-outline" size={20} color="#808080" />
          </TouchableOpacity>
        )}
        <AlertModal 
          visible={isDeleteModalVisible}
          onClose={() => setIsDeleteModalVisible(false)}
          onConfirm={handleDelete}
          title="글을 삭제하시겠습니까?"
          message="삭제된 글은 복구가 어렵습니다."
        />
      </ThemedView>
      {post.postImages && post.postImages.length > 0 && (
        <Image 
          source={{ uri: post.postImages[0] }} 
          style={styles.grayArea}
          resizeMode="cover"
        />
      )}
      <ThemedView style={styles.postActions}>
        <ThemedView style={styles.likeComment}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Ionicons 
              name={isLove ? "heart" : "heart-outline"}
              size={24} 
              color={isLove ? "#FF69B4" : "#808080"}
            />
            <ThemedText style={styles.actionCount}>{likeCount}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setIsCommentsModalVisible(true)}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#808080" />
            <ThemedText style={styles.actionCount}>{post.commentCount}</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      <ThemedText style={styles.caption}>{post.postTitle}</ThemedText>
      <ThemedText style={styles.content}>{post.postContent}</ThemedText>
      <ThemedText style={styles.date}>{formatDate(post.postDate)}</ThemedText>
      <CommentsModal 
        visible={isCommentsModalVisible}
        onClose={() => setIsCommentsModalVisible(false)}
        postId={post.postId} // postId가 실제로 전달되는지 확인
      />
    </ThemedView>
  );
};
// 게시글이 없을 때 보여줄 컴포넌트
const EmptyPostsView = () => (
  <View style={styles.emptyContainer}>
    <ThemedText style={styles.emptyText}>게시글이 존재하지 않습니다.</ThemedText>
  </View>
);

// Tab Navigation 컴포넌트들
const CommunityScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/community/post/get/running-spot`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('CommunityScreen - Fetched data:', data);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  // 게시글 삭제 핸들러
  const handlePostDelete = (deletedPostId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.postId !== deletedPostId));
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts && posts.length > 0 ? (
          posts.map(post => (
            <PostCard 
              key={post.postId} 
              post={post} 
              onDelete={handlePostDelete} // 삭제 핸들러 전달
            />
          ))
        ) : (
          <EmptyPostsView />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const ExerciseScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/community/post/get/exercise-proof`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('ExerciseScreen - Fetched data:', data);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts && posts.length > 0 ? (
          posts.map(post => <PostCard key={post.postId} post={post} />)
        ) : (
          <EmptyPostsView />
        )}
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
        <Tab.Screen 
          name="러닝 스팟 공유" 
          component={CommunityScreen} 
        />
        <Tab.Screen 
          name="운동 인증" 
          component={ExerciseScreen} 
        />
      </Tab.Navigator>
      <FloatingActionButton />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    fontSize: 14,
    color: '#262626',
  },
  date: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontSize: 12,
    color: '#8e8e8e',
  },
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
    height: '60%', // MODAL_HEIGHT 대신 비율 사용
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
  sendButton: {
    paddingLeft: 10,
    paddingBottom: Platform.OS === 'ios' ? 6 : 4,
  },
  commentInputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    backgroundColor: 'white',
  },
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    maxHeight: 80,
    paddingTop: Platform.OS === 'ios' ? 8 : 4,
    paddingBottom: Platform.OS === 'ios' ? 8 : 4,
  },
  commentsList: {
    flex: 1,
    marginVertical: 10,
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