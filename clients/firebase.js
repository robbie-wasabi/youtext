import dotenv from 'dotenv'
dotenv.config()

import { initializeApp } from 'firebase/app'
import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    addDoc,
    doc,
    setDoc
} from 'firebase/firestore'
import config from '../config.js'

export default class FirebaseClient {
    static _app = initializeApp(config.firebaseConfig)
    static _db = getFirestore(this._app)

    static getInterpretations = async () => {
        const collectionRef = collection(this._db, 'interpretations')
        const snapshot = await getDocs(collectionRef)
        return snapshot.docs.map((doc) => doc.data())
    }

    static getInterpretation = async (ytId) => {
        const collectionRef = collection(this._db, 'interpretations')
        const q = query(collectionRef, where('yt_id', '==', ytId))
        const querySnapshot = await getDocs(q)
        if (querySnapshot.empty) {
            return null
        }
        // if data.content is array return first element
        const data = querySnapshot.docs[0].data()
        if (Array.isArray(data.content)) data.content = data.content.join(' ')
        return data
    }

    static addInterpretation = async (yt_id, content) => {
        const res = await addDoc(collection(this._db, 'interpretations'), {
            yt_id,
            content
        })
        return res
    }

    // TODO: fix
    // static updateInterpretation = async (ytId, newContent) => {
    //     const interpretation = await FirebaseClient.getInterpretation(ytId)
    //     if (!interpretation) {
    //         throw new Error('Interpretation not found')
    //     }

    //     interpretation.content = newContent
    //     const docRef = doc(
    //         FirebaseClient._db,
    //         'interpretations',
    //         interpretation.id
    //     )
    //     await setDoc(docRef, interpretation)

    //     return interpretation
    // }
}
