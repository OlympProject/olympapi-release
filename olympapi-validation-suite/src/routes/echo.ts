import { Router, Request, Response } from 'express';

const router = Router();

const echoBody = (req: Request, res: Response) => {
  res.json({
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    query: req.query,
    body: req.body,
    timestamp: new Date().toISOString(),
  });
};

/**
 * @openapi
 * /echo:
 *   get:
 *     summary: Echo GET request details
 *     tags: [Echo]
 *     responses:
 *       200:
 *         description: Echoed request info
 *   post:
 *     summary: Echo POST request details
 *     tags: [Echo]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200:
 *         description: Echoed request info
 *   put:
 *     summary: Echo PUT request details
 *     tags: [Echo]
 *     responses:
 *       200:
 *         description: Echoed request info
 *   patch:
 *     summary: Echo PATCH request details
 *     tags: [Echo]
 *     responses:
 *       200:
 *         description: Echoed request info
 *   delete:
 *     summary: Echo DELETE request details
 *     tags: [Echo]
 *     responses:
 *       200:
 *         description: Echoed request info
 *   head:
 *     summary: Echo HEAD request (headers only, no body)
 *     tags: [Echo]
 *     responses:
 *       200:
 *         description: Response headers only
 *   options:
 *     summary: CORS preflight / OPTIONS echo
 *     tags: [Echo]
 *     responses:
 *       200:
 *         description: Allowed methods
 */
router.get('/echo', echoBody);
router.post('/echo', echoBody);
router.put('/echo', echoBody);
router.patch('/echo', echoBody);
router.delete('/echo', echoBody);

router.head('/echo', (_req: Request, res: Response) => {
  res.set('X-Echo-Method', 'HEAD');
  res.set('X-Echo-Timestamp', new Date().toISOString());
  res.status(200).end();
});

router.options('/echo', (_req: Request, res: Response) => {
  res.set('Allow', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
  res.status(200).json({ allowed: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] });
});

export default router;
