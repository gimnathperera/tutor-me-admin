import { TestimonialSchema } from "@/schemas/testimonial.schema";
import { FetchTestimonialsRequest } from "@/types/request-types";
import { PaginatedResponse, Testimonial } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const testimonialsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTestimonials: build.query<
      PaginatedResponse<Testimonial>,
      FetchTestimonialsRequest
    >({
      query: (payload) => ({
        url: Endpoints.Testimonials,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Testimonials"],
    }),

    createTestimonial: build.mutation<Testimonial, TestimonialSchema>({
      query: (body) => ({
        url: Endpoints.Testimonials,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Testimonials"],
    }),

    updateTestimonial: build.mutation<
      Testimonial,
      { id: string } & TestimonialSchema
    >({
      query: ({ id, ...body }) => ({
        url: `${Endpoints.Testimonials}/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Testimonials"],
    }),

    deleteTestimonial: build.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `${Endpoints.Testimonials}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Testimonials"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialsApi;
