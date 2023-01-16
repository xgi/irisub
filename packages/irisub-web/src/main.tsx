import * as React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import { createApolloClient } from "./services/apollo";
import { initializeFirebase } from "./services/firebase";

const apolloClient = createApolloClient();
initializeFirebase();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RecoilRoot>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </RecoilRoot>
);
