import { FetchFaqRequest } from "@/types/request-types";
import { baseApi } from "../..";
import { Faq, PaginatedResponse } from "@/types/response-types";
import { Endpoints } from "../../endpoints";

export const FaqsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchFaqs: build.query<PaginatedResponse<Faq>, FetchFaqRequest>({
      query: (payload) => ({
        url: Endpoints.Faqs,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Faqs"],
    }),

    createFaq: build.mutation<Faq, Partial<Faq>>({
      query: (body) => ({
        url: Endpoints.Faqs,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Faqs"],
    }),

    updateFaq: build.mutation<Faq, { id: string; body: Partial<Faq> }>({
      query: ({ id, body }) => ({
        url: `${Endpoints.Faqs}/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Faqs"],
    }),

    deleteFaq: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `${Endpoints.Faqs}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Faqs"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useFetchFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = FaqsApi;
