import { SyncBridge } from './sync';

const bridge = new SyncBridge();

bridge.init().catch(error => {
  console.error('Fatal error during sync bridge initialization:', error);
  process.exit(1);
});

console.log('n8n Sync Bridge is running...');
console.log('Press Ctrl+C to stop.');
