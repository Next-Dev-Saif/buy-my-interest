import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { auth } from './firebase';
import { handleChat } from './services/cohere.service';
import { websocketService } from './services/websocket.service';

const app = express();
const server = createServer(app);

// Initialize WebSocket Service
websocketService.init(server);

app.use(cors());
app.use(express.json());

// Middleware to verify Firebase Auth token
const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid Bearer token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

app.post('/api/chat', authenticate, async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const user = (req as any).user;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await handleChat(message, conversationId, user);
    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Agent service listening on port ${PORT}`);
});
