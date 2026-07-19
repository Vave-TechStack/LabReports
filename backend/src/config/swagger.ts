import { Application } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export const setupSwagger = (app: Application): void => {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'MediLab Diagnostics API',
        version: '1.0.0',
        description: 'Enterprise Blood Diagnostic Laboratory Management Platform. Supports patient management, test catalog, bookings, payments, reports, and more.',
        contact: { name: 'MediLab Diagnostics', email: 'support@medilab.com' },
      },
      servers: [
        { url: 'http://localhost:5000/api/v1', description: 'Development' },
        { url: 'https://api.medilab.com/api/v1', description: 'Production' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
      security: [{ bearerAuth: [] }],
      tags: [
        { name: 'Auth', description: 'Authentication' },
        { name: 'Tests', description: 'Test catalog' },
        { name: 'Packages', description: 'Health packages' },
        { name: 'Bookings', description: 'Booking management' },
        { name: 'Payments', description: 'Payment processing' },
        { name: 'Reports', description: 'Report management' },
        { name: 'Patients', description: 'Patient management' },
        { name: 'Doctors', description: 'Doctor management' },
        { name: 'Branches', description: 'Branch locations' },
        { name: 'Contact', description: 'Contact & inquiries' },
        { name: 'Blogs', description: 'Blog posts' },
        { name: 'Uploads', description: 'File uploads' },
      ],
    },
    apis: ['./src/routes/*.ts'],
  };

  const swaggerSpec = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'MediLab API Docs',
  }));
  app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));
};
