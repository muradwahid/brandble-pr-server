import { Router} from "express";
import { FavoriteController } from "./favorite.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = Router();

router.get('/all-favorite/:id', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.SUPER_ADMIN), FavoriteController.allFavorites);
router.get('/all-favoriteIds/:id', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.SUPER_ADMIN), FavoriteController.getOnlyFavoriteIds);
router.post('/create', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.SUPER_ADMIN), FavoriteController.createFavorite);
router.delete('/remove/:id',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.SUPER_ADMIN), FavoriteController.deleteFavorite);

export const FavoriteRoutes = router;