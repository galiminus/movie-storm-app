import React, { useState } from 'react';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import {
  Icon,
  TopNavigation,
  TopNavigationAction,
  Layout,
  Text,
  Card,
  withStyles,
  Button,
} from '@ui-kitten/components';

import { View, Image, TouchableOpacity, FlatList } from 'react-native';
import useDeleteViewer from '../hooks/useDeleteViewer';
import useDeleteToken from '../hooks/useDeleteToken';
import useGetGroup from '../hooks/useGetGroup';
import useLeaveGroup from '../hooks/useLeaveGroup';

import BottomButton from '../components/BottomButton';
import UserAvatar from '../components/UserAvatar';

const GroupLobbyScreen = ({ navigation, route, themedStyle }) => {
  const { code, id } = route.params;

  const [ leaveGroup ] = useLeaveGroup();

  const { data: groupData } = useGetGroup({ variables: { id }, pollInterval: 3000 });
  const users = groupData?.viewer?.group?.users || [];

  return (
    <SafeAreaConsumer>
      {
        (insets) => (
          <View style={[themedStyle.rootContainer, { paddingTop: insets.top }]}>
            <TopNavigation
              title='Start a group'
              leftControl={
                <TopNavigationAction
                  icon={(style) => <Icon {...style} name='arrow-back'/>}
                  onPress={() => {
                    leaveGroup({ variables: { input: { id }} }).then(() => {
                      navigation.navigate("Home");
                    })
                  }}
                />
              }
            />
            <View style={themedStyle.codeLayout}>
              <Text category="s1">
                Share this code with your friends
              </Text>
              <Text
                style={themedStyle.code}
              >
                {code.toUpperCase()}
              </Text>
            </View>
            <View style={themedStyle.layout}>
              <FlatList
                ListFooterComponent={<View style={{ paddingTop: 24 }} />}
                numColumns={4}
                showsVerticalScrollIndicator={false}
                data={users}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item }) => (
                  <View key={item.id} style={themedStyle.userItem}>
                    <UserAvatar
                      size={64}
                      user={item}
                    />
                    <Text style={{ marginTop: 8 }} numberOfLines={1}>{item.name}</Text>
                  </View>
                )}
              />
            </View>
            <BottomButton
              style={[ themedStyle.startButton, { flexDirection: 'row-reverse' }]}
              size="giant"
              icon={(style) => <Icon {...style} name="arrow-forward" />}
              last
            >
              START SELECTION
            </BottomButton>
          </View>
        )
      }
    </SafeAreaConsumer>
  );
}


export const GroupLobbyScreenWithStyles = withStyles(GroupLobbyScreen, theme => ({
  rootContainer: {
    backgroundColor: theme['color-basic-800'],
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  codeLayout: {
    flex: 0,
    backgroundColor: theme['color-basic-1000'],
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: 100,
  },
  code: {
    fontSize: 40,
    lineHeight: 40,
    letterSpacing: 4,
    marginTop: 16,
    fontFamily: 'RobotoMonoBold'
  },
  layout: {
    flex: 4,
    display: 'flex',
    flexDirection: 'row',
  },
  startButton: {
    backgroundColor: theme['color-danger-500'],
  },
  userItem: {
    paddingTop: 24,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

export default GroupLobbyScreenWithStyles;
