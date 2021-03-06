import React from 'react'
import { connect } from 'react-redux'
import { RootStateTypes } from '@config/roots'
import { systemActions } from '@system/store/actions'
import { systemSelectors } from '@system/store/selectors'
import { AuthScreen } from '@system/components/AuthScreen'

const mapStateToProps = (state: RootStateTypes) => ({
    username: systemSelectors.username(state),
    password: systemSelectors.password(state),
    isLoggedIn: systemSelectors.isLoggedIn(state),
    authFetched: systemSelectors.authFetched(state)
})

const mapDispatchToProps = {
    setLogin: systemActions.setLogin,
    setPassword: systemActions.setPassword,
    getCredentials: systemActions.getCredentials,
    checkAuth: systemActions.checkAuth
}

export type AuthProps = ReturnType<typeof mapStateToProps> &
    typeof mapDispatchToProps

const Auth: React.FC<AuthProps> = (props) => {
    const { authFetched } = props

    if (!authFetched) {
        return null
    }

    return AuthScreen(props)
}

const AuthConnected = connect(mapStateToProps, mapDispatchToProps)(Auth)

export { AuthConnected as Auth }
