import dotenv from 'dotenv'
dotenv.config()

import { initializeApp } from 'firebase/app'
import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    addDoc
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
        return querySnapshot.docs[0].data()
    }

    static addInterpretation = async (yt_id, content) => {
        const res = await addDoc(collection(this._db, 'interpretations'), {
            yt_id,
            content
        })
        return res
    }
}
