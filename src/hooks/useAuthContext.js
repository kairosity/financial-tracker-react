import { AuthContext } from '../context/AuthContext'
import { useContext } from 'react'


export const useAuthContext = () => {
    const context = useContext(AuthContext)

    if(!context){
        throw new Error('useAuthContext must be inside an AuthContextProvider')
    }

    return context
}

// creating a custom Auth Context hook allows us to put a little more logic in here. 
// Rather than allowing the components to interact directly with the context.