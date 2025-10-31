import { Router} from "express";
import { FavoriteController } from "./favorite.controller";

const router = Router();

router.get('/all-favorite/:id', FavoriteController.allFavorites);
router.post('/', FavoriteController.createFavorite);
router.delete('/:id', FavoriteController.deleteFavorite);

export const FavoriteRoutes = router;