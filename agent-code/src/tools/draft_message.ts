import { AgentTool } from './types';

export const draftMessage: AgentTool = {
  name: 'draft_message',
  description: 'Helps draft messages to sellers or negotiate prices automatically.',
  parameterDefinitions: {
    intent: {
      type: 'string',
      description: 'The intent of the message (e.g., negotiate, inquire)',
      required: true
    },
    targetPrice: {
      type: 'number',
      description: 'The price the user wants to offer',
      required: false
    }
  },
  execute: async (params, context) => {
    // Stub implementation
    if (params.intent === 'negotiate' && params.targetPrice) {
      return {
        draft: `Hi there, I am very interested in your listing. Would you consider an offer of $${params.targetPrice}? Let me know if we can work something out.`
      };
    }
    
    return {
      draft: `Hi, I am interested in your listing and would like to learn more. Please get back to me when you can.`
    };
  }
};
