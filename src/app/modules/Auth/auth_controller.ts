import status from 'http-status';
//import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { JwtDecoded } from '../../interface/jwt_tokeData_interface';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authService } from './auth_service';

const loginUser = catchAsync(async (req, res) => {
  const result = await authService.loginUserIntoDB(req.body);
  const { jwt_refreshToken, jwt_accessToken, needsPasswordChange } = result;
  //set refresh toke to cookie
  res.cookie('refreshToken', jwt_refreshToken, {
    secure: config.node_env === 'production', //check it is in development or production mode, for production it will be secure(true)
    httpOnly: true, //it will not be modified by javascript
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 1, //1 day
  });
  /*
  refresh token does not work on any free hosting(vercel,netlify)
  use paid hosting->digital ocean, aws
  7 days → 1000 * 60 * 60 * 24 * 7
  30 days → 1000 * 60 * 60 * 24 * 30
  1 year → 1000 * 60 * 60 * 24 * 365
  1 hour → 1000 * 60 * 60
  */

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User is logged in successfully.',
    //data: result,
    data: {
      jwt_accessToken,
      needsPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  //const user = req.user as JwtPayload;
  const user = req.user as JwtDecoded;
  const passwordData = req.body;
  const result = await authService.changePasswordIntoDB(user, passwordData);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Password is changed successfully.',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authService.refreshTokenIntoDB(refreshToken);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Access token is retrieved successfully.',
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const UserId = req.body.id;
  const result = await authService.forgotPasswordIntoDB(UserId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Reset link is generated successfully.',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;
  const result = await authService.resetPasswordIntoDB(req.body, token);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Password reset successfully.',
    data: result,
  });
});

export const authController = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
};
