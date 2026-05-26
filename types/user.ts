export type StudentUser = {
  id: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  createdAt: string;
};

export type SavedJob = {
  id: string;
  userId: string;
  jobId: string;
  createdAt: string;
};
