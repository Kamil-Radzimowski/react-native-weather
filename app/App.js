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
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import RNLocation from 'react-native-location';
// import * as Location from 'expo-location';
import config from './config.json';

const getCoordinates = async () => {
  await RNLocation.configure({
    distanceFilter: 0.0,
  });

  let permission = await RNLocation.checkPermission({
    ios: 'whenInUse', // or 'always'
    android: {
      detail: 'coarse', // or 'fine'
    },
  });
  permission = await RNLocation.requestPermission({
    ios: 'whenInUse',
    android: {
      detail: 'coarse',
      rationale: {
        title: 'We need to access your location',
        message: 'We use your location to show where you are on the map',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      },
    },
  });
  if (!permission) {
    await RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'coarse',
        rationale: {
          title: 'We need to access your location',
          message: 'We use your location to show where you are on the map',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      },
    });
    return await RNLocation.getLatestLocation({ timeout: 100 });
  } else {
    return await RNLocation.getLatestLocation({ timeout: 100 });
  }
};

const getCurrentDayWeatherData = async (latitude, longitude, key) => {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}/today?key=${key}`,
    );
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const App: () => Node = () => {
  const colorScheme = useColorScheme();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [locationData, setLocationData] = useState({});
  const apiKey = config.apiKey;

  useEffect(() => {
    getCoordinates()
      .then(r => {
        getCurrentDayWeatherData(r.latitude, r.longitude).then(responseJSON => {
          setLocationData(r);
          setIsDataLoading(false);
        });
      })
      .catch(error => {
        console.log(`myError: ${error}`);
      });
  }, []);

  return (
    <View style={styles.header}>
      {isDataLoading ? (
        <ActivityIndicator />
      ) : (
        <View
          style={{
            display: 'flex',
            margin: 15,
            alignContent: 'space-between',
            flex: 1,
            height: '100%',
          }}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTemp}>0 stopni</Text>
            <Text style={styles.headerCity}>Warlubie</Text>
          </View>
          <Text>Latitude: {locationData.latitude}</Text>
          <Text>Longitude: {locationData.longitude}</Text>
        </View>
      )}
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
});

export default App;
