import { Router, Request, Response } from 'express';

const router = Router();

const LOGIN_TOKEN = 'jwt-abc-xyz-123';

const USERS = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  { id: 4, name: 'Diana', email: 'diana@example.com' },
  { id: 5, name: 'Eve', email: 'eve@example.com' },
];

/**
 * @openapi
 * /data/users:
 *   get:
 *     summary: Get a fixed list of 5 users (deterministic for response-test assertions)
 *     tags: [Data]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/data/users', (_req: Request, res: Response) => {
  res.json(USERS);
});

/**
 * @openapi
 * /data/user/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/data/user/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const user = USERS.find(u => u.id === id);
  if (!user) {
    res.status(404).json({ error: `User ${id} not found` });
    return;
  }
  res.json(user);
});

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (chaining target — requires Bearer token from /auth/login)
 *     tags: [Data]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/users/:id', (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ') || auth.slice(7) !== LOGIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized', hint: 'Use the token from POST /auth/login' });
    return;
  }
  const id = req.params.id;
  if (id === 'user-42') {
    res.json({ userId: 'user-42', username: 'demo', role: 'admin', email: 'demo@olympapi.test' });
    return;
  }
  const numId = parseInt(id, 10);
  const user = USERS.find(u => u.id === numId);
  if (!user) {
    res.status(404).json({ error: `User ${id} not found` });
    return;
  }
  res.json(user);
});

export default router;
