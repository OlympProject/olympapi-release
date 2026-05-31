import { Router, Request, Response } from 'express';

const router = Router();

const BEARER_TOKEN = 'test-token-123';
const API_KEY = 'api-key-xyz';
const LOGIN_TOKEN = 'jwt-abc-xyz-123';

/**
 * @openapi
 * /auth/bearer:
 *   get:
 *     summary: Protected by Bearer token
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated successfully
 *       401:
 *         description: Invalid or missing token
 */
router.get('/auth/bearer', (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ') || auth.slice(7) !== BEARER_TOKEN) {
    res.status(401).json({ error: 'Unauthorized', expected: `Bearer ${BEARER_TOKEN}` });
    return;
  }
  res.json({ authenticated: true, method: 'bearer', token: auth.slice(7) });
});

/**
 * @openapi
 * /auth/basic:
 *   get:
 *     summary: Protected by HTTP Basic auth (admin:password123)
 *     tags: [Auth]
 *     security:
 *       - BasicAuth: []
 *     responses:
 *       200:
 *         description: Authenticated successfully
 *       401:
 *         description: Invalid or missing credentials
 */
router.get('/auth/basic', (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.status(401).json({ error: 'Unauthorized', hint: 'Use Basic admin:password123' });
    return;
  }
  const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf-8');
  if (decoded !== 'admin:password123') {
    res.status(401).json({ error: 'Unauthorized', hint: 'Use Basic admin:password123' });
    return;
  }
  res.json({ authenticated: true, method: 'basic', user: 'admin' });
});

/**
 * @openapi
 * /auth/apikey:
 *   get:
 *     summary: Protected by API key (header or query param)
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: X-API-Key
 *         schema: { type: string }
 *       - in: query
 *         name: api_key
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Authenticated successfully
 *       401:
 *         description: Missing or invalid API key
 */
router.get('/auth/apikey', (req: Request, res: Response) => {
  const key = (req.headers['x-api-key'] as string) || (req.query.api_key as string);
  if (!key || key !== API_KEY) {
    res.status(401).json({ error: 'Unauthorized', hint: `Use X-API-Key: ${API_KEY} or ?api_key=${API_KEY}` });
    return;
  }
  res.json({ authenticated: true, method: 'apikey', key });
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login with username and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string, example: demo }
 *               password: { type: string, example: demo123 }
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       401:
 *         description: Invalid credentials
 */
router.post('/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body ?? {};
  if (username !== 'demo' || password !== 'demo123') {
    res.status(401).json({ error: 'Invalid credentials', hint: 'Use demo / demo123' });
    return;
  }
  res.json({
    token: LOGIN_TOKEN,
    userId: 'user-42',
    role: 'admin',
    expiresIn: 3600,
  });
});

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get current user profile (requires login token)
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Invalid or missing token
 */
router.get('/auth/me', (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ') || auth.slice(7) !== LOGIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized', hint: `POST /auth/login first to get a token` });
    return;
  }
  res.json({
    userId: 'user-42',
    username: 'demo',
    role: 'admin',
    email: 'demo@olympapi.test',
  });
});

export default router;
