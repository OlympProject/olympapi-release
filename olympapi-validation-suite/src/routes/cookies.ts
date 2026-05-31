import { Router, Request, Response } from 'express';

const router = Router();

const RESERVED_QUERY_KEYS = new Set(['maxAge', 'path', 'httpOnly']);
const COOKIE_NAME_PATTERN = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

const firstQueryValue = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    return firstQueryValue(value[0]);
  }
  if (typeof value === 'string') {
    return value;
  }
  return undefined;
};

const parseCookieHeader = (raw: string | undefined): Record<string, string> => {
  if (!raw) {
    return {};
  }

  return raw.split(';').reduce<Record<string, string>>((cookies, part) => {
    const trimmed = part.trim();
    if (!trimmed) {
      return cookies;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex <= 0) {
      return cookies;
    }

    const name = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    try {
      cookies[name] = decodeURIComponent(value);
    } catch {
      cookies[name] = value;
    }

    return cookies;
  }, {});
};

const buildCookieHeader = (name: string, value: string, maxAge?: number): string => {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'HttpOnly'];
  if (maxAge !== undefined) {
    parts.push(`Max-Age=${maxAge}`);
  }
  return parts.join('; ');
};

/**
 * @openapi
 * /cookies/set:
 *   get:
 *     summary: Set one or more test cookies from query parameters
 *     tags: [Cookies]
 *     parameters:
 *       - in: query
 *         name: session
 *         schema: { type: string, example: abc123 }
 *         description: Session cookie value to set. Defaults to abc123 when no cookie query is provided.
 *       - in: query
 *         name: maxAge
 *         schema: { type: integer, example: 3600 }
 *         description: Optional Max-Age attribute in seconds.
 *     responses:
 *       200:
 *         description: Cookies were set through Set-Cookie headers
 */
router.get('/cookies/set', (req: Request, res: Response) => {
  const maxAgeValue = firstQueryValue(req.query.maxAge);
  const parsedMaxAge = maxAgeValue ? parseInt(maxAgeValue, 10) : undefined;
  const maxAge = parsedMaxAge !== undefined && !Number.isNaN(parsedMaxAge) ? parsedMaxAge : undefined;

  const cookiesToSet = Object.entries(req.query).reduce<Record<string, string>>((cookies, [key, value]) => {
    if (RESERVED_QUERY_KEYS.has(key) || !COOKIE_NAME_PATTERN.test(key)) {
      return cookies;
    }

    const stringValue = firstQueryValue(value);
    if (stringValue !== undefined) {
      cookies[key] = stringValue;
    }

    return cookies;
  }, {});

  if (Object.keys(cookiesToSet).length === 0) {
    cookiesToSet.session = 'abc123';
  }

  res.setHeader(
    'Set-Cookie',
    Object.entries(cookiesToSet).map(([name, value]) => buildCookieHeader(name, value, maxAge)),
  );

  res.json({
    set: cookiesToSet,
    cookies: cookiesToSet,
  });
});

/**
 * @openapi
 * /cookies/read:
 *   get:
 *     summary: Read incoming cookies from the Cookie request header
 *     tags: [Cookies]
 *     responses:
 *       200:
 *         description: Parsed cookies and the raw Cookie header
 */
router.get('/cookies/read', (req: Request, res: Response) => {
  const raw = req.headers.cookie;
  res.json({
    cookies: parseCookieHeader(raw),
    raw: raw ?? '',
  });
});

/**
 * @openapi
 * /cookies/clear:
 *   get:
 *     summary: Clear known test cookies
 *     tags: [Cookies]
 *     responses:
 *       200:
 *         description: Known test cookies were expired
 */
router.get('/cookies/clear', (_req: Request, res: Response) => {
  res.setHeader('Set-Cookie', [
    'session=; Path=/; HttpOnly; Max-Age=0',
    'theme=; Path=/; HttpOnly; Max-Age=0',
  ]);
  res.json({ cleared: ['session', 'theme'] });
});

export default router;
