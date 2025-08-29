import { PaperSchema } from "@/schemas/paper.schema";
import { FetchPapersRequest } from "@/types/request-types";
import { PaginatedResponse, Paper } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const PaperApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPapers: build.query<PaginatedResponse<Paper>, FetchPapersRequest>({
      query: (payload) => ({
        url: Endpoints.Papers,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Papers"],
    }),

    createPaper: build.mutation<Paper, PaperSchema>({
      query: (body) => ({
        url: Endpoints.Papers,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Papers"],
    }),

    updatePaper: build.mutation<Paper, { id: string } & PaperSchema>({
      query: ({ id, ...body }) => ({
        url: `${Endpoints.Papers}/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Papers"],
    }),

    deletePaper: build.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `${Endpoints.Papers}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Papers"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchPapersQuery,
  useCreatePaperMutation,
  useUpdatePaperMutation,
  useDeletePaperMutation,
} = PaperApi;
