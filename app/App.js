/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import RNLocation from 'react-native-location';
import config from './config.json';

const App: () => Node = () => {
  const colorScheme = useColorScheme();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [locationData, setLocationData] = useState({});
  const apiKey = config.apiKey;

  useEffect(() => {
    const permissionHandler = async () => {
      await RNLocation.configure({
        distanceFilter: 0.0,
      });

      let permission = await RNLocation.checkPermission({
        ios: 'whenInUse', // or 'always'
        android: {
          detail: 'coarse', // or 'fine'
        },
      });
      console.log(`permission: ${permission}`);
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
      console.log(`permission 2: ${permission}`);
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
        console.log(`permission 3: ${permission}`);
        const result = await RNLocation.getLatestLocation({timeout: 100});
        console.log(result);
        setLocationData(result);
      } else {
        const result = await RNLocation.getLatestLocation({timeout: 100});
        console.log(result);
        setLocationData(result);
      }
    };
    permissionHandler()
      .then(r => setIsDataLoading(false))
      .catch(error => {
        console.log(`myError: ${error}`);
      });
  }, []);

  return (
    <View style={styles.header}>
      {isDataLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
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
});

export default App;
