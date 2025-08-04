import { Ticket, Severity } from '../types/ticket';

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'in-progress': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="card p-4 sm:p-6 hover:shadow-lg dark:hover:shadow-soft-dark transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 sm:line-clamp-1">
              {ticket.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full self-start ${getSeverityColor(ticket.severity)}`}>
              {ticket.severity.charAt(0).toUpperCase() + ticket.severity.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <span>#{ticket.id.slice(-8)}</span>
            <span>•</span>
            <span className="hidden sm:inline">{formatDate(ticket.createdAt)}</span>
            <span className="sm:hidden">{new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).format(ticket.createdAt)}</span>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full self-start sm:self-auto ${getStatusColor(ticket.status)}`}>
          {ticket.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>
      
      <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        <p className="line-clamp-3">
          {ticket.description}
        </p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Created {formatDate(ticket.createdAt)}</span>
            <span className="sm:hidden">Created {new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric'
            }).format(ticket.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              ticket.severity === 'high' ? 'bg-red-500' : 
              ticket.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            }`}></div>
            <span className="capitalize">{ticket.severity} priority</span>
          </div>
        </div>
      </div>
    </div>
  );
}