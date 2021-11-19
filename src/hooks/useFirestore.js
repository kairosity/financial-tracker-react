import { useReducer, useEffect, useState } from 'react'
import { projectFirestore, timestamp } from '../firebase/config'


// to add and remove documents from a firestore collection
let initialState = {
    document: null,
    isPending: false,
    error: null,
    success: null
}

const firestoreReducer = (state, action) => {
    switch(action.type){
        case 'IS_PENDING':
            return { isPending: true, document: null, success: false, error: null }
        case 'ADDED_DOCUMENT':
            return { isPending: false, document: action.payload, success: true, error: null }
        case 'ERROR':
            return { isPending: false, document: null, success: false, error: action.payload }
        default:
            return state
    }
}

// response is state. A representation of the response we get back from firestore.
export const useFirestore = (collection) => {
    const [response, dispatch] = useReducer(firestoreReducer, initialState)
    const [isCancelled, setIsCancelled] = useState(false)

    // collection reference 
    const collectionReference = projectFirestore.collection(collection)

    // only dispatch if not cancelled - only if the component using this hook is NOT unmounted.
    const dispatchIfNotCancelled = (action) => {
        if(!isCancelled){
            dispatch(action)
        }
    }

    // add a new document - this doc is an object to be saved as a firestore document.
    const addDocument = async (doc) => {

        dispatch({ type: 'IS_PENDING' })

        try {
            const createdAt = timestamp.fromDate(new Date())
            const addedDocument = await collectionReference.add({...doc, createdAt: createdAt})
            console.log(...doc)
            dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument })

            } catch(err){
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
        }
    }

    // delete a document
    const deleteDocument = async (id) => {

    }

    // if the component ever unmounts setIsCancelled will be set to true. So it won't try to update state
    // if the user switches pages and the component unmounts.
    useEffect(() => {
        return () => {
            setIsCancelled(true)
        }
    }, [])

    return { addDocument, deleteDocument, response }

}



