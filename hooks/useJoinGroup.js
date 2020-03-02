import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const JOIN_GROUP = gql`
  mutation joinGroup($input: JoinGroupInput!) {
    joinGroup(input: $input) {
      group {
        id
      }
    }
  }
`;

export default (options) => {
  return (
    useMutation(JOIN_GROUP, options)
  );
}
