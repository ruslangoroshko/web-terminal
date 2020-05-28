import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';

export interface UserAuthenticate {
  email: string;
  password: string;
}

export interface UserRegistration {
  email: string;
  password: string;
  repeatPassword?: string;
  userAgreement?: boolean;
  captcha: string;
}

export interface UserForgotPassword {
  email: string;
}

export interface ResetPassword {
  password: string;
  repeatPassword?: string;
}

export interface UserAuthenticateResponse {
  result: OperationApiResponseCodes;
  data: {
    token: string;
    tradingUrl: string;
    signalRConnectionTimeOut: number;
    signalRReconnectTimeOut: number;
    refreshToken: string;
  };
}
