import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Dimensions, FlatList, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COURSE_ITEM_WIDTH = SCREEN_WIDTH - 60;

// 더미 데이터 정의
const DUMMY_COURSES = [
  {
    id: 1,
    name: '한강 러닝 코스',
    distance: '5km',
    difficulty: '초급',
    image: 'https://i.imgur.com/UwZR5mF.jpeg',
    estimatedTime: '30분',
  },
  {
    id: 2,
    name: '올림픽 공원 코스',
    distance: '7km',
    difficulty: '중급',
    image: 'https://i.imgur.com/BHPqxdw.jpeg',
    estimatedTime: '45분',
  },
  {
    id: 3,
    name: '남산 트레일',
    distance: '8km',
    difficulty: '고급',
    image: 'https://i.imgur.com/2dXRRmp.jpeg',
    estimatedTime: '50분',
  },
  {
    id: 4,
    name: '청계천 러닝',
    distance: '4km',
    difficulty: '초급',
    image: 'https://i.imgur.com/Q9JqXpi.jpeg',
    estimatedTime: '25분',
  },
];

const DUMMY_SPOTS = [
  {
    id: 1,
    user: '러너 김철수',
    date: '2024.02.15',
    spotName: '여의도 한강공원',
    spotDescription: '새벽 러닝하기 좋아요! 러닝 메이트 구합니다 👋',
    likes: 24,
    images: ['https://i.imgur.com/Q9JqXpi.jpeg']
  },
  {
    id: 2,
    user: '마라토너 이영희',
    date: '2024.02.14',
    spotName: '올림픽공원',
    spotDescription: '저녁에 사람 적고 공기 좋아요~ 코스도 잘 되어있습니다!',
    likes: 18,
    images: ['https://i.imgur.com/BHPqxdw.jpeg']
  },
  {
    id: 3,
    user: '러닝왕 박지성',
    date: '2024.02.13',
    spotName: '남산 둘레길',
    spotDescription: '경사가 있어서 운동 효과 최고입니다. 주말 아침이 가장 좋아요',
    likes: 35,
    images: ['https://i.imgur.com/2dXRRmp.jpeg']
  }
];

const DUMMY_GROUPS = [
  {
    id: 1,
    title: '아침을 여는 러너들',
    startTime: '06:00',
    endTime: '07:00',
    distance: '5km',
    currentMembers: 3,
    maxMembers: 6,
    level: '초급',
    location: '여의도 한강공원'
  },
  {
    id: 2,
    title: '퇴근 후 스트레스 해소',
    startTime: '19:00',
    endTime: '20:00',
    distance: '7km',
    currentMembers: 4,
    maxMembers: 8,
    level: '중급',
    location: '올림픽공원'
  },
  {
    id: 3,
    title: '주말 마라톤 준비',
    startTime: '08:00',
    endTime: '09:30',
    distance: '10km',
    currentMembers: 5,
    maxMembers: 10,
    level: '고급',
    location: '남산 둘레길'
  },
  {
    id: 4,
    title: '초보자 환영 러닝',
    startTime: '07:00',
    endTime: '08:00',
    distance: '3km',
    currentMembers: 2,
    maxMembers: 6,
    level: '초급',
    location: '청계천'
  },
];

const DUMMY_EXERCISE = [
  {
    id: 1,
    title: '아침을 여는 러너들',
    startTime: '06:00',
    endTime: '07:00',
    distance: '5km',
    currentMembers: 3,
    maxMembers: 6,
    level: '초급',
    location: '여의도 한강공원'
  },
  {
    id: 2,
    title: '퇴근 후 스트레스 해소',
    startTime: '19:00',
    endTime: '20:00',
    distance: '7km',
    currentMembers: 4,
    maxMembers: 8,
    level: '중급',
    location: '올림픽공원'
  },
  {
    id: 3,
    title: '주말 마라톤 준비',
    startTime: '08:00',
    endTime: '09:30',
    distance: '10km',
    currentMembers: 5,
    maxMembers: 10,
    level: '고급',
    location: '남산 둘레길'
  },
  {
    id: 4,
    title: '초보자 환영 러닝',
    startTime: '07:00',
    endTime: '08:00',
    distance: '3km',
    currentMembers: 2,
    maxMembers: 6,
    level: '초급',
    location: '청계천'
  },
];


