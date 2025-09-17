import { env } from "@/configs/env";
import {
  getAccessToken,
  handleForceLogout,
  handleRefreshTokenProcess,
} from "@/utils/auth";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
  retry,
} from "@reduxjs/toolkit/query/react";
import { Endpoints } from "./endpoints";

const ENDPOINTS_TO_AVOID_RETRY = [Endpoints.RefreshToken];

type CustomError = {
  status: "TIMEOUT_ERROR" | "FETCH_ERROR" | number;
};

const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: env.urls.apiUrl,
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  {
    retryCondition: (
      error: unknown,
      baseQueryArgs: FetchArgs,
      { attempt }: { attempt: number }
    ) => {
      const err = error as FetchBaseQueryError | CustomError;
      if (ENDPOINTS_TO_AVOID_RETRY.includes(baseQueryArgs.url)) return false;
      if (attempt > 5) return false;

      return (
        err.status === "TIMEOUT_ERROR" ||
        err.status === "FETCH_ERROR" ||
        (typeof err.status === "number" &&
          (err.status === 429 || err.status > 500))
      );
    },
  },
);

const baseQueryWithAuth: BaseQueryFn<
  FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await staggeredBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && args?.url !== Endpoints.Login) {
    console.log("Access token expired. Attempting to refresh token...");

    const isTokenRefreshed = await handleRefreshTokenProcess();
    if (isTokenRefreshed) {
      console.log("Retrying original request with new access token...");
      result = await staggeredBaseQuery(args, api, extraOptions);
    } else {
      console.log("Refresh token expired or invalid. Forcing logout.");
      handleForceLogout();
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  tagTypes: [
    "Faqs",
    "Users",
    "Testimonials",
    "Grades",
    "Subjects",
    "Papers",
    "TuitionRates",
    "LevelAndExams",
    "TuitionAssignments",
    "Levels",
    "Inquiries",
    "Tutors",
  ],
  baseQuery: baseQueryWithAuth,
  endpoints: () => ({}),
});
