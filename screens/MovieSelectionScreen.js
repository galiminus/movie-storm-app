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
  ButtonGroup,
  Spinner,
} from '@ui-kitten/components';
import useDimensions from "react-native-use-dimensions";
import { View, Animated, TouchableOpacity } from 'react-native';
import useGetMovieSelection from '../hooks/useGetMovieSelection';
import useCreateRating from '../hooks/useCreateRating';
import BottomButton from '../components/BottomButton';
import MovieBackdrop from '../components/MovieBackdrop';
import MovieTitle from '../components/MovieTitle';
import MovieOverview from '../components/MovieOverview';

const MovieCard = ({ movie, themedStyle, onPressRate }) => {
  const [ chosenGrade, setChosenGrade ] = useState(0);

  return (
    <View
      appearance="outline"
      style={[ themedStyle.card ]}
      key={movie.id}
    >
      <MovieBackdrop movie={movie} />
      <MovieTitle movie={movie} />
      <MovieOverview movie={movie} />

      <View style={themedStyle.starsContainer} >
        <ButtonGroup style={themedStyle.buttonGroup} appearance='outline' status="warning" size="small">
          {
            [1, 2, 3, 4, 5].map((grade) => (
              <Button
                key={grade}
                textStyle={{ marginLeft: 0 }}
                icon={(style) => <Icon {...style} name={grade === chosenGrade ? 'star' : 'star-outline'} />}
                onPress={() => {
                  setChosenGrade(grade);
                  onPressRate(grade);
                }}
              >
                {`${grade}`}
              </Button>
            ))
          }
        </ButtonGroup>
        <Text style={themedStyle.rateActionText}>Rate this movie</Text>
      </View>
    </View>
  );
}

export const MovieCardScreenWithStyles = withStyles(MovieCard, theme => ({
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
}));

const MovieSelectionScreen = ({ navigation, route, themedStyle }) => {
  const [ createRating ] = useCreateRating();

  const { data: movieSelectionData } = useGetMovieSelection({ fetchPolicy: 'no-cache' });
  const movieSelection = movieSelectionData?.viewer?.movieSelection || [];
  const [ index, setIndex ] = useState(0);

  const [ counter, setCounter ] = useState(1);
  const [ rotations, setRotations ] = useState([]);

  const { screen } = useDimensions();

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
                  key="text"
                  onPress={() => navigation.navigate("Home")}
                >
                  <Text style={{ lineHeight: 24 }}>Skip this step</Text>
                </TouchableOpacity>,
                <TopNavigationAction
                  key="icon"
                  icon={(style) => <Icon {...style} name='arrow-forward'/>}
                  onPress={() => navigation.navigate("Home")}
                />
              ] : [
                <Text style={{ lineHeight: 24, marginRight: 8 }} key="counter">
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
                            })
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
                        {`I didn't see this movie`}
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
