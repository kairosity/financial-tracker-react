import { useState, useEffect } from 'react'
import { projectAuth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useLogout = () => {

    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    const logout = async () => {
        setError(null)
        setIsPending(true)

        // sign the user out
        try {
            // signs the user out of firebase
            await projectAuth.signOut()

            // update the context to reflect no user  - dispatch logout action
            //  doesn't require a payload.
            dispatch({ type: 'LOGOUT' })

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

    // Fires on the initial component render - just once. When the component unmounts, (if we navigate away), then the 
    // cleanup function returned here is fired.  So we can add a rule that only updates the state if setIsCancelled is false. 
    // So if the user has left the page, the process will stop, and state will not be updated.
    // So now we are not updating state if the component unmounts
    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { logout, error, isPending }
}