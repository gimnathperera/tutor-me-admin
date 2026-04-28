import {
  UserLoginRequest,
  UserLogoutRequest,
  UserRefreshTokenRequest,
  ResetPasswordRequest,
} from "@/types/request-types";
import {
  TokenResponse,
  UpdatePasswordResponse,
  UserLoginResponse,
} from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<UserLoginResponse, UserLoginRequest>({
      query: (payload) => {
        return {
          url: Endpoints.Login,
          method: "POST",
          body: payload,
        };
      },
    }),
    logout: build.mutation<void, UserLogoutRequest>({
      query: (payload) => {
        return {
          url: Endpoints.Logout,
          method: "POST",
          body: payload,
        };
      },
    }),
    fetchAccessToken: build.mutation<TokenResponse, UserRefreshTokenRequest>({
      query: (payload) => {
        return {
          url: Endpoints.RefreshToken,
          method: "POST",
          body: payload,
        };
      },
    }),
    resetPassword: build.mutation<UpdatePasswordResponse, ResetPasswordRequest>({
      query: ({ token, password }) => ({
        url: `${Endpoints.ResetPassword}?token=${encodeURIComponent(token)}`,
        method: "POST",
        body: { password },
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useFetchAccessTokenMutation,
  useResetPasswordMutation,
} = usersApi;
