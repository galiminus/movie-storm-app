import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const CREATE_VIEWER = gql`
  mutation createViewer($input: CreateViewerInput!) {
    createViewer(input: $input) {
      viewer {
        id
        authorizationToken
      }
    }
  }
`;

export default (options) => {
  return (
    useMutation(CREATE_VIEWER, options)
  );
}
