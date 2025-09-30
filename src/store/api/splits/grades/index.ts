import { CreateGradeSchema } from "@/app/(admin)/grades/create-grade/schema";
import { FetchGradesRequest, UpdateGradeRequest } from "@/types/request-types";
import { Grade, PaginatedResponse } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const GradesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchGrades: build.query<PaginatedResponse<Grade>, FetchGradesRequest>({
      query: (payload) => {
        const { ...rest } = payload;
        return {
          url: Endpoints.Grades,
          method: "GET",
          params: rest,
        };
      },
      providesTags: ["Grades"],
    }),

    fetchGradeById: build.query<Grade, string>({
      query: (id) => ({
        url: `${Endpoints.Grades}/${id}`,
        method: "GET",
      }),
    }),

    createGrade: build.mutation<Grade, CreateGradeSchema>({
      query: (payload) => ({
        url: Endpoints.Grades,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Grades"],
    }),

    updateGrade: build.mutation<Grade, UpdateGradeRequest>({
      query: ({ id, ...payload }) => ({
        url: `${Endpoints.Grades}/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Grades"],
    }),

    deleteGrade: build.mutation<void, string>({
      query: (id) => ({
        url: `${Endpoints.Grades}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Grades"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchGradesQuery,
  useFetchGradeByIdQuery,
  useLazyFetchGradeByIdQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useDeleteGradeMutation,
} = GradesApi;
