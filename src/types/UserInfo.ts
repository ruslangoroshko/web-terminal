export interface UserAuthenticate {
  userName: string;
  password: string;
}

export interface UserAuthenticateResponse {
  result: number;
  data: {
    token: string;
  };
}
