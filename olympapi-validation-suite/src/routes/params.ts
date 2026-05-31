import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @openapi
 * /params:
 *   get:
 *     summary: Echo query parameters
 *     tags: [Params]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Received query params
 */
router.get('/params', (req: Request, res: Response) => {
  res.json({ received: req.query });
});

/**
 * @openapi
 * /params/required:
 *   get:
 *     summary: Require name and page query parameters
 *     tags: [Params]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Valid params received
 *       400:
 *         description: Missing required params
 */
router.get('/params/required', (req: Request, res: Response) => {
  const { name, page } = req.query;
  if (!name || !page) {
    const missing: string[] = [];
    if (!name) missing.push('name');
    if (!page) missing.push('page');
    res.status(400).json({ error: 'Missing required query parameters', missing });
    return;
  }
  res.json({ received: { name, page } });
});

export default router;
