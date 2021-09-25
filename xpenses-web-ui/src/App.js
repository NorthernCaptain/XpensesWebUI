import React, { lazy, Suspense } from 'react';
import {Route} from "react-router";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

import './App.css';
import AuthorizedRoute from "./components/AuthorizedRoute";
import Dashboard from "./pages/dashboard";
import Loading from "./components/Loading";
import config from "./config";
const SignIn = lazy(() => import("./pages/signin"));

const cache = new InMemoryCache()

const client = new ApolloClient({
    uri: `${config.api_url}/${config.graphql_api_path}`,
    cache: cache,
})


function App() {
  return (
    <div className="App">
        <ApolloProvider client={client}>
            <Suspense fallback={Loading}>
                <Route exact path="/sign-in" component={SignIn} />
                <AuthorizedRoute exact path="/dashboard" component={Dashboard} />
            </Suspense>
        </ApolloProvider>
    </div>
  );
}

export default App;
