import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import isEqual from 'lodash/isEqual';
import { config } from './config';
import { n8nClient } from './api';

export class SyncBridge {
  private localFilePath: string;
  private cache: any = null;
  private isUpdatingLocal = false;
  private isUpdatingRemote = false;

  constructor() {
    this.localFilePath = path.join(config.workflowsDir, `${config.workflowId}.json`);
    this.ensureDirs();
  }

  private ensureDirs() {
    if (!fs.existsSync(config.workflowsDir)) {
      fs.mkdirSync(config.workflowsDir, { recursive: true });
    }
    if (!fs.existsSync(config.backupsDir)) {
      fs.mkdirSync(config.backupsDir, { recursive: true });
    }
  }

  async init() {
    console.log(`[INIT] Starting sync bridge for workflow: ${config.workflowId}`);
    
    // Initial fetch from n8n
    try {
      const workflow = await n8nClient.getWorkflow(config.workflowId);
      this.cache = workflow;
      await this.saveLocal(workflow);
      console.log(`[INIT] Successfully fetched and saved workflow locally.`);
    } catch (error: any) {
      console.error(`[INIT] Failed to fetch initial workflow from n8n: ${error.message}`);
      // If local file exists, load it into cache
      if (fs.existsSync(this.localFilePath)) {
        console.log(`[INIT] Local file found, using it as initial state.`);
        this.cache = JSON.parse(fs.readFileSync(this.localFilePath, 'utf8'));
      }
    }

    this.startWatcher();
    this.startPoller();
  }

  private async saveLocal(data: any) {
    this.isUpdatingLocal = true;
    try {
      const content = JSON.stringify(data, null, 2);
      fs.writeFileSync(this.localFilePath, content, 'utf8');
      this.cache = data;
    } finally {
      // Small timeout to allow FS events to trigger and be ignored
      setTimeout(() => {
        this.isUpdatingLocal = false;
      }, 500);
    }
  }

  private async createBackup(data: any) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(config.backupsDir, `${config.workflowId}_${timestamp}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf8');
    
    // Keep only last 10 backups
    const files = fs.readdirSync(config.backupsDir)
      .filter(f => f.startsWith(config.workflowId))
      .map(f => ({ name: f, time: fs.statSync(path.join(config.backupsDir, f)).mtime.getTime() }))
      .sort((a, b) => b.time - a.time);

    if (files.length > 10) {
      files.slice(10).forEach(f => fs.unlinkSync(path.join(config.backupsDir, f.name)));
    }
  }

  private startWatcher() {
    console.log(`[WATCH] Watching local file: ${this.localFilePath}`);
    const watcher = chokidar.watch(this.localFilePath, { ignoreInitial: true });

    watcher.on('change', async () => {
      if (this.isUpdatingLocal) return;

      console.log(`[WATCH] Local change detected.`);
      try {
        const content = fs.readFileSync(this.localFilePath, 'utf8');
        const localData = JSON.parse(content);

        if (!isEqual(localData, this.cache)) {
          console.log(`[WATCH] Data changed, updating n8n...`);
          this.isUpdatingRemote = true;
          
          await this.createBackup(this.cache); // Backup before update
          await n8nClient.updateWorkflow(config.workflowId, localData);
          
          this.cache = localData;
          console.log(`[WATCH] n8n updated successfully.`);
          
          setTimeout(() => {
            this.isUpdatingRemote = false;
          }, 1000);
        } else {
          console.log(`[WATCH] No actual changes detected (deep comparison).`);
        }
      } catch (error: any) {
        console.error(`[WATCH] Error updating n8n: ${error.message}`);
        this.isUpdatingRemote = false;
      }
    });
  }

  private startPoller() {
    console.log(`[POLL] Starting polling for n8n changes every ${config.pollingInterval}ms`);
    
    setInterval(async () => {
      if (this.isUpdatingRemote) return;

      try {
        const remoteData = await n8nClient.getWorkflow(config.workflowId);
        
        if (!isEqual(remoteData, this.cache)) {
          console.log(`[POLL] Remote change detected in n8n editor, updating local file...`);
          await this.saveLocal(remoteData);
          console.log(`[POLL] Local file updated.`);
        }
      } catch (error: any) {
        console.error(`[POLL] Error polling n8n: ${error.message}`);
      }
    }, config.pollingInterval);
  }
}
