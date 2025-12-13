export type BusinessCategory = 'real-estate' | 'digital-marketing' | 'software-dev' | 'loan' | 'ai-services';
export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  time: string;
  location?: string;
  category: BusinessCategory;
  status: TaskStatus;
  createdAt: string;
  clientName?: string;
  followUpDate?: string;
  notes?: string;
}

export const BUSINESS_CATEGORIES: { value: BusinessCategory; label: string; color: string }[] = [
  { value: 'real-estate', label: 'Real Estate', color: 'real-estate' },
  { value: 'digital-marketing', label: 'Digital Marketing', color: 'digital-marketing' },
  { value: 'software-dev', label: 'Software Dev', color: 'software-dev' },
  { value: 'loan', label: 'Loan Consulting', color: 'loan' },
  { value: 'ai-services', label: 'AI Services', color: 'ai-services' },
];

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];
