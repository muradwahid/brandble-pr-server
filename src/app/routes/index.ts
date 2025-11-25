import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { DoFollowRoutes } from '../modules/dofollow/dofollow.route';
import { GenreRoutes } from '../modules/genre/genre.route';
import { IndexedRoutes } from '../modules/indexed/indexed.route';
import { NicheRoutes } from '../modules/niche/niche.route';
import { OrderRoutes } from '../modules/order/order.route';
import { StripeRoutes } from '../modules/payment-gateway-stripe/stripe.route';
import { PublicationRoutes } from '../modules/publication/publication.route';
// import { ServiceRoutes } from '../modules/service/service.route';
import { SponsoredRoutes } from '../modules/sponsor/sponsor.route';
import { WonArticleRoutes } from '../modules/wonArticle/wonArticle.route';
import { WriteArticleRoutes } from '../modules/writeArticle/writeArticle.route';
import { FavoriteRoutes } from '../modules/favorite/favorite.route';
import { ChatRoutes } from '../modules/chat/chat.route';
import { NotificationRoutes } from '../modules/notification/notification.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    routes: AuthRoutes,
  },
  {
    path: '/chat',
    routes: ChatRoutes,
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
  // {
  //   path: '/service',
  //   routes: ServiceRoutes,
  // },
  {
    path: '/publication',
    routes: PublicationRoutes,
  },
  {
    path: '/favorite',
    routes: FavoriteRoutes,
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
    routes: SponsoredRoutes,
  },
  {
    path: '/dofollow',
    routes: DoFollowRoutes,
  },
  {
    path: '/notifications',
    routes: NotificationRoutes
  },
  {
    path: '/payment',
    routes: StripeRoutes
  }
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
