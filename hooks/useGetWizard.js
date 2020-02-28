import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const GET_WIZARD = gql`
  query getWizard @client {
    wizard @client(always: true)
  }
`;

export default (options) => {
  return (
    useQuery(GET_WIZARD, options)
  );
}
