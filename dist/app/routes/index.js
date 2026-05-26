"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const dofollow_route_1 = require("../modules/dofollow/dofollow.route");
const genre_route_1 = require("../modules/genre/genre.route");
const indexed_route_1 = require("../modules/indexed/indexed.route");
const niche_route_1 = require("../modules/niche/niche.route");
const order_route_1 = require("../modules/order/order.route");
const stripe_route_1 = require("../modules/payment-gateway-stripe/stripe.route");
const publication_route_1 = require("../modules/publication/publication.route");
// import { ServiceRoutes } from '../modules/service/service.route';
const sponsor_route_1 = require("../modules/sponsor/sponsor.route");
const wonArticle_route_1 = require("../modules/wonArticle/wonArticle.route");
const writeArticle_route_1 = require("../modules/writeArticle/writeArticle.route");
const favorite_route_1 = require("../modules/favorite/favorite.route");
const chat_route_1 = require("../modules/chat/chat.route");
const notification_route_1 = require("../modules/notification/notification.route");
const city_route_1 = require("../modules/city/city.route");
const country_route_1 = require("../modules/country/country.route");
const state_route_1 = require("../modules/state/state.route");
const common_route_1 = require("../modules/common/common.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        routes: auth_route_1.AuthRoutes,
    },
    {
        path: '/chat',
        routes: chat_route_1.ChatRoutes,
    },
    {
        path: '/order',
        routes: order_route_1.OrderRoutes,
    },
    {
        path: '/won-article',
        routes: wonArticle_route_1.WonArticleRoutes,
    },
    {
        path: '/write-article',
        routes: writeArticle_route_1.WriteArticleRoutes,
    },
    // {
    //   path: '/service',
    //   routes: ServiceRoutes,
    // },
    {
        path: '/publication',
        routes: publication_route_1.PublicationRoutes,
    },
    {
        path: '/country',
        routes: country_route_1.CountryRoutes,
    },
    {
        path: '/states',
        routes: state_route_1.StateRoutes,
    },
    {
        path: '/cities',
        routes: city_route_1.CityRoutes,
    },
    {
        path: '/favorite',
        routes: favorite_route_1.FavoriteRoutes,
    },
    {
        path: '/genre',
        routes: genre_route_1.GenreRoutes,
    },
    {
        path: '/niche',
        routes: niche_route_1.NicheRoutes,
    },
    {
        path: '/indexed',
        routes: indexed_route_1.IndexedRoutes,
    },
    {
        path: '/sponsor',
        routes: sponsor_route_1.SponsoredRoutes,
    },
    {
        path: '/dofollow',
        routes: dofollow_route_1.DoFollowRoutes,
    },
    {
        path: '/common',
        routes: common_route_1.CommonRoutes
    },
    {
        path: '/notifications',
        routes: notification_route_1.NotificationRoutes
    },
    {
        path: '/payment',
        routes: stripe_route_1.StripeRoutes
    }
];
moduleRoutes.forEach(route => router.use(route.path, route.routes));
exports.default = router;
