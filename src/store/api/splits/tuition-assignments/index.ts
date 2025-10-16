import { CreateAssignmentSchema } from "@/app/(admin)/assignments/components/add-assignment/schema";
import { UpdateAssignmentSchema } from "@/app/(admin)/assignments/components/edit-assignment/schema";
import {
  TuitionAssignment,
  TuitionAssignmentResponse,
} from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export type UpdateAssignmentPayload = {
  id: string;
} & Partial<UpdateAssignmentSchema>;

export const AssignmentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchAssignments: build.query<
      TuitionAssignmentResponse,
      { page: number; limit: number; sortBy: string }
    >({
      query: (params) => ({
        url: Endpoints.TuitionAssignments,
        method: "GET",
        params,
      }),
      providesTags: ["TuitionAssignments"],
    }),

    fetchAssignmentById: build.query<TuitionAssignment, string>({
      query: (id) => ({
        url: `${Endpoints.TuitionAssignments}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [
        { type: "TuitionAssignments", id: arg },
      ],
    }),

    createAssignment: build.mutation<TuitionAssignment, CreateAssignmentSchema>(
      {
        query: (payload) => ({
          url: Endpoints.TuitionAssignments,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: ["TuitionAssignments"],
      },
    ),

    updateAssignment: build.mutation<
      TuitionAssignment,
      UpdateAssignmentPayload
    >({
      // Replaced any with the new type
      query: ({ id, ...payload }) => ({
        url: `${Endpoints.TuitionAssignments}/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: [
        "TuitionAssignments",
        { type: "TuitionAssignments", id: "LIST" },
      ],
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
