import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

/**
 * CustomButton 컴포넌트 - buttonStyle에 따라 미리 지정된 스타일로 버튼이 변경됨
 * buttonStyle: "skyblue" - 하늘색 버튼 (강조 버튼)
 * buttonStyle: "white" - 흰색 버튼
 *
 * @param {Object} props - 컴포넌트의 속성
 * @param {string} props.title - 버튼의 제목
 * @param {function} props.onPress - 버튼 클릭 시 호출되는 함수
 * @param {string} [props.buttonStyle="skyblue"] - 버튼의 스타일 (기본값: "skyblue")
 * @param {Object} [props.style] - 추가적인 스타일 객체
 * @returns {JSX.Element} - 커스텀 버튼 컴포넌트
 */
function CustomButton({ title, onPress, buttonStyle = "skyblue", style }) {
  const getButtonStyles = () => {
    if (buttonStyle === "white") {
      return {
        buttonColor: "#fff",
        borderColor: "#8dccff",
        textColor: "#8dccff",
      };
    } else {
      // default => skyblue
      return {
        buttonColor: "#8dccff",
        borderColor: "#8dccff",
        textColor: "#fff",
      };
    }
  };

  const { buttonColor, borderColor, textColor } = getButtonStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: buttonColor, borderColor: borderColor },
        style,
      ]}
      onPress={onPress}
    >
      <Text style={{ color: textColor }}>{title}</Text>
    </TouchableOpacity>
  );
}

CustomButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  buttonStyle: PropTypes.string,
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  button: {
    width: 300,
    height: 45,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    alignSelf: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomButton;
