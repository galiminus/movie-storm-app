import React, { createRef, useState, useEffect } from 'react';
import { Layout, Text, withStyles, useTheme, Icon } from '@ui-kitten/components';
import { StyleSheet, View, StatusBar, Animated } from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';

import BottomButton from '../components/BottomButton';
import useCreateViewer from '../hooks/useCreateViewer';
import useSetToken from '../hooks/useSetToken';

const WelcomeScreen = ({ navigation, themedStyle }) => {
  const [ createViewer, { loading: createViewerLoading } ] = useCreateViewer();
  const [ setToken ] = useSetToken();
  const theme = useTheme();
  const iconRef = React.createRef();

  const [movieFontSize] = useState(new Animated.Value(0));
  const [stormFontSize] = useState(new Animated.Value(0));
  const [rotateY] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateY, {
        toValue: Math.PI * 8,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(movieFontSize, {
          toValue: 90,
          duration: 300,
        }),
        Animated.timing(stormFontSize, {
          toValue: 110,
          duration: 300,
        }),
        Animated.parallel([
          Animated.timing(movieFontSize, {
            toValue: 80,
            duration: 400,
          }),
          Animated.timing(stormFontSize, {
            toValue: 100,
            duration: 400,
          }),
        ])
      ])
    ]).start();
  }, []);

  return (
    <SafeAreaConsumer>
      {
        (insets) => (
          <View style={[ themedStyle.rootContainer, { paddingTop: insets.top }]}>
            <Layout style={themedStyle.welcomeContainer}>
              <Animated.View style={[ themedStyle.titleContainer, { transform: [ { rotateY: rotateY }] }]}>
                <Animated.Text
                  style={[ themedStyle.text, themedStyle.title, { fontSize: movieFontSize, lineHeight: 80 } ]}
                >
                  MOVIE
                </Animated.Text>
                <Animated.Text
                  style={[ themedStyle.text, themedStyle.title, { fontSize: stormFontSize, lineHeight: 100 } ]}
                >
                  STORM
                </Animated.Text>
              </Animated.View>

              <Layout style={themedStyle.explanationContainer}>
                <Text style={themedStyle.text} category='h4'>
                  <Text style={[ themedStyle.text, { textDecorationLine: 'underline' }]} category="h4">Movie Storm</Text>
                  {` is the single best way to pick a movie to watch with your friends!`}
                </Text>
                <Text style={[themedStyle.text, { marginTop: 16 }]} category='s1'>
                  First we need to know you better. In the next screen we will show you some popular movies you may have seen, please
                  tell use which one you liked.
                </Text>
              </Layout>
            </Layout>
            <BottomButton
              size="giant"
              style={[ themedStyle.nextButton, { flexDirection: 'row-reverse' }]}
              status='info'
              disabled={createViewerLoading}
              icon={(style) => <Icon {...style} name="arrow-forward" />}
              last
              onPress={async () => {
                const response = await createViewer({ variables: { input: {} }});
                await setToken({ variables: { token: response?.data?.createViewer?.viewer?.authorizationToken }})
                navigation.navigate("InitialMovieSelection", { initial: true });
              }}
            >
              LET'S GET STARTED!
            </BottomButton>
          </View>
        )
      }
    </SafeAreaConsumer>
  )
}

export const WelcomeScreenWithStyles = withStyles(WelcomeScreen, theme => ({
  rootContainer: {
    backgroundColor: theme['color-basic-800'],
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: 'transparent',
    width: '100%',
    paddingTop: 32,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: 32,
  },
  title: {
    fontFamily: "Lacquer",
    textAlign: 'center',
    letterSpacing: 8,
    transform: [{ translateX: 1 }, { perspective: 850 }]
  },
  logo: {
  },
  explanationContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: '100%',
    backgroundColor: theme['color-basic-800'],
  },
  text: {
    color: theme['text-control-color'],
    textAlign: 'left',
  },
  nextButton: {
    backgroundColor: theme['color-danger-600'],
  }
}));


export default WelcomeScreenWithStyles;
