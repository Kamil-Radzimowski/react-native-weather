import {Text} from 'react-native';

export const ForecastDetails = ({navigation, route}) => {
  return <Text>{route.params.date}</Text>;
};
