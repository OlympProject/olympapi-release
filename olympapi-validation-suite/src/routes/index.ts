import { Router } from 'express';
import statusRouter from './status';
import echoRouter from './echo';
import paramsRouter from './params';
import headersRouter from './headers';
import bodyRouter from './body';
import authRouter from './auth';
import dataRouter from './data';
import debugRouter from './debug';
import cookiesRouter from './cookies';

const router = Router();

router.use(statusRouter);
router.use(echoRouter);
router.use(paramsRouter);
router.use(headersRouter);
router.use(bodyRouter);
router.use(authRouter);
router.use(dataRouter);
router.use(debugRouter);
router.use(cookiesRouter);

export default router;
