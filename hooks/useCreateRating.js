import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const CREATE_RATING = gql`
  mutation createRating($input: CreateRatingInput!) {
    createRating(input: $input) {
      rating {
        id
      }
    }
  }
`;

export default (options) => {
  return (
    useMutation(CREATE_RATING, options)
  );
}
