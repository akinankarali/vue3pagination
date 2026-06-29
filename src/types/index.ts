export const ProgramStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type ProgramStatusType = typeof ProgramStatus[keyof typeof ProgramStatus];

export interface Program {
  id: number;
  title: string;
  university: string;
  description: string;
  status: ProgramStatusType;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
