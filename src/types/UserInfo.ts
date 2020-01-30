export interface UserAuthenticate {
  email: string;
  password: string;
}


export interface UserRegistration {
  email: string;
  password: string;
  repeatPassword?: string;
}

export interface UserAuthenticateResponse {
  result: number;
  data: {
    token: string;
  };
}
