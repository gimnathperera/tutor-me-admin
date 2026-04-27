import { CreateAdminRequest } from "@/types/request-types";
import { Users } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const AdminsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createAdmin: build.mutation<Users, CreateAdminRequest>({
      query: (payload) => ({
        url: Endpoints.Admins,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Admins"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateAdminMutation } = AdminsApi;
