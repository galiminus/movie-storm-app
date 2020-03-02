import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const DELETE_TOKEN = gql`
  mutation deleteToken {
    deleteToken @client
  }
`;

export default (options) => {
  return (
    useMutation(DELETE_TOKEN, options)
  );
}
