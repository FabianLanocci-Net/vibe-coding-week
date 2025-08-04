export type Severity = 'low' | 'medium' | 'high';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  createdAt: Date;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
}

export interface CreateTicketData {
  title: string;
  description: string;
  severity: Severity;
}