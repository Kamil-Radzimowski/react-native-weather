import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  useColorScheme,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as coordinates from './getCoordinates.js';
import * as nameToIcon from './Mapper.js';
import config from './config.json';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {gradientMap, gradientSum} from './Mapper.js';

const getCurrentDayWeatherData = async (latitude, longitude, key) => {
  try {
    console.log(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}/today?key=${key}&&include=current,hours&&unitGroup=metric`,
    );
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}/today?key=${key}&&include=current,hours&&unitGroup=metric`,
    );
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const get7daysForecast = async (latitude, longitude, key) => {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}/next7days?&key=${key}&include=hours%2Ccurrent&&unitGroup=metric`,
    );
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const latAndLongToAddress = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pl`,
    );
    return await response.json();
  } catch (e) {
    console.log(e);
  }
};

const IconValuePair = props => {
  return (
    <View
      style={{flexDirection: 'row', marginVertical: 5, alignItems: 'center'}}>
      <Icon name={props.icon} size={25} />
      <Text style={{fontSize: 16, marginLeft: 10}}>{props.name}</Text>
    </View>
  );
};

const ForecastItem = (props, navigation, longitude, latitude) => {
  return (
    <TouchableHighlight
      underlayColor="#ffffff"
      onPress={() => {
        navigation.navigate('ForecastDetails', {
          date: props.datetime,
          latitude: latitude,
          longitude: longitude,
        });
      }}>
      <LinearGradient
        colors={gradientMap(props.icon)}
        style={styles.forecastItem}>
        <Text>{`${props.datetime.substring(8, 10)}.${props.datetime.substring(
          5,
          7,
        )}`}</Text>
        <Text>{`${props.temp} ºC`}</Text>
        <Icon name={nameToIcon.map(props.icon)} size={20} />
      </LinearGradient>
    </TouchableHighlight>
  );
};

const HourlyForecastItem = props => {
  return (
    <View>
      <View style={styles.hourlyForecastItem}>
        <Text>{props.datetime.substring(0, 5)}</Text>
        <Text>{`${props.temp} ºC`}</Text>
        <Icon name={nameToIcon.map(props.icon)} size={20} />
      </View>
      <View
        style={{
          borderBottomColor: 'white',
          borderBottomWidth: 1,
        }}
      />
    </View>
  );
};

export const MainScreen = ({navigation}) => {
  const colorScheme = useColorScheme();
  const [latAndLng, setLatAndLng] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [isForecastLoading, setIsForecastLoading] = useState(true);
  const [forecastData, setForecastData] = useState({});
  const [address, setAddress] = useState({});
  const [weatherData, setWeatherData] = useState({});
  const [degreeUnit, setDegreeUnit] = useState('C');
  const apiKey = config.apiKey;

  useEffect(() => {
    coordinates
      .get()
      .then(r => {
        setLatAndLng({latitude: r.latitude, longitude: r.longitude});
        getCurrentDayWeatherData(r.latitude, r.longitude, apiKey)
          .then(responseJSON => {
            setWeatherData(responseJSON);
            setIsDataLoading(false);
          })
          .catch(e => console.log(e));
        get7daysForecast(r.latitude, r.longitude, apiKey)
          .then(responseJSON => {
            setForecastData(responseJSON.days);
            setIsForecastLoading(false);
          })
          .catch(e => console.log(e));
        latAndLongToAddress(r.latitude, r.longitude)
          .then(responseAddress => {
            setAddress(responseAddress);
            setIsAddressLoading(false);
          })
          .catch(e => console.log(e));
      })
      .catch(error => {
        console.log(`myError: ${error}`);
      });
  }, [apiKey]);

  return (
    <View style={{height: '100%', backgroundColor: '#ffffff'}}>
      <ScrollView>
        <View>
          {isDataLoading ? (
            <View style={styles.header} />
          ) : (
            <LinearGradient
              colors={gradientMap(weatherData.currentConditions.icon)}
              style={styles.header}>
              <View style={styles.headerData}>
                <View style={styles.headerTop}>
                  <Text
                    style={styles.headerTemp}
                    onPress={e => {
                      degreeUnit === 'F'
                        ? setDegreeUnit('C')
                        : setDegreeUnit('F');
                    }}>
                    {weatherData.currentConditions.temp} º{degreeUnit}
                  </Text>
                  {isAddressLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <Text style={styles.headerCity}>{address.locality}</Text>
                  )}
                </View>
                <IconValuePair
                  icon="water"
                  name={weatherData.currentConditions.humidity}
                />
                <IconValuePair
                  icon="weather-windy"
                  name={`${weatherData.currentConditions.windspeed} km/h`}
                />
              </View>
            </LinearGradient>
          )}
          <View>
            {isForecastLoading ? (
              <ActivityIndicator />
            ) : (
              <ScrollView horizontal={true} style={{marginLeft: 25}}>
                {forecastData.splice(1, forecastData.length - 1).map(val => {
                  return ForecastItem(
                    val,
                    navigation,
                    latAndLng.longitude,
                    latAndLng.latitude,
                  );
                })}
              </ScrollView>
            )}
          </View>
          {isForecastLoading ? (
            <ActivityIndicator style={{height: '100%'}} />
          ) : (
            <LinearGradient
              colors={gradientSum(forecastData[0].hours)}
              style={styles.hourlyForecast}>
              <ScrollView>
                {forecastData[0].hours.map(HourlyForecastItem)}
              </ScrollView>
            </LinearGradient>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    margin: 25,
    padding: 20,
    backgroundColor: '#039dfc',
    height: 200,
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderRadius: 25,
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerData: {
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    flex: 1,
    height: '100%',
  },
  headerTemp: {
    fontSize: 25,
  },
  headerCity: {
    fontSize: 18,
  },
  forecastItem: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 8,
    borderRadius: 25,
    marginRight: 15,
    height: 100,
    width: 100,
    backgroundColor: '#039dfc',
  },
  hourlyForecast: {
    margin: 25,
    marginBottom: 0,
    padding: 10,
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#039dfc',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  hourlyForecastItem: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
