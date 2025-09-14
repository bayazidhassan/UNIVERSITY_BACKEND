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
  });

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
  const result = await authService.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Access token is retrieved successfully.',
    data: result,
  });
});

export const authController = {
  loginUser,
  changePassword,
  refreshToken,
};
