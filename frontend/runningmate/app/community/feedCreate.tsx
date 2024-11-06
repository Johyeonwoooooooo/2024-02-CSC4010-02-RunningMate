import React, { useState } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import { 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  View, 
  Platform,
  SafeAreaView,
  ScrollView
} from "react-native";
import { useRouter } from 'expo-router';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from 'expo-router';

export default function FeedCreateScreen() {
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState(''); // 선택된 태그 상태 관리
  const router = useRouter();

  // 태그 선택 핸들러
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
  };

  // 태그 버튼 렌더링 함수
  const TagButton = ({ tag, icon }: { tag: string; icon: string }) => (
    <TouchableOpacity 
      style={[
        styles.tagButton,
        selectedTag === tag && styles.tagButtonActive // 선택된 태그에 대한 스타일
      ]}
      onPress={() => handleTagSelect(tag)}
    >
      <Ionicons 
        name={icon} 
        size={20} 
        color={selectedTag === tag ? '#fff' : '#000'} // 아이콘 색상도 변경
      />
      <ThemedText 
        style={[
          styles.tagText,
          selectedTag === tag && styles.tagTextActive // 텍스트 색상도 변경
        ]}
      >
        {tag}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <ThemedText style={styles.title}>글 제목을 작성해주세요</ThemedText>

        {/* 이미지 업로드 섹션 */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>이미지 추가</ThemedText>
          <TouchableOpacity style={styles.uploadBox}>
            <Ionicons name="image-outline" size={24} color="#666" />
            <ThemedText style={styles.uploadText}>Upload an image</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.maxSize}>Max file size: 5MB</ThemedText>
        </ThemedView>

        {/* 글 내용 섹션 */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>글 내용</ThemedText>
          <TextInput
            style={styles.contentInput}
            multiline
            placeholder="Write your post here"
            placeholderTextColor="#999"
            value={content}
            onChangeText={setContent}
            maxLength={280}
          />
          <ThemedText style={styles.maxSize}>Max characters: 280</ThemedText>
        </ThemedView>

        {/* 태그 선택 섹션 */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Select Tags</ThemedText>
          <ThemedView style={styles.tagsContainer}>
            <TagButton tag="운동 인증" icon="fitness-outline" />
            <TagButton tag="러닝 스팟 공유" icon="map-outline" />
          </ThemedView>
        </ThemedView>

        {/* 버튼 영역 */}
        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.buttonText}>취소</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton}>
            <ThemedText style={styles.submitButtonText}>게시하기</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  uploadBox: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  uploadText: {
    marginTop: 10,
    color: '#666',
  },
  maxSize: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  contentInput: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  tagButtonActive: {
    backgroundColor: '#36A3FD', // 선택된 태그 배경색
    borderColor: '#ADD8E6',
  },
  tagText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#000',
  },
  tagTextActive: {
    color: '#fff', // 선택된 태그 텍스트 색상
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#36A3FD',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});