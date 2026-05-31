import { Router, Request, Response } from 'express';

const router = Router();

const startTime = Date.now();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: ok }
 *                 version: { type: string, example: 1.0.0 }
 *                 uptime: { type: number, example: 42.5 }
 *                 timestamp: { type: string, format: date-time }
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    uptime: (Date.now() - startTime) / 1000,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @openapi
 * /status/{code}:
 *   get:
 *     summary: Respond with the given HTTP status code
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema: { type: integer, minimum: 200, maximum: 599 }
 *         description: HTTP status code to return
 *     responses:
 *       200:
 *         description: Returns the requested status code (actual status varies)
 */
router.get('/status/:code', (req: Request, res: Response) => {
  const code = parseInt(req.params.code, 10);
  if (isNaN(code) || code < 200 || code > 599) {
    res.status(400).json({ error: 'Invalid status code. Must be 200–599.' });
    return;
  }
  res.status(code).json({ status: code, message: `Responded with ${code}` });
});

/**
 * @openapi
 * /delay/{ms}:
 *   get:
 *     summary: Respond after a delay
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: ms
 *         required: true
 *         schema: { type: integer, minimum: 0, maximum: 3000 }
 *         description: Delay in milliseconds (max 3000)
 *     responses:
 *       200:
 *         description: Delayed response
 */
router.get('/delay/:ms', (req: Request, res: Response) => {
  const ms = Math.min(parseInt(req.params.ms, 10) || 0, 3000);
  setTimeout(() => {
    res.json({ delayed: ms, message: `Responded after ${ms}ms` });
  }, ms);
});

export default router;
