import React, { useRef, useEffect, useState } from 'react';

import { Modalize } from 'react-native-modalize';
import { Plaform, View } from 'react-native';
import {
  Spinner,
  useTheme
} from '@ui-kitten/components';

import useGetViewer from '../hooks/useGetViewer';
import useGetGroup from '../hooks/useGetGroup';

import GroupLobby from './GroupLobby';

const GroupModal = ({ onClosed, groupId }) => {
  const modal = useRef(null);

  const {
    data: groupData,
    loading: getGroupLoading,
    error: getGroupError,
  } = useGetGroup({
    variables: { id: groupId },
    pollInterval: 3000,
  });

  const theme = useTheme();

  useEffect(() => {
    if (getGroupError) {
      modal.current.close();
    } else {
      modal.current.open();
    }
  }, [getGroupError])


  let groupScreen = null;
  switch (groupData?.viewer?.group?.state) {
    case "initial":
      groupScreen = <GroupLobby groupData={groupData} />;
      break;
  }

  return (
    <Modalize
      ref={modal}
      modalStyle={{
        backgroundColor: theme['color-basic-800'],
        zIndex: 200,
      }}
      handlePosition={"outside"}
      onClosed={onClosed}
      withReactModal={Platform.OS !== 'ios'}
      withHandle={Platform.OS === 'ios'}
      scrollViewProps={{
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
      }}
    >
      {
        groupData ? (
          groupScreen
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '50%'
            }}
          >
            <Spinner status={'control'} />
          </View>
        )

      }
    </Modalize>
  );
}

export default GroupModal;