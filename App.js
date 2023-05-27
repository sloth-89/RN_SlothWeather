import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';

// 현재 expo와 연결된 기기의 스크린 크기를 알려주는 API
// width: SCEEEN_WIDTH를 styled에 넣으면 스크린 크기에 맞게 바뀐다.
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "65d60f1205d97ccd938fb459842c61c1";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Rain: "rains",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {

  // 위치값 데이터
  const [city, setCity] = useState("Loading...");
  const [district, setDistrict] = useState();

  // 날씨 데이터
  const [days, setDays] = useState([]);

  // 실시간 위치값과 날씨값 가져오기
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    // 사용자의 실시간 위치값의 권한을 물어보는 API
     const {granted} = await Location.requestForegroundPermissionsAsync();
    // 유저가 권한을 거부했을 경우
     if(!granted){
      setOk(false);
     }
    // 사용자의 실시간 위차값을 가져오는 API
     const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync();
    // 위도, 경도 값을 지역(주소) 값으로 변환해주는 API
     const location = await Location.reverseGeocodeAsync(
      {latitude, longitude}, 
      {useGoogleMaps: false}
     );
    // console.log(location);
    // 배열 확인 후 입력할 값 결정
     setCity(location[0].region);
     setDistrict(location[0].district);

     const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
     const json = await response.json();
    //  console.log(json)

     setDays(
      json.list.filter((weather) => {
        if(weather.dt_txt.includes("00:00:00")){
          return weather;
        }
      })
     );

  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
        <Text style={styles.districtName}>{district}</Text>
      </View>
      {/* ScrollView는 스크롤을 할 수 있는 View인데 여기에 style을 넣기 위해서는 
          ContentContainerStyle로 넣어야한다. ps. ScrollView에는 사이즈가 필요 없다.
          그러므로 flex 수치는 제거 */}
      <ScrollView 
       pagingEnabled 
       horizontal 
       showsHorizontalScrollIndicator={false}
       ContentContainerstyle={styles.weather}>
        {/* pagingEnabled = 스크롤에 페이지가 생겨 페이지 넘김 효과 적용
            horizontal = 가로로 스크롤 
            showHorizontalScrollIndicator = {false} 스크롤바를 숨김 
            persistentScrollbar = 스크롤바가 투명하지 않게 해줌(Android)
            indicatorStyle = "색" 스크롤바 색지정(IOS) */}
        {days.length === 0 ? (
          <View style={{...styles.day, alignItems: "center"}}>
            <ActivityIndicator color="white" style={{marginTop: 10}} size="large"/>
          </View> 
          ) : (
            days.map((day, index) => 
            <View key={index} style={styles.day}>
              {/* 소수점 한자리까지 표시 */}
              <View style={{
                flexDirection: "row", 
                alignItems: "center", 
                width: "100%",
                justifyContent:"flex-start",
              }}>
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                </Text>
                <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>)
          )}
      </ScrollView>
    </View>

    // View의 기본은 flex, 그의 기본값은 column
    // 웹의 경우 block : row이다
    // flex의 값을 부모에 지정해줌으로서 그를 기준으로 자식의 레이아웃 비율 분배 가능
    // <View style={{flex:1}}>
    //   <View style={{flex: 1, backgroundColor:"tomato"}}></View>
    //   <View style={{flex: 3, backgroundColor:"teal"}}></View>
    //   <View style={{flex: 1, backgroundColor:"orange"}}></View>
    // </View>

    // <div/> 대신 <View/>, 글자는 <Text/> 컴포넌트 안에
    // <View style={styles.container}>
    //   <Text style={styles.text}>Hello!</Text>
    //   {/* 휴대폰 상단 상태바 */}
    //   <StatusBar style="auto" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1f1f",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40
  },
  cityName: {
    color: "white",
    fontSize: 68,
    fontWeight: "500",
  },
  districtName: {
    color: 'white',
    fontSize: 28,
  },
  weather: {
    
  },
  day: {
    width: SCREEN_WIDTH,
  },
  temp: {
    fontSize: 108,
    marginTop: 50,
    marginLeft: 10,
    marginRight: 80,
    color: "white",
  },
  description: {
    fontSize: 38,
    marginTop: -20,
    marginLeft: 15,
    color: "white",
  },
  tinyText: {
    color: "white",
    fontSize: 18,
    marginLeft: 17,
  }
});

// 스타일을 클래스를 정의하는 것처럼 따로 정의하려 사용 할 수 있다.
// css 98% 정도의 속성들 사용 가능
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   text: {
//     fontSize: 28,
//     color: "red",
//   },
// });

// 터미널에서 r을 누르면 expo 앱에서 보여지는 출력화면을 새로고침 해준다.
// d를 누르면 개발자 도구를 보여준다.
