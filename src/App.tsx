import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { SubmitTicket } from './components/SubmitTicket';
import { TicketList } from './components/TicketList';

function AppContent() {
  const [activeSection, setActiveSection] = useState<'submit' | 'list'>('submit');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTicketCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveSection('list'); // Automatically switch to list view after creating a ticket
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
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