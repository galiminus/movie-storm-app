import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const DELETE_GROUP = gql`
  mutation deleteGroup($input: DeleteGroupInput!) {
    deleteGroup(input: $input) {
      id
    }
  }
`

export default (options) => {
  return (
    useMutation(DELETE_GROUP, options)
  );
}
