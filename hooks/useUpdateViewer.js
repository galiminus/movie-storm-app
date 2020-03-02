import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const UPDATE_VIEWER = gql`
  mutation updateViewer($input: UpdateViewerInput!) {
    updateViewer(input: $input) {
      viewer {
        id
        name
      }
    }
  }
`;

export default (options) => {
  return (
    useMutation(UPDATE_VIEWER, options)
  );
}
