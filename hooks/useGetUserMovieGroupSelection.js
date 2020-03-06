import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const GET_USER_GROUP_MOVIE_SELECTION = gql`
  query getGroup($id: ID!) {
    viewer {
      id
      group(id: $id) {
        id
        userMovieGroupSelections {
          id
          selected
          movie {
            id
            title
            backdropPath
            posterPath
            overview
          }
          user {
            id
          }
        }
      }
    }
  }
`;

export default (options) => {
  return (
    useQuery(GET_USER_GROUP_MOVIE_SELECTION, options)
  );
}
