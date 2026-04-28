import DashboardOverview from "@/components/dashboard/DashboardOverview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TuitionLanka Admin Panel | Softvil Technologies",
  description:
    "Admin dashboard for managing tutors, students, and sessions efficiently.",
};

export default function Ecommerce() {
  return (
    <div className="">
      <DashboardOverview />

      {/* Hide unwanted sections */}
      {/* <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div> */}
    </div>
  );
}
