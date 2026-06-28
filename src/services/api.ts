import type { Program } from '../types';

export interface FetchProgramsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface PaginatedProgramsResponse {
  programs: Program[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const LATENCY_MS = 500;
const PROGRAM_COUNT = 5_000;

let programs: Program[] | null = null;

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const createMockPrograms = (): Program[] => {
  const degrees = ['MSc', 'MA', 'MBA', 'BSc', 'BA', 'LLM'];
  const subjects = [
    'Artificial Intelligence',
    'Data Science',
    'International Business',
    'Computer Science',
    'Public Health',
    'Sustainable Energy',
    'Psychology',
    'Finance',
    'Biomedical Engineering',
    'Digital Marketing',
  ];
  const universities = [
    'University of Amsterdam',
    'Technical University of Munich',
    'University of Copenhagen',
    'Delft University of Technology',
    'University of Manchester',
    'Lund University',
    'KU Leuven',
    'University of Barcelona',
  ];

  return Array.from({ length: PROGRAM_COUNT }, (_, index) => {
    const id = index + 1;
    const degree = degrees[index % degrees.length];
    const subject = subjects[index % subjects.length];
    const university = universities[index % universities.length];

    return {
      id,
      title: `${degree} ${subject}`,
      university,
      description: `${degree} ${subject} at ${university}. This version improves clarity, structure, and study outcome details for prospective students.`,
      status: 'pending',
    };
  });
};

export const fetchPrograms = async ({
  page = 1,
  pageSize = 10,
  search = '',
}: FetchProgramsParams = {}): Promise<PaginatedProgramsResponse> => {
  await delay(LATENCY_MS);

  if (!programs) {
    programs = createMockPrograms();
  }

  const normalizedSearch = search.trim().toLowerCase();
  const filteredPrograms = normalizedSearch
    ? programs.filter((program) => {
      return (
        program.title.toLowerCase().includes(normalizedSearch) ||
        program.university.toLowerCase().includes(normalizedSearch)
      );
    })
    : programs;

  const total = filteredPrograms.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedPrograms = filteredPrograms.slice(startIndex, startIndex + pageSize);

  return {
    programs: paginatedPrograms,
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
};

export const updateStatus = async (
  id: Program['id'],
  status: Program['status'],
): Promise<Program> => {
  await delay(LATENCY_MS);

  if (!programs) {
    programs = createMockPrograms();
  }

  const programIndex = programs.findIndex((program) => program.id === id);

  if (programIndex === -1) {
    throw new Error(`Program with id ${id} was not found.`);
  }

  const updatedProgram = {
    ...programs[programIndex],
    status,
  };

  programs[programIndex] = updatedProgram;

  return updatedProgram;
};
