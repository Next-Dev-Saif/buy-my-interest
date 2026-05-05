import { NextResponse } from "next/server";
import { adminDb } from "@/config/firebase-admin";

/**
 * API Route for n8n Task Queue Management.
 * Handles Enqueueing, Dequeueing, and Status Updates.
 */

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get("X-API-KEY");
    if (apiKey !== process.env.N8N_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { users, priority } = await request.json();

    if (!users || !Array.isArray(users)) {
      return NextResponse.json(
        { error: "Invalid users data" },
        { status: 400 },
      );
    }

    const batch = adminDb.batch();
    const now = new Date();

    for (const user of users) {
      const taskId = `${user.email}_task`.replace(/[@.]/g, "_");
      const taskRef = adminDb.collection("agent_tasks").doc(taskId);

      batch.set(
        taskRef,
        {
          userId: user.email,
          userData: user,
          priority: priority ?? 2, // Default to 2 (Free)
          status: "pending",
          createdAt: now,
          updatedAt: now,
        },
        { merge: true },
      );
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: `Enqueued ${users.length} tasks`,
    });
  } catch (error: any) {
    console.error("Queue Error (POST):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const apiKey = request.headers.get("X-API-KEY");
    if (apiKey !== process.env.N8N_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5");

    const snapshot = await adminDb
      .collection("agent_tasks")
      .where("status", "==", "pending")
      .orderBy("priority", "asc")
      .orderBy("createdAt", "asc")
      .limit(limit)
      .get();

    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error: any) {
    console.error("Queue Error (GET):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const apiKey = request.headers.get("X-API-KEY");
    if (apiKey !== process.env.N8N_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId, status, data } = await request.json();

    if (!taskId || !status) {
      return NextResponse.json(
        { error: "taskId and status are required" },
        { status: 400 },
      );
    }

    await adminDb.collection("agent_tasks").doc(taskId).update({
      status,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (error: any) {
    console.error("Queue Error (PATCH):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
