import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const FloatingActionButton = () => {
  return (
    <TouchableOpacity style={styles.fab}>
      <Ionicons name="add" size={24} color="#000000" />
    </TouchableOpacity>
  );
};

const PostCard = () => {
  return (
    <ThemedView style={styles.postCard}>
      {/* 게시물 헤더: 프로필과 사용자 이름, 삭제 버튼 */}
      <ThemedView style={styles.postHeader}>
        <ThemedView style={styles.userInfo}>
          {/* 프로필 이미지 대신 회색 원 */}
          <ThemedView style={styles.profileCircle} />
          <ThemedText style={styles.userName}>러닝 스팟 공유</ThemedText>
        </ThemedView>
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={20} color="#808080" />
        </TouchableOpacity>
      </ThemedView>

      {/* 이미지 대신 회색 영역 */}
      <ThemedView style={styles.grayArea} />

      {/* 좋아요, 댓글 버튼 영역 */}
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

      {/* 게시물 설명 텍스트 */}
      <ThemedText style={styles.caption}>오늘의 러닝!</ThemedText>
    </ThemedView>
  );
};

export default function CommunityScreen() {
  const bottomNavHeight = 60;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomNavHeight + 20 }
        ]}
      >
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
      </ScrollView>
      <FloatingActionButton />
    </SafeAreaView>
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
  // 프로필 이미지 대신 회색 원
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
  // 이미지 영역 대신 회색 영역
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