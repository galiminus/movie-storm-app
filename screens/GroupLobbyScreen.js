import React, { useState, useEffect, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';

import useDeleteViewer from '../hooks/useDeleteViewer';
import useDeleteToken from '../hooks/useDeleteToken';
import useGetGroup from '../hooks/useGetGroup';
import useLeaveGroup from '../hooks/useLeaveGroup';
import useDeleteGroup from '../hooks/useDeleteGroup';
import useGetViewer from '../hooks/useGetViewer';

import BottomButton from '../components/BottomButton';
import UserAvatar from '../components/UserAvatar';

const GroupLobbyScreen = ({ navigation, route, themedStyle }) => {
  const { code, id } = route.params;

  const [ leaveGroup ] = useLeaveGroup();
  const [ deleteGroup ] = useDeleteGroup();

  const { data: groupData, loading: groupLoading, error: groupError } = useGetGroup({ variables: { id }, pollInterval: 3000 });
  const users = groupData?.viewer?.group?.users || [];

  useEffect(() => {
    if (groupError) {
      navigation.goBack();
    }
  }, [groupError]);

  const owned = groupData?.viewer?.id === groupData?.viewer?.group?.owner?.id;

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (groupLoading) {
          return;
        }
        if (owned) {
          deleteGroup({ variables: { input: { id }} });
        } else {
          leaveGroup({ variables: { input: { id }} });
        }
      }
    }, [groupLoading])
  );

  return (
    <SafeAreaConsumer>
      {
        (insets) => (
          <View style={[themedStyle.rootContainer, { paddingTop: insets.top }]}>
            <TopNavigation
              title='Create a room'
              leftControl={
                <TopNavigationAction
                  icon={(style) => <Icon {...style} name='arrow-back'/>}
                  onPress={() => {
                    navigation.goBack();
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
            <View
              style={themedStyle.userCounter}
            >
              {
                users.length <= 1 ?
                <Text>{`One person in the room`}</Text> :
                <Text>{`${users.length} people in the room`}</Text>
              }
            </View>
            {
              owned ? (
                <BottomButton
                  style={[ themedStyle.startButton, { flexDirection: 'row-reverse' }]}
                  size="giant"
                  icon={(style) => <Icon {...style} name="arrow-forward" />}
                  last
                >
                  START SELECTION
                </BottomButton>
              ) : (
                <BottomButton
                  disabled
                  style={[ themedStyle.waitButton, { flexDirection: 'row-reverse' }]}
                  size="giant"
                  last
                >
                  {`WAITING FOR ${groupData?.viewer?.group?.owner?.name.toUpperCase()}`}
                </BottomButton>
              )
            }

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
    backgroundColor: theme['color-basic-900'],
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
  waitButton: {
    backgroundColor: theme['color-basic-900'],
  },
  userItem: {
    paddingTop: 24,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCounter: {
    padding: 16,
    alignItems: 'center',
  }
}));

export default GroupLobbyScreenWithStyles;
