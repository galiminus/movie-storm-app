import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const DELETE_VIEWER = gql`
  mutation deleteViewer($input: DeleteViewerInput!) {
    deleteViewer(input: $input) {
      id
    }
  }
`

export default (options) => {
  return (
    useMutation(DELETE_VIEWER, options)
  );
}
