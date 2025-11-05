"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const chat_service_1 = require("./chat.service");
// const createChat = catchAsync(async (req: Request, res: Response) => {
//   const genre = await ChatService.createChat(req.body);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Chat created successfully!',
//     data: genre,
//   });
// });
const createOrderChat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { orderId } = req.params;
    const { participantIds = [] } = req.body;
    const createdBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    // Add available admins to participant list
    const adminsResult = yield chat_service_1.ChatService.getAllActiveAdmins();
    if (adminsResult) {
        adminsResult.forEach(admin => {
            if (!participantIds.includes(admin.id)) {
                participantIds.push(admin.id);
            }
        });
    }
    const result = yield chat_service_1.ChatService.createChatRoom({
        orderId,
        title: `Order #${orderId}`,
        description: `Chat for order ${orderId}`,
        participantIds,
        createdBy
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order chat created successfully!',
        data: result,
    });
}));
const getOrderChat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { orderId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield chat_service_1.ChatService.getChatRoomByOrder(orderId);
    // Check if user can access this chat room
    const canAccess = yield chat_service_1.ChatService.canUserAccessRoom(result.id, userId);
    if (!canAccess.success) {
        return res.status(403).json({
            success: false,
            error: 'Access denied to chat room'
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order chat fetched successfully!',
        data: result,
    });
}));
const getUserChats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield chat_service_1.ChatService.getUserChatRooms(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User chats fetched successfully!',
        data: result,
    });
}));
const sendMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { roomId } = req.params;
    const { content, type, fileUrl } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    // Check access
    const canAccess = yield chat_service_1.ChatService.canUserAccessRoom(roomId, userId);
    if (!canAccess.success) {
        return res.status(403).json({
            success: false,
            error: 'Access denied to chat room'
        });
    }
    const result = yield chat_service_1.ChatService.sendMessage({
        roomId,
        userId,
        content,
        type,
        fileUrl
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Message sent successfully!',
        data: result,
    });
}));
const addParticipant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    const user = req.user;
    const result = yield chat_service_1.ChatService.addParticipant(roomId, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Participant added successfully!',
        data: result,
    });
}));
const assignAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const user = req.user;
    const result = yield chat_service_1.ChatService.assignAdmin(data, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Admin assigned successfully!',
        data: result,
    });
}));
const getOrderAdmins = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const result = yield chat_service_1.ChatService.getOrderAdmins(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order admins fetched successfully!',
        data: result,
    });
}));
const getAllAdmins = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield chat_service_1.ChatService.getAllActiveAdmins();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All admins fetched successfully!',
        data: result,
    });
}));
exports.ChatController = { createOrderChat, getOrderChat, getUserChats, sendMessage, addParticipant, assignAdmin, getOrderAdmins, getAllAdmins };
