

// export const syncCollectionToFirestore = async (rxCollection: any, firestorePath: string) => {
//   const allDocs = await rxCollection.find().exec()
//   for (const doc of allDocs) {
//     await setDoc(firestoreDoc(firestoreDb, `${firestorePath}/${doc.id}`), doc.toJSON())
//   }
// }

import {
    collection,
    getDocs,
    setDoc,
    doc as firestoreDoc,
    deleteDoc,
  } from "firebase/firestore"
import { firestoreDb } from "./fireStoreDb"


  export const syncCollectionToFirestore = async (
    rxCollection: any,
    firestorePath: string
  ) => {
    // 1. Get all local docs
    const allDocs = await rxCollection.find().exec()
    const localIds = new Set(allDocs.map((doc: any) => doc.id))

    // 2. Sync local docs to Firestore (upsert)
    for (const doc of allDocs) {
      await setDoc(
        firestoreDoc(firestoreDb, `${firestorePath}/${doc.id}`),
        doc.toJSON()
      )
    }

    // 3. Get all Firestore docs to compare
    const firestoreSnap = await getDocs(collection(firestoreDb, firestorePath))
    for (const remoteDoc of firestoreSnap.docs) {
      if (!localIds.has(remoteDoc.id)) {
        // This doc was deleted locally — delete from Firestore
        await deleteDoc(firestoreDoc(firestoreDb, `${firestorePath}/${remoteDoc.id}`))
        console.log(`Deleted ${firestorePath}/${remoteDoc.id} from Firestore`)
      }
    }
  }


export const syncCollectionFromFirestore = async (rxCollection: any, firestorePath: string) => {
  const snapshot = await getDocs(collection(firestoreDb, firestorePath))
  for (const firestoreDoc of snapshot.docs) {
    const data = firestoreDoc.data()
    console.log(data);

    const exists = await rxCollection.findOne(data.id).exec()
    if (!exists) {
      await rxCollection.insert(data)
    }
  }
}
