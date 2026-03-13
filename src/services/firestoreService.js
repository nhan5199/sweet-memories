import { db, storage } from "../firebase/firebaseConfig";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  updateDoc,
  doc,
  getDoc
} from "firebase/firestore";
import { ref, getDownloadURL, deleteObject } from "firebase/storage";

export const getAllMemories = async () => {
  const q = query(collection(db, "memories"), orderBy("time", "desc"));
  const snapshot = await getDocs(q);

  const results = [];

  for (const docItem of snapshot.docs) {
    const data = docItem.data();

    const imageUrls = await Promise.all(
      (data.imageNames || []).map(async (imageName) => {
        const imageRef = ref(storage, `memories/${imageName}`);
        return await getDownloadURL(imageRef);
      })
    );

    results.push({
      id: docItem.id,
      ...data,
      imageUrls,
    });
  }

  return results;
};

export const getMemoryDetails = async (id) => {
  const docRef = doc(db, "memories", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();

  const imageUrls = await Promise.all(
    (data.imageNames || []).map(async (imageName) => {
      const imageRef = ref(storage, `memories/${imageName}`);
      return await getDownloadURL(imageRef);
    })
  );

  return {
    id: snapshot.id,
    ...data,
    imageUrls,
  };
};



export const updateMemory = async (id, updatedData) => {
  const docRef = doc(db, "memories", id);

  await updateDoc(docRef, updatedData);

  return true;
};



export const deleteMemory = async (id) => {
  const docRef = doc(db, "memories", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return;

  const data = snapshot.data();

  // delete images from storage
  await Promise.all(
    (data.imageNames || []).map(async (imageName) => {
      const imageRef = ref(storage, `memories/${imageName}`);
      return deleteObject(imageRef);
    })
  );

  // delete firestore document
  await deleteDoc(docRef);

  return true;
};