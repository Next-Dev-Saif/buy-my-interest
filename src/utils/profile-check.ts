import { db } from "@/config/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

/**
 * Checks if a user has completed their profile by looking for their UID or email
 * in any of the subscriber collections.
 */
export const checkProfileCompletion = async (email: string, uid: string) => {
  const collections = ["FreeSubscribers", "PrioritySubscribers", "PremiumSubscribers"];
  
  for (const collName of collections) {
    const q = query(
      collection(db, collName), 
      where("uid", "==", uid), 
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      return { completed: data.profileCompleted === true, userType: data.userType, ...data };
    }
    
    // Fallback to email check
    const qEmail = query(
      collection(db, collName), 
      where("email", "==", email), 
      limit(1)
    );
    const querySnapshotEmail = await getDocs(qEmail);
    if (!querySnapshotEmail.empty) {
      const data = querySnapshotEmail.docs[0].data();
      return { completed: data.profileCompleted === true, userType: data.userType, ...data };
    }
  }
  
  return null;
};
