import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  User,
  Building2,
  Megaphone,
  Code2,
  Landmark,
  BrainCircuit,
  Moon,
  Sun,
  Bell,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const businesses = [
    { icon: Building2, name: 'Real Estate', color: 'text-real-estate' },
    { icon: Megaphone, name: 'Digital Marketing', color: 'text-digital-marketing' },
    { icon: Code2, name: 'Software Development', color: 'text-software-dev' },
    { icon: Landmark, name: 'Loan Consulting', color: 'text-loan' },
    { icon: BrainCircuit, name: 'AI Services', color: 'text-ai-services' },
  ];

  return (
    <AppLayout
      onAddTask={() => {}}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your profile and preferences
          </p>
        </div>

        {/* Profile Section */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-6">
            <User className="h-5 w-5" />
            Profile
          </h2>

          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-display font-bold">
                AG
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-display font-bold text-xl text-foreground">
                Anubhav Godre
              </h3>
              <p className="text-muted-foreground">Business Owner & Entrepreneur</p>
              <p className="text-sm text-muted-foreground mt-1">
                Managing 5 businesses
              </p>
            </div>
          </div>
        </div>

        {/* Businesses */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-foreground mb-4">
            Your Businesses
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {businesses.map((business) => (
              <div
                key={business.name}
                className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border/50"
              >
                <div className={cn("p-2 rounded-lg bg-card", business.color)}>
                  <business.icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-foreground">{business.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="glass-card p-6 space-y-6">
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Preferences
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Sun className="h-5 w-5 text-digital-marketing" />
                )}
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle dark/light theme
                  </p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Enable browser notifications
                  </p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="glass-card p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary text-primary-foreground mb-3">
              <span className="font-display font-bold text-lg">V</span>
            </div>
            <h3 className="font-display font-bold text-foreground">Veda AI</h3>
            <p className="text-sm text-muted-foreground">
              Business Productivity Suite
            </p>
            <p className="text-xs text-muted-foreground mt-2">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
