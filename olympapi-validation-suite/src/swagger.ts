import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OlympAPI Test Server',
      version: '1.0.0',
      description: 'A dedicated test server covering all OlympAPI features: HTTP methods, auth, body types, chaining, scripts, SSL, and proxy.',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'HTTP' },
      { url: 'https://localhost:3443', description: 'HTTPS (self-signed)' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'token',
          description: 'Use "test-token-123" for /auth/bearer, or the token from POST /auth/login for /auth/me and /users/:id',
        },
        BasicAuth: {
          type: 'http',
          scheme: 'basic',
          description: 'Use admin:password123',
        },
        ApiKeyHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'Use "api-key-xyz"',
        },
        ApiKeyQuery: {
          type: 'apiKey',
          in: 'query',
          name: 'api_key',
          description: 'Use "api-key-xyz"',
        },
      },
    },
    tags: [
      { name: 'Status', description: 'Health, status codes, and delay' },
      { name: 'Echo', description: 'Echo all HTTP methods' },
      { name: 'Params', description: 'Query parameter testing' },
      { name: 'Headers', description: 'Request header testing' },
      { name: 'Body', description: 'Request body testing' },
      { name: 'Auth', description: 'Authentication testing' },
      { name: 'Data', description: 'Deterministic data for response-test assertions' },
      { name: 'Debug', description: 'Full debug echo for script testing' },
      { name: 'Cookies', description: 'Set-Cookie and Cookie header testing' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
