import { Router } from "express";
import { GenreController } from "./genre.controller";
const router = Router();

router.post('/create', GenreController.createGenre);
router.get('/get-all', GenreController.getAllGenres);
router.put('/:id', GenreController.updateGenre);
router.delete('/:id', GenreController.deleteGenre);
router.get('/:id', GenreController.getGenreById);

export const GenreRoutes = router;