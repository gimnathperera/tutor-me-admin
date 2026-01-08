/* eslint-disable @typescript-eslint/no-unused-vars */
import { AddTutorFormValues } from "@/app/(admin)/tutors/components/add-tutor/schema";
import { UpdateTutorSchema } from "@/app/(admin)/tutors/components/edit-tutor/schema";
import { FetchTutorsRequest } from "@/types/request-types";
import { PaginatedResponse, Tutor } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const TutorsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTutors: build.query<PaginatedResponse<Tutor>, FetchTutorsRequest>({
      query: (payload) => {
        const { tutorId, ...rest } = payload;
        return {
          url: Endpoints.FindATutor,
          method: "GET",
          params: rest,
        };
      },
      providesTags: ["FindATutor"],
    }),

    fetchTutorById: build.query<Tutor, string>({
      query: (id) => ({
        url: `${Endpoints.FindATutor}/${id}`,
        method: "GET",
      }),
      providesTags: ["FindATutor"],
    }),

    createTutor: build.mutation<Tutor, AddTutorFormValues>({
      query: (payload) => {
        return {
          url: Endpoints.FindATutor,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["FindATutor"],
    }),

    updateTutor: build.mutation<Tutor, { id: string } & UpdateTutorSchema>({
      query: ({ id, ...payload }) => {
        return {
          url: `${Endpoints.FindATutor}/${id}`,
          method: "PATCH",
          body: payload,
        };
      },
      invalidatesTags: ["FindATutor"],
    }),

    deleteTutor: build.mutation<void, string>({
      query: (id) => ({
        url: `${Endpoints.FindATutor}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FindATutor"],
    }),

    sendTempPasswordTutor: build.mutation<void, string>({
      query: (id) => ({
        url: `${Endpoints.FindATutor}/temp-password/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["FindATutor"],
    }),

    fetchMatchingTutors: build.query<
      { count: number; tutors: Tutor[] },
      { subjects: string[]; tutorType?: string }
    >({
      query: (body) => ({
        url: `${Endpoints.FindATutor}/match-by-subjects`,
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchTutorsQuery,
  useFetchTutorByIdQuery,
  useLazyFetchTutorByIdQuery,
  useCreateTutorMutation,
  useUpdateTutorMutation,
  useDeleteTutorMutation,
  useSendTempPasswordTutorMutation,
  useFetchMatchingTutorsQuery
} = TutorsApi;
