import { Router, Request, Response } from 'express';
import express from 'express';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @openapi
 * /body/json:
 *   post:
 *     summary: Parse and echo a JSON body
 *     tags: [Body]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200:
 *         description: Echoed JSON body info
 *       400:
 *         description: Body is not valid JSON
 */
router.post('/body/json', (req: Request, res: Response) => {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: 'Expected JSON body' });
    return;
  }
  res.json({
    received: body,
    keys: Object.keys(body),
    type: 'application/json',
  });
});

/**
 * @openapi
 * /body/form:
 *   post:
 *     summary: Parse and echo a URL-encoded form body
 *     tags: [Body]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             additionalProperties: { type: string }
 *     responses:
 *       200:
 *         description: Echoed form fields
 */
router.post('/body/form', (req: Request, res: Response) => {
  res.json({
    received: req.body,
    keys: Object.keys(req.body),
    type: 'application/x-www-form-urlencoded',
  });
});

/**
 * @openapi
 * /body/validate:
 *   post:
 *     summary: Validate required fields name and email
 *     tags: [Body]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: Validation passed
 *       422:
 *         description: Missing required fields
 */
router.post('/body/validate', (req: Request, res: Response) => {
  const { name, email } = req.body ?? {};
  const missing: string[] = [];
  if (!name) missing.push('name');
  if (!email) missing.push('email');
  if (missing.length > 0) {
    res.status(422).json({ error: 'Unprocessable Entity', missing });
    return;
  }
  res.json({ valid: true, data: { name, email } });
});

/**
 * @openapi
 * /body/multipart:
 *   post:
 *     summary: Accept multipart/form-data (text fields + file uploads)
 *     tags: [Body]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               key: { type: string }
 *     responses:
 *       200:
 *         description: Echoed fields and file metadata
 */
router.post('/body/multipart', upload.any(), (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  res.json({
    fields: req.body,
    files: files.map((f) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
    })),
    type: 'multipart/form-data',
  });
});

/**
 * @openapi
 * /body/binary:
 *   post:
 *     summary: Accept a raw binary body (any content type, max 10 MB)
 *     tags: [Body]
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: string
 *             format: binary
 *     responses:
 *       200:
 *         description: Returns size and content type
 */
router.post('/body/binary', express.raw({ type: '*/*', limit: '10mb' }), (req: Request, res: Response) => {
  const bytes = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
  res.json({
    size: bytes.length,
    contentType: req.headers['content-type'] ?? 'application/octet-stream',
    preview: bytes.length > 0 ? bytes.slice(0, 64).toString('hex') : '',
  });
});

/**
 * @openapi
 * /graphql:
 *   post:
 *     summary: Mock GraphQL endpoint — echoes query and variables
 *     tags: [Body]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [query]
 *             properties:
 *               query: { type: string }
 *               variables: { type: object }
 *     responses:
 *       200:
 *         description: GraphQL echo response
 */
router.post('/graphql', (req: Request, res: Response) => {
  const { query, variables } = req.body ?? {};
  if (!query) {
    res.status(400).json({ errors: [{ message: 'query is required' }] });
    return;
  }
  res.json({
    data: {
      echo: {
        query,
        variables: variables ?? null,
      },
    },
  });
});

export default router;
