import React, { useLayoutEffect } from 'react';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import {
  Icon,
  TopNavigation,
  TopNavigationAction,
  Layout,
  Text,
  Card,
  withStyles
} from '@ui-kitten/components';
import { View, Image, TouchableOpacity } from 'react-native';
import useGetMovieSelection from '../hooks/useGetMovieSelection';
import BottomButton from '../components/BottomButton';

const HomeScreen = ({ navigation, themedStyle }) => {
  const { data: movieSelectionData } = useGetMovieSelection();
  const movieSelection = movieSelectionData?.viewer?.movieSelection || [];

  return (
    <SafeAreaConsumer>
      {
        (insets) => (
          <View style={[themedStyle.rootContainer, { paddingTop: insets.top }]}>
            <TopNavigation
              title='MOVIE STORM'
              titleStyle={{ fontSize: 18, paddingLeft: 12 }}
              rightControls={[
                <TouchableOpacity
                  onPress={() => navigation.navigate("MovieSelection", { initial: false })}
                >
                  <Text style={{ lineHeight: 24 }}>Rate movies</Text>
                </TouchableOpacity>,
                <TopNavigationAction
                  icon={(style) => <Icon {...style} name='film-outline'/>}
                  onPress={() => navigation.navigate("Home")}
                  onPress={() => navigation.navigate("MovieSelection", { initial: false })}
                />
              ]}
            />
            <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text category="h1">
                Lorem ipsum
              </Text>
            </Layout>
            <BottomButton
              size="giant"
              style={themedStyle.joinButton}
            >
              JOIN A GROUP
            </BottomButton>
            <BottomButton
              size="giant"
              style={themedStyle.createButton}
              last
            >
              START A GROUP
            </BottomButton>
          </View>
        )
      }
    </SafeAreaConsumer>
  );
}


export const HomeScreenWithStyles = withStyles(HomeScreen, theme => ({
  rootContainer: {
    backgroundColor: theme['color-basic-800'],
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  joinButton: {
    backgroundColor: theme['color-basic-700'],
  },
  createButton: {
    backgroundColor: theme['color-danger-500'],
  }
}));

export default HomeScreenWithStyles;
