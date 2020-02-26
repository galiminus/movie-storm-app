import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';

import BottomButton from '../components/BottomButton';
import useCreateViewer from '../hooks/useCreateViewer';
import useSetToken from '../hooks/useSetToken';

const WelcomeScreen = () => {
  const [ createViewer, { loading: createViewerLoading } ] = useCreateViewer();
  const [ setToken ] = useSetToken();

  return (
    <Layout style={styles.rootContainer}>
      <Layout style={styles.welcomeContainer}>
        <Text category='h1'>WELCOME!</Text>
        <Text category='s1'>
          Movie Storm is the best way to pick a movie to watch with your friends!
          First we need to know you better! Please pick some movies you like in the next screen,
          the more movies you pick the best our custom selection will be.
        </Text>
      </Layout>
      <BottomButton
        status='info'
        disabled={createViewerLoading}
        onPress={async () => {
          const response = await createViewer({ variables: { input: {} }});
          await setToken({ variables: { token: response?.data?.createViewer?.viewer?.authorizationToken }})
        }}
      >
        LET'S GET STARTED!
      </BottomButton>
    </Layout>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    minHeight: '100%',
  },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
    padding: 16,
  },
});

export default WelcomeScreen;
