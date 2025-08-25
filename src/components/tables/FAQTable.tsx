"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Pencil, Trash2 } from "lucide-react"; // ✅ import icons

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
  createdAt: string;
}

// Sample FAQ data
const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How can I register as a new student?",
    answer:
      "Students can register by clicking the 'Sign Up' button on the login page, filling out the required details, and verifying their email address.",
    createdAt: "2025-08-25T10:00:00Z",
  },
  {
    id: 2,
    question: "How do teachers create and manage classes?",
    answer:
      "Teachers can create classes from the 'Classes' section in their dashboard. They can add course materials, assignments, and manage enrolled students.",
    createdAt: "2025-08-25T10:05:00Z",
  },
    {
        id: 3,
        question: "What payment methods are accepted?",
        answer:
        "We accept major credit cards, PayPal, and bank transfers. Payment details can be managed in the 'Billing' section of your account.",
        createdAt: "2025-08-25T10:10:00Z",
    },
    {
        id: 4,
        question: "How can I reset my password?",
        answer:
        "To reset your password, click on the 'Forgot Password' link on the login page and follow the instructions to receive a reset link via email.",
        createdAt: "2025-08-25T10:15:00Z",
    },
    {
        id: 5,
        question: "How do I contact support?",
        answer:
        "You can contact support by clicking on the 'Help' section in your dashboard or by emailing support@tutorme.com.",
        createdAt: "2025-08-25T10:20:00Z",
    },
];

export default function FAQTable() {
  // Placeholder handlers
  const handleEdit = (id: number) => {
    console.log("Edit clicked:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete clicked:", id);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-16"
                >
                  #
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Question
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Answer
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Date Created
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-32"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {faqData.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400 font-medium ">
                    {faq.id}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start max-w-sm">
                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {faq.question}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 text-start text-theme-sm dark:text-gray-300 ">
                    <p className="line-clamp-3">{faq.answer}</p>
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {faq.createdAt}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-3">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(faq.id)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        aria-label="Edit FAQ"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        aria-label="Delete FAQ"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
