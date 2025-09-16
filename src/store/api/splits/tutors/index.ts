import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const TutorsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTutors: build.query<any, void>({
      // <- no params
      query: () => ({
        url: Endpoints.FindATutor,
        method: "GET",
      }),
      providesTags: ["Tutors"],
    }),

    fetchTutorById: build.query<any, string>({
      query: (id) => ({
        url: `${Endpoints.FindATutor}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Tutors", id }],
    }),

    createTutor: build.mutation<any, Partial<any>>({
      query: (payload) => ({
        url: Endpoints.FindATutor,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Tutors"],
    }),

    updateTutor: build.mutation<any, { id: string; [key: string]: any }>({
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
