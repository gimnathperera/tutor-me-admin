import { AddTutorFormValues } from "@/app/(admin)/tutors/components/add-tutor/schema";
import { UpdateTutorSchema } from "@/app/(admin)/tutors/components/edit-tutor/schema";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const TutorsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTutors: build.query<AddTutorFormValues, void>({
      // <- no params
      query: () => ({
        url: Endpoints.FindATutor,
        method: "GET",
      }),
      providesTags: ["Tutors"],
    }),

    fetchTutorById: build.query<AddTutorFormValues, string>({
      query: (id) => ({
        url: `${Endpoints.FindATutor}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Tutors", id }],
    }),

    createTutor: build.mutation<AddTutorFormValues, Partial<any>>({
      query: (payload) => ({
        url: Endpoints.FindATutor,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Tutors"],
    }),

    updateTutor: build.mutation<
      UpdateTutorSchema,
      { id: string; [key: string]: any }
    >({
      query: ({ id, ...payload }) => ({
        url: `${Endpoints.FindATutor}/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Tutors"],
    }),

    deleteTutor: build.mutation<void, string>({
      query: (id) => ({
        url: `${Endpoints.FindATutor}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tutors"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchTutorsQuery,
  useFetchTutorByIdQuery,
  useCreateTutorMutation,
  useUpdateTutorMutation,
  useDeleteTutorMutation,
} = TutorsApi;
