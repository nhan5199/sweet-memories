import { db, storage } from "../firebase/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

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