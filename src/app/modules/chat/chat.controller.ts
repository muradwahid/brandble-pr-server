import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { ChatService } from "./chat.service";
import { ITokenUser } from "./chat.interface";
// const createChat = catchAsync(async (req: Request, res: Response) => {
//   const genre = await ChatService.createChat(req.body);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Chat created successfully!',
//     data: genre,
//   });
// });

const createOrderChat = catchAsync(async (req: Request, res: Response) => {

  const { orderId } = req.params;
  const { participantIds = [] } = req.body;
  const createdBy = req.user?.id as string;


  // Add available admins to participant list
  const adminsResult = await ChatService.getAllActiveAdmins();
  if (adminsResult) {
    adminsResult.forEach(admin => {
      if (!participantIds.includes(admin.id)) {
        participantIds.push(admin.id);
      }
    });
  }

  const result = await ChatService.createChatRoom({
    orderId,
    title: `Order #${orderId}`,
    description: `Chat for order ${orderId}`,
    participantIds,
    createdBy
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order chat created successfully!',
    data: result,
  });
});

const getOrderChat = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = req.user?.id as string;

  const result = await ChatService.getChatRoomByOrder(orderId);

  // Check if user can access this chat room
  const canAccess = await ChatService.canUserAccessRoom(result.id as string, userId);
  if (!canAccess.success) {
    return res.status(403).json({
      success: false,
      error: 'Access denied to chat room'
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order chat fetched successfully!',
    data: result,
  });
});

const getUserChats = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;

  const result = await ChatService.getUserChatRooms(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User chats fetched successfully!',
    data: result,
  });
});

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { content, type, fileUrl } = req.body;
  const userId = req.user?.id as string;

  // Check access
  const canAccess = await ChatService.canUserAccessRoom(roomId, userId);
  if (!canAccess.success) {
    return res.status(403).json({
      success: false,
      error: 'Access denied to chat room'
    });
  }

  const result = await ChatService.sendMessage({
    roomId,
    userId,
    content,
    type,
    fileUrl
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Message sent successfully!',
    data: result,
  });
});

const addParticipant = catchAsync(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const user = req.user as ITokenUser;
  
  const result = await ChatService.addParticipant(roomId, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Participant added successfully!',
    data: result,
  });

});

const assignAdmin = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const user = req.user as ITokenUser;

  const result = await ChatService.assignAdmin(data, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin assigned successfully!',
    data: result,
  });
});

const getOrderAdmins = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const result = await ChatService.getOrderAdmins(orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order admins fetched successfully!',
    data: result,
  });
});

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatService.getAllActiveAdmins();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All admins fetched successfully!',
    data: result,
  });
});

export const ChatController = { createOrderChat, getOrderChat, getUserChats, sendMessage, addParticipant, assignAdmin, getOrderAdmins, getAllAdmins };