import React from 'react';
import { View, Image } from 'react-native';
import {
  withStyles,
  Icon,
  useTheme
} from '@ui-kitten/components';
import useDimensions from "react-native-use-dimensions";

const MovieBackdrop = ({ themedStyle, movie }) => {
  const { window } = useDimensions();
  const theme = useTheme();

  return (
    movie.backdropPath || movie.posterPath ? (
      <View
        style={themedStyle.backdropContainer}
      >
        <Image
          style={[ themedStyle.backdrop, { width: window.width - 32 }]}
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
  );
}

export const MovieBackdropWithStyles = withStyles(MovieBackdrop, theme => ({
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
}));

export default MovieBackdropWithStyles;
