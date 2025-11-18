export const registerAllRoutes = async (app) => {
  const employeeRoutes = (await import('../User/Routes/EmployeeRoutes.js')).default;
  app.use('/employees', employeeRoutes);
  
  const documentRoutes = (await import('../User/Routes/documentRoutes.js')).default;
  app.use('/documents', documentRoutes);
  
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString()
    });
  });
  
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  });
  
  console.log('All routes registered');
};

