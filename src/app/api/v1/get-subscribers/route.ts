import { NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

/**
 * API Route for n8n to fetch subscribers/users based on collection tier.
 * Method: GET
 * Headers: X-API-KEY: your_secret_key
 * Query Params: collection (e.g., FreeSubscribers)
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionName = searchParams.get("collection");
    const apiKey = request.headers.get("X-API-KEY");

    // 1. Validate API Key
    if (apiKey !== process.env.N8N_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!collectionName) {
      return NextResponse.json({ error: "Collection name is required" }, { status: 400 });
    }

    // 2. Fetch from Firestore
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    
    const subscribers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ 
      success: true, 
      count: subscribers.length,
      data: subscribers 
    });

  } catch (error: any) {
    console.error("API Error (get-subscribers):", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
