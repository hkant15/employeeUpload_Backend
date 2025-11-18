import { BlobServiceClient } from '@azure/storage-blob';
import dotenv from 'dotenv';
dotenv.config();

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
console.log('Blob service client created successfully');
const containerClient = blobServiceClient.getContainerClient(process.env.BLOB_CONTAINER_NAME);

const getBlobPath = (fileName) => {
  return `${process.env.AZURE_BLOB_PATH}/${fileName}`;
};

export { blobServiceClient, containerClient, getBlobPath };

