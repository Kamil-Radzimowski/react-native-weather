import type {Node} from 'react';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainScreen} from './Main';
import {ForecastDetails} from './ForecastDetails';

const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          component={MainScreen}
          name="Main"
          options={{headerShown: false}}
        />
        <Stack.Screen name="ForecastDetails" component={ForecastDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
