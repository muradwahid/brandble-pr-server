import { Router } from "express";
import { DoFollowController } from "./dofollow.controller";
const router = Router();

router.post('/create', DoFollowController.createDoFollow);
router.get('/get-all', DoFollowController.getAllDoFollow);
router.put('/:id', DoFollowController.updateDoFollow);
router.delete('/:id', DoFollowController.deleteDoFollow);
router.get('/:id', DoFollowController.getDoFollowById);

export const DoFollowRoutes = router;