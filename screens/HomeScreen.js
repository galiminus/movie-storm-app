import React, { useState, useEffect } from 'react';
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
  Input,
  Modal,
  Spinner,
  useTheme,
} from '@ui-kitten/components';
import { View, Image, TouchableOpacity, KeyboardAvoidingView, Keyboard, Animated, ImageBackground } from 'react-native';
import useDimensions from "react-native-use-dimensions";

import BottomButton from '../components/BottomButton';
import UserAvatar from '../components/UserAvatar';
import AnimatedImageBackground from '../components/AnimatedImageBackground';
import useCreateGroup from '../hooks/useCreateGroup';
import useJoinGroup from '../hooks/useJoinGroup';
import useGetViewer from '../hooks/useGetViewer';
import useUpdateViewer from '../hooks/useUpdateViewer';
import useGetMovieSelection from '../hooks/useGetMovieSelection';

const HomeScreen = ({ navigation, themedStyle }) => {
  const [ createGroup, { loading: createGroupLoading } ] = useCreateGroup();
  const [ joinGroup, { loading: joinGroupLoading, error: joinGroupError } ] = useJoinGroup();

  const { data: viewerData } = useGetViewer();
  const [ updateViewer, { loading: updateViewerLoading } ] = useUpdateViewer();

  const [ code, setCode ] = useState("");
  const [ name, setName ] = useState("");
  useEffect(() => {
    setName(viewerData?.viewer?.name || "");
  }, [viewerData])

  const theme = useTheme();
  const { screen } = useDimensions();
  const CONTAINER_WIDTH = screen.width > 300 ? 300 : screen.width;

  const [ nameFocused, setNameFocused ] = useState(false);
  const [ codeFocused, setCodeFocused ] = useState(false);

  const { data: movieSelectionData } = useGetMovieSelection({ fetchPolicy: 'no-cache' });
  const movieSelection = movieSelectionData?.viewer?.movieSelection || [];
  const [ imageBackgroundLoaded, setImageBackgroundLoaded ] = useState(false);

  const loading = !viewerData || !imageBackgroundLoaded;
  const isProfileValid = name.trim().length > 0 && viewerData?.viewer?.name?.trim()?.length > 0;
  // const isProfileValid = name.trim().length > 0;

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
                    onPress={() => navigation.navigate("MovieSelection", { initial: false })}
                  >
                    <Text style={{ lineHeight: 24 }}>Rate more movies</Text>
                  </TouchableOpacity>,
                  <TopNavigationAction
                    icon={(style) => <Icon {...style} name='film-outline'/>}
                    onPress={() => navigation.navigate("Home")}
                    onPress={() => navigation.navigate("MovieSelection", { initial: false })}
                  />
                ]}
              />
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                contentContainerStyle={{ flex: 1 }}
              >
                {
                  !loading ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
                      {
                        !codeFocused ? (
                            <View
                              style={themedStyle.profileContainer}
                            >
                              <UserAvatar
                                editable
                                size={128}
                                borderWidth={4}
                                user={viewerData.viewer}
                              />
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
                            Create or join a room to enter a two-round movie selection vote with your friends.
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
                          />
                          <Button
                            disabled={code.trim().length !== 4}
                            appearance="outline"
                            status="control"
                            style={[ themedStyle.joinButton ]}
                            onPress={async () => {
                              if (code.trim().length !== 4) {
                                return ;
                              }
                              const { data: { joinGroup: { group: { id } }} } = await joinGroup({ variables: { input: { code: code.toUpperCase() }}});
                              navigation.navigate("GroupLobby", {
                                id, code
                              });
                              setCode("");
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
                !loading ? (
                  <BottomButton
                    key={`lol-${isProfileValid}`}
                    hidden={!isProfileValid}
                    disabled={createGroupLoading || joinGroupLoading}
                    size="giant"
                    style={themedStyle.createButton}
                    onPress={async () => {
                      const { data: { createGroup: { group: { id, code } }} } = await createGroup({ variables: { input : {} }});
                      await joinGroup({ variables: { input: { code }}})

                      navigation.navigate("GroupLobby", {
                        id, code
                      });
                    }}
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
    alignItems: 'center',
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
