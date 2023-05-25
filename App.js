import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    // <div/> 대신 <View/>, 글자는 <Text/> 컴포넌트 안에
    <View style={styles.container}>
      <Text style={styles.text}>Hello!</Text>
      {/* 휴대폰 상단 상태바 */}
      <StatusBar style="auto" />
    </View>
  );
}

// 스타일을 클래스를 정의하는 것처럼 따로 정의하려 사용 할 수 있다.
// css 98% 정도의 속성들 사용 가능
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 28,
    color: "red",
  },
});
