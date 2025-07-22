import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, HelpCircle, User } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import farmerAvatar from '@/assets/farmer-avatar.png';

interface NavbarProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle, isSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-soft"
    >
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="hover:bg-primary/10 transition-bounce"
          >
            <motion.div
              animate={{ rotate: isSidebarOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Menu className="h-5 w-5" />
            </motion.div>
          </Button>

          {/* Logo and App Name */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.img
              src={farmerAvatar}
              alt="Project Kisan"
              className="h-10 w-10 rounded-full shadow-soft"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-indian">
                Project Kisan
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Digital Farming Assistant
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="hidden md:block"
          >
            <Button variant="outline" size="sm" className="text-xs">
              ಕನ್ನಡ
            </Button>
          </motion.div>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="hover:bg-accent/10 transition-bounce relative"
            >
              <Bell className="h-5 w-5" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-card border p-4 z-50"
              >
                <h3 className="font-semibold mb-3">Notifications</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-accent/10 rounded text-sm">
                    🌾 Crop monitoring alert: Low soil moisture detected
                  </div>
                  <div className="p-2 bg-primary/10 rounded text-sm">
                    📈 Tomato prices increased by 12% today
                  </div>
                  <div className="p-2 bg-secondary/10 rounded text-sm">
                    🏛️ New subsidy scheme available for drip irrigation
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Help */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 transition-bounce"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* Profile */}
          <div className="relative">
            <Button
              variant="ghost"
              className="p-1 hover:bg-accent/10 transition-bounce"
              onClick={() => setShowProfile(!showProfile)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={farmerAvatar} alt="Profile" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>

            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-64 bg-card rounded-lg shadow-card border p-4 z-50"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={farmerAvatar} alt="Profile" />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">Farmers Friend</h4>
                    <p className="text-sm text-muted-foreground">Karnataka, India</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Language: ಕನ್ನಡ
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Settings
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-destructive">
                    Sign Out
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};