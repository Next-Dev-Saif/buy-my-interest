import axios, { AxiosInstance } from 'axios';
import { config } from './config';

export class N8nClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.n8nBaseUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(config.apiKey ? { 'X-N8N-API-KEY': config.apiKey } : {}),
      },
    });
  }

  async getWorkflow(id: string) {
    console.log(`[API] Fetching workflow ${id} (API Key present: ${!!config.apiKey})`);
    // Try Public API first, then fallback to REST API
    try {
      const response = await this.client.get(`/api/v1/workflows/${id}`);
      return response.data;
    } catch (error: any) {
      console.warn(`[API] Public API failed for ${id}: ${error.message} (Status: ${error.response?.status})`);
      if (error.response?.status === 404 || error.response?.status === 401) {
        console.log(`[API] Attempting fallback to internal REST API for ${id}...`);
        try {
          const restResponse = await this.client.get(`/rest/workflows/${id}`);
          return restResponse.data.data || restResponse.data;
        } catch (restError: any) {
          console.error(`[API] Fallback REST API also failed: ${restError.message} (Status: ${restError.response?.status})`);
          throw restError;
        }
      }
      throw error;
    }
  }

  async updateWorkflow(id: string, workflowData: any) {
    console.log(`[API] Updating workflow ${id}...`);
    try {
      // n8n Public API is very strict about extra or read-only properties
      const allowedSettings = [
        'executionOrder', 'saveExecutionProgress', 'saveManualExecutions',
        'saveDataErrorExecution', 'saveDataSuccessExecution', 'errorWorkflow',
        'callerId', 'timezone'
      ];

      const cleanSettings: any = {};
      if (workflowData.settings) {
        allowedSettings.forEach(key => {
          if (workflowData.settings[key] !== undefined) {
            cleanSettings[key] = workflowData.settings[key];
          }
        });
      }

      const cleanData = {
        name: workflowData.name,
        nodes: workflowData.nodes,
        connections: workflowData.connections,
        settings: Object.keys(cleanSettings).length > 0 ? cleanSettings : undefined,
        staticData: workflowData.staticData,
      };

      const response = await this.client.put(`/api/v1/workflows/${id}`, cleanData);
      console.log(`[API] Public API update SUCCESS for ${id}`);
      return response.data;
    } catch (error: any) {
      console.warn(`[API] Public API update FAILED for ${id}: ${error.message} (Status: ${error.response?.status})`);
      if (error.response?.data) {
        console.warn(`[API] Error details:`, JSON.stringify(error.response.data));
      }
      
      // Fallback to internal REST API
      console.log(`[API] Attempting fallback to internal REST API for update ${id}...`);
      try {
        const restResponse = await this.client.patch(`/rest/workflows/${id}`, workflowData);
        console.log(`[API] Fallback REST API update SUCCESS for ${id}`);
        return restResponse.data.data || restResponse.data;
      } catch (restError: any) {
        console.error(`[API] Fallback REST API update also failed: ${restError.message} (Status: ${restError.response?.status})`);
        throw restError;
      }
    }
  }
}

export const n8nClient = new N8nClient();
