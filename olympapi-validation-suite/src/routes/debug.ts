import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @openapi
 * /debug/echo:
 *   get:
 *     summary: Full debug echo — method, headers, query, body, ip
 *     tags: [Debug]
 *     responses:
 *       200:
 *         description: Complete request snapshot
 */
router.get('/debug/echo', (req: Request, res: Response) => {
  res.json({
    method: req.method,
    url: req.originalUrl,
    path: req.path,
    headers: req.headers,
    query: req.query,
    body: req.body,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });
});

export default router;
