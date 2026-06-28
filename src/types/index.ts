export interface Program {
  id: number;
  title: string;
  university: string;
  ai_description: string;
  status: 'pending' | 'approved' | 'rejected';
}
