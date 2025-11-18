import { containerClient } from './azureBlobConnection.js';

const azureHealthController = {};

azureHealthController.checkAzureConnection = async (req, res) => {
  try {
    const startTime = Date.now();
    
    await containerClient.getProperties();
    
    const responseTime = Date.now() - startTime;
    
    const containerName = process.env.BLOB_CONTAINER_NAME || 'Not configured';
    const hasConnectionString = !!process.env.AZURE_STORAGE_CONNECTION_STRING;
    
    res.status(200).json({
      success: true,
      message: 'Azure Blob Storage connection successful',
      data: {
        connected: true,
        containerName: containerName,
        connectionStringConfigured: hasConnectionString,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Azure connection check failed:', error);
    
    const containerName = process.env.BLOB_CONTAINER_NAME || 'Not configured';
    const hasConnectionString = !!process.env.AZURE_STORAGE_CONNECTION_STRING;
    
    res.status(503).json({
      success: false,
      message: 'Azure Blob Storage connection failed',
      error: error.message,
      data: {
        connected: false,
        containerName: containerName,
        connectionStringConfigured: hasConnectionString,
        timestamp: new Date().toISOString()
      }
    });
  }
};

export default azureHealthController;

