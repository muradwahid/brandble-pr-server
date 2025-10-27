import { Router } from "express";
import { NicheController } from "./niche.controller";
const router = Router();

router.post('/create', NicheController.createNiche);
router.get('/get-all', NicheController.getAllNiches);
router.put('/:id', NicheController.updateNiche);
router.delete('/:id', NicheController.deleteNiche);
router.get('/:id', NicheController.getNicheById);

export const NicheRoutes = router;