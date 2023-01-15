import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

export const createApolloClient = () => {
  const httpLink = new HttpLink({
    uri: import.meta.env.VITE_HASURA_HTTP_ENDPOINT,
    headers: {
      "x-hasura-admin-secret": import.meta.env.VITE_HASURA_ADMIN_SECRET,
    },
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: import.meta.env.VITE_HASURA_WEBSOCKET_ENDPOINT,
      connectionParams: () => ({
        headers: {
          "x-hasura-admin-secret": import.meta.env.VITE_HASURA_ADMIN_SECRET,
        },
      }),
    })
  );

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === "OperationDefinition" && definition.operation === "subscription";
    },
    wsLink,
    httpLink
  );

  return new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
  });
};
