import React, { useState, useMemo } from 'react';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import {
  Icon,
  Text,
  withStyles,
  useTheme,
  Spinner
} from '@ui-kitten/components';

import { View, TouchableOpacity } from 'react-native';

import useGetUserMovieGroupSelection from '../hooks/useGetUserMovieGroupSelection';

import MovieBackdrop from '../components/MovieBackdrop';
import MovieTitle from '../components/MovieTitle';
import MovieOverview from '../components/MovieOverview';

const GroupMovieSelection = ({ groupData, themedStyle }) => {
  const { data: userMovieGroupSelectionData, loading: userMovieGroupSelectionLoading } = useGetUserMovieGroupSelection({ variables: { id: groupData.viewer.group.id }});
  const [ index, setIndex ] = useState(0);
  const theme = useTheme();

  const movieSelection = useMemo(() => (
    (userMovieGroupSelectionData?.viewer?.group?.userMovieGroupSelections || []).reduce((movieSelection, movieSelectionItem) => {
      if (!movieSelectionItem.selected) {
        return movieSelection;
      }

      const movieSelectionExistingItem = movieSelection.find((movie) => movie.id === movieSelectionItem.movie.id);

      if (movieSelectionExistingItem) {
        movieSelectionExistingItem.voteCount += 1;
      } else {
        movieSelection = [
          ...movieSelection,
          { ...movieSelectionItem.movie, voteCount: 1 }
        ]
      }
      return movieSelection;
    }, [])
  ), [userMovieGroupSelectionData?.viewer?.group?.userMovieGroupSelections])

  const sortedMovieSelection = useMemo(() => (
    movieSelection.sort((s1, s2) => s2.voteCount - s1.voteCount)
  ), [movieSelection])

  return (
    <View style={themedStyle.rootContainer}>
      <View style={themedStyle.codeLayout}>
        <View style={themedStyle.navigationContainer}>
          <TouchableOpacity
            disabled={index === 0}
            onPress={() => {
              setIndex(index - 1);
            }}
          >
            <Icon width={32} height={32} fill={index === 0 ? theme['color-basic-700'] : theme['color-basic-500']} name='arrow-circle-left-outline'/>
          </TouchableOpacity>
        </View>
        <View style={themedStyle.voteContainer}>
          <Text category="s1" style={{ color: sortedMovieSelection.length - index === 0 ? theme['color-basic-600'] : 'white' }}>
            {`Here's our final selection`}
          </Text>
          <Text
            style={[ themedStyle.code, { color: userMovieGroupSelectionLoading ? theme['color-basic-700'] : 'white' } ]}
          >
            {
              sortedMovieSelection[index] ? (
                sortedMovieSelection[index].voteCount <= 1 ?
                  `One vote` :
                  `${sortedMovieSelection[index].voteCount} votes`
              ) : ` `
            }
          </Text>
        </View>
        <View style={themedStyle.navigationContainer}>
          <TouchableOpacity
            disabled={sortedMovieSelection.length === 0 || index === sortedMovieSelection.length - 1}
            onPress={() => {
              setIndex(index + 1);
            }}
          >
            <Icon
              width={32}
              height={32}
              fill={sortedMovieSelection.length === 0 || index === sortedMovieSelection.length - 1 ? theme['color-basic-700'] : theme['color-basic-500']}
              name='arrow-circle-right-outline'
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={themedStyle.layout}>
        {
          userMovieGroupSelectionLoading ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Spinner status={'control'} />
            </View>
          ) : (
            sortedMovieSelection[index] ? (
              <View style={{ flex: 1, paddingTop: 20 }}>
                <MovieBackdrop movie={sortedMovieSelection[index]} />
                <MovieTitle movie={sortedMovieSelection[index]} />
                <MovieOverview movie={sortedMovieSelection[index]} />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text category="h4">
                  No movie selected
                </Text>
              </View>
            )
          )
        }
      </View>
      <SafeAreaConsumer>
        {
          (insets) => (
            <View
              style={[ themedStyle.userCounter, { marginBottom: insets.bottom }]}
            >
              {
                groupData.viewer.group.users.length <= 1 ?
                  <Text>{`One person in the room`}</Text> :
                  <Text>{`${groupData.viewer.group.users.length} people in the room`}</Text>
              }
            </View>
          )
        }
      </SafeAreaConsumer>
    </View>
  );
}

export const GroupMovieSelectionWithStyles = withStyles(GroupMovieSelection, theme => ({
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
    flexDirection: 'row',
    height: 100,
  },
  voteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  navigationContainer: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  code: {
    fontSize: 40,
    lineHeight: 40,
    marginTop: 16,
    // fontFamily: 'RobotoMonoBold'
  },
  layout: {
    flex: 1,
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
  },
  actionContainer: {
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    margin: 8,
  }
}));

export default GroupMovieSelectionWithStyles;
