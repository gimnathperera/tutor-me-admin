import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const TutorsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTutors: build.query<any, void>({
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
    }),
  }),
  overrideExisting: false,
});

export const { useFetchTutorsQuery, useFetchTutorByIdQuery } = TutorsApi;
