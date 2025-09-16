export type ContactUsRequest = {
  message: string;
  sender: {
    name: string;
    email: string;
  };
};

export type UserLoginRequest = {
  email: string;
  password: string;
};

export type UserRefreshTokenRequest = {
  refreshToken: string;
};

export type UserLogoutRequest = {
  refreshToken: string;
};

export type UserRegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type UpdateProfileRequest = {
  id: string;
  payload: {
    name?: string;
    email?: string;
    grade?: string;
    subjects?: string[];
    country?: string;
    phoneNumber?: string;
    city?: string;
    state?: string;
    region?: string;
    zip?: string;
    address?: string;
    birthday?: string | Date;
    tutorType?: string;
    gender?: string;
    duration?: string;
    timeZone?: string;
    language?: string;
  };
};

export type UpdatePasswordRequest = {
  id: string;
  payload: {
    currentPassword: string;
    newPassword: string;
  };
};

export type FetchProfileRequest = {
  userId: string;
};

export type FetchFaqRequest = {
  page: number;
  limit: number;
};

export type FetchInquiryRequest = {
  page: number;
  limit: number;
};

export type FetchLevelRequest = {
  page: number;
  limit: number;
  title: string;
  details: string[];
  challenges?: string[];
  subjects: string[];
  levelId: string;
};

export type FetchPapersRequest = {
  page: number;
  limit: number;
  grade: string;
  subject: string;
};

export type CreateSubjectRequest = {
  title: string;
  description: string;
};

export type UpdateSubjectRequest = {
  id: string;
  title: string;
  description: string;
};
export type UpdateUserRequest = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  phoneNumber: string;
  birthday: string;
  status: string;
  country: string;
  city: string;
  state: string;
  region: string;
  zip: string;
  address: string;
  tutorType: string;
  gender: string;
  duration: string;
  frequency: string;
  timezone: string;
  language: string;
  avatar: string;
};

export type UpdateGradeRequest = {
  id: string;
  title: string;
  description: string;
  subjects: string[];
};

export type FetchGradesRequest = {
  title?: string;
  description?: string;
  subjects?: string[];
  page?: number;
  sortBy?: string;
  limit?: number;
  gradeId?: string;
};
//tuition rates types

export type TuitionRate = {
  minimumRate: string;
  maximumRate: string;
};

export type UpdateTuitionRateRequest = {
  id: string;
  level: string;
  subject: string;
  grade: string;
  fullTimeTuitionRate?: TuitionRate[];
  govTuitionRate?: TuitionRate[];
  partTimeTuitionRate?: TuitionRate[];
};

export type FetchTuitionRatesRequest = {
  level?: string[];
  subject?: string[];
  grade?: string[];
  fullTimeTuitionRate?: TuitionRate[];
  govTuitionRate?: TuitionRate[];
  partTimeTuitionRate?: TuitionRate[];
  page?: number;
  sortBy?: string;
  limit?: number;
  rateId?: string;
};

export type FetchSubjectsRequest = {
  title?: string;
  description?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  subjectId?: string;
};

export type FetchUserRequest = {
  email?: string;
  password?: string;
  name?: string;
  role?: string;
  phoneNumber?: string;
  birthday?: string;
  status?: string;
  country?: string;
  city?: string;
  state?: string;
  region?: string;
  zip?: string;
  address?: string;
  tutorType?: string;
  gender?: string;
  duration?: string;
  frequency?: string;
  timezone?: string;
  language?: string;
  avatar?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  userId?: string;
};

export type FetchTestimonialsRequest = {
  page: number;
  limit: number;
};

export type FetchTuitionAssignments = {
  title: string;
  assignmentNumber: string;
  address: string;
  duration: string;
  gradeId: string;
  tutorId: string;
  assignmentPrice: string;
};

export type FindMyTutorRequest = {
  fullName: string;
  contactNumber: string;
  confirmContactNumber: string;
  email: string;
  dateOfBirth: string; // YYYY-MM-DD format
  confirmDateOfBirth: string; // YYYY-MM-DD format
  gender: string;
  age: number;
  nationality: string;
  race: string;
  last4NRIC: string;
  tutoringLevels: string[]; // e.g., ["Primary School", "Upper Secondary"]
  preferredLocations: string[]; // e.g., ["Bukit Timah", "Toa Payoh"]
  tutorType: string; // Full Time Tutor / Part Time Tutor
  yearsExperience: number;
  highestEducation: string;
  academicDetails: string;
  teachingSummary: string;
  studentResults: string;
  sellingPoints: string;
  agreeTerms: boolean;
  agreeAssignmentInfo: boolean;
};

export type FetchLevelsRequest = {
  title?: string;
  details?: string[];
  challenges?: string[];
  subjects?: string[];
  levelId?: string;
};

export type UpdateLevelRequest = {
  id: string;
  title: string;
  description: string;
  details: string[];
  challenges: string[];
  subjects: string[];
};