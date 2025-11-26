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

    fetchUserById: build.query<Users, string | number>({
      query: (id) => ({
        url: `${Endpoints.Users}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
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
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    deleteUser: build.mutation<void, string>({
      query: (id) => ({
        url: `${Endpoints.Users}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    sendUserTempPassword: build.mutation<void, string>({
      query: (id) => ({
        url: `${Endpoints.Users}/temp-password/${id}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Users", id }],
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
  useSendUserTempPasswordMutation,
} = UsersApi;
