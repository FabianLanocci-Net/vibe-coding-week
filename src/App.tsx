import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { SubmitTicket } from './components/SubmitTicket';
import { TicketList } from './components/TicketList';
import { ThemeToggle } from './components/ThemeToggle';

function AppContent() {
  const [activeSection, setActiveSection] = useState<'submit' | 'list'>('submit');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleTicketCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveSection('list'); // Automatically switch to list view after creating a ticket
    if (isMobile) {
      setIsMobileMenuOpen(false); // Close mobile menu after action
    }
  };

  const handleSectionChange = (section: 'submit' | 'list') => {
    setActiveSection(section);
    if (isMobile) {
      setIsMobileMenuOpen(false); // Close mobile menu after selection
    }
  };

  const getSectionTitle = () => {
    return activeSection === 'submit' ? 'Submit Ticket' : 'Ticket List';
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
          isMobile={false}
        />
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Mobile Menu */}
          <div className="fixed inset-y-0 left-0 z-50 w-64">
            <Sidebar 
              activeSection={activeSection} 
              onSectionChange={handleSectionChange}
              isMobile={true}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        {isMobile && (
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Toggle menu"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {getSectionTitle()}
                </h1>
              </div>
              <ThemeToggle />
            </div>
          </header>
        )}

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            {activeSection === 'submit' ? (
              <SubmitTicket onTicketCreated={handleTicketCreated} />
            ) : (
              <TicketList refreshTrigger={refreshTrigger} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;