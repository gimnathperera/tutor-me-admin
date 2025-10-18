import { FetchRequestForTutor } from "@/types/request-types";
import { PaginatedResponse, RequestTutors } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const RequestTutorApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchRequestForTutors: build.query<
      PaginatedResponse<RequestTutors>,
      FetchRequestForTutor
    >({
      query: (payload) => ({
        url: Endpoints.RequestTutor,
        method: "GET",
        params: payload,
      }),
      providesTags: [{ type: "RequestTutor", id: "LIST" }],
    }),

    fetchRequestForTutorsById: build.query<RequestTutors, string>({
      query: (id) => ({
        url: `${Endpoints.RequestTutor}/${id}`,
        method: "GET",
      }),
      providesTags: ["RequestTutor"],
    }),

    deleteRequestForTutor: build.mutation<void, string>({
      query: (id) => ({
        url: `${Endpoints.RequestTutor}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "RequestTutor", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchRequestForTutorsQuery,
  useFetchRequestForTutorsByIdQuery,
  useLazyFetchRequestForTutorsByIdQuery,
  useDeleteRequestForTutorMutation,
} = RequestTutorApi;
