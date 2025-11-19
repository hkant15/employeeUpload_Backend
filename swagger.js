import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
dotenv.config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Employee Document Upload Backend API',
            version: '1.0.0',
            description: 'API documentation for Employee Document Upload Backend'
        },
        servers: [
            {
                url: 'http://localhost:' + process.env.PORT,
                description: 'Local Development Server'
            },
            {
                url: 'https://api.warehouse.thrivebrands.in',
                description: 'Production Server'
            }
        ]
    },
    apis: [
        './Admin/Routes/*.js',
        './User/Routes/*.js',
        './Utils/All_Routes.js',
        "./app.js"
    ]
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };

export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};


