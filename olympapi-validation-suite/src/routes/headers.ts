import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @openapi
 * /headers:
 *   get:
 *     summary: Echo all request headers
 *     tags: [Headers]
 *     responses:
 *       200:
 *         description: All request headers
 */
router.get('/headers', (req: Request, res: Response) => {
  res.json({ received: req.headers });
});

/**
 * @openapi
 * /headers/required:
 *   get:
 *     summary: Require X-Custom-Header header
 *     tags: [Headers]
 *     parameters:
 *       - in: header
 *         name: X-Custom-Header
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Header received
 *       400:
 *         description: Missing X-Custom-Header
 */
router.get('/headers/required', (req: Request, res: Response) => {
  const custom = req.headers['x-custom-header'];
  if (!custom) {
    res.status(400).json({ error: 'Missing required header: X-Custom-Header' });
    return;
  }
  res.json({ received: { 'x-custom-header': custom } });
});

export default router;
