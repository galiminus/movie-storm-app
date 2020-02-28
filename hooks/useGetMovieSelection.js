import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const GET_MOVIE_SELECTION = gql`{
  viewer {
    id
    movieSelection {
      id
      title
      backdropPath
      posterPath
      overview
    }
  }
}
`;

export default (options) => {
  return (
    useQuery(GET_MOVIE_SELECTION, options)
  );
}
