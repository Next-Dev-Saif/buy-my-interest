import { NextResponse } from "next/server";
import { adminDb } from "@/config/firebase-admin";

/**
 * API Route for n8n to fetch subscribers/users based on collection tier.
 * Method: GET
 * Headers: X-API-KEY: your_secret_key
 * Query Params: collection (e.g., FreeSubscribers)
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let collectionName = searchParams.get("collection");
    const apiKey = request.headers.get("X-API-KEY");

    // Sanitize: Remove any accidental quotes (single or double) from the collection name
    if (collectionName) {
      collectionName = collectionName.replace(/^["']|["']$/g, "").trim();
    }

    // 1. Validate API Key
    if (apiKey !== process.env.N8N_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!collectionName) {
      return NextResponse.json({ error: "Collection name is required" }, { status: 400 });
    }

    // 2. Fetch from Firestore using Admin SDK (bypasses security rules)
    let query = adminDb.collection(collectionName);
    
    // Add pagination/limit support to prevent overloading
    const limit = parseInt(searchParams.get("limit") || "100");
    const snapshot = await query.limit(limit).get();
    
    const subscribers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ 
      success: true, 
      count: subscribers.length,
      debug: {
        queriedCollection: `"${collectionName}"`,
        snapshotSize: snapshot.size,
        config: {
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          hasAppId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID
        }
      },
      data: subscribers 
    });

  } catch (error: any) {
    console.error("API Error (get-subscribers):", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
