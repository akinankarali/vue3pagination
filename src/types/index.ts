export interface Program {
  id: number;
  title: string;
  university: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
}
