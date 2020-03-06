import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const CREATE_USER_MOVIE_GROUP_SELECTION = gql`
  mutation createUserMovieGroupSelection($input: CreateUserMovieGroupSelectionInput!) {
    createUserMovieGroupSelection(input: $input) {
      group {
        id
      }
    }
  }
`;

export default (options) => {
  return (
    useMutation(CREATE_USER_MOVIE_GROUP_SELECTION, options)
  );
}
