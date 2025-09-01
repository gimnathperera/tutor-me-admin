import { FetchInquiryRequest } from "@/types/request-types";
import { baseApi } from "../..";
import { Inquiry, PaginatedResponse } from "@/types/response-types";
import { Endpoints } from "../../endpoints";

export const InquiriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchInquiries: build.query<PaginatedResponse<Inquiry>, FetchInquiryRequest>({
      query: (payload) => ({
        url: Endpoints.Inquiries,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Inquiries"],
    }),

    createInquiry: build.mutation<Inquiry, Partial<Inquiry>>({
      query: (body) => ({
        url: Endpoints.Inquiries,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Inquiries"],
    }),

    updateInquiry: build.mutation<Inquiry, { id: string; body: Partial<Inquiry> }>({
      query: ({ id, body }) => ({
        url: `${Endpoints.Inquiries}/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Inquiries"],
    }),

    deleteInquiry: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `${Endpoints.Inquiries}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inquiries"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useFetchInquiriesQuery,
  useCreateInquiryMutation,
  useUpdateInquiryMutation,
  useDeleteInquiryMutation,
} = InquiriesApi;
