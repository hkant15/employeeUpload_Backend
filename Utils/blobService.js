import { containerClient } from './azureBlobConnection.js';
import dotenv from 'dotenv';
dotenv.config();


class BlobService {
  getEmployeeFolderPath(employeeId, employeeName) {
    return `${process.env.AZURE_BLOB_NAME}/${employeeId}_${employeeName.replace(/\s+/g, '_')}/`;
  }

  async uploadFileToEmployeeFolder(employeeId, employeeName, fileName, buffer, mimeType) {
    const folder = this.getEmployeeFolderPath(employeeId, employeeName);
    const blobName = folder + fileName;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: mimeType }
    });

    return {
      blobName,
      url: blockBlobClient.url
    };
  }

  async listEmployeeFiles(employeeId, employeeName) {
    const folder = this.getEmployeeFolderPath(employeeId, employeeName);
    let iter = containerClient.listBlobsFlat({ prefix: folder });
    let files = [];
    for await (const blob of iter) {
      files.push(blob.name);
    }
    return files;
  }
}

export default new BlobService();
