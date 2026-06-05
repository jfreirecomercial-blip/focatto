import {
  doc, getDoc, setDoc, collection, addDoc, getDocs,
  query, where, orderBy, Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { RatingData, SellerStats } from "./roles";

export async function addRating(
  productId: string,
  sellerId: string,
  userId: string,
  userName: string,
  rating: number,
  comment: string,
): Promise<string> {
  const docRef = await addDoc(collection(db, "products", productId, "ratings"), {
    productId,
    sellerId,
    userId,
    userName,
    rating: Math.min(5, Math.max(1, Math.round(rating))),
    comment,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function getProductRatings(productId: string): Promise<RatingData[]> {
  try {
    const q = query(
      collection(db, "products", productId, "ratings"),
      orderBy("createdAt", "desc"),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as RatingData));
  } catch {
    return [];
  }
}

export async function getUserRatingForProduct(productId: string, userId: string): Promise<RatingData | null> {
  try {
    const q = query(
      collection(db, "products", productId, "ratings"),
      where("userId", "==", userId),
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as RatingData;
  } catch {
    return null;
  }
}

export async function getSellerRatings(sellerId: string): Promise<RatingData[]> {
  try {
    const productsSnap = await getDocs(
      query(collection(db, "products"), where("userId", "==", sellerId)),
    );
    const allRatings: RatingData[] = [];
    for (const productDoc of productsSnap.docs) {
      const ratingsSnap = await getDocs(
        query(collection(db, "products", productDoc.id, "ratings"), orderBy("createdAt", "desc")),
      );
      for (const r of ratingsSnap.docs) {
        allRatings.push({ id: r.id, ...r.data() } as RatingData);
      }
    }
    return allRatings;
  } catch {
    return [];
  }
}

export async function getSellerStats(sellerId: string): Promise<SellerStats> {
  const ratings = await getSellerRatings(sellerId);
  if (ratings.length === 0) {
    return { averageRating: 0, totalRatings: 0, ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }
  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const r of ratings) {
    sum += r.rating;
    dist[r.rating] = (dist[r.rating] || 0) + 1;
  }
  return {
    averageRating: Math.round((sum / ratings.length) * 10) / 10,
    totalRatings: ratings.length,
    ratingDistribution: dist,
  };
}

export async function getProductRatingsCount(productId: string): Promise<number> {
  try {
    const snap = await getDocs(collection(db, "products", productId, "ratings"));
    return snap.size;
  } catch {
    return 0;
  }
}
