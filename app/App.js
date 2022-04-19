/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import type {Node} from 'react';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import * as coordinates from './getCoordinates.js';
import * as Location from 'expo-location';
import config from './config.json';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const getCurrentDayWeatherData = async (latitude, longitude, key) => {
  try {
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
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}/next5days?&key=${key}&&unitGroup=metric`,
    );
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const latAndLongToAddress = async (latitude, longitude) => {
  try {
    console.log(`latitude: ${latitude}`);
    console.log(`longitude: ${longitude}`);
    return await Location.reverseGeocodeAsync({
      latitude: latitude,
      longitude: longitude,
    }).catch(e => {
      console.log(e);
    });
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

const ForecastItem = props => {
  return (
    <View style={styles.forecastItem}>
      <Text>{`${props.datetime.substring(8, 10)}.${props.datetime.substring(
        5,
        7,
      )}`}</Text>
      <Text>{`${props.temp} ºC`}</Text>
      <Icon name={}></Icon>
    </View>
  );
};

const App: () => Node = () => {
  const colorScheme = useColorScheme();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [isForecastLoading, setIsForecastLoading] = useState(true);
  const [forecastData, setForecastData] = useState({});
  const [address, setAddress] = useState({});
  const [weatherData, setWeatherData] = useState({});
  const [degreeUnit, setDegreeUnit] = useState('C');
  const apiKey = config.apiKey;

  useEffect(() => {
    coordinates.get()
      .then(r => {
        getCurrentDayWeatherData(r.latitude, r.longitude, apiKey).then(
          responseJSON => {
            console.log(responseJSON);
            setWeatherData(responseJSON);
            setIsDataLoading(false);
          },
        );
        get7daysForecast(r.latitude, r.longitude, apiKey).then(responseJSON => {
          console.log(responseJSON);
          setForecastData(responseJSON.days);
          setIsForecastLoading(false);
        });
        latAndLongToAddress(r.latitude, r.longitude).then(responseAddress => {
          setAddress(responseAddress.city);
          setIsAddressLoading(false);
        });
      })
      .catch(error => {
        console.log(`myError: ${error}`);
      });
  }, []);

  return (
    <View>
      <View style={styles.header}>
        {isDataLoading ? (
          <ActivityIndicator />
        ) : (
          <View
            style={{
              display: 'flex',
              margin: 20,
              justifyContent: 'space-between',
              alignContent: 'space-between',
              flex: 1,
              height: '100%',
            }}>
            <View style={styles.headerTop}>
              <Text
                style={styles.headerTemp}
                onPress={e => {
                  degreeUnit === 'F' ? setDegreeUnit('C') : setDegreeUnit('F');
                }}>
                {weatherData.currentConditions.temp} º{degreeUnit}
              </Text>
              {isAddressLoading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.headerCity}>{address.city}</Text>
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
        )}
      </View>
      <View>
        {isForecastLoading ? (
          <ActivityIndicator />
        ) : (
          <ScrollView horizontal={true} style={{marginLeft: 25}}>
            {forecastData.map(ForecastItem)}
          </ScrollView>
        )}
      </View>
      <View style={styles.hourlyForecast}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    margin: 25,
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
  headerTemp: {
    fontSize: 25,
  },
  headerCity: {
    fontSize: 18,
  },
  forecastItem: {
    padding: 8,
    borderRadius: 25,
    marginRight: 15,
    height: 100,
    width: 100,
    backgroundColor: '#039dfc',
  },
  hourlyForecast: {
    height: '100%',
    margin: 25,
    flexGrow: 1,
    backgroundColor: '#039dfc',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
});

export default App;
