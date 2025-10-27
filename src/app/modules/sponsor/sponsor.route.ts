import { Router } from "express";
import { SponsoredController } from "./sponsor.controller";
const router = Router();

router.post('/create', SponsoredController.createSponsored);
router.get('/get-all', SponsoredController.getAllSponsors);
router.put('/:id', SponsoredController.updateSponsored);
router.delete('/:id', SponsoredController.deleteSponsored);
router.get('/:id', SponsoredController.getSponsoredById);

export const SponsoredRoutes = router;