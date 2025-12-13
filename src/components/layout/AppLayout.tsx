import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: ReactNode;
  onAddTask: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function AppLayout({ children, onAddTask, searchQuery, onSearchChange }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64 transition-all duration-300">
        <Header 
          onAddTask={onAddTask} 
          searchQuery={searchQuery} 
          onSearchChange={onSearchChange}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
