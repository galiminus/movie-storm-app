import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const CREATE_GROUP = gql`
  mutation createRating($input: CreateGroupInput!) {
    createGroup(input: $input) {
      group {
        id
        code
      }
    }
  }
`;

export default (options) => {
  return (
    useMutation(CREATE_GROUP, options)
  );
}
