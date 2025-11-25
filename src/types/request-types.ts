export type ContactUsRequest = {
  message: string;
  sender: {
    name: string;
    email: string;
  };
};
export type FetchBlogsRequest = {
  blogId?: string;
  image?: string;
  status?: "pending" | "approved" | "draft";
  authorName?: string;
  title?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
};

export type UpdateBlogRequest = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  image?: string;
  relatedArticles: string[];
  status?: "pending" | "approved" | "rejected";
  authorName?: string;
  title?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
};

export type UpdateBlogStatusRequest = {
  blogId: string;
  status?: "pending" | "approved" | "rejected";
};
export type UpdateTutorRequestsRequest = {
  requestId: string;
  status?: "Approved" | "Pending" | "Tutor Assigned";
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
  sortBy?: string;
};

export type FetchInquiryRequest = {
  page: number;
  limit: number;
  sortBy?: string;
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
  grade?: string;
  subject?: string;
  sortBy?: string;
};

export type CreateTagRequest = {
  name: string;
  description: string;
};

export type UpdateTagRequest = {
  id: string;
  name: string;
  description: string;
};

export type FetchTagsRequest = {
  name?: string;
  description?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  tagId?: string;
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

export type TuitionRate = {
  minimumRate: string;
  maximumRate: string;
};

export type UpdateTuitionRateRequest = {
  id: string;
  subject: string;
  grade: string;
  fullTimeTuitionRate?: TuitionRate[];
  govTuitionRate?: TuitionRate[];
  partTimeTuitionRate?: TuitionRate[];
};

export type FetchTuitionRatesRequest = {
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

export type FetchTutorsRequest = {
  fullName?: string;
  contactNumber?: string;
  email?: string;
  gender?: string;
  nationality?: string;
  tutorType?: string;
  yearsExperience?: number;
  highestEducation?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  tutorId?: string;
};
export type FetchRequestForTutor = {
  page?: number;
  limit?: number;
  sortBy?: string;
  requestTutorId?: string;
  name?: string;
  medium?: string;
  district?: string;
  email?: string;
  grade?: string[];
  phoneNumber?: string;
  city?: string;
  state?: string;
  status?: string;
  region?: string;
  zip?: string;
  tutors?: string[];
  subjects?: string[];
  duration?: string;
  frequency?: string;
  assignedTutor?: { id: string; fullName: string }[];
};
export type CreateTutorRequest = {
  fullName: string;
  contactNumber: string;
  confirmContactNumber: string;
  email: string;
  dateOfBirth: string;
  confirmDateOfBirth: string;
  gender: string;
  age: number;
  nationality: string;
  race: string;
  last4NRIC: string;
  tutoringLevels: string[];
  preferredLocations: string[];
  tutorType: string;
  yearsExperience: number;
  highestEducation: string;
  academicDetails: string;
  teachingSummary: string;
  studentResults: string;
  sellingPoints: string;
  agreeTerms: boolean;
  agreeAssignmentInfo: boolean;
  captchaToken: string;
};

export type UpdateTutorRequest = {
  id: string;
  payload: {
    fullName?: string;
    contactNumber?: string;
    email?: string;
    dateOfBirth?: string;
    gender?: string;
    age?: number;
    nationality?: string;
    race?: string;
    last4NRIC?: string;
    tutoringLevels?: string[];
    preferredLocations?: string[];
    tutorType?: string;
    yearsExperience?: number;
    highestEducation?: string;
    academicDetails?: string;
    teachingSummary?: string;
    studentResults?: string;
    sellingPoints?: string;
    agreeTerms?: boolean;
    agreeAssignmentInfo?: boolean;
  } & Record<string, unknown>; // ensures object is not empty
};

export type FetchTestimonialsRequest = {
  page: number;
  limit: number;
  sortBy?: string;
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
  dateOfBirth: string;
  confirmDateOfBirth: string;
  gender: string;
  age: number;
  nationality: string;
  race: string;
  last4NRIC: string;
  tutoringLevels: string[];
  preferredLocations: string[];
  tutorType: string;
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
  page?: number;
  limit?: number;
  sortBy?: string;
  title?: string;
  details?: string[];
  challenges?: string[];
  subjects?: string[];
};

export type UpdateLevelRequest = {
  id: string;
  title: string;
  description: string;
  details: string[];
  challenges: string[];
  subjects: string[];
};
