import * as React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { ApolloClient, InMemoryCache, ApolloProvider, gql, HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import App from "./App";

const httpLink = new HttpLink({
  uri: "https://central-slug-59.hasura.app/v1/graphql",
  headers: {
    "x-hasura-admin-secret": "d10J3maUuxH4U4kxIM00EGOGTcWzrd6tNKamlNixvwwZyJfBrjJYFvUfI7Ep1DtK",
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "wss://central-slug-59.hasura.app/v1/graphql",
    connectionParams: () => ({
      headers: {
        "x-hasura-admin-secret": "d10J3maUuxH4U4kxIM00EGOGTcWzrd6tNKamlNixvwwZyJfBrjJYFvUfI7Ep1DtK",
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

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RecoilRoot>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </RecoilRoot>
);
