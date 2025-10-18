"use client";

import { useEffect, useState } from "react";

interface Subject {
  id: string;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Level {
  id: string;
  title: string;
  details: string[];
  challanges: string[];
  subjects: Subject[];
  createdAt?: string;
  updatedAt?: string;
}

interface LevelDetailProps {
  params: { id: string };
}

const LevelDetailPage = ({ params }: LevelDetailProps) => {
  const { id } = params;
  const [level, setLevel] = useState<Level | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevelById = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/levels/${id}`,
        );
        const data = await res.json();
        setLevel(data);
      } catch (error) {
        console.error("Error fetching level:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevelById();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!level) return <p>No level found.</p>;

  return (
    <div>
      <div className="">
        <h3 className="font-semibold text-3xl text-gray-800 dark:text-white">
          {level.title}
        </h3>

        <h2 className="text-lg font-semibold mt-4">Details</h2>
        <ul className="list-disc pl-6 mt-2">
          {level.details?.map((d, idx) => (
            <li key={idx} className="text-gray-500">
              {d}
            </li>
          ))}
        </ul>

        <h2 className="text-lg font-semibold mt-4">Challenges</h2>
        <ul className="list-disc pl-6 mt-2">
          {level.challanges?.map((c, idx) => (
            <li key={idx} className="text-gray-500">
              {c}
            </li>
          ))}
        </ul>

        <h2 className="text-lg font-semibold mt-4">Subjects</h2>
        <div className="flex flex-wrap gap-3 mt-2">
          {level.subjects?.length ? (
            level.subjects.map((subject) => (
              <div
                key={subject.id}
                className="px-3 py-2 bg-blue-100 text-blue-800 rounded-xl shadow-sm border border-blue-200"
              >
                <p className="font-medium text-sm">{subject.title}</p>
                {subject.description && (
                  <p className="text-xs text-blue-600">{subject.description}</p>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-400">No subjects</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LevelDetailPage;
