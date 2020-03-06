import React, { useState } from 'react';

import {
  Text,
  useTheme,
  withStyles,
  Modal,
  Button,
} from '@ui-kitten/components';
import { View, TouchableOpacity } from 'react-native';

const MovieOverview = ({ themedStyle, movie }) => {
  const [ overviewModalOpen, setOverviewModalOpen ] = useState(false);
  const theme = useTheme();

  return (
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

export const MovieOverviewWithStyles = withStyles(MovieOverview, theme => ({
  overview: {
    borderTopWidth: 0.5,
    marginHorizontal: 16,
    paddingVertical: 8,
    borderTopColor: theme['color-basic-600']
  },
  overviewText: {
    textAlign: 'justify',
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

export default MovieOverviewWithStyles;
