import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { OrderRoutes } from '../order/order.route';
import { WonArticleRoutes } from '../modules/wonArticle/wonArticle.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    routes: AuthRoutes,
  },
  {
    path: '/order',
    routes: OrderRoutes,
  },
  {
    path: '/won-article',
    routes: WonArticleRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
