import { CreateLevelSchema } from "@/app/(admin)/levels/create-level/schema";
import { FetchLevelsRequest, UpdateLevelRequest } from "@/types/request-types";
import { Level, PaginatedResponse } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const LevelsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchLevels: build.query<PaginatedResponse<Level>, FetchLevelsRequest>({
      query: (payload) => {
        const { ...rest } = payload || ({} as any);
        return {
          url: Endpoints.Levels,
          method: "GET",
          params: rest,
        };
      },
      providesTags: ["Levels"],
    }),

    fetchLevelById: build.query<Level, string>({
      query: (id) => ({
        url: `${Endpoints.Levels}/${id}`,
        method: "GET",
      }),
    }),

    createLevel: build.mutation<Level, CreateLevelSchema>({
      query: (payload) => ({
        url: Endpoints.Levels,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Levels"],
    }),

    updateLevel: build.mutation<Level, UpdateLevelRequest>({
      query: ({ id, ...payload }) => ({
        url: `${Endpoints.Levels}/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Levels"],
    }),

    deleteLevel: build.mutation<void, string>({
      query: (id) => ({
        url: `${Endpoints.Levels}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Levels"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchLevelsQuery,
  useFetchLevelByIdQuery,
  useLazyFetchLevelByIdQuery,
  useCreateLevelMutation,
  useUpdateLevelMutation,
  useDeleteLevelMutation,
} = LevelsApi;
