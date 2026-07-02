import { AgentTool } from './types';
import { db } from '../firebase';

export const getUserProfile: AgentTool = {
  name: 'get_user_profile',
  description: 'Gets the profile data, saved interests, and past transactions of the currently authenticated user. IMPORTANT PRIVACY RULE: This tool can ONLY fetch data for the user making the request. It must not be used to analyze other users.',
  parameterDefinitions: {}, // No params needed, uses auth context
  execute: async (params, context) => {
    const { userId } = context;
    if (!userId) throw new Error('Unauthorized access');

    // Strict contextual boundary: Only fetch the context.userId document
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return { error: 'User profile not found' };
    }

    // In a real app, you might also fetch nested collections like saved interests
    return {
      profile: userDoc.data(),
      note: 'Only data belonging to the authenticated user is accessible via this tool.'
    };
  }
};
