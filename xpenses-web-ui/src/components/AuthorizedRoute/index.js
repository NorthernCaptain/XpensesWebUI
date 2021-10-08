/**
 * Copyright 2021, Northern Captain
 */
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../../features/auth/authSlice'

function AuthorizedRoute({ component: Component, redirectTo , ...rest }) {
    const { signInURL = '/sign-in' } = rest || {}
    const  auth = useAuth()
    return (
        <Route
            {...rest}
            render={(props) =>
                auth.valid ? (
                    redirectTo?
                        <Redirect
                            to={{
                                pathname: redirectTo,
                                search: `from=${props.location.pathname}`,
                                state: { from: props.location },
                            }}
                        />
                        :
                        <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: signInURL,
                            search: `from=${props.location.pathname}`,
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />
    )
}

export default AuthorizedRoute