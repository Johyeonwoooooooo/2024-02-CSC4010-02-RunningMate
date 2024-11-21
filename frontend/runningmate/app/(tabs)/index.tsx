import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Dimensions, FlatList, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COURSE_ITEM_WIDTH = SCREEN_WIDTH - 50;
const API_URL = 'http://localhost:8080';

// 더미 데이터 정의
const DUMMY_COURSES = [
  {
    id: 1,
    name: '한강 러닝 코스',
    distance: '5km',
    difficulty: '초급',
    image: 'https://runningmatebucket1.s3.ap-northeast-2.amazonaws.com/mainPage1.png',
    estimatedTime: '30분',
  },
  {
    id: 2,
    name: '올림픽 공원 코스',
    distance: '7km',
    difficulty: '중급',
    image: 'https://runningmatebucket1.s3.ap-northeast-2.amazonaws.com/mainPage2.png',
    estimatedTime: '45분',
  },
  {
    id: 3,
    name: '남산 트레일',
    distance: '8km',
    difficulty: '고급',
    image: 'https://runningmatebucket1.s3.ap-northeast-2.amazonaws.com/mainPage3.png',
    estimatedTime: '50분',
  },
  {
    id: 4,
    name: '청계천 러닝',
    distance: '4km',
    difficulty: '초급',
    image: 'https://runningmatebucket1.s3.ap-northeast-2.amazonaws.com/mainPage4.png',
    estimatedTime: '25분',
  },
  {
    id: 5,
    name: '한강 산책',
    distance: '2km',
    difficulty: '초급',
    image: 'https://runningmatebucket1.s3.ap-northeast-2.amazonaws.com/mainPage5.png',
    estimatedTime: '250분',
  },
];


