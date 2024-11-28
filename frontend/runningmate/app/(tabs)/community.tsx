import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  View,
  Modal,
  TextInput,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Alert,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AlertModal from "../../components/modal/AlertModal";

const API_URL = "http://43.200.193.236:8080";

// CommentsModal 컴포넌트
const CommentsModal = ({ visible, onClose, postId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  // 댓글 불러오기
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/community/post/${postId}/comments`
      );

      if (!response.ok) {
        throw new Error("댓글을 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      setComments(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("댓글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && postId) {
      fetchComments();
    }
  }, [visible, postId]);
  // 댓글 달기
  const handleSubmitComment = async () => {
    if (!comment.trim() || !postId) return;

    try {
      const commentData = {
        commentContent: comment.trim(),
        postId: postId,
      };

      const response = await fetch(
        `${API_URL}/community/post/${postId}/comment`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(commentData),
        }
      );

      if (response.ok) {
        setComment("");
        fetchComments();
      } else {
        Alert.alert("오류", "댓글 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      Alert.alert("오류", "네트워크 오류가 발생했습니다.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours}시간 전`;
    }
    return date.toLocaleDateString("ko-KR");
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
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>댓글</ThemedText>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <View style={styles.commentsContainer}>
                {loading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                  <ThemedText style={styles.errorText}>{error}</ThemedText>
                ) : comments.length === 0 ? (
                  <ThemedText style={styles.emptyText}>
                    댓글이 없습니다.
                  </ThemedText>
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

// FloatingActionButton 컴포넌트
const FloatingActionButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => router.push("/community/feedCreate")}
    >
      <Ionicons name="add" size={24} color="#000000" />
    </TouchableOpacity>
  );
};

// PostCard 컴포넌트
const PostCard = ({ post, onDelete }) => {
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isLove, setIsLove] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  // 삭제 기능 구현
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${API_URL}/community/post/${post.postId}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        onDelete(post.postId);
        Alert.alert("성공", "게시글이 삭제되었습니다.");
      } else {
        Alert.alert("오류", "게시글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("오류", "네트워크 오류가 발생했습니다.");
    } finally {
      setIsDeleteModalVisible(false);
    }
  };
  // 좋아요 기능 구현
  const handleLike = async () => {
    try {
      const response = await fetch(
        `${API_URL}/community/post/${post.postId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setIsLove(!isLove);
        setLikeCount((prevCount) => (isLove ? prevCount - 1 : prevCount + 1));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  return (
    <ThemedView style={styles.postCard}>
      <ThemedView style={styles.postHeader}>
        <ThemedView style={styles.userInfo}>
          <ThemedView style={styles.profileCircle} />
          <ThemedText style={styles.userName}>{post.userNickname}</ThemedText>
        </ThemedView>
        {post.userId === 1 && (
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
            <ThemedText style={styles.actionCount}>
              {post.commentCount}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      <ThemedText style={styles.caption}>{post.postTitle}</ThemedText>
      <ThemedText style={styles.content}>{post.postContent}</ThemedText>
      <ThemedText style={styles.date}>{formatDate(post.postDate)}</ThemedText>
      <CommentsModal
        visible={isCommentsModalVisible}
        onClose={() => setIsCommentsModalVisible(false)}
        postId={post.postId}
      />
    </ThemedView>
  );
};

// EmptyPostsView 컴포넌트
const EmptyPostsView = () => (
  <View style={styles.emptyContainer}>
    <ThemedText style={styles.emptyText}>
      게시글이 존재하지 않습니다.
    </ThemedText>
  </View>
);

// 메인 CommunityScreen 컴포넌트
const CommunityScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialTab = params?.initialTab ? parseInt(params.initialTab) : 0;
  const selectedPostId = params?.selectedPostId;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [spotPosts, setSpotPosts] = useState([]);
  const [exercisePosts, setExercisePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }

      let spotData = [];
      let exerciseData = [];

      // 기본 데이터 가져오기
      const [spotResponse, exerciseResponse] = await Promise.all([
        fetch(`${API_URL}/community/post/get/running-spot`),
        fetch(`${API_URL}/community/post/get/exercise-proof`),
      ]);

      if (!spotResponse.ok || !exerciseResponse.ok) {
        throw new Error("Network response was not ok");
      }

      spotData = await spotResponse.json();
      exerciseData = await exerciseResponse.json();

      // 새로고침이 아니고 선택된 포스트가 있는 경우에만 처리
      if (!isRefreshing && selectedPostId) {
        try {
          const selectedSpotPost = spotData.find(
            (post) => post.postId.toString() === selectedPostId.toString()
          );
          const selectedExercisePost = exerciseData.find(
            (post) => post.postId.toString() === selectedPostId.toString()
          );

          if (selectedSpotPost) {
            const otherSpotPosts = spotData.filter(
              (post) => post.postId.toString() !== selectedPostId.toString()
            );
            spotData = [selectedSpotPost, ...otherSpotPosts];
            setActiveTab(0);
          } else if (selectedExercisePost) {
            const otherExercisePosts = exerciseData.filter(
              (post) => post.postId.toString() !== selectedPostId.toString()
            );
            exerciseData = [selectedExercisePost, ...otherExercisePosts];
            setActiveTab(1);
          } else {
            const selectedPostResponse = await fetch(
              `${API_URL}/community/post/get/${selectedPostId}`
            );

            if (selectedPostResponse.ok) {
              const selectedPost = await selectedPostResponse.json();
              if (selectedPost.postTag === true) {
                spotData = [selectedPost, ...spotData];
                setActiveTab(0);
              } else {
                exerciseData = [selectedPost, ...exerciseData];
                setActiveTab(1);
              }
            }
          }
        } catch (error) {
          console.error("Error processing selected post:", error);
        }
      }

      setSpotPosts(spotData);
      setExercisePosts(exerciseData);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 초기 로딩
  useEffect(() => {
    fetchPosts(false);
  }, []);

  // params 변경 감지
  useEffect(() => {
    if (params?.initialTab !== undefined) {
      setActiveTab(parseInt(params.initialTab));
    }
    if (selectedPostId) {
      fetchPosts(false);
    }
  }, [params?.initialTab, params?.selectedPostId]);

  // 새로고침 처리
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // 새로고침 시 URL 변경
    router.replace({
      pathname: "/community",
    });
    // 기본 데이터 로드
    fetchPosts(true);
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 0 && styles.activeTabButton]}
          onPress={() => setActiveTab(0)}
        >
          <ThemedText
            style={[styles.tabText, activeTab === 0 && styles.activeTabText]}
          >
            러닝 스팟 공유
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 1 && styles.activeTabButton]}
          onPress={() => setActiveTab(1)}
        >
          <ThemedText
            style={[styles.tabText, activeTab === 1 && styles.activeTabText]}
          >
            운동 인증
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 0 ? (
          spotPosts.length > 0 ? (
            spotPosts.map((post) => (
              <PostCard
                key={post.postId}
                post={post}
                onDelete={(postId) => handlePostDelete(postId, true)}
              />
            ))
          ) : (
            <EmptyPostsView />
          )
        ) : exercisePosts.length > 0 ? (
          exercisePosts.map((post) => (
            <PostCard
              key={post.postId}
              post={post}
              onDelete={(postId) => handlePostDelete(postId, false)}
            />
          ))
        ) : (
          <EmptyPostsView />
        )}
      </ScrollView>

      <FloatingActionButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabHeader: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginTop: Platform.OS === "ios" ? 47 : 0,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 5,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  postCard: {
    marginBottom: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#DBDBDB",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0E0E0",
    marginRight: 10,
  },
  userName: {
    fontWeight: "600",
    fontSize: 14,
  },
  grayArea: {
    width: "100%",
    height: 300,
    backgroundColor: "#E0E0E0",
  },
  postActions: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  likeComment: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionCount: {
    marginLeft: 6,
    color: "#262626",
    fontSize: 13,
  },
  caption: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontSize: 14,
    color: "#262626",
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    fontSize: 14,
    color: "#262626",
  },
  date: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontSize: 12,
    color: "#8e8e8e",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 80,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "60%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  smallProfileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0E0E0",
    marginRight: 10,
  },
  commentUserName: {
    fontWeight: "bold",
  },
  commentTime: {
    fontSize: 12,
    color: "#666",
  },
  commentText: {
    marginLeft: 42,
    color: "#333",
    fontSize: 14,
    lineHeight: 20,
  },
  commentInputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
  commentInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    maxHeight: 80,
    paddingTop: Platform.OS === "ios" ? 8 : 4,
    paddingBottom: Platform.OS === "ios" ? 8 : 4,
  },
  sendButton: {
    paddingLeft: 10,
    paddingBottom: Platform.OS === "ios" ? 6 : 4,
  },
});

export default CommunityScreen;
