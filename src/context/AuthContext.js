import { createContext, useReducer } from "react";

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch(action.type){
        case 'LOGIN':
            return { ...state, user: action.payload }
        case 'LOGOUT':
            return { ...state, user: null }
        default:
            return state
    }
}

// This is wrapped around entire App - the children = App
// Every component can access this context
export const AuthContextProvider = ({children}) => {

    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    console.log('AuthContext state:', state)

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}

// 1. Create the context, name it AuthContext
// 2. Create an AuthContextProvider to wrap the AuthContext.Provider component which contains the state & dispatch function. 
// 3. Dispatch func & state come from the useReducer hook which takes a func (authReducer) which is responsible for updating the state.
// 4. authReducer takes in the current state & the action obj
// 5. Based on what action is passed in, the state is updated differently.
// 6. If the action.type is 'LOGIN' we spread the current state & then update the user key with the action's payload.
// 7. The action is dispatched from a specific location e.g. useSignup