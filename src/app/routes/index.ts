import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { GenreRoutes } from '../modules/genre/genre.route';
import { OrderRoutes } from '../modules/order/order.route';
import { PublicationRoutes } from '../modules/publication/publication.route';
import { ServiceRoutes } from '../modules/service/service.route';
import { WonArticleRoutes } from '../modules/wonArticle/wonArticle.route';
import { WriteArticleRoutes } from '../modules/writeArticle/writeArticle.route';
import { NicheRoutes } from '../modules/niche/niche.route';
import { IndexedRoutes } from '../modules/indexed/indexed.route';

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
  {
    path: '/genre',
    routes: GenreRoutes,
  },
  {
    path: '/niche',
    routes: NicheRoutes,
  },
  {
    path: '/indexed',
    routes: IndexedRoutes,
  },
  {
    path: '/sponsor',
    routes: IndexedRoutes,
  },
  {
    path: '/defollow',
    routes: IndexedRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
