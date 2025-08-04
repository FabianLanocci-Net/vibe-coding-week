import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  activeSection: 'submit' | 'list';
  onSectionChange: (section: 'submit' | 'list') => void;
  isMobile: boolean;
  onClose?: () => void;
}

export function Sidebar({ activeSection, onSectionChange, isMobile, onClose }: SidebarProps) {
  return (
    <div className={`w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full ${
      isMobile ? 'shadow-lg' : ''
    }`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Support Desk
          </h1>
          <div className="flex items-center space-x-2">
            {!isMobile && <ThemeToggle />}
            {isMobile && onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <button
          className={`sidebar-item w-full text-left ${activeSection === 'submit' ? 'active' : ''} ${
            isMobile ? 'py-4 text-base' : ''
          }`}
          onClick={() => onSectionChange('submit')}
        >
          <svg
            className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} mr-3`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Submit Ticket
        </button>
        
        <button
          className={`sidebar-item w-full text-left ${activeSection === 'list' ? 'active' : ''} ${
            isMobile ? 'py-4 text-base' : ''
          }`}
          onClick={() => onSectionChange('list')}
        >
          <svg
            className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} mr-3`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Ticket List
        </button>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Support Ticket System v1.0
        </div>
      </div>
    </div>
  );
}