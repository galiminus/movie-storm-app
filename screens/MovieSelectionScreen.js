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
  ButtonGroup,
  Spinner,
  Modal,
  useTheme
} from '@ui-kitten/components';
import useDimensions from "react-native-use-dimensions";
import { View, Image, Animated, Dimensions, Easing, TouchableOpacity, ImageBackground } from 'react-native';
import useGetMovieSelection from '../hooks/useGetMovieSelection';
import useCreateRating from '../hooks/useCreateRating';
import BottomButton from '../components/BottomButton';

const MovieCard = ({ movie, themedStyle, onPressRate }) => {
  const theme = useTheme();
  const [ overviewModalOpen, setOverviewModalOpen ] = useState(false);
  const { screen } = useDimensions();

  return (
    <View
      appearance="outline"
      style={[ themedStyle.card ]}
      key={movie.id}
    >
        {
          movie.backdropPath || movie.posterPath ? (
            <View
              style={themedStyle.backdropContainer}
            >
              <Image
                style={[ themedStyle.backdrop, { width: screen.width - 32 }]}
                resizeMode={'cover'}
                source={{ uri: `https://image.tmdb.org/t/p/w780/${movie.backdropPath || movie.posterPath}` }}
              />
            </View>
          ) : (
            <View
              style={themedStyle.noBackdrop}
            >
              <Icon width={92} height={92} fill={theme['color-basic-800']} name="image-2" />
            </View>
          )
        }
      <Text
        style={themedStyle.title}
        category='h6'
        numberOfLines={1}
      >
        {movie.title}
      </Text>
      <View
        style={themedStyle.overview}
      >
        {
          movie.overview ? (
            <TouchableOpacity
              onPress={() => setOverviewModalOpen(true)}
            >
              <Text style={themedStyle.overviewText} numberOfLines={4}>
                 {movie.overview}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[ themedStyle.overviewText, { fontFamily: 'CircularStdItalic', color: theme['color-basic-600'] } ]} numberOfLines={4}>
              No description
            </Text>
          )
        }
      </View>
      <View style={themedStyle.starsContainer} >
        <ButtonGroup style={themedStyle.buttonGroup} appearance='outline' status="warning" size="small">
          {
            [1, 2, 3, 4, 5].map((grade) => (
              <Button
                key={grade}
                textStyle={{ marginLeft: 0 }}
                icon={(style) => <Icon {...style} name='star-outline' />}
                onPress={() => {
                  onPressRate(grade)
                }}
              >
                {`${grade}`}
              </Button>
            ))
          }
        </ButtonGroup>
        <Text style={themedStyle.rateActionText}>Rate this movie</Text>
      </View>
      <Modal
        backdropStyle={themedStyle.modalBackdrop}
        onBackdropPress={() => setOverviewModalOpen(false)}
        visible={overviewModalOpen}
      >
        <View
          style={themedStyle.overviewModalContainer}
        >
          <Text
            style={[ themedStyle.title, { textDecorationLine: 'underline' }]}
            category='h6'
          >
            {movie.title}
          </Text>
          <Text style={themedStyle.overviewText}>
            {movie.overview}
          </Text>
          <Button
            appearance="outline"
            status="control"
            style={themedStyle.closeButton}
            size="tiny"
            onPress={() => setOverviewModalOpen(false)}
          >
            CLOSE
          </Button>
        </View>
      </Modal>
    </View>
  );
}

export const MovieCardScreenWithStyles = withStyles(MovieCard, theme => ({
  title: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  backdropContainer: {
    flex: 1,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.5,
    borderRadius: 8,
  },
  backdrop: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 8,
  },
  noBackdrop: {
    marginHorizontal: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme['color-basic-700'],
    borderRadius: 8,
  },
  overview: {
    borderTopWidth: 0.5,
    marginHorizontal: 16,
    paddingVertical: 8,
    borderTopColor: theme['color-basic-600']
  },
  overviewText: {
    textAlign: 'justify',
  },
  card: {
    flex: 1,
    borderWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: theme['color-basic-800'],
  },
  starsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  rateActionText: {
    marginTop: 8,
    color: theme['color-warning-600']
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  overviewModalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
  },
  closeButton: {
    marginTop: 32,
    backgroundColor: 'black'
  }
}));

const MovieSelectionScreen = ({ navigation, route, themedStyle }) => {
  const [ createRating ] = useCreateRating();

  const { data: movieSelectionData, loading: movieSelectionLoading } = useGetMovieSelection({ fetchPolicy: 'no-cache' });
  const movieSelection = movieSelectionData?.viewer?.movieSelection || [];
  const [ index, setIndex ] = useState(0);

  const [ counter, setCounter ] = useState(1);
  const [ rotations, setRotations ] = useState([]);

  const { screen } = useDimensions();

  const theme = useTheme();

  const { initial } = route.params;

  useEffect(() => {
    if (rotations.length === movieSelection.length)
      return;

    const baseRotations = movieSelection.map(() => (
      new Animated.Value(0)
    ))
    setRotations(baseRotations);
  }, [movieSelection]);

  const handleNextMovie = (index, offset) => {
    if (counter < movieSelection.length) {
      setCounter(counter + 1);
    }
    Animated.timing(rotations[index + offset], {
      toValue: -Math.PI,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      if (index === movieSelection.length - 1) {
        navigation.navigate("Home");
      } else {
        setIndex(index + 1);
      }
    });
  }

  return (
    <SafeAreaConsumer>
      {
        (insets) => (
          <View style={[ themedStyle.rootContainer, { paddingTop: insets.top }]}>
            <TopNavigation
              leftControl={
                !initial ? (
                  <TopNavigationAction
                    icon={(style) => <Icon {...style} name='arrow-back'/>}
                    onPress={() => navigation.navigate("Home")}
                  />
                ) : null
              }
              rightControls={initial ? [
                <TouchableOpacity
                  onPress={() => navigation.navigate("Home")}
                >
                  <Text style={{ lineHeight: 24 }}>Skip this step</Text>
                </TouchableOpacity>,
                <TopNavigationAction
                  icon={(style) => <Icon {...style} name='arrow-forward'/>}
                  onPress={() => navigation.navigate("Home")}
                />
              ] : [
                <Text style={{ lineHeight: 24, marginRight: 8 }}>
                  {movieSelection.length > 0 && `${counter}/${movieSelection.length}`}
                </Text>,
              ]}
              title={!initial ? 'Rate more movies' : movieSelection.length > 0 && `${counter}/${movieSelection.length}`}
              titleStyle={{ marginLeft: 8 }}
            />
            {
              movieSelection.length > 0 ? (
                [1, 0].map((offset) => (
                  movieSelection[index + offset] ? (
                    <Animated.View
                      key={movieSelection[index + offset].id}
                      style={{
                        flex: 1,
                        transform: [
                          { translateX: -(screen.width  / 2) - 300 },
                          { translateY: (screen.height  / 2) - 300},
                          { rotate: rotations[index + offset] ? rotations[index + offset] : 0 },
                          { translateX: (screen.width  / 2) + 300 },
                          { translateY: -(screen.height  / 2) + 300},
                        ],
                        position: 'absolute',
                        top: insets.top + 54,
                        left: 0,
                        height: screen.height - insets.top - 54,
                        zIndex: 1 - offset,
                      }}
                    >
                      <Layout
                        style={themedStyle.layout}
                      >
                        <MovieCardScreenWithStyles
                          movie={movieSelection[index + offset]}
                          onPressRate={(grade) => {
                            createRating({
                              variables: {
                                input: {
                                  movieId: movieSelection[index + offset].id,
                                  grade: grade,
                                  seenAt: new Date().toString(),
                                }
                              }
                            });
                            handleNextMovie(index, offset);
                          }}
                        />
                      </Layout>
                      <BottomButton
                        size="large"
                        style={[ themedStyle.skipButton, { flexDirection: 'row-reverse' }]}
                        last
                        onPress={() => {
                          createRating({
                            variables: {
                              input: {
                                movieId: movieSelection[index + offset].id,
                                grade: null,
                                seenAt: null,
                              }
                            }
                          });
                          handleNextMovie(index, offset);
                        }}
                      >
                        I didn't see this movie
                      </BottomButton>
                    </Animated.View>
                  ) : null
                ))
              ) : (
                <View
                  style={themedStyle.spinnerContainer}
                >
                  <Spinner size='giant' status={'control'} />
                </View>
              )
            }
          </View>
        )
      }
    </SafeAreaConsumer>
  );
}

export const MovieSelectionScreenWithStyles = withStyles(MovieSelectionScreen, theme => ({
  rootContainer: {
    backgroundColor: theme['color-basic-800'],
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  layout: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: theme['color-basic-900'],
  },
}));

export default MovieSelectionScreenWithStyles;
