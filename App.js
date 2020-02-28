import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';

import { StyleSheet, View, SafeAreaView, Text, StatusBar } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { mapping, dark as darkTheme } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CircularStd from 'circular-std/fonts/CircularStd-Medium.ttf';
import CircularStdBold from 'circular-std/fonts/CircularStd-Bold.ttf';
import Lacquer from './fonts/Lacquer-Regular.ttf';
import * as Font from 'expo-font';

import createClient from './apolloClient';
import useGetViewer from './hooks/useGetViewer';
import useGetToken from './hooks/useGetToken';
import useGetWizard from './hooks/useGetWizard';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import MovieSelectionScreen from './screens/MovieSelectionScreen';

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
  // components: {
  //   ...mapping.components,
  //   Card: {
  //     ...mapping.components.Card,
  //     appearances: {
  //       ...mapping.components.Card.appearances,
  //       outline: {
  //         ...mapping.components.Card.appearances.outline,
  //         mapping: {
  //           ...mapping.components.Card.appearances.outline.mapping,
  //           bodyPaddingHorizontal: 16,
  //           footerPaddingHorizontal: 16,
  //           headerPaddingHorizontal: 16,
  //         }
  //       }
  //     }
  //   }
  // }
};

// console.log(JSON.stringify(customMapping))

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
      'Lacquer': Lacquer
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

