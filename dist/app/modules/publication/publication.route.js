"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicationRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../../enums/user");
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const publication_controller_1 = require("./publication.controller");
const router = (0, express_1.Router)();
//auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
//   FileUploadHelper.upload.single('file'),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = UserValidation.createStudent.parse(JSON.parse(req.body.data));
//     return UserController.createStudent(req, res, next);
//   }
// router.post('/create', PublicationController.createPublication);
router.post('/create', 
// auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
FileUploadHelper_1.FileUploadHelper.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return publication_controller_1.PublicationController.createPublication(req, res, next);
});
router.get('/all-publications', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.CLIENT), publication_controller_1.PublicationController.getAllPublications);
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.CLIENT), publication_controller_1.PublicationController.getPublicationById);
// router.patch('/:id', PublicationController.updatePublication);
router.patch('/:id', 
// auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
FileUploadHelper_1.FileUploadHelper.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return publication_controller_1.PublicationController.updatePublication(req, res, next);
});
router.delete('/:id', 
// auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
publication_controller_1.PublicationController.deletePublication);
exports.PublicationRoutes = router;
