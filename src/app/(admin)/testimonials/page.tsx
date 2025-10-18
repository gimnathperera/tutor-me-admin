import { Metadata } from "next";
import { AddTestimonial } from "./components/add-testimonial/AddTestimonial";
import TestimonialsTable from "./components/TestimonialsList";

export const metadata: Metadata = {
  title: "Testimonials | TutorMe",
  description: "This is the Testimonials management page for TutorMe",
};

export default function Testimonials() {
  return (
    <div className="max-w-full">
      <div className="p-5  lg:p-6">
        <div className="mb-5 flex items-center justify-between lg:mb-7">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white/90">
            Testimonials
          </h3>
          <AddTestimonial />
        </div>

        <div className="space-y-6">
          <TestimonialsTable />
        </div>
      </div>
    </div>
  );
}
