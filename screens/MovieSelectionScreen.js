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
  ButtonGroup
} from '@ui-kitten/components';
import { View, Image, Animated, Dimensions, Easing } from 'react-native';
import useGetMovieSelection from '../hooks/useGetMovieSelection';
import useCreateRating from '../hooks/useCreateRating';
import BottomButton from '../components/BottomButton';

const { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT } = Dimensions.get('window');

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back'/>
);

const ForwardIcon = (style) => (
  <Icon {...style} name='arrow-forward'/>
);

const MovieCard = ({ movie, themedStyle, onPressRate }) => {
  return (
    <View
      appearance="outline"
      style={[ themedStyle.card ]}
      key={movie.id}
    >
      <Image
        style={themedStyle.backdrop}
        resizeMode={'cover'}
        source={{ uri: `https://image.tmdb.org/t/p/w780/${movie.backdropPath || movie.posterPath}` }}
      />
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
        <Text style={themedStyle.overviewText} numberOfLines={4}>
           {movie.overview}
        </Text>
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
    </View>
  );
}

const MovieSelectionScreen = ({ navigation, route, themedStyle }) => {
  const [ createRating ] = useCreateRating();

  const { data: movieSelectionData, loading: movieSelectionLoading } = useGetMovieSelection({ fetchPolicy: 'no-cache' });
  const movieSelection = movieSelectionData?.viewer?.movieSelection || [];
  const [ index, setIndex ] = useState(0);
  const [ counter, setCounter ] = useState(1);
  const [ rotations, setRotations ] = useState([]);

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

  if (movieSelectionLoading) {
    <View style={[ themedStyle.rootContainer ]}>
    </View>
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
                    icon={BackIcon}
                    onPress={() => navigation.navigate("Home")}
                  />
                ) : null
              }
              rightControls={initial ? [
                <Text style={{ lineHeight: 24 }}>Skip this step</Text>,
                <TopNavigationAction
                  icon={ForwardIcon}
                  onPress={() => navigation.navigate("Home")}
                />
              ] : [
                <Text style={{ lineHeight: 24, marginRight: 8 }}>{`${counter}/${movieSelection.length}`}</Text>,
              ]}
              title={!initial ? 'Home' : `${counter}/${movieSelection.length}`}
              titleStyle={{ marginLeft: 8 }}
            />
            {
              [1, 0].map((offset) => (
                movieSelection[index + offset] ? (
                  <Animated.View
                    key={movieSelection[index + offset].id}
                    style={{
                      flex: 1,
                      transform: [
                        { translateX: -(VIEWPORT_WIDTH  / 2) - 300 },
                        { translateY: (VIEWPORT_HEIGHT  / 2) - 300},
                        { rotate: rotations[index + offset] ? rotations[index + offset] : 0 },
                        { translateX: (VIEWPORT_WIDTH  / 2) + 300 },
                        { translateY: -(VIEWPORT_HEIGHT  / 2) + 300},
                      ],
                      position: 'absolute',
                      top: insets.top + 54,
                      left: 0,
                      height: VIEWPORT_HEIGHT - insets.top - 54,
                      zIndex: 1 - offset,
                    }}
                  >
                    <Layout
                      style={themedStyle.layout}
                    >
                      <MovieCard
                        movie={movieSelection[index + offset]}
                        themedStyle={themedStyle}
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
  title: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  backdrop: {
    flex: 1,
    marginHorizontal: 16,
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
  buttonGroup: {
  },
  layout: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
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
  skipButton: {
    backgroundColor: theme['color-basic-900'],
  },
}));

export default MovieSelectionScreenWithStyles;
