import { useState, useEffect } from 'react'
import { projectAuth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {

    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setError(null)
        setIsPending(true)

        // sign the user out
        try {
            // signs the user out of firebase
            const response = await projectAuth.signInWithEmailAndPassword(email, password)

            // update the context to reflect no user  - dispatch logout action
            //  doesn't require a payload.
            dispatch({ type: 'LOGIN', payload: response.user })

            if (!isCancelled){
                setIsPending(false)
                setError(null) 
            }
        } catch(err) {
            if(!isCancelled){
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            }
        }
    }
    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { login, error, isPending }
}