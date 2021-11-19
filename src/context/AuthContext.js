import { createContext, useReducer, useEffect } from "react";
import { projectAuth } from '../firebase/config'

// creates a new context stored in AuthContext
export const AuthContext = createContext()


export const authReducer = (state, action) => {
    switch(action.type){
        case 'LOGIN':
            return { ...state, user: action.payload }
        case 'LOGOUT':
            return { ...state, user: null }
        case 'AUTH_IS_READY':
            return {...state, user: action.payload, authIsReady: true}
        default:
            return state
    }
}


// This component is wrapped around entire App - the children = App
// Every component can access this context
export const AuthContextProvider = ({children}) => {

    // Reducer Function:
    // 1. authReducer = a reducer function. - used to control the state
    // When we want to control the state using this function, we dispatch an action (dispatch function) that will update the state.
    // The dispatch connects with the function passed in to useReducer so dispatch== authReducer.
    // 2. the initial values for the state. (user: null, authIsReady: false)
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        authIsReady: false
    })

    // fires when component mounts - tells us whenever there is a change in authentication status
    // When there is a change it fires the onAuthState... func.
    // Fires the func once when we first communicate with firebase.
    // And then also every time there is a change in the user authentication.
    // ONly need to do it once to find out who the initial user is, we don't need to know every time it changes.
    // we save it in unsub - because the firebase function returns an unsubscribe function.
    // when the func is invoked it carries on to unsub() which unsubscribes from it.
    useEffect(() => {
        const unsub = projectAuth.onAuthStateChanged((user) => {
            dispatch({ type: 'AUTH_IS_READY', payload: user })
            unsub()
        })
    }, [])

    console.log('AuthContext state:', state)


    // All consumers of the provider will re-render whenever the Provider's value prop changes.
    // The AuthContext Provider wraps the <App />
    // So anytime the authentication state OR dispatch changes, all components in the app will re-render.
    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}

// 1. Create the context, name it AuthContext
// 2. Create an AuthContextProvider component to return the AuthContext.Provider which contains the state & dispatch as its values. 
// 3. Dispatch func & state come from the useReducer hook which takes a func (authReducer) which is responsible for updating the state.
// 4. authReducer takes in the current state & the action obj
// 5. Based on what action is passed in, the state is updated differently.
// 6. If the action.type is 'LOGIN' we spread the current state & then update the user key with the action's payload.
// 7. The action is dispatched from a specific location e.g. useSignup