import { Ticket, CreateTicketData } from '../types/ticket';

const STORAGE_KEY = 'support-tickets';

export function getTickets(): Ticket[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const tickets = JSON.parse(stored);
    // Convert date strings back to Date objects
    return tickets.map((ticket: any) => ({
      ...ticket,
      createdAt: new Date(ticket.createdAt)
    }));
  } catch (error) {
    console.error('Error loading tickets from storage:', error);
    return [];
  }
}

export function saveTickets(tickets: Ticket[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (error) {
    console.error('Error saving tickets to storage:', error);
  }
}

export function createTicket(ticketData: CreateTicketData): Ticket {
  const newTicket: Ticket = {
    id: generateId(),
    ...ticketData,
    createdAt: new Date(),
    status: 'open'
  };

  const tickets = getTickets();
  tickets.unshift(newTicket); // Add new ticket to the beginning
  saveTickets(tickets);
  
  return newTicket;
}

export function updateTicket(ticketId: string, updates: Partial<Ticket>): Ticket | null {
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);
  
  if (ticketIndex === -1) return null;
  
  tickets[ticketIndex] = { ...tickets[ticketIndex], ...updates };
  saveTickets(tickets);
  
  return tickets[ticketIndex];
}

export function deleteTicket(ticketId: string): boolean {
  const tickets = getTickets();
  const filteredTickets = tickets.filter(t => t.id !== ticketId);
  
  if (filteredTickets.length === tickets.length) return false;
  
  saveTickets(filteredTickets);
  return true;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}