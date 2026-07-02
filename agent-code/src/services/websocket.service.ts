import { WebSocketServer, WebSocket } from 'ws';
import { Server as HttpServer } from 'http';
import { auth } from '../firebase';

export interface FrontendAction {
  action: 'navigate' | 'get-inputs' | 'click-button' | 'change-theme' | 'scroll-to' | 'highlight-element' | 'fire-confetti' | 'trigger-fireworks' | 'trigger-snow' | 'read-aloud' | 'vibrate-device' | 'create-chaos';
  payload: any;
}

class WebSocketService {
  private wss: WebSocketServer | null = null;
  // Map email (or uid) -> active WebSocket
  private clients: Map<string, WebSocket> = new Map();

  public init(server: HttpServer) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', async (ws, req) => {
      let authenticatedUserId: string | null = null;

      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message);
          if (data.type === 'auth') {
            const token = data.token;
            const decodedToken = await auth.verifyIdToken(token);
            // Use email if available, fallback to uid
            authenticatedUserId = decodedToken.email || decodedToken.uid;
            
            if (authenticatedUserId) {
              this.clients.set(authenticatedUserId, ws);
              ws.send(JSON.stringify({ type: 'authenticated' }));
              console.log(`[WS] Authenticated & connected for ${authenticatedUserId}`);
            }
          }
        } catch (error) {
          console.error('[WS] Auth error:', error);
          ws.send(JSON.stringify({ type: 'error', message: 'Auth failed' }));
          ws.close();
        }
      });

      ws.on('close', () => {
        if (authenticatedUserId) {
          this.clients.delete(authenticatedUserId);
          console.log(`[WS] Disconnected for ${authenticatedUserId}`);
        }
      });
    });
    
    console.log('[WS] WebSocket server initialized');
  }

  public emitFrontendAction(userId: string, action: FrontendAction) {
    const ws = this.clients.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log(`[WS] Emitting action ${action.action} to ${userId}`);
      ws.send(JSON.stringify({ type: 'frontend_action', ...action }));
      return true;
    }
    console.log(`[WS] Client ${userId} not connected. Cannot emit action ${action.action}.`);
    return false;
  }
}

export const websocketService = new WebSocketService();
