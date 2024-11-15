import React, { useState } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import { 
 StyleSheet, 
 TouchableOpacity, 
 TextInput, 
 View, 
 Platform,
 SafeAreaView,
 ScrollView,
 Alert,
 Image
} from "react-native";
import { useRouter } from 'expo-router';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://localhost:8080';

export default function FeedCreateScreen() {
 const [title, setTitle] = useState('');
 const [content, setContent] = useState('');
 const [selectedTag, setSelectedTag] = useState('');
 const [selectedImage, setSelectedImage] = useState(null);
 const router = useRouter();

 // 이미지 선택 핸들러
 const pickImage = async () => {
   try {
     const result = await ImagePicker.launchImageLibraryAsync({
       mediaTypes: ImagePicker.MediaTypeOptions.Images,
       allowsEditing: true,
       aspect: [4, 3],
       quality: 1,
     });

     if (!result.canceled) {
       setSelectedImage(result.assets[0]);
     }
   } catch (error) {
     console.error('Error picking image:', error);
     Alert.alert('오류', '이미지 선택 중 오류가 발생했습니다.');
   }
 };

 // 태그 선택 핸들러
 const handleTagSelect = (tag) => {
   setSelectedTag(tag === selectedTag ? '' : tag);
 };

 // 게시글 업로드 핸들러
 const handleSubmit = async () => {
   // 입력 검증
   if (!title.trim()) {
     Alert.alert('알림', '제목을 입력해주세요.');
     return;
   }
   if (!content.trim()) {
     Alert.alert('알림', '내용을 입력해주세요.');
     return;
   }
   if (!selectedTag) {
     Alert.alert('알림', '태그를 선택해주세요.');
     return;
   }
   if (!selectedImage) {
     Alert.alert('알림', '이미지를 선택해주세요.');
     return;
   }

   try {
     const postData = {
       postTitle: title.trim(),
       postTag: selectedTag === '러닝 스팟 공유',
       postContent: content.trim()
     };

     const formData = new FormData();
     
     // 'files' 대신 'image'로 변경
     if (selectedImage) {
       const imageUri = selectedImage.uri;
       const filename = imageUri.split('/').pop();
       
       formData.append('image', {  // 여기를 'files'에서 'image'로 변경
         uri: imageUri,
         type: 'image/jpeg',
         name: filename || 'image.jpg',
       } as any);
     }

     const requestParam = encodeURIComponent(JSON.stringify(postData));
     const url = `${API_URL}/community/post/upload?request=${requestParam}`;

     console.log('Request URL:', url);
     console.log('FormData:', formData);

     const response = await fetch(url, {
       method: 'POST',
       body: formData,
       headers: {
         'Content-Type': 'multipart/form-data',
       },
     });

     const responseText = await response.text();
     console.log('Response:', responseText);

     if (!response.ok) {
       throw new Error('Upload failed');
     }

     Alert.alert('성공', '게시글이 업로드되었습니다.', [
       {
         text: '확인',
         onPress: () => router.replace('/(tabs)/community')
       }
     ]);
   } catch (error) {
     console.error('Upload error details:', error);
     Alert.alert('오류', '게시글 업로드에 실패했습니다.');
   }
 };

 // 태그 버튼 컴포넌트
 const TagButton = ({ tag, icon }) => (
   <TouchableOpacity 
     style={[
       styles.tagButton,
       selectedTag === tag && styles.tagButtonActive
     ]}
     onPress={() => handleTagSelect(tag)}
   >
     <Ionicons 
       name={icon} 
       size={20} 
       color={selectedTag === tag ? '#fff' : '#000'}
     />
     <ThemedText 
       style={[
         styles.tagText,
         selectedTag === tag && styles.tagTextActive
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
       <TextInput
         style={styles.titleInput}
         value={title}
         onChangeText={setTitle}
         placeholder="글 제목을 작성해주세요"
         placeholderTextColor="#999"
         maxLength={50}
       />

       {/* 이미지 업로드 섹션 */}
       <ThemedView style={styles.section}>
         <ThemedText style={styles.sectionTitle}>이미지 추가</ThemedText>
         <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
           {selectedImage ? (
             <Image 
               source={{ uri: selectedImage.uri }} 
               style={styles.selectedImage} 
             />
           ) : (
             <>
               <Ionicons name="image-outline" size={24} color="#666" />
               <ThemedText style={styles.uploadText}>Upload an image</ThemedText>
             </>
           )}
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
         <TouchableOpacity 
           style={styles.submitButton}
           onPress={handleSubmit}
         >
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
 titleInput: {
   fontSize: 24,
   fontWeight: 'bold',
   marginBottom: 30,
   marginTop: 10,
   paddingHorizontal: 0,
   color: '#000',
   borderBottomWidth: 1,
   borderBottomColor: '#eee',
   paddingBottom: 10,
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
   overflow: 'hidden', // 이미지가 박스를 벗어나지 않도록
 },
 selectedImage: {
   width: '100%',
   height: '100%',
   resizeMode: 'cover',
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
   backgroundColor: '#36A3FD',
   borderColor: '#ADD8E6',
 },
 tagText: {
   marginLeft: 8,
   fontSize: 14,
   color: '#000',
 },
 tagTextActive: {
   color: '#fff',
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