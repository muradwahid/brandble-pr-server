
import { Router } from "express";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { CommonController } from "./common.controller";

const router = Router();

router.get('/get-all', CommonController.getAllCommon);



export const CommonRoutes = router;