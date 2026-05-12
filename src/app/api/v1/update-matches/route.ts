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

    // 2. Process Matches using Admin SDK with chunked batches
    const resultsCollection = adminDb.collection("search_results");
    const BATCH_SIZE = 400; // Stay under the 500 operation limit
    
    let totalProcessed = 0;
    let batchCount = 0;
    
    // Process matches in chunks to handle unlimited matches
    for (let i = 0; i < matches.length; i += BATCH_SIZE) {
      const chunk = matches.slice(i, i + BATCH_SIZE);
      const batch = adminDb.batch();
      batchCount++;
      
      console.log(`Processing batch ${batchCount} with ${chunk.length} matches (total: ${matches.length})`);
      
      chunk.forEach((match: any) => {
        // Create a truly unique ID per user, source URL, and title to prevent overwrites
        const uniqueKey = `${userEmail}_${match.sourceUrl}_${match.title || match.headline || Date.now()}_${Math.random()}`;
        const resultId = Buffer.from(uniqueKey)
          .toString("base64")
          .replace(/[/+=]/g, "_");
        
        const resultRef = resultsCollection.doc(resultId);

        console.log(`Creating document with ID: ${resultRef.id} for match: ${match.title || match.headline || 'No title'}`);

        batch.set(resultRef, {
          ...match,
          userId: userEmail,
          timestamp: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          isNew: true,
        }, { merge: true });
      });

      try {
        await batch.commit();
        totalProcessed += chunk.length;
        console.log(`Batch ${batchCount} committed successfully. Processed ${totalProcessed}/${matches.length} matches`);
      } catch (batchError) {
        console.error(`Error in batch ${batchCount}:`, batchError);
        throw new Error(`Failed to commit batch ${batchCount}: ${batchError}`);
      }
    }

    // 3. Optional: Update user's last scan time
    // We could find the user in 'FreeSubscribers', 'PrioritySubscribers', etc.
    // and update their lastRun field here.

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${totalProcessed}/${matches.length} matches for ${userEmail} in ${batchCount} batches`,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
