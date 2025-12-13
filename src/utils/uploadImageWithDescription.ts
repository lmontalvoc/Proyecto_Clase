import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, storage, db } from "../firebase/firebaseConfig";
import * as FileSystem from "expo-file-system/legacy";

type UploadParams = {
  uri: string;
  description: string;
};

export async function uploadImageWithDescription({
  uri,
  description,
}: UploadParams) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const imageId = Date.now().toString();

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64" as any,
  });

  const dataUrl = `data:image/jpeg;base64,${base64}`;

  const imageRef = ref(storage, `users/${user.uid}/${imageId}.jpg`);

  await uploadString(imageRef, dataUrl, "data_url");

  const downloadURL = await getDownloadURL(imageRef);

  // ✅ SOLO METADATA EN FIRESTORE
  await setDoc(
    doc(db, "users", user.uid, "images", imageId),
    {
      imageUrl: downloadURL,      // ✅
      description,                // ✅
      createdAt: serverTimestamp()// ✅
      // ❌ NO base64
    }
  );

  return { imageUrl: downloadURL, description };
}
