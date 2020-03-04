import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const DELETE_GROUP_ID = gql`
  mutation deleteGroupId {
    deleteGroupId @client
  }
`;

export default (options) => {
  return (
    useMutation(DELETE_GROUP_ID, options)
  );
}
