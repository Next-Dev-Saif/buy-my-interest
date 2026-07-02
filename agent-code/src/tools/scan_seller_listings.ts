import { AgentTool } from './types';
import { db } from '../firebase';

export const scanSellerListings: AgentTool = {
  name: 'scan_seller_listings',
  description: 'Scans the seller_listings collection to find products listed by sellers.',
  parameterDefinitions: {
    category: {
      type: 'string',
      description: 'The category of the listing to search for',
      required: false
    },
    sellerId: {
      type: 'string',
      description: 'Optional seller ID (userId) to filter listings by a specific seller',
      required: false
    }
  },
  execute: async (params, context) => {
    let queryRef: any = db.collection('seller_listings');
    
    if (params.sellerId) {
      queryRef = queryRef.where('userId', '==', params.sellerId);
    }
    
    const snapshot = await queryRef.limit(50).get();
    let results = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    
    if (params.category) {
      const catLower = params.category.toLowerCase();
      results = results.filter((r: any) => r.category && r.category.toLowerCase().includes(catLower));
    }
    
    return {
      results,
      count: results.length
    };
  }
};
