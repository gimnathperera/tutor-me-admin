/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateUserSchema } from "@/app/(admin)/users/all-users/components/add-user/schema";
import { FetchUserRequest, UpdateUserRequest } from "@/types/request-types";
import { PaginatedResponse, Users } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const UsersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchUsers: build.query<PaginatedResponse<Users>, FetchUserRequest>({
      query: (payload) => {
        const { userId, ...rest } = payload;
        return {
          url: Endpoints.Users,
          method: "GET",
          params: rest,
        };
      },
      providesTags: ["Users"],
    }),

    fetchUserById: build.query<Users, string>({
      query: (id) => ({
        url: `${Endpoints.Users}/${id}`,
        method: "GET",
      }),
    }),

    createUser: build.mutation<Users, CreateUserSchema>({
      query: (payload) => {
        return {
          url: Endpoints.Users,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["Users"],
    }),

    updateUser: build.mutation<Users, UpdateUserRequest>({
      query: ({ id, ...payload }) => {
        return {
          url: `${Endpoints.Users}/${id}`,
          method: "PATCH",
          body: payload,
        };
      },
      invalidatesTags: ["Users"],
    }),

    deleteUser: build.mutation<void, string>({
      query: (id) => ({
        url: `${Endpoints.Users}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchUsersQuery,
  useFetchUserByIdQuery,
  useLazyFetchUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = UsersApi;
