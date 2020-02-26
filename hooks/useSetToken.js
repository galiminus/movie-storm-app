import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const SET_TOKEN = gql`
  mutation setToken($token: String!) {
    setToken(token: $token) @client
  }
`;

export default (options) => {
  return (
    useMutation(SET_TOKEN, options)
  );
}
