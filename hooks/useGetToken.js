import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const GET_TOKEN = gql`
  query getToken @client {
    token @client(always: true)
  }
`;

export default (options) => {
  return (
    useQuery(GET_TOKEN, options)
  );
}
