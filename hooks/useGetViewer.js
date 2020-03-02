import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const GET_VIEWER = gql`{
  viewer {
    id
    name
  }
}
`;

export default (options) => {
  return (
    useQuery(GET_VIEWER, options)
  );
}
