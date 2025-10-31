import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthService } from "./auth.service";

const allUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.allUsers();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully!',
        data: result,
    })
})

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.body;
  const result = await AuthService.createUser(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully!',
    data: result,
  })
})

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await AuthService.loginUser(data);
  const { refreshToken, ...others } = result;
  //set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }
  res.cookie('refreshToken', refreshToken, cookieOptions);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: others,
  })
})


const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AuthService.getSingleUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success:true,
    message:'User retrieved successfully!',
    data:result
  })

})

const updateUser = catchAsync(async (req: Request, res: Response,next: NextFunction) => {
    const { id } = req.params;

  try { const result = await AuthService.updateUser(id,req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User updated successfully',
    data: result,
  });
  } catch (error) {
    next(error)
  }
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AuthService.deleteUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success:true,
    message:'User deleted successfully!',
    data:result
  })

})


export const AuthController = {
    allUsers,
    createUser,
    loginUser,
    getSingleUser,
  updateUser,
  deleteUser
}