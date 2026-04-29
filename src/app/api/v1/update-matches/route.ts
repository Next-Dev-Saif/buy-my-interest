import { NextResponse } from "next/server";
import { adminDb } from "@/config/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * API Route for n8n to push search results.
 * Method: POST
 * Headers: X-API-KEY: your_secret_key
 * Body: { userEmail: string, matches: Array<Match> }
 */

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get("X-API-KEY");

    // 1. Validate API Key
    if (apiKey !== process.env.N8N_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userEmail, matches } = body;

    if (!userEmail || !Array.isArray(matches)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 2. Process Matches using Admin SDK
    const resultsCollection = adminDb.collection("search_results");

    const batch = adminDb.batch();

    matches.forEach((match: any) => {
      const resultId = Buffer.from(match.sourceUrl).toString('base64').replace(/[/+=]/g, '_');
      const resultRef = resultsCollection.doc(resultId);

      batch.set(resultRef, {
        ...match,
        userId: userEmail,
        timestamp: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        isNew: true,
      }, { merge: true });
    });

    await batch.commit();

    // 3. Optional: Update user's last scan time
    // We could find the user in 'FreeSubscribers', 'PrioritySubscribers', etc.
    // and update their lastRun field here.

    return NextResponse.json({ 
      success: true, 
      message: `Successfully processed ${matches.length} matches for ${userEmail}` 
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
