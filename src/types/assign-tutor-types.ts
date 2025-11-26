export interface AssignTutorRow {
  id: string;
  tutors?: {
    subjects: { title: string }[];
    assignedTutor?: { id: string; fullName: string }[];
    preferredTutorType?: string;
    duration: string;
    frequency: string;
    createdAt: string;
  }[];
}
