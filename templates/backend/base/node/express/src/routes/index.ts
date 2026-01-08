import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to {{projectName}} API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api'}});
});

export default router;