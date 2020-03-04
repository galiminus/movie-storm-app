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
import useDimensions from "react-native-use-dimensions";

import useGetGroup from '../hooks/useGetGroup';
import useLeaveGroup from '../hooks/useLeaveGroup';
import useDeleteGroup from '../hooks/useDeleteGroup';
import useGetViewer from '../hooks/useGetViewer';

import BottomButton from '../components/BottomButton';
import UserAvatar from '../components/UserAvatar';

const GroupLobby = ({ groupData, themedStyle, id }) => {
  const [ leaveGroup ] = useLeaveGroup();
  const [ deleteGroup ] = useDeleteGroup();
  const { screen } = useDimensions();

  return (
    <SafeAreaConsumer>
      {
        (insets) => (
          <View style={[themedStyle.rootContainer, { borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden', height: screen.height - insets.top - 14 } ]}>
            <View style={themedStyle.codeLayout}>
              <Text category="s1">
                Share this code with your friends
              </Text>
              <Text
                style={themedStyle.code}
              >
                {groupData.viewer.group.code.toUpperCase()}
              </Text>
            </View>
            <View style={themedStyle.layout}>
            {
              groupData.viewer.group.users.map((user, index) => (
                <View key={`${user.id}-${index}`} style={themedStyle.userItem}>
                  <UserAvatar
                    size={64}
                    user={user}
                  />
                  <Text style={{ marginTop: 8 }} numberOfLines={1}>{user.name}</Text>
                </View>
              ))
            }
            </View>
            <View
              style={themedStyle.userCounter}
            >
              {
                groupData.viewer.group.users.length <= 1 ?
                  <Text>{`One person in the room`}</Text> :
                  <Text>{`${groupData.viewer.group.users.length} people in the room`}</Text>
              }
            </View>
            {
              groupData.viewer.id === groupData.viewer.group.owner.id ? (
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
                  {`WAITING FOR ${groupData.viewer.group.owner.name.toUpperCase()}`}
                </BottomButton>
              )
            }

          </View>
        )
      }
    </SafeAreaConsumer>
  );
}


export const GroupLobbyWithStyles = withStyles(GroupLobby, theme => ({
  rootContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
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
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  startButton: {
    backgroundColor: theme['color-danger-500'],
  },
  waitButton: {
    backgroundColor: theme['color-basic-900'],
  },
  userItem: {
    paddingTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '33%'
  },
  userCounter: {
    padding: 16,
    alignItems: 'center',
  }
}));

export default GroupLobbyWithStyles;
