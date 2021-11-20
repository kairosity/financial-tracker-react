import { useEffect, useState, useRef } from 'react'
import { projectFirestore } from '../firebase/config'
/**
 * Fetches a collection from firestore to show on webpage
 */
export const useCollection = (collection, _query, _orderedBy) => {
    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)

    // Using useRef() to avoid infinite loop from passing in query array into useEffect()
    const query = useRef(_query).current
    const orderedBy = useRef(_orderedBy).current

    // fires once when the component mounts & then any time the collection changes.
    // sets up a real-time listener to a firestore collection
    // Reason logic for real-time listener inside useEffect is so code will run on page load.
    useEffect(() => {
        // a reference to the collection
        let ref = projectFirestore.collection(collection)


        // If a query is passed in, spread it and add as the value to a firestore .where() func.
        // This will return collections where that query is true. i.e. where the user.id is "sjdfhjds432"
        if(query){
            ref = ref.where(...query)
        }
        // use a firestore method orderBy() takes in property as a string, that we want to order by
        // Second arg = des or asc to order by
        if(orderedBy){
            ref = ref.orderBy(...orderedBy)
        }

        // real-time listener: fires every time we get a snapshot back from the firestore collection
        // we get one back, once initially & thereafter it will fire any time the firestore collection changes.
        // It returns an unsubscribe function - the snapshot represents that collection at that moment in time. 
        // So state can be updated everytime we get a snapshot back - so state will accurately represent the collection.
        const unsub = ref.onSnapshot((snapshot) => {
            let results = []
            // snapshot.docs returns an array of documents from that snapshot
            console.log(snapshot)

            // Pushes the data from each doc into the results array & adds the doc id as well.
            snapshot.docs.forEach((doc) => {
                results.push({ ...doc.data(), id: doc.id })
            })

            // updates state with the results array data taken from the document.
            setDocuments(results)
            setError(null)

        // The onSnapshot method requires a second argument for errors.
        // The first arg fires everytime we get a snapshot, the second arg fires every time we get an error.
        }, (error) => {
            console.log(error)
            setError('Could not fetch the collection data.')
        })
        // unsubscribe from the real-time listener on unmount - when the component using this hook unmounts.
        // the unsub() func means that if we move away from this page in future, we are no longer listening for snapshot events
        // on this collection & therefor no longer updating the state.
        return () => {
            unsub()
        }

    }, [collection, query, orderedBy])

    return { documents, error }
}