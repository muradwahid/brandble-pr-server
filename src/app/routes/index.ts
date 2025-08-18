import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { WonArticleRoutes } from '../modules/wonArticle/wonArticle.route';
import { OrderRoutes } from '../modules/order/order.route';
import { WriteArticleRoutes } from '../modules/writeArticle/writeArticle.route';
import { ServiceRoutes } from '../modules/service/service.route';
import { PublicationRoutes } from '../modules/publication/publication.route';

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
  {
    path: '/write-article',
    routes: WriteArticleRoutes,
  },
  {
    path: '/service',
    routes: ServiceRoutes,
  },
  {
    path: '/publication',
    routes: PublicationRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
