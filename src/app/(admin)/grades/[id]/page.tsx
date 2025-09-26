"use client";

import { useEffect, useState } from "react";

interface GradeDetailsProps {
  params: { id: string };
}

interface Subject {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Grade {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  subjects: Subject[];
}

const GradeDetailPage = ({ params }: GradeDetailsProps) => {
  const { id } = params;
  const [grade, setGrade] = useState<Grade | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGradesById = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/grades/${id}`,
        );
        const data = await res.json();
        setGrade(data);
      } catch (error) {
        console.error("Error fetching grades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGradesById();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!grade) return <p>No grade found.</p>;

  return (
    <div>
      <div className="">
        <h3 className="font-semibold text-3xl text-gray-800 dark:text-white">
          {grade.title}
        </h3>
        <p className="text-xl text-gray-500 dark:text-gray-400">
          {grade.description}
        </p>
        <h2 className="text-lg font-semibold mt-4">Subjects</h2>
        <div className="flex flex-wrap gap-3 mt-2">
          {grade.subjects?.map((subject) => (
            <div
              key={subject.id}
              className="px-3 py-2 bg-blue-100 text-blue-800 rounded-xl shadow-sm border border-blue-200"
            >
              <p className="font-medium text-sm">{subject.title}</p>
              <p className="text-xs text-blue-600">{subject.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradeDetailPage;