const HomeScreen = () => {
  const navigation = useNavigation();
  const courseListRef = useRef(null);
  const [liked, setLiked] = useState<{[key: number]: boolean}>({});

  // 코스 자동 스크롤
  useEffect(() => {
    let scrollInterval;
    
    const startAutoScroll = () => {
      let currentIndex = 0;
      scrollInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % DUMMY_COURSES.length;
        courseListRef.current?.scrollToIndex({
          index: currentIndex,
          animated: true,
        });
      }, 3000);
    };

    startAutoScroll();

    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };
  }, []);

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.courseItemContainer}
      onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
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

  // 메인 러닝 그리기 
  const renderSpotPost = ({ item }) => (
    <TouchableOpacity 
      style={styles.spotContainer}
      onPress={() => navigation.navigate('SpotDetail', { spotId: item.id })}
    >
      <View style={styles.spotHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.user}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <TouchableOpacity 
          style={styles.likeButton}
          onPress={() => {
            setLiked(prev => ({
              ...prev,
              [item.id]: !prev[item.id]
            }));
          }}
        >
          <Text style={styles.heartIcon}>{liked[item.id] ? '❤️' : '🤍'}</Text>
          <Text style={styles.likeCount}>
            {liked[item.id] ? item.likes + 1 : item.likes}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.spotName}>{item.spotName}</Text>
      <Text style={styles.spotDescription} numberOfLines={2}>
        {item.spotDescription}
      </Text>
      
    </TouchableOpacity>
  );

  const renderGroup = ({ item }) => (
    <TouchableOpacity 
      style={styles.groupContainer}
      onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })}
    >
      <View style={styles.groupHeader}>
        <Text style={styles.groupTitle}>{item.title}</Text>
        <View style={[
          styles.groupBadge,
          {
            backgroundColor: 
              item.level === '초급' ? '#e3f2fd' :
              item.level === '중급' ? '#fff3e0' : '#fbe9e7'
          }
        ]}>
          <Text style={[
            styles.groupLevel,
            {
              color: 
                item.level === '초급' ? '#1976d2' :
                item.level === '중급' ? '#f57c00' : '#d32f2f'
            }
          ]}>{item.level}</Text>
        </View>
      </View>
      <View style={styles.groupInfo}>
        <View style={styles.groupDetail}>
          <Text style={styles.groupTime}>
            ⏰ {item.startTime} - {item.endTime}
          </Text>
          <Text style={styles.groupDistance}>
            🏃‍♂️ {item.distance}
          </Text>
        </View>
        <View style={styles.groupDetail}>
          <Text style={styles.groupLocation}>
            📍 {item.location}
          </Text>
          <Text style={styles.groupMembers}>
            👥 {item.currentMembers}/{item.maxMembers}명
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          <TouchableOpacity onPress={() => navigation.navigate('community')}>
            <Text style={styles.moreButton}>더보기 ≫</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={DUMMY_SPOTS}
          renderItem={renderSpotPost}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
      </View>
      {/* 러닝 스팟 게시판 섹션 */}

      {/* 운동인증 게시판 섹션 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>운동인증 공유 게시판</Text>
          <TouchableOpacity onPress={() => navigation.navigate('community')}>
            <Text style={styles.moreButton}>더보기 ≫</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={DUMMY_SPOTS}
          renderItem={renderSpotPost}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
      </View>
      {/* 운동인증 게시판 섹션 */}

      {/* 러닝 그룹 섹션 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>현재 이런 방이 생성되어 있어요!</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RunningGroups')}>
            <Text style={styles.moreButton}>더보기 ≫</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={DUMMY_GROUPS}
          renderItem={renderGroup}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
      </View>
      {/* 러닝 그룹 섹션 */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    paddingHorizontal: 10,
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