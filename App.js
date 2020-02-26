import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';

import { StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { ApplicationProvider } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import createClient from './apolloClient';
import useGetViewer from './hooks/useGetViewer';
import useToken from './hooks/useToken';
import WelcomeScreen from './screens/WelcomeScreen';

const RootStack = createStackNavigator();

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}


const Viewer = () => {
  const { data: tokenData, loading: tokenLoading } = useToken();

  if (tokenLoading) {
    return (null);
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName={tokenData.token ? 'Home' : 'Welcome'}>
        <RootStack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ header: () => null }}
        />
        <RootStack.Screen
          name="Home"
          component={HomeScreen}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [ apolloClient, setApolloClient ] = useState(null);

  useEffect(() => {
    createClient().then((apolloClient) => {
      setApolloClient(apolloClient);
    })
  }, []);

  if (!apolloClient) {
    return (null);
  }

  return (
    <SafeAreaProvider>
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <ApolloProvider client={apolloClient}>
          <Viewer />
        </ApolloProvider>
      </ApplicationProvider>
    </SafeAreaProvider>
  );
}

