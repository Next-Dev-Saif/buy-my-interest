import { AgentTool } from './types';
import { db } from '../firebase';

export const scanSearchResults: AgentTool = {
  name: 'scan_search_results',
  description: 'Scans the search_results collection for matching results found by the automation trigger for the authenticated buyer.',
  parameterDefinitions: {
    category: {
      type: 'string',
      description: 'Optional category to filter the search results',
      required: false
    }
  },
  execute: async (params, context) => {
    const { email } = context;
    if (!email) throw new Error('Unauthorized access');
    
    // Strict privacy boundary: Must match the authenticated buyer's email (stored as userId in DB)
    let queryRef: any = db.collection('search_results').where('userId', '==', email);
    
    const snapshot = await queryRef.limit(50).get();
    let results = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    
    if (params.category) {
      const catLower = params.category.toLowerCase();
      results = results.filter((r: any) => r.category && r.category.toLowerCase().includes(catLower));
    }
    
    return {
      results,
      count: results.length,
      note: 'These results are securely filtered and belong exclusively to the requesting user.'
    };
  }
};
