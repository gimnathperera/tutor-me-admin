import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export type DashboardSummaryResponse = {
  registeredTutors: number;
  registeredStudents: number;
  requestTutorRequests: number;
  registerAsTutorRequests: number;
};

export const DashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchDashboardSummary: build.query<DashboardSummaryResponse, void>({
      query: () => ({
        url: Endpoints.DashboardSummary,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useFetchDashboardSummaryQuery } = DashboardApi;