const HomeScreen = () => {
  const navigation = useNavigation();
  const courseListRef = useRef(null);
  const [liked, setLiked] = useState<{[key: number]: boolean}>({});
  
  // 서버 데이터를 위한 상태 추가
  const [runningSpotPosts, setRunningSpotPosts] = useState([]);
  const [runningCertPosts, setRunningCertPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(runningCertPosts, 'gggggggggggg')
  // 서버에서 데이터 가져오기
  useEffect(() => {
    const fetchMainPageData = async () => {
      try {
        const response = await fetch(`${API_URL}/mainPage`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // 데이터 설정
        setRunningSpotPosts(data.mainPageRunningSpotPostList || []);
        setRunningCertPosts(data.mainPageRunningCertPostList || []);
        setGroups(data.mainPageGroupList || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching main page data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMainPageData();
  }, []);
  const router = useRouter();
  // 게시물 클릭 핸들러 수정
  const handlePostPress = (post) => {
    console.log(post.postTag, 'postttt')
    const tabIndex = post.postTag === true ? 0 : 1;
    console.log(tabIndex, "tabIndexxxxx")
    router.push({
      pathname: '/community',
      params: {
        selectedPostId: post.postId,
        initialTab: tabIndex
      }
    });
  };

  // 더보기 버튼 핸들러 수정
  const handleMorePress = (tabIndex) => {
    router.push({
      pathname: '/community',
      params: { 
        initialTab: tabIndex // 0 또는 1
      }
    });
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.courseItemContainer}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.courseImage}
        resizeMode="cover"
      />
      <View style={styles.courseInfo}>
        <Text style={styles.courseName}>{item.name}</Text>
        <View style={styles.courseDetails}>
          <Text style={styles.courseDistance}>🏃‍♂️ {item.distance}</Text>
          <Text style={styles.courseDifficulty}>난이도: {item.difficulty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // 게시물 렌더링 함수 통합
  const renderPost = ({ item }) => {
    const postId = item?.postId?.toString() || item?.id?.toString() || Math.random().toString();
    
    const formatDate = (dateString) => {
      if (!dateString) return '날짜 없음';
      try {
        return new Date(dateString).toLocaleDateString('ko-KR');
      } catch (error) {
        return '날짜 형식 오류';
      }
    };
    
    const handleLike = () => {
      setLiked(prev => ({
        ...prev,
        [postId]: !prev[postId]
      }));
    };
   
    const getLikeCount = () => {
      const baseCount = item?.likeCount || 0;
      return liked[postId] ? baseCount + 1 : baseCount;
    };
   
    return (
      <TouchableOpacity 
        style={styles.spotContainer}
        onPress={() => handlePostPress(item)}
      >
        <View style={styles.spotHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {item?.userNickname || '사용자 없음'}
            </Text>
            <Text style={styles.date}>
              {formatDate(item?.postDate)}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={handleLike}
          >
            <Text style={styles.heartIcon}>
              {liked[postId] ? '❤️' : '🤍'}
            </Text>
            <Text style={styles.likeCount}>
              {getLikeCount()}
            </Text>
          </TouchableOpacity>
        </View>
   
        <Text style={styles.spotName}>
          {item?.postTitle || '제목 없음'}
        </Text>
      </TouchableOpacity>
    );
   };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🏃‍♂️</Text>
        <Text style={styles.headerTitle}>Running Mate</Text>
      </View>

      {/* 추천 코스 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Running Mate가 추천하는 오늘의 코스!</Text>
        <FlatList
          ref={courseListRef}
          data={DUMMY_COURSES}
          renderItem={renderCourseItem}
          keyExtractor={item => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={COURSE_ITEM_WIDTH + 20}
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={styles.courseListContainer}
        />
      </View>

      {/* 러닝 스팟 게시판 섹션 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>러닝 스팟 공유 게시판</Text>
          <TouchableOpacity onPress={() => handleMorePress(0)}>
            <Text style={styles.moreButton}>더보기 ≫</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={runningSpotPosts}
          renderItem={renderPost}
          keyExtractor={item => item.postId.toString()}
          scrollEnabled={false}
        />
      </View>

      {/* 운동인증 게시판 섹션 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>운동인증 공유 게시판</Text>
          <TouchableOpacity onPress={() => handleMorePress(1)}>
            <Text style={styles.moreButton}>더보기 ≫</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={runningCertPosts}
          renderItem={renderPost}
          keyExtractor={item => item.postId.toString()}
          scrollEnabled={false}
        />
      </View>

      {/* 러닝 그룹 섹션 */}
      {groups.length > 0 && (
 <View style={styles.section}>
   <View style={styles.sectionHeader}>
     <Text style={styles.sectionTitle}>현재 이런 방이 생성되어 있어요!</Text>
     <TouchableOpacity onPress={() => navigation.navigate('running')}>
       <Text style={styles.moreButton}>더보기 ≫</Text>
     </TouchableOpacity>
   </View>
   <FlatList
     data={groups}
     renderItem={({ item }) => (
       <TouchableOpacity 
         style={styles.groupContainer}
         onPress={() => navigation.navigate('running', { groupId: item.groupId })}
       >
         <View style={styles.groupDetail}>
           <Text style={styles.groupTitle}>{item.groupTitle}</Text>
           <View style={styles.groupBadge}>
             <Text style={styles.groupLevel}>
               {item.groupTag === 'BEGINNER' ? '초보' : 
                item.groupTag === 'INTERMEDIATE' ? '중수' :
                item.groupTag === 'ADVANCED' ? '고수' : '선수'}
             </Text>
           </View>
         </View>
         <View style={styles.groupInfo}>
           <Text style={styles.groupTime}>
             {new Date(item.startTime).toLocaleTimeString('ko-KR', { 
               hour: '2-digit', 
               minute: '2-digit',
               hour12: true 
             })} ~ 
             {new Date(item.endTime).toLocaleTimeString('ko-KR', {
               hour: '2-digit',
               minute: '2-digit',
               hour12: true
             })}
           </Text>
           <Text style={styles.groupDistance}>목표 거리: {item.targetDistance}km</Text>
         </View>
       </TouchableOpacity>
     )}
     keyExtractor={item => item.groupId.toString()}
     scrollEnabled={false}
   />
 </View>
      )}
    </ScrollView>
  );
};

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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  moreButton: {
    color: '#666',
    fontSize: 14,
  },
  courseListContainer: {
    paddingHorizontal: 0,
  },
  courseItemContainer: {
    width: COURSE_ITEM_WIDTH,
    marginHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  courseInfo: {
    padding: 12,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseDistance: {
    fontSize: 14,
    color: '#666',
  },
  courseDifficulty: {
    fontSize: 14,
    color: '#666',
  },
  spotContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  spotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  heartIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  likeCount: {
    fontSize: 12,
    color: '#666',
  },
  spotName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  spotDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
    lineHeight: 20,
  },
  spotImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  groupContainer: {
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#f0f0f0',
  },
  groupHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
  },
  groupTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      flex: 1,
  },
  groupBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
  },
  groupLevel: {
      fontSize: 12,
      fontWeight: '600',
  },
  groupInfo: {
      gap: 8,
  },
  groupDetail: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  groupTime: {
      fontSize: 14,
      color: '#666',
  },
  groupDistance: {
      fontSize: 14,
      color: '#666',
  },
  groupLocation: {
      fontSize: 14,
      color: '#666',
  },
  groupMembers: {
      fontSize: 14,
      color: '#666',
  },
  
});

export default HomeScreen;