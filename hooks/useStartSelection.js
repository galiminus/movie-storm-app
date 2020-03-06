import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const START_SELECTION = gql`
  mutation startSelection($input: StartSelectionInput!) {
    startSelection(input: $input) {
      group {
        id
      }
    }
  }
`;

export default (options) => {
  return (
    useMutation(START_SELECTION, options)
  );
}
