import { useEffect, useState } from 'react'
import { projectFirestore } from '../firebase/config'



/**
 * Fetches a collection from firestore to show on webpage
 */
export const useCollection = (collection) => {
    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)

    // fires once when the component mounts & then any time the collection changes.
    // sets up a real-time listener to a firestore collection
    // Reason logic for real-time listener inside useEffect is so code will run on page load.
    useEffect(() => {
        // a reference to the collection
        let ref = projectFirestore.collection(collection)

        // real-time listener: fires every time we get a snapshot back from the firestore collection
        // we get one back, once initially & thereafter it will fire any time the firestore collection changes.
        // It returns an unsubscribe function - the snapshot represents that collection at that moment in time. 
        // So state can be updated everytime we get a snapshot back - so state will accurately represent the collection.
        const unsub = ref.onSnapshot((snapshot) => {
            let results = []
            // snapshot.docs returns an array of documents from that snapshot
            console.log(snapshot.docs)

            // Pushes the data from each doc into the results array & adds the doc id as well.
            snapshot.docs.forEach((doc) => {
                console.log(...doc.data())
                results.push({ ...doc.data(), id: doc.id })
            })

            // updates state with the results array data taken from the document.
            setDocuments(results)
            setError(null)
        }, (error) => {
            console.log(error)
            setError('could not fetch the data')
        })
        // unsubscribe on unmount
        return () => {
            unsub()
        }

    }, [collection])
    return { documents, error }
}