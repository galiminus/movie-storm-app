import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const GET_GROUP_ID = gql`
  query getGroupId @client {
    groupId @client(always: true)
  }
`;

export default (options) => {
  return (
    useQuery(GET_GROUP_ID, options)
  );
}
