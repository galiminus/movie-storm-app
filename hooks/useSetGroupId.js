import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const SET_GROUP_ID = gql`
  mutation setGroupId($groupId: String!) {
    setGroupId(groupId: $groupId) @client
  }
`;

export default (options) => {
  return (
    useMutation(SET_GROUP_ID, options)
  );
}
