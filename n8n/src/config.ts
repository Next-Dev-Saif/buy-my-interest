import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  n8nBaseUrl: process.env.N8N_BASE_URL || 'http://localhost:5678',
  workflowId: process.env.WORKFLOW_ID || '',
  apiKey: process.env.N8N_API_KEY || '',
  pollingInterval: parseInt(process.env.POLLING_INTERVAL || '5000', 10),
  workflowsDir: path.resolve(process.env.WORKFLOWS_DIR || './workflows'),
  backupsDir: path.resolve('./backups'),
};

if (!config.workflowId) {
  console.error('ERROR: WORKFLOW_ID is not defined in .env');
  process.exit(1);
}
