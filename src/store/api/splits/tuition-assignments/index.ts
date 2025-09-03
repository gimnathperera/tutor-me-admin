import { CreateAssignmentSchema } from "@/app/(admin)/assignments/components/add-assignment/schema";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const AssignmentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchAssignments: build.query<
      any,
      { page: number; limit: number; sortBy: string }
    >({
      query: (params) => ({
        url: Endpoints.TuitionAssignments,
        method: "GET",
        params,
      }),
      providesTags: ["TuitionAssignments"],
    }),

    fetchAssignmentById: build.query<any, string>({
      query: (id) => ({
        url: `${Endpoints.TuitionAssignments}/${id}`,
        method: "GET",
      }),
    }),

    createAssignment: build.mutation<any, CreateAssignmentSchema>({
      query: (payload) => ({
        url: Endpoints.TuitionAssignments,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["TuitionAssignments"],
    }),

    updateAssignment: build.mutation<any, { id: string; [key: string]: any }>({
      query: ({ id, ...payload }) => ({
        url: `${Endpoints.TuitionAssignments}/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["TuitionAssignments"],
    }),

    deleteAssignment: build.mutation<void, string>({
      query: (id) => ({
        url: `${Endpoints.TuitionAssignments}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TuitionAssignments"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchAssignmentsQuery,
  useFetchAssignmentByIdQuery,
  useLazyFetchAssignmentByIdQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = AssignmentsApi;
