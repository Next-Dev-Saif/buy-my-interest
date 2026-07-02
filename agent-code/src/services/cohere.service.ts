import { CohereClient } from 'cohere-ai';
import { db } from '../firebase';
import { tools } from '../tools';
import { WebMap } from '../WebMap';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || '',
});

export const handleChat = async (message: string, conversationId: string | undefined, user: any) => {
  const userId = user.uid;
  const email = user.email;

  // Fetch full user profile to get roles and permissions
  const userDoc = await db.collection('users').doc(userId).get();
  const userProfile = userDoc.exists ? userDoc.data() : { role: 'buyer' };
  const fullUserObject = { uid: userId, email, ...userProfile };

  // Persist and load context from Firebase
  const chatId = conversationId || `chat_${userId}_${Date.now()}`;
  const chatRef = db.collection('chats').doc(chatId);
  const chatDoc = await chatRef.get();

  let chatHistory: any[] = [];
  if (chatDoc.exists) {
    chatHistory = chatDoc.data()?.history || [];
  }

  // Define Cohere Tools
  const cohereTools = tools.map(t => ({
    name: t.name,
    description: t.description,
    parameterDefinitions: t.parameterDefinitions,
  }));

  const agentPermissionsEnabled = userProfile?.agentPermissionsEnabled === true;
  const permissionRule = agentPermissionsEnabled
    ? ""
    : "\nCRITICAL: The user has NOT granted you frontend action permissions. If they ask you to navigate or perform a UI action, you MUST refuse and instruct them to enable 'Discovery Agent Permissions' in their Profile Settings page. Do not use 'trigger_frontend_action' tool.";

  const preamble = `You are a Discovery Agent for BuyMyInterests.ai. 
When a user asks to find products or listings, you MUST always use BOTH 'scan_search_results' and 'scan_seller_listings'.
CRITICAL: Do not hallucinate or make up any details. Stick exactly to the provided JSON data. 
Do not attempt to format the listings as markdown cards or long lists in your response. Simply say 'I have found X results, opening them for you now.' and optionally provide a brief 1-sentence summary of what was found.

CRITICAL UI ACTION INSTRUCTION:
If the user asks you to perform a UI action (such as creating chaos, firing confetti/fireworks/snow, scrolling, changing themes, vibrating, reading aloud, or navigating), YOU MUST INVOKE THE 'trigger_frontend_action' TOOL!
Do NOT just say "I will do it". You must physically return a tool_call. If you do not call the tool, the action will fail and the user will see nothing.
${permissionRule}

**Current User Context:**
${JSON.stringify(fullUserObject, null, 2)}

**Website Routes & Permissions (WebMap):**
When using the 'trigger_frontend_action' tool with action='navigate', you MUST use the exact 'path' from the WebMap below. Never invent URLs.
CRITICAL PERMISSION CHECK: Before navigating the user to a route, check if their role (from Current User Context) exists in the route's 'allowedRoles'. If it does not, DO NOT navigate them. Tell them they do not have permission.
${JSON.stringify(WebMap, null, 2)}`;

  // Send request to Cohere
  const response = await cohere.chat({
    message,
    chatHistory,
    tools: cohereTools,
    preamble,
  });

  // Handle Tool Calls (simplified loop for first tool call)
  console.log("================ COHERE RESPONSE ================");
  console.log("Text:", response.text);
  console.log("ToolCalls present?", !!response.toolCalls);
  if (response.toolCalls) {
    console.log("ToolCalls array:", JSON.stringify(response.toolCalls, null, 2));
  }
  console.log("=================================================");

  let finalResponseText = response.text;
  let toolResults: any[] = [];

  if (response.toolCalls && response.toolCalls.length > 0) {
    for (const call of response.toolCalls) {
      const tool = tools.find(t => t.name === call.name);
      if (tool) {
        try {
          const result = await tool.execute(call.parameters, { userId, email });
          toolResults.push({
            call,
            outputs: [result]
          });
        } catch (err: any) {
          toolResults.push({
            call,
            outputs: [{ error: err.message }]
          });
        }
      }
    }

    // Provide tool results back to Cohere
    const secondResponse = await cohere.chat({
      message: "",
      chatHistory: [...chatHistory, { role: "USER", message }, { role: "CHATBOT", message: response.text, toolCalls: response.toolCalls }],
      toolResults,
      preamble,
    });

    finalResponseText = secondResponse.text;
  }

  // Save history
  const updatedHistory = [
    ...chatHistory,
    { role: 'USER', message },
    { role: 'CHATBOT', message: finalResponseText }
  ];

  await chatRef.set({
    userId,
    updatedAt: new Date(),
    history: updatedHistory,
  }, { merge: true });

  let discoveredItems: any[] = [];
  if (toolResults.length > 0) {
    discoveredItems = toolResults.flatMap(tr => {
      if (tr.outputs && tr.outputs[0] && tr.outputs[0].results) {
        return tr.outputs[0].results;
      }
      return [];
    });
  }

  return {
    text: finalResponseText,
    conversationId: chatId,
    discoveredItems
  };
};
