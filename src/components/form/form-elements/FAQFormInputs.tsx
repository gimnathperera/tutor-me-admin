"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useState } from "react";
import TextArea from "../input/TextArea";

interface FormData {
  question: string;
  answer: string;
}

interface FormErrors {
  question?: string;
  answer?: string;
}

export default function FAQFormInputs() {
  const [formData, setFormData] = useState<FormData>({
    question: "",
    answer: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Question validation
    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
    }

    // Answer validation
    if (!formData.answer.trim()) {
      newErrors.answer = "Answer is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, question: value }));

    // Clear error when user starts typing
    if (errors.question) {
      setErrors((prev) => ({ ...prev, question: undefined }));
    }
  };

  const handleAnswerChange = (value: string) => {
    setFormData((prev) => ({ ...prev, answer: value }));

    // Clear error when user starts typing
    if (errors.answer) {
      setErrors((prev) => ({ ...prev, answer: undefined }));
    }
  };

  const handleReset = () => {
    setErrors({}); // Clear all errors
    setFormData({ question: "", answer: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Handle successful submission
      console.log("FAQ submitted:", formData);
      alert("FAQ created successfully!");

      // Reset form after successful submission
      handleReset();
    } catch (error) {
      console.error("Error submitting FAQ:", error);
      alert("Error creating FAQ. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Create FAQ" />
      <div className="mx-auto w-full max-w-[630px] text-center ">
        <ComponentCard title="Add a New FAQ" className="[&>div>h3]:!text-lg">
          <form className="space-y-4 text-left" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Question Input */}
              <div>
                <Label>
                  Question: <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your question here"
                  value={formData.question}
                  onChange={handleQuestionChange}
                  error={!!errors.question}
                  hint={errors.question}
                />
              </div>

              {/* Answer TextArea */}
              <div>
                <Label>
                  Answer: <span className="text-red-500">*</span>
                </Label>
                <TextArea
                  value={formData.answer}
                  onChange={handleAnswerChange}
                  rows={6}
                  error={!!errors.answer}
                  hint={errors.answer}
                  placeholder="Enter the answer here"
                />
              </div>
              {/* Reset & Submit Buttons */}
              <div className="flex gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}
