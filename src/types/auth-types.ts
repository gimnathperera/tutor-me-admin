export type AuthTokenParams = {
  code: string;
  codeVerifier?: string;
};

export type ErrorCallback = (err: { [key: string]: string }) => void;

export type AuthUserData = {
  id: string;
  role: string;
  name: string;
  email: string;
  status: string;
  isEmailVerified?: boolean;
  phoneNumber?: string;
  birthday?: string;
  country?: string;
  city?: string;
  state?: string;
  region?: string;
  zip?: string;
  address?: string;
  gender?: string;
  avatar?: string;
  language?: string;
  timeZone?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Tokens = {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
};
