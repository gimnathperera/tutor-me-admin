"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useState } from "react";
import TextArea from "../input/TextArea";

export default function FAQFormInputs() {
  const [message, setMessage] = useState("");

  const handleReset = () => {
    setMessage("");
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Create FAQ" />
      <div className="mx-auto w-full max-w-[630px] text-center ">
        <ComponentCard title="Add a New FAQ" className="[&>div>h3]:!text-lg">
          <form className="space-y-4 text-left">
            <div className="space-y-6">
              {/* Question Input */}
              <div>
                <Label>Question:</Label>
                <Input
                  type="text"
                  placeholder="Enter your question here"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    // Handle question input change
                  }}
                />
              </div>

              {/* Answer TextArea */}
              <div>
                <Label>Answer:</Label>
                <TextArea
                  value={message}
                  onChange={(value) => setMessage(value)}
                  rows={6}
                  className="text-black placeholder:text-gray-400"
                />
              </div>

              {/* Reset Button */}
              <div className="flex gap-4">
                <Button size="sm" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button size="sm" variant="primary">
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}
