import React, { useState, useEffect } from 'react';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import {
  Icon,
  TopNavigation,
  TopNavigationAction,
  Layout,
  Text,
  withStyles,
  Button,
  Input,
  Spinner,
  useTheme,
} from '@ui-kitten/components';
import { View, TouchableOpacity, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import useDimensions from "react-native-use-dimensions";

import BottomButton from '../components/BottomButton';
import UserAvatar from '../components/UserAvatar';
import AnimatedImageBackground from '../components/AnimatedImageBackground';
import useCreateGroup from '../hooks/useCreateGroup';
import useJoinGroup from '../hooks/useJoinGroup';
import useGetViewer from '../hooks/useGetViewer';

import useGetGroupId from '../hooks/useGetGroupId';
import useDeleteGroupId from '../hooks/useDeleteGroupId';
import useSetGroupId from '../hooks/useSetGroupId';
import useLeaveGroup from '../hooks/useLeaveGroup';

import useUpdateViewer from '../hooks/useUpdateViewer';
import useGetMovieSelection from '../hooks/useGetMovieSelection';

import GroupModal from '../components/GroupModal';

const HomeScreen = ({ navigation, themedStyle }) => {
  const { data: viewerData } = useGetViewer();
  const [ updateViewer, { loading: updateViewerLoading } ] = useUpdateViewer();
  const [ code, setCode ] = useState("");
  const [ name, setName ] = useState("");
  useEffect(() => {
    setName(viewerData?.viewer?.name || "");
  }, [viewerData])

  const theme = useTheme();
  const { window } = useDimensions();
  const CONTAINER_WIDTH = window.width > 300 ? 300 : window.width;

  const [ nameFocused, setNameFocused ] = useState(false);
  const [ codeFocused, setCodeFocused ] = useState(false);

  const { data: movieSelectionData } = useGetMovieSelection({ fetchPolicy: 'no-cache' });
  const movieSelection = movieSelectionData?.viewer?.movieSelection || [];
  const [ imageBackgroundLoaded, setImageBackgroundLoaded ] = useState(false);

  const contentLoading = !viewerData || !imageBackgroundLoaded;
  const isProfileValid = name.trim().length > 0 || viewerData?.viewer?.name?.length > 0;

  const { data: groupIdData } = useGetGroupId();
  const [ deleteGroupId ] = useDeleteGroupId();
  const [ setGroupId ] = useSetGroupId();

  const [
    createGroup,
    {
      loading: createGroupLoading,
    }
  ] = useCreateGroup();

  const [
    joinGroup,
    {
      loading: joinGroupLoading,
      error: joinGroupError
    }
  ] = useJoinGroup();

  const [
    leaveGroup,
  ] = useLeaveGroup();

  const handleCreateGroup = async () => {
    const { data: { createGroup: { group: { id } }} } = await createGroup({ variables: { input: { selectionCount: 12 } }});
    setGroupId({ variables: { groupId: id } });
  }

  const handleJoinGroup = async (code) => {
    const { data: { joinGroup: { group: { id } }} } = await joinGroup({ variables: { input: { code: code.toUpperCase() }}});
    setGroupId({ variables: { groupId: id } });
    setCode("");
    Keyboard.dismiss();
  }

  const handleCloseGroup = async () => {
    leaveGroup({ variables: { input: { id: groupIdData.groupId }} });
    deleteGroupId();
  }

  return (
    <AnimatedImageBackground
      onLoadEnd={() => setImageBackgroundLoaded(true)}
      backgroundColor={theme['color-basic-800']}
      images={movieSelection.map((movie) => `https://image.tmdb.org/t/p/w780/${movie.backdropPath || movie.posterPath}`)}
    >
      <SafeAreaConsumer>
        {
          (insets) => (
            <View style={[themedStyle.rootContainer, { paddingTop: insets.top }]}>
              <TopNavigation
                style={{ backgroundColor: 'transparent', zIndex: 1 }}
                leftControl={
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Settings")}
                    style={{ display: 'flex', flexDirection: 'row', marginLeft: 8 }}
                  >
                    <Icon width={24} height={24} fill="white" name="settings" />
                    <Text style={{ lineHeight: 24, marginLeft: 8 }}>Settings</Text>
                  </TouchableOpacity>
                }
                rightControls={[
                  <TouchableOpacity
                    key="text"
                    onPress={() => navigation.navigate("MovieSelection", { initial: false })}
                  >
                    <Text style={{ lineHeight: 24 }}>Rate more movies</Text>
                  </TouchableOpacity>,
                  <TopNavigationAction
                    key="icon"
                    icon={(style) => <Icon {...style} name='film-outline'/>}
                    onPress={() => navigation.navigate("MovieSelection", { initial: false })}
                  />
                ]}
              />
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? undefined : "height"}
                style={{ flex: 1 }}
                contentContainerStyle={{ flex: 1 }}
              >
                {
                  !contentLoading ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
                      {
                        !codeFocused ? (
                            <View
                              style={themedStyle.profileContainer}
                            >
                              {
                                viewerData?.viewer ? (
                                  <UserAvatar
                                    size={128}
                                    borderWidth={4}
                                    user={viewerData.viewer}
                                  />
                                ) : null
                              }
                              <Input
                                autoCorrect={false}
                                style={[ themedStyle.nameInput, { width: CONTAINER_WIDTH }]}
                                placeholder='Your name...'
                                value={name}
                                status="control"
                                onChangeText={(name) => {
                                  setName(name);
                                }}
                                caption={isProfileValid ? " " : "Setting a name is required to create or join a room"}
                                captionStyle={{
                                  textAlign: 'center',
                                  width: '100%',
                                  color: theme['color-basic-600']
                                }}
                                onSubmitEditing={() => {
                                  if (name.trim() === viewerData?.viewer?.name) {
                                    return;
                                  }
                                  updateViewer({
                                    variables: {
                                      input: {
                                        name
                                      }
                                    }
                                  })
                                }}
                                onFocus={() => setNameFocused(true)}
                                onBlur={() => setNameFocused(false)}
                              />
                              <View style={{ marginTop: 8 }}>
                                <Spinner status={'control'} style={{ opacity: updateViewerLoading ? 1 : 0}} />
                              </View>
                            </View>
                        ) : null
                      }
                      {
                        !codeFocused && !nameFocused && isProfileValid ? (
                          <View
                            style={[themedStyle.separator, { width: CONTAINER_WIDTH }]}
                          />
                        ) : null
                      }
                      {
                        !nameFocused ? (
                        <View
                          style={[
                            themedStyle.joinContainer,
                            { width: CONTAINER_WIDTH, maxHeight: isProfileValid ? 'auto' : 0, overflow: 'hidden' },
                          ]}
                        >
                          <Text style={{ width: '100%', textAlign: 'center' }}>
                            Create or join a room to enter a movie selection vote with your friends.
                          </Text>
                          <Input
                            status={joinGroupError ? 'danger' : 'basic'}
                            style={themedStyle.codeInput}
                            placeholder='Enter the room code to join'
                            value={code.trim().toUpperCase()}
                            onChangeText={setCode}
                            variant="giant"
                            autoCapitalize={'none'}
                            autoComplete={'off'}
                            autoCorrect={false}
                            maxLength={4}
                            onFocus={() => setCodeFocused(true)}
                            onBlur={() => setCodeFocused(false)}
                            textStyle={{
                              fontFamily: 'RobotoMonoBold',
                            }}
                          />
                          <Button
                            disabled={code.trim().length !== 4 || joinGroupLoading}
                            appearance="outline"
                            status="control"
                            style={[ themedStyle.joinButton ]}
                            onPress={async () => {
                              if (code.trim().length !== 4) {
                                return ;
                              }
                              handleJoinGroup(code);
                            }}
                          >
                            JOIN
                          </Button>
                        </View>
                        ) : null
                      }
                    </View>
                  ) : (
                    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <Spinner size='giant' status={'control'} />
                    </Layout>
                  )
                }
              </KeyboardAvoidingView>
              {
                !contentLoading ? (
                  <BottomButton
                    key={`bottom-button-${isProfileValid}`}
                    hidden={!isProfileValid}
                    disabled={createGroupLoading || joinGroupLoading}
                    size="giant"
                    style={themedStyle.createButton}
                    onPress={handleCreateGroup}
                    last
                  >
                    CREATE A ROOM
                  </BottomButton>
                ) : null
              }
            </View>
          )
        }
      </SafeAreaConsumer>
      {groupIdData?.groupId ? <GroupModal groupId={groupIdData.groupId} onClosed={handleCloseGroup} /> : null}
    </AnimatedImageBackground>
  );
}


export const HomeScreenWithStyles = withStyles(HomeScreen, theme => ({
  rootContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  nameInput: {
    marginTop: 16,
    backgroundColor: theme['color-basic-700']
  },
  codeInput: {
    marginTop: 16,
    width: '100%',
  },
  separator: {
    borderTopWidth: 0.5,
    borderTopColor: theme['color-basic-600'],
    width: '100%',
    flex: 0,
  },
  profileContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  joinContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButton: {
    backgroundColor: theme['color-basic-700'],
    marginTop: 0,
    width: '100%'
  },
  createButton: {
    backgroundColor: theme['color-danger-500'],
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
}));

export default HomeScreenWithStyles;
