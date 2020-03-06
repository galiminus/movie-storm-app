import React from 'react';

import {
  Text,
} from '@ui-kitten/components';

const MovieTitle = ({ movie }) => {
  return (
    <Text
      style={{
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
      }}
      category='h6'
      numberOfLines={1}
    >
      {movie.title}
    </Text>
  );
}

export default MovieTitle;
