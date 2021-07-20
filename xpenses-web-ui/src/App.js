import React, { lazy, Suspense } from 'react';
import {Route} from "react-router";

import './App.css';
import AuthorizedRoute from "./components/AuthorizedRoute";
import Dashboard from "./pages/dashboard";
import Loading from "./components/Loading";
const SignIn = lazy(() => import("./pages/signin"));

function App() {
  return (
    <div className="App">
        <Suspense fallback={Loading}>
            <Route exact path="/sign-in" component={SignIn} />
            <AuthorizedRoute exact path="/dashboard" component={Dashboard} />
        </Suspense>
    </div>
  );
}

export default App;
