import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const GET_GROUP = gql`
  query getGroup($id: ID!) {
    viewer {
      id
      group(id: $id) {
        id
        code
        owner {
          id
        }
        users {
          id
          name
        }
      }
    }
  }
`;

export default (options) => {
  return (
    useQuery(GET_GROUP, options)
  );
}
