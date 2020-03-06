import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';

import { StatusBar } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { mapping, dark as darkTheme } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CircularStd from 'circular-std/fonts/CircularStd-Medium.ttf';
import CircularStdBold from 'circular-std/fonts/CircularStd-Bold.ttf';
import CircularStdItalic from 'circular-std/fonts/CircularStd-MediumItalic.ttf';
import Lacquer from './fonts/Lacquer-Regular.ttf';
import RobotoMonoBold from './fonts/RobotoMono-Bold.ttf';
import * as Font from 'expo-font';

import createClient from './apolloClient';
import useGetToken from './hooks/useGetToken';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import MovieSelectionScreen from './screens/MovieSelectionScreen';
import SettingsScreen from './screens/SettingsScreen';

const RootStack = createStackNavigator();

const DEFAULT_SCREEN_OPTIONS = {
  header: () => null,
  cardStyle: {
    backgroundColor: 'white',
  }
}

const Viewer = () => {
  const { data: tokenData, loading: tokenLoading } = useGetToken();

  if (tokenLoading) {
    return (null);
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName={tokenData.token ? 'Home' : 'Welcome'}
      >
        <RootStack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={DEFAULT_SCREEN_OPTIONS}
        />
        <RootStack.Screen
          name="InitialMovieSelection"
          component={MovieSelectionScreen}
          options={DEFAULT_SCREEN_OPTIONS}
        />
        <RootStack.Screen
          name="MovieSelection"
          component={MovieSelectionScreen}
          options={DEFAULT_SCREEN_OPTIONS}
        />
        <RootStack.Screen
          name="Home"
          component={HomeScreen}
          options={DEFAULT_SCREEN_OPTIONS}
        />
        <RootStack.Screen
          name="Settings"
          component={SettingsScreen}
          options={DEFAULT_SCREEN_OPTIONS}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const customMapping = {
  ...mapping,
  strict: {
    ...mapping.strict,
    "text-font-family": "CircularStd"
  },
};

export default function App() {
  const [ apolloClient, setApolloClient ] = useState(null);
  const [ fontLoaded, setFontLoaded ] = useState(false);

  useEffect(() => {
    createClient().then((apolloClient) => {
      setApolloClient(apolloClient);
    })
  }, []);

  useEffect(() => {
    Font.loadAsync({
      'CircularStd': CircularStd,
      'CircularStdBold': CircularStdBold,
      'CircularStdItalic': CircularStdItalic,
      'Lacquer': Lacquer,
      'RobotoMonoBold': RobotoMonoBold,
    }).then(() => {
      setFontLoaded(true)
    })
  }, [])

  if (!apolloClient || !fontLoaded) {
    return (null);
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider mapping={customMapping} theme={darkTheme}>
        <ApolloProvider client={apolloClient}>
          <Viewer />
        </ApolloProvider>
      </ApplicationProvider>
    </SafeAreaProvider>
  );
}

