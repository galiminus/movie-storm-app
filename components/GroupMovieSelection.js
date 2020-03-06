import React, { useState} from 'react';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import {
  Text,
  withStyles,
  Button,
  useTheme,
  Spinner
} from '@ui-kitten/components';

import { View } from 'react-native';

import useGetGroupMovieSelection from '../hooks/useGetGroupMovieSelection';
import useCreateUserMovieGroupSelection from '../hooks/useCreateUserMovieGroupSelection';

import MovieBackdrop from '../components/MovieBackdrop';
import MovieTitle from '../components/MovieTitle';
import MovieOverview from '../components/MovieOverview';

const GroupMovieSelection = ({ groupData, themedStyle }) => {
  const { data: groupMovieSelectionData, loading: groupMovieSelectionLoading } = useGetGroupMovieSelection({ variables: { id: groupData.viewer.group.id }});
  const [ createUserMovieGroupSelection ] = useCreateUserMovieGroupSelection();
  const [ index, setIndex ] = useState(0);
  const theme = useTheme();

  const movieSelection = groupMovieSelectionData?.viewer?.group?.selection || [];

  const handleMovieChoice = (selected) => {
    setIndex(index + 1);
    createUserMovieGroupSelection({
      variables: {
        input: {
          movieId: movieSelection[index].id,
          groupId: groupData.viewer.group.id,
          selected
        }
      }
    })
  }

  let movieLeft = null;
  if (movieSelection.length === 0) {
    movieLeft = `${groupData.viewer.group.selectionCount} movies left`;
  }
  else if (movieSelection.length - index === 1) {
    movieLeft = "One movie left";
  }
  else if (movieSelection.length - index === 0) {
    movieLeft = `Waiting for others`;
  } else {
    movieLeft = `${movieSelection.length - index} movies left`;
  }

  return (
    <View style={themedStyle.rootContainer}>
      <View style={themedStyle.codeLayout}>
        <Text category="s1" style={{ color: movieSelection.length - index === 0 ? theme['color-basic-600'] : 'white' }}>
          Which movie do you want to watch?
        </Text>
        <Text
          style={[ themedStyle.code, { color: groupMovieSelectionLoading ? theme['color-basic-700'] : 'white' } ]}
        >
          {movieLeft}
        </Text>
      </View>
      <View style={themedStyle.layout}>
        {
          groupMovieSelectionLoading || movieSelection.length - index === 0 ? (
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
            movieSelection[index] ? (
              <View style={{ flex: 1, paddingTop: 20 }}>
                <MovieBackdrop movie={movieSelection[index]} />
                <MovieTitle movie={movieSelection[index]} />
                <MovieOverview movie={movieSelection[index]} />
                <View
                  style={themedStyle.actionContainer}
                >
                  <Button
                    style={themedStyle.actionButton}
                    appearance="outline"
                    status="info"
                    onPress={() => handleMovieChoice(false)}
                  >
                    NO
                  </Button>
                  <Button
                   style={themedStyle.actionButton}
                   status="info"
                    onPress={() => handleMovieChoice(true)}
                  >
                    YES
                  </Button>
                </View>
              </View>
            ) : null
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
    flexDirection: 'column',
    height: 100,
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
