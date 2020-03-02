import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const LEAVE_GROUP = gql`
  mutation leaveGroup($input: LeaveGroupInput!) {
    leaveGroup(input: $input) {
      group {
        id
      }
    }
  }
`;

export default (options) => {
  return (
    useMutation(LEAVE_GROUP, options)
  );
}
