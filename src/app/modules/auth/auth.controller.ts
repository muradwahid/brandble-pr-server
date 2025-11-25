import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthService } from "./auth.service";
import pick from "../../../shared/pick";
import { authFilterAbleFields } from "./auth.constant";
import { paginationFields } from "../../../constants/pagination";

const allUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.allUsers();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully!',
        data: result,
    })
})

const userAllInfo = catchAsync(async (req: Request, res: Response) => { 

  const filters = pick(req.query, authFilterAbleFields);
  const options = pick(req.query, paginationFields);
  const result = await AuthService.userAllInfo(filters,options as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users all info retrieved successfully!',
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
  const refCookieOptions = {
    domain: config.rootUrl,
    secure: true,
    httpOnly: true,
    path: '/',
    sameSite: 'none' as any
  }
  const AccessCookieOptions = {
    domain: config.rootUrl,
    secure: true,
    httpOnly: false,
    path: '/',
    sameSite: 'none' as any
  }
  res.cookie('refreshToken', refreshToken, refCookieOptions);
  res.cookie('accessToken', others?.accessToken, AccessCookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: others,
  })
})

const logOutUser = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('accessToken', { domain: config.rootUrl, path: '/' });
  res.clearCookie('refreshToken', { domain: config.rootUrl, path: '/' });
  res.json({ ok: true });
})

const getUserByCookie = catchAsync(async (req: Request, res: Response) => {
  const user = req.cookies?.accessToken;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const result = await AuthService.getUserByCookie(user as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged in user retrieved successfully!',
    data: result
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

const getAdminRole = catchAsync(async (req: Request, res: Response) => { 
  const result = await AuthService.getAdminRole();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin role retrieved successfully!',
    data: result
  })
})



export const AuthController = {
    allUsers,
    createUser,
    loginUser,
    getSingleUser,
    updateUser,
    deleteUser,
    getUserByCookie,
  logOutUser,
  getAdminRole,
  userAllInfo
}