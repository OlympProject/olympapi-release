import { Router, Request, Response } from 'express';

const router = Router();

// ---------------------------------------------------------------------------
// Base path definitions — reused across all scenarios
// operationIds must remain stable so OlympAPI's merge tracker can follow them
// ---------------------------------------------------------------------------

const BASE_PATHS: Record<string, unknown> = {
  '/dynamic/users': {
    get: {
      tags: ['Dynamic'],
      summary: 'List users',
      operationId: 'dynamic_listUsers',
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
      ],
      responses: {
        '200': { description: 'Paginated user list', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } },
      },
    },
    post: {
      tags: ['Dynamic'],
      summary: 'Create user',
      operationId: 'dynamic_createUser',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'email'],
              properties: {
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
              },
            },
          },
        },
      },
      responses: {
        '201': { description: 'User created' },
        '422': { description: 'Validation error' },
      },
    },
  },
  '/dynamic/users/{id}': {
    get: {
      tags: ['Dynamic'],
      summary: 'Get user by ID',
      operationId: 'dynamic_getUserById',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ],
      responses: {
        '200': { description: 'User found', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
        '404': { description: 'User not found' },
      },
    },
    put: {
      tags: ['Dynamic'],
      summary: 'Update user',
      operationId: 'dynamic_updateUser',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
              },
            },
          },
        },
      },
      responses: {
        '200': { description: 'User updated' },
        '404': { description: 'User not found' },
      },
    },
    delete: {
      tags: ['Dynamic'],
      summary: 'Delete user',
      operationId: 'dynamic_deleteUser',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ],
      responses: {
        '204': { description: 'User deleted' },
        '404': { description: 'User not found' },
      },
    },
  },
  '/dynamic/products': {
    get: {
      tags: ['Dynamic'],
      summary: 'List products',
      operationId: 'dynamic_listProducts',
      parameters: [
        { name: 'category', in: 'query', required: false, schema: { type: 'string' } },
      ],
      responses: {
        '200': { description: 'Product list', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } } },
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Scenario definitions
// ---------------------------------------------------------------------------

interface Scenario {
  label: string;
  version: string;
  paths: Record<string, unknown>;
}

const SCENARIOS: Scenario[] = [
  // 0 — Baseline
  {
    label: 'Baseline',
    version: '1.0.0',
    paths: BASE_PATHS,
  },

  // 1 — Add bulk-import endpoint
  {
    label: 'Add bulk-import',
    version: '1.1.0',
    paths: {
      ...BASE_PATHS,
      '/dynamic/users/bulk-import': {
        post: {
          tags: ['Dynamic'],
          summary: 'Bulk import users',
          operationId: 'dynamic_bulkImportUsers',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['users'],
                  properties: {
                    users: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['name', 'email'],
                        properties: {
                          name: { type: 'string' },
                          email: { type: 'string', format: 'email' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Import result with success/failure counts' },
            '422': { description: 'Validation error' },
          },
        },
      },
    },
  },

  // 2 — Modify GET /dynamic/users/{id}: add include_deleted param + 410 response
  {
    label: 'Extend user lookup',
    version: '1.2.0',
    paths: {
      ...BASE_PATHS,
      '/dynamic/users/{id}': {
        ...(BASE_PATHS['/dynamic/users/{id}'] as Record<string, unknown>),
        get: {
          tags: ['Dynamic'],
          summary: 'Get user by ID',
          operationId: 'dynamic_getUserById',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'include_deleted', in: 'query', required: false, schema: { type: 'boolean', default: false }, description: 'Include soft-deleted users' },
          ],
          responses: {
            '200': { description: 'User found', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            '404': { description: 'User not found' },
            '410': { description: 'User was permanently deleted' },
          },
        },
      },
    },
  },

  // 3 — Remove DELETE, add audit-log with BearerAuth
  {
    label: 'Remove delete + add audit log',
    version: '1.3.0',
    paths: (() => {
      const p = { ...BASE_PATHS };
      // Remove DELETE from /dynamic/users/{id}
      const userById = { ...(p['/dynamic/users/{id}'] as Record<string, unknown>) };
      delete userById['delete'];
      p['/dynamic/users/{id}'] = userById;
      // Add audit-log
      (p as Record<string, unknown>)['/dynamic/audit-log'] = {
        get: {
          tags: ['Dynamic'],
          summary: 'Get audit log',
          operationId: 'dynamic_getAuditLog',
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: 'from', in: 'query', required: false, schema: { type: 'string', format: 'date-time' } },
            { name: 'to', in: 'query', required: false, schema: { type: 'string', format: 'date-time' } },
            { name: 'action', in: 'query', required: false, schema: { type: 'string', enum: ['create', 'update', 'delete'] } },
          ],
          responses: {
            '200': { description: 'Audit log entries' },
            '401': { description: 'Unauthorized' },
          },
        },
      };
      return p;
    })(),
  },

  // 4 — Extend POST /dynamic/users body + add POST /dynamic/products
  {
    label: 'Extended user creation + products write',
    version: '1.4.0',
    paths: {
      ...BASE_PATHS,
      '/dynamic/users': {
        ...(BASE_PATHS['/dynamic/users'] as Record<string, unknown>),
        post: {
          tags: ['Dynamic'],
          summary: 'Create user',
          operationId: 'dynamic_createUser',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    role: { type: 'string', enum: ['user', 'admin', 'moderator'], default: 'user' },
                    phone: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'User created' },
            '409': { description: 'Email already registered' },
            '422': { description: 'Validation error' },
          },
        },
      },
      '/dynamic/products': {
        ...(BASE_PATHS['/dynamic/products'] as Record<string, unknown>),
        post: {
          tags: ['Dynamic'],
          summary: 'Create product',
          operationId: 'dynamic_createProduct',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'price'],
                  properties: {
                    name: { type: 'string' },
                    price: { type: 'number', minimum: 0 },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'Product created' },
            '422': { description: 'Validation error' },
          },
        },
      },
    },
  },

  // 5 — Back to baseline (completes cycle)
  {
    label: 'Back to baseline',
    version: '1.5.0',
    paths: BASE_PATHS,
  },
];

// ---------------------------------------------------------------------------
// Spec builder
// ---------------------------------------------------------------------------

function buildDynamicSpec(scenario: Scenario, secondsUntilNext: number) {
  return {
    openapi: '3.0.0',
    info: {
      title: 'OlympAPI Validation Suite — Dynamic Sync',
      version: scenario.version,
      description: `Active scenario: **${scenario.label}** (v${scenario.version}). Next change in ${secondsUntilNext}s. Use \`?scenario=N\` (0–${SCENARIOS.length - 1}) to force a specific state.`,
    },
    servers: [
      { url: 'http://localhost:3000', description: 'HTTP' },
      { url: 'https://localhost:3443', description: 'HTTPS (self-signed)' },
    ],
    tags: [
      { name: 'Dynamic', description: 'Deterministically rotating endpoints for Auto Sync testing' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'token',
          description: 'Use the token from POST /auth/login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            price: { type: 'number' },
          },
        },
      },
    },
    paths: scenario.paths,
  };
}

// ---------------------------------------------------------------------------
// Route: GET /swagger-dynamic.json
// ---------------------------------------------------------------------------

router.get('/swagger-dynamic.json', (req: Request, res: Response) => {
  const nowMs = Date.now();
  const currentMinute = Math.floor(nowMs / 60_000);
  const autoIndex = currentMinute % SCENARIOS.length;
  const secondsUntilNextChange = 60 - Math.floor((nowMs % 60_000) / 1000);

  // ?scenario=N override
  let scenarioIndex = autoIndex;
  let forcedByQueryParam = false;
  const qScenario = req.query['scenario'];
  if (qScenario !== undefined) {
    const parsed = parseInt(String(qScenario), 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed < SCENARIOS.length) {
      scenarioIndex = parsed;
      forcedByQueryParam = true;
    }
  }

  const scenario = SCENARIOS[scenarioIndex];

  // ?info — return metadata only
  if (req.query['info'] !== undefined) {
    res.json({
      currentScenario: scenarioIndex,
      label: scenario.label,
      version: scenario.version,
      totalScenarios: SCENARIOS.length,
      secondsUntilNextChange,
      forcedByQueryParam,
    });
    return;
  }

  const spec = buildDynamicSpec(scenario, secondsUntilNextChange);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', `public, max-age=${secondsUntilNextChange}`);
  res.setHeader('X-Sync-Scenario', String(scenarioIndex));
  res.setHeader('X-Sync-Version', scenario.version);
  res.setHeader('X-Sync-Next-Change-In', `${secondsUntilNextChange}s`);
  res.json(spec);
});

export default router;
