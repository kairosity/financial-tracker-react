import { useState, useEffect } from 'react'
import { projectAuth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {

    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()
    const [isCancelled, setIsCancelled] = useState(false)

    const signup = async (email, password, displayName) => {
        setError(null)
        setIsPending(true)

        try {
            // signup user
            // this createuserwith... signup function automatically logs the user in.
            const response = await projectAuth.createUserWithEmailAndPassword(email, password)
            

            if (!response) {
                throw new Error('Could not complete signup')
            }

            // Add display name to user
            await response.user.updateProfile({ displayName: displayName })

            // dispatch login action - this stores the user object & details in the context on the front-end  
            // so we can access the user details from the app's components.
            dispatch({ type: 'LOGIN', payload: response.user })

            if(!isCancelled){
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

    return { error, isPending, signup }
}

// Clean up functions are needed because if the process of signup is started & then the user navigates
// away from the signup page, the signup component is unmounted but the async signup request is 
// still going. When the response comes back we are still trying to update the state inside the signup
// component - this will cause an error. To combat this, we need a cleanup function.