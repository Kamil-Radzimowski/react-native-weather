import {Text} from 'react-native';
import React from 'react';

export const ForecastDetails = ({navigation, route}) => {
  return <Text>{route.params.date}</Text>;
};
