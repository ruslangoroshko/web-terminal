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
}

export interface UserForgotPassword {
  email: string;
}

export interface UserAuthenticateResponse {
  result: OperationApiResponseCodes;
  data: {
    token: string;
  };
}
