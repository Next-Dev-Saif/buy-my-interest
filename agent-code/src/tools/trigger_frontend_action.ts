import { websocketService, FrontendAction } from '../services/websocket.service';

export const triggerFrontendAction = {
  name: 'trigger_frontend_action',
  description: 'Triggers a UI action on the user\'s frontend browser. Use this to navigate, scroll, change themes, trigger animations (fireworks, snow, confetti), vibrate device, read text aloud, or create chaos on the screen.',
  parameterDefinitions: {
    action: {
      description: "The type of action to perform. Allowed values: 'navigate', 'get-inputs', 'click-button', 'change-theme', 'scroll-to', 'highlight-element', 'fire-confetti', 'trigger-fireworks', 'trigger-snow', 'read-aloud', 'vibrate-device', 'create-chaos'",
      type: "str",
      required: true
    },
    payload: {
      description: "JSON string containing the payload for the action. For navigate: { \"url\": \"...\" }. For change-theme: { \"theme\": \"light\" | \"dark\" | \"system\" }. For scroll-to or highlight-element: { \"elementId\": \"...\" }. For read-aloud: { \"text\": \"...\" }. For parameterless tools (fire-confetti, trigger-fireworks, trigger-snow, vibrate-device, create-chaos): {}.",
      type: "str",
      required: true
    }
  },
  execute: async (params: any, context: any) => {
    const { email, userId } = context;
    const targetId = email || userId;
    if (!targetId) {
      throw new Error('Unauthorized access');
    }

    const { action, payload } = params;
    
    let parsedPayload;
    try {
      parsedPayload = JSON.parse(payload);
    } catch (e) {
      throw new Error('Invalid JSON payload. Must be a valid JSON string.');
    }

    const success = websocketService.emitFrontendAction(targetId, {
      action,
      payload: parsedPayload
    } as FrontendAction);

    if (success) {
      return {
        success: true,
        message: `Successfully emitted ${action} action to user's frontend. The frontend UI will show an interruption overlay giving the user a chance to cancel before execution.`
      };
    } else {
      return {
        success: false,
        message: `User is not currently connected via WebSocket. Frontend action could not be triggered.`
      };
    }
  }
};
