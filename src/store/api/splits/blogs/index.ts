import {
  FetchBlogsRequest,
  UpdateBlogRequest,
  UpdateBlogStatusRequest,
} from "@/types/request-types";
import { Blogs, PaginatedResponse } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const BlogsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchBlogs: build.query<PaginatedResponse<Blogs>, FetchBlogsRequest>({
      query: (payload) => {
        const { blogId, ...rest } = payload;
        return {
          url: Endpoints.Blogs,
          method: "GET",
          params: rest,
        };
      },
      providesTags: ["Blogs"],
    }),

    fetchBlogById: build.query<Blogs, string>({
      query: (blogId) => ({
        url: `${Endpoints.Blogs}/${blogId}`,
        method: "GET",
      }),
    }),

    updateBlog: build.mutation<Blogs, UpdateBlogRequest>({
      query: ({ id, ...payload }) => ({
        url: `${Endpoints.Blogs}/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Blogs"],
    }),
    updateBlogStatus: build.mutation<Blogs, UpdateBlogStatusRequest>({
      query: ({ blogId, status }) => ({
        url: `${Endpoints.Blogs}/${blogId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Blogs"],
    }),

    deleteBlog: build.mutation<void, string>({
      query: (id) => ({
        url: `${Endpoints.Blogs}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blogs"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchBlogsQuery,
  useFetchBlogByIdQuery,
  useLazyFetchBlogByIdQuery,
  useUpdateBlogMutation,
  useUpdateBlogStatusMutation,
  useDeleteBlogMutation,
} = BlogsApi;
