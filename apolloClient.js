import { ApolloClient } from 'apollo-client';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { RetryLink } from "apollo-link-retry";
import { withClientState } from 'apollo-link-state';
import { ApolloLink, Observable } from 'apollo-link';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const createClient = async () => {
  const cache = new InMemoryCache({
    dataIdFromObject: object => {
      switch (object.__typename) {
        default: return defaultDataIdFromObject(object)
      }
    }
  });

  const request = async (operation) => {
    const token = await SecureStore.getItemAsync('token', token);

    if (token) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`
        }
      });
    }
  };

  const requestLink = new ApolloLink((operation, forward) =>
    new Observable(observer => {
      let handle;
      Promise.resolve(operation)
        .then(operation => request(operation))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: (...args) => {
              observer.complete(...args)
            }
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
  );

  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: 10000,
      jitter: true
    },
    attempts: {
      max: Infinity,
      retryIf: (error) => {
        // Toast.show({ text: "Network error" });

        return (!!error.message.match(/Network/))
      }
    }
  });

  const stateLink = withClientState({
    cache
  });

  const httpLink = new HttpLink({
    uri: process.env.NODE_ENV === 'development' ? Constants.manifest.extra.developmentApiUrl : Constants.manifest.extra.productionApiUrl,
    credentials: 'same-origin',
  })

  const hasSubscriptionOperation = ({ query: { definitions } }) => {
    return definitions.some(
      ({ kind, operation }) => kind === 'OperationDefinition' && operation === 'subscription'
    )
  }

  const client = new ApolloClient({
    typeDefs: ``,
    resolvers: {
      Query: {
        token: async () => {
          const token = await SecureStore.getItemAsync('token');

          return token;
        },
      },
      Mutation: {
        setToken: async (_, { token }, { cache }) => {

          try {
          await SecureStore.setItemAsync('token', token, { keychainAccessible: SecureStore.ALWAYS });
            cache.writeData({ data: { token }});
          } catch (e) {
            console.log(e);
          }
          return null;
        },
        deleteToken: async (_, _params, { cache }) => {
          await SecureStore.deleteItemAsync('token');
          cache.writeData({ data: { token: null }});
          return null;
        },
      }
    },
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) => {
            // Toast.show({ text: "An unexpected error occured" });

            console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
          });
        }
        if (networkError) {
          // Toast.show({ text: "Network error" });

          console.log(`[Network error]: ${networkError}`);
        }
      }),
      requestLink,
      retryLink,
      stateLink,
      httpLink
    ]),
    cache
  });

  const defaultData = {};

  cache.writeData({
    data: defaultData
  });

  client.onResetStore(() => {
    cache.writeData({ data : defaultData });
  });

  return client;
}

export default createClient;
