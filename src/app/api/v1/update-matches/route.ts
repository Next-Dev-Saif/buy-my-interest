import { NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

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

    // 2. Process Matches
    const resultsCollection = collection(db, "search_results");

    // We use a Promise.all to process all matches in parallel
    const writePromises = matches.map(async (match: any) => {
      // Create a unique ID for the result (e.g., base64 or sanitized URL)
      // This prevents duplicate entries if n8n finds the same listing again
      const resultId = Buffer.from(match.sourceUrl).toString('base64').replace(/[/+=]/g, '_');
      
      const resultRef = doc(resultsCollection, resultId);

      return setDoc(resultRef, {
        ...match,
        userId: userEmail,
        timestamp: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isNew: true, // Flag for the UI to highlight new matches
      }, { merge: true });
    });

    await Promise.all(writePromises);

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
