import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as nameToIcon from './Mapper';
import config from './config.json';
import {gradientSum} from './Mapper';

const headerItem = params => {
  return (
    <View>
      <View style={styles.hourlyForecastItem}>
        <Text>{params.datetime.substring(0, 5)}</Text>
        <Text>{`${params.temp} ºC`}</Text>
        <Icon name={nameToIcon.map(params.icon)} size={20} />
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

const getData = async (lat, long, date, key) => {
  try {
    console.log(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${long}/${date}?key=${key}&include=hours`,
    );
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${long}/${date}?key=${key}&include=hours`,
    );
    return await response.json();
  } catch (e) {
    console.log(e);
  }
};

export const ForecastDetails = ({navigation, route}) => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    getData(
      route.params.latitude,
      route.params.longitude,
      route.params.date,
      config.apiKey,
    ).then(response => {
      setData(response.days[0].hours);
      setIsDataLoading(false);
    });
  });

  return (
    <View>
      {isDataLoading ? (
        <ActivityIndicator style={styles.centerItem} />
      ) : (
        <LinearGradient colors={gradientSum(data)} style={styles.header}>
          <ScrollView>
            {data.map(val => {
              console.log(val);
              return headerItem(val);
            })}
          </ScrollView>
        </LinearGradient>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    margin: 25,
    padding: 10,
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#039dfc',
    borderRadius: 25,
  },
  centerItem: {
    alignSelf: 'center',
    justifySelf: 'center',
  },
  hourlyForecastItem: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
