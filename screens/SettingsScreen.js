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
  Menu
} from '@ui-kitten/components';
import { Updates } from 'expo';

import { View, Image, TouchableOpacity } from 'react-native';
import useDeleteViewer from '../hooks/useDeleteViewer';
import useDeleteToken from '../hooks/useDeleteToken';
import useGetToken from '../hooks/useGetToken';

const SettingsScreen = ({ navigation, themedStyle }) => {
  const [ deleteViewer, { loading, error } ] = useDeleteViewer();
  const [ deleteToken ] = useDeleteToken();
  const [ selectedIndex, setSelectedIndex ] = useState(null);
  const { data: tokenData } = useGetToken();

  const items = [
    {
      title: 'Delete account',
      icon: (style) => <Icon {...style} name='trash-2'/>
    },
  ];

  return (
    <SafeAreaConsumer>
      {
        (insets) => (
          <View style={[themedStyle.rootContainer, { paddingTop: insets.top }]}>
            <TopNavigation
              title='Settings'
              leftControl={
                <TopNavigationAction
                  icon={(style) => <Icon {...style} name='arrow-back'/>}
                  onPress={() => navigation.navigate("Home")}
                />
              }
            />
            <Layout style={themedStyle.layout}>
              <Menu
                style={themedStyle.menu}
                appearance='noDivider'
                data={items}
                selectedIndex={selectedIndex}
                onSelect={(selectedIndex) => {
                  setSelectedIndex(selectedIndex);
                  switch (selectedIndex) {
                    case 0: // Delete account
                      deleteViewer({ variables: { input: {} }}).then(() => {
                        deleteToken();
                        Updates.reloadFromCache();
                      });
                  }
                }}
              />
            </Layout>
          </View>
        )
      }
    </SafeAreaConsumer>
  );
}


export const SettingsScreenWithStyles = withStyles(SettingsScreen, theme => ({
  rootContainer: {
    backgroundColor: theme['color-basic-800'],
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  layout: {
    flex: 1,
    backgroundColor: theme['color-basic-900'],
  },
  menu: {
    marginTop: 16,
  }
}));

export default SettingsScreenWithStyles;
