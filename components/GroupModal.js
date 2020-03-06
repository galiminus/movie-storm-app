import React, { useRef, useEffect } from 'react';

import { Modalize } from 'react-native-modalize';
import { Platform, View } from 'react-native';
import {
  Spinner,
  useTheme
} from '@ui-kitten/components';
import useDimensions from "react-native-use-dimensions";
import { SafeAreaConsumer } from 'react-native-safe-area-context';

import useGetGroup from '../hooks/useGetGroup';

import GroupLobby from './GroupLobby';
import GroupMovieSelection from './GroupMovieSelection';
import GoupFinalSelection from './GroupFinalSelection';

const GroupModal = ({ onClosed, groupId }) => {
  const { screen } = useDimensions();

  const modal = useRef(null);

  const {
    data: groupData,
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
    case "selection_started":
      groupScreen = <GroupMovieSelection groupData={groupData} />;
      break;
    case "selection_done":
      groupScreen = <GoupFinalSelection groupData={groupData} />;
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
      <SafeAreaConsumer>
      {
        (insets) => (
          <View
            style={{
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              overflow: 'hidden',
              height: screen.height - insets.top - 14
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
          </View>
        )
      }

      </SafeAreaConsumer>
    </Modalize>
  );
}

export default GroupModal;