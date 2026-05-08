const axios = require('axios');
require('dotenv').config();

const config = {
  n8nBaseUrl: process.env.N8N_BASE_URL || 'http://localhost:5678',
  workflowId: process.env.WORKFLOW_ID || 'oMeIZE2RZ0To91SC',
  apiKey: process.env.N8N_API_KEY,
};

async function testUpdate() {
  try {
    const getUrl = `${config.n8nBaseUrl}/api/v1/workflows/${config.workflowId}`;
    const getResponse = await axios.get(getUrl, {
      headers: { 'X-N8N-API-KEY': config.apiKey }
    });
    
    const workflowData = getResponse.data;
    console.log('Settings keys:', Object.keys(workflowData.settings || {}));

    const allowedSettingsKeys = [
        'executionOrder',
        'saveExecutionProgress',
        'saveManualExecutions',
        'saveDataErrorExecution',
        'saveDataSuccessExecution',
        'errorWorkflow',
        'callerId',
        'timezone'
    ];
    
    const cleanSettings = {};
    if (workflowData.settings) {
        allowedSettingsKeys.forEach(k => {
            if (workflowData.settings[k] !== undefined) {
                cleanSettings[k] = workflowData.settings[k];
            }
        });
    }

    const cleanData = {
        name: workflowData.name,
        nodes: workflowData.nodes,
        connections: workflowData.connections,
        settings: cleanSettings,
        meta: workflowData.meta
    };

    const putUrl = `${config.n8nBaseUrl}/api/v1/workflows/${config.workflowId}`;
    const response = await axios.put(putUrl, cleanData, {
      headers: {
        'X-N8N-API-KEY': config.apiKey,
        'Content-Type': 'application/json'
      }
    });
    console.log('SUCCESS!');
  } catch (error) {
    console.error('FAILED!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testUpdate();
