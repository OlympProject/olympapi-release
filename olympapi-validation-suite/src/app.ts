import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import routes from './routes/index';
import dynamicSwaggerRouter from './routes/dynamic-swagger';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((_req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use(dynamicSwaggerRouter);

app.use(routes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

export default app;
