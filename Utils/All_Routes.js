export const registerAllRoutes = async (app) => {
  const authRoutes = (await import('../Admin/Routes/authRoute.js')).default;
  app.use('/auth', authRoutes);
  
  const documentRoutes = (await import('../User/Routes/documentRoutes.js')).default;
  app.use('/document', documentRoutes);
  
  const employeeRoutes = (await import('../User/Routes/EmployeeRoutes.js')).default;
  app.use('/employee', employeeRoutes);
  
  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Server health check
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Server is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 timestamp:
   *                   type: string
   */
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString()
    });
  });

  /**
   * @swagger
   * /health/azure:
   *   get:
   *     summary: Check Azure Blob Storage connection
   *     tags: [Health]
   *     description: Verifies if the application can successfully connect to Azure Blob Storage
   *     responses:
   *       200:
   *         description: Azure Blob Storage connection successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     connected:
   *                       type: boolean
   *                     containerName:
   *                       type: string
   *                     connectionStringConfigured:
   *                       type: boolean
   *                     responseTime:
   *                       type: string
   *                     timestamp:
   *                       type: string
   *       503:
   *         description: Azure Blob Storage connection failed
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 error:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     connected:
   *                       type: boolean
   *                     containerName:
   *                       type: string
   *                     connectionStringConfigured:
   *                       type: boolean
   *                     timestamp:
   *                       type: string
   */
  const azureHealthController = (await import('./azureHealthController.js')).default;
  app.get('/health/azure', azureHealthController.checkAzureConnection);
  
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  });
  
  console.log('All routes registered');
};

