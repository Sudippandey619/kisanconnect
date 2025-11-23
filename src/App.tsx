import React, { useState, useEffect } from 'react';
import { Phone, User, MessageCircle, Moon, Sun, ChevronDown, Bell, Zap, Leaf, Settings, Wallet, BarChart3, Shield, MapPin, Brain, Users, Cpu, Plus, RefreshCw, Search, Video, Trophy, TrendingUp, Camera, Mic, Gift, Gamepad2, Target, Award, Star, Compass } from 'lucide-react';
import { Button } from './components/ui/button';
import { Switch } from './components/ui/switch';
import { Badge } from './components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { EnhancedOnboarding } from './components/EnhancedOnboarding';
import { EnhancedAuth } from './components/EnhancedAuth';
import { EnhancedRoleSelection } from './components/EnhancedRoleSelection';
import { ConsumerApp } from './components/ConsumerApp';
import { FarmerApp } from './components/FarmerApp';
import { DriverApp } from './components/DriverApp';
import { NepaliChatbot } from './components/NepaliChatbot';
import { ProfileSettings } from './components/ProfileSettings';
import { RealTimeProvider, useRealTime } from './components/RealTimeInfrastructure';
import { PaymentWalletSystem } from './components/PaymentWalletSystem';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { LiveOrderTracking } from './components/LiveOrderTracking';
import { RealTimeMessaging } from './components/RealTimeMessaging';
import { QualityAssuranceSystem } from './components/QualityAssuranceSystem';
import { SmartFarmingHub } from './components/SmartFarmingHub';
import { AIFarmingAssistant } from './components/AIFarmingAssistant';
import { CommunityKnowledgeHub } from './components/CommunityKnowledgeHub';
import { RoleManagement } from './components/RoleManagement';
import { AdvancedSearchDiscovery } from './components/AdvancedSearchDiscovery';
import { LiveVideoStreaming } from './components/LiveVideoStreaming';
import { SocialCommerce } from './components/SocialCommerce';
import { AdvancedLogistics } from './components/AdvancedLogistics';
import { FinancialHub } from './components/FinancialHub';
import { MarketIntelligence } from './components/MarketIntelligence';
import { GamificationSystem } from './components/GamificationSystem';
import { OfflineSupport } from './components/OfflineSupport';
import { AdvancedProfiles } from './components/AdvancedProfiles';
import { IntegrationHub } from './components/IntegrationHub';
import { AccessibilityCenter } from './components/AccessibilityCenter';
import { QuickActionsHub } from './components/QuickActionsHub';
import { AuthService } from './utils/auth';
import { supabase } from './utils/supabase/client';
import OrderManager from './utils/orderManagement';
import WalletManager from './utils/walletManagement';

export type UserRole = 'farmer' | 'consumer' | 'driver';
export type Language = 'en' | 'ne';

export interface User {
  id: string;
  phone: string;
  name: string;
  nameNepali?: string;
  roles: UserRole[];
  currentRole: UserRole;
  avatar?: string;
  verified: boolean;
  location?: string;
  createdAt: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'auth' | 'roleSelection' | 'app'>('onboarding');
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('ne');
  const [darkMode, setDarkMode] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [showSmartFarming, setShowSmartFarming] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showRoleManagement, setShowRoleManagement] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showLiveStreaming, setShowLiveStreaming] = useState(false);
  const [showSocialCommerce, setShowSocialCommerce] = useState(false);
  const [showAdvancedLogistics, setShowAdvancedLogistics] = useState(false);
  const [showFinancialHub, setShowFinancialHub] = useState(false);
  const [showMarketIntelligence, setShowMarketIntelligence] = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [showOfflineSupport, setShowOfflineSupport] = useState(false);
  const [showAdvancedProfiles, setShowAdvancedProfiles] = useState(false);
  const [showIntegrationHub, setShowIntegrationHub] = useState(false);
  const [showAccessibilityCenter, setShowAccessibilityCenter] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(WalletManager.getBalance());
  const [orderData, setOrderData] = useState<any>(null);

  // Initialize Supabase auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.access_token) {
          setAccessToken(session.access_token);
          // Fetch user profile from backend
          await fetchUserProfile(session.access_token);
        } else {
          setAccessToken(null);
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Check for existing session on app load and seed data
  useEffect(() => {
    const initializeApp = async () => {
      // Initialize wallet and order managers
      WalletManager.loadData();
      OrderManager.loadOrders();
      setWalletBalance(WalletManager.getBalance());

      // Seed initial data (categories and sample products)
      try {
        await AuthService.seedInitialData();
      } catch (error) {
        console.log('Seed data already exists or failed:', error);
      }

      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        setAccessToken(session.access_token);
        await fetchUserProfile(session.access_token);
      }
    };
    initializeApp();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchUserProfile = async (token: string) => {
    try {
      const userData = await AuthService.getUserProfile(token);
      setUser(userData);
      if (userData.roles.length === 0) {
        setCurrentScreen('roleSelection');
      } else {
        setCurrentScreen('app');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('auth');
  };

  const handleLogin = async (identifier: string, otp: string) => {
    try {
      // Validate OTP format (demo validation)
      if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      // Determine if identifier is email or phone
      const isEmail = identifier.includes('@');
      const phone = isEmail ? identifier.replace('@', '').replace(/[^0-9]/g, '') : identifier;
      
      console.log('Login attempt:', { identifier, isEmail, phone, otp });

      // First check if user exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('kisanconnect:users') || '[]');
      const existingUser = existingUsers.find((u: any) => 
        u.phone === phone || u.phone === identifier || u.email === identifier
      );

      if (existingUser) {
        // User exists, proceed with login
        try {
          const { user: loginUser } = await AuthService.login(phone, otp);
          setUser(loginUser);
          if (loginUser.roles.length === 0) {
            setCurrentScreen('roleSelection');
          } else {
            setCurrentScreen('app');
          }
          return;
        } catch (loginError: any) {
          console.error('Login error for existing user:', loginError);
          // If login fails but user exists, still proceed (demo mode)
          setUser(existingUser);
          if (existingUser.roles.length === 0) {
            setCurrentScreen('roleSelection');
          } else {
            setCurrentScreen('app');
          }
          return;
        }
      } else {
        // User doesn't exist, create new user
        console.log('New user detected, creating account...');
        try {
          const { user: newUser } = await AuthService.signup(
            identifier, 
            otp, 
            'नयाँ प्रयोगकर्ता', 
            'New User'
          );
          setUser(newUser);
          setCurrentScreen('roleSelection');
          return;
        } catch (signupError: any) {
          console.error('Signup error:', signupError);
          // If signup fails, create a basic demo user
          const demoUser: User = {
            id: 'demo-user-' + Date.now(),
            phone: isEmail ? phone : identifier,
            name: 'नयाँ प्रयोगकर्ता',
            nameNepali: 'New User',
            roles: [],
            currentRole: 'consumer',
            verified: true,
            createdAt: new Date().toISOString()
          };
          
          // Save demo user to localStorage
          existingUsers.push(demoUser);
          localStorage.setItem('kisanconnect:users', JSON.stringify(existingUsers));
          
          setUser(demoUser);
          setCurrentScreen('roleSelection');
          return;
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Create fallback demo user
      const fallbackUser: User = {
        id: 'fallback-user-' + Date.now(),
        phone: isEmail ? phone : identifier,
        name: 'डेमो प्रयोगकर्ता',
        nameNepali: 'Demo User',
        roles: [],
        currentRole: 'consumer',
        verified: true,
        createdAt: new Date().toISOString()
      };
      
      setUser(fallbackUser);
      setCurrentScreen('roleSelection');
      
      console.log('Created fallback demo user for development');
    }
  };

  const handleRoleSelection = async (roles: UserRole[]) => {
    if (!user) return;
    
    try {
      if (accessToken) {
        // Update roles via API
        const updatedUser = await AuthService.updateUserRoles(accessToken, roles);
        setUser(updatedUser);
      } else {
        // Fallback for demo mode
        const updatedUser = {
          ...user,
          roles,
          currentRole: roles[0]
        };
        setUser(updatedUser);
      }
      setCurrentScreen('app');
    } catch (error) {
      console.error('Error updating roles:', error);
      // Fallback to local update
      const updatedUser = {
        ...user,
        roles,
        currentRole: roles[0]
      };
      setUser(updatedUser);
      setCurrentScreen('app');
    }
  };

  const switchRole = async (role: UserRole) => {
    if (!user || !user.roles.includes(role)) return;
    
    try {
      if (accessToken) {
        // Switch role via API
        const updatedUser = await AuthService.switchRole(accessToken, role);
        setUser(updatedUser);
      } else {
        // Fallback for demo mode
        setUser({ ...user, currentRole: role });
      }
    } catch (error) {
      console.error('Error switching role:', error);
      // Fallback to local update
      setUser({ ...user, currentRole: role });
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'farmer': return '👨‍🌾';
      case 'consumer': return '🛒';
      case 'driver': return '🚚';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    if (language === 'ne') {
      switch (role) {
        case 'farmer': return 'किसान';
        case 'consumer': return 'उपभोक्ता';
        case 'driver': return 'चालक';
      }
    } else {
      switch (role) {
        case 'farmer': return 'Farmer';
        case 'consumer': return 'Consumer';
        case 'driver': return 'Driver';
      }
    }
  };

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  const addRole = async (role: UserRole) => {
    if (!user || user.roles.includes(role)) return;
    
    const newRoles = [...user.roles, role];
    try {
      if (accessToken) {
        const updatedUser = await AuthService.updateUserRoles(accessToken, newRoles);
        setUser(updatedUser);
      } else {
        setUser({ ...user, roles: newRoles });
      }
    } catch (error) {
      console.error('Error adding role:', error);
      setUser({ ...user, roles: newRoles });
    }
  };

  const removeRole = async (role: UserRole) => {
    if (!user || user.roles.length <= 1 || !user.roles.includes(role)) return;
    
    const newRoles = user.roles.filter(r => r !== role);
    const newCurrentRole = role === user.currentRole ? newRoles[0] : user.currentRole;
    
    try {
      if (accessToken) {
        const updatedUser = await AuthService.updateUserRoles(accessToken, newRoles);
        if (role === user.currentRole) {
          const switchedUser = await AuthService.switchRole(accessToken, newCurrentRole);
          setUser(switchedUser);
        } else {
          setUser(updatedUser);
        }
      } else {
        setUser({ ...user, roles: newRoles, currentRole: newCurrentRole });
      }
    } catch (error) {
      console.error('Error removing role:', error);
      setUser({ ...user, roles: newRoles, currentRole: newCurrentRole });
    }
  };

  if (currentScreen === 'onboarding') {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1 border border-emerald-200 dark:border-emerald-700">
            <Sun className="h-4 w-4 text-orange-500" />
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            <Moon className="h-4 w-4 text-emerald-600" />
          </div>
        </div>
        <EnhancedOnboarding onComplete={handleOnboardingComplete} language={language} />
      </div>
    );
  }

  if (currentScreen === 'auth') {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
            className="text-xs bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-200 dark:border-emerald-700"
          >
            {language === 'en' ? 'नेपाली' : 'English'}
          </Button>
          <div className="flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1 border border-emerald-200 dark:border-emerald-700">
            <Sun className="h-4 w-4 text-orange-500" />
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            <Moon className="h-4 w-4 text-emerald-600" />
          </div>
        </div>
        <EnhancedAuth onLogin={handleLogin} language={language} />
      </div>
    );  
  }

  if (currentScreen === 'roleSelection') {
    return <EnhancedRoleSelection onRoleSelect={handleRoleSelection} language={language} />;
  }

  return (
    <RealTimeProvider user={user}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Enhanced Header */}
        <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-800 shadow-lg sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-green-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 hover:rotate-3 transition-all duration-300 hover:shadow-2xl group-hover:shadow-emerald-500/25" 
                     style={{
                       transform: 'perspective(1000px) rotateX(5deg) rotateY(-5deg)',
                       transition: 'all 0.3s ease-out'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'perspective(1000px) rotateX(-5deg) rotateY(5deg) scale(1.1)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(-5deg) scale(1)';
                     }}>
                  <Leaf className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  <Zap className="h-2 w-2 text-white" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-orange-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 cursor-default">
                  {t('KisanConnect', 'किसान कनेक्ट')}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                  {t('Smart • Sustainable • Social • AI-Powered', 'स्मार्ट • दिगो • सामाजिक • AI-संचालित')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Advanced Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transform hover:scale-110 transition-all duration-200"
                onClick={() => setShowAdvancedSearch(true)}
                style={{
                  transform: 'perspective(1000px) rotateY(-3deg)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateY(3deg) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateY(-3deg) scale(1)';
                }}
              >
                <Search className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </Button>

              {/* Notifications with Real-time Updates */}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transform hover:scale-110 transition-all duration-200"
                onClick={() => setShowMessaging(true)}
                style={{
                  transform: 'perspective(1000px) rotateY(3deg)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateY(-3deg) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateY(3deg) scale(1)';
                }}
              >
                <Bell className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white border-2 border-white dark:border-gray-800 animate-bounce">
                  3
                </Badge>
              </Button>

              {/* Enhanced Quick Access Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transform hover:scale-110 hover:rotate-12 transition-all duration-200"
                  >
                    <Settings className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-emerald-200 dark:border-emerald-700 shadow-2xl">
                  {/* Financial & Commerce */}
                  <div className="px-2 py-1">
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                      {t('Financial & Commerce', 'वित्तीय र व्यापार')}
                    </p>
                  </div>
                  <DropdownMenuItem onClick={() => setShowWallet(true)} className="gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                    <Wallet className="h-4 w-4 text-emerald-600" />
                    {t('Payment & Wallet', 'भुक्तानी र वालेट')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowFinancialHub(true)} className="gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    {t('Financial Hub', 'वित्तीय केन्द्र')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSocialCommerce(true)} className="gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                    <Gift className="h-4 w-4 text-pink-600" />
                    {t('Social Commerce', 'सामाजिक व्यापार')}
                  </DropdownMenuItem>

                  {/* Analytics & Intelligence */}
                  <div className="border-t border-emerald-100 dark:border-emerald-700 my-1"></div>
                  <div className="px-2 py-1">
                    <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">
                      {t('Analytics & Intelligence', 'विश्लेषण र बुद्धिमत्ता')}
                    </p>
                  </div>
                  <DropdownMenuItem onClick={() => setShowAnalytics(true)} className="gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    <BarChart3 className="h-4 w-4 text-orange-600" />
                    {t('Analytics', 'एनालिटिक्स')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowMarketIntelligence(true)} className="gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    <Compass className="h-4 w-4 text-blue-600" />
                    {t('Market Intelligence', 'बजार बुद्धिमत्ता')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowAIAssistant(true)} className="gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    <Brain className="h-4 w-4 text-purple-600" />
                    {t('AI Assistant', 'AI सहायक')}
                  </DropdownMenuItem>

                  {/* Operations & Logistics */}
                  <div className="border-t border-emerald-100 dark:border-emerald-700 my-1"></div>
                  <div className="px-2 py-1">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                      {t('Operations & Logistics', 'सञ्चालन र रसद')}
                    </p>
                  </div>
                  <DropdownMenuItem onClick={() => setShowAdvancedLogistics(true)} className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    {t('Advanced Logistics', 'उन्नत रसद')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    const recentOrders = OrderManager.getRecentOrders(1);
                    if (recentOrders.length > 0) {
                      setTrackingOrderId(recentOrders[0].id);
                      setOrderData(recentOrders[0]);
                      setShowOrderTracking(true);
                    }
                  }} className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    {t('Track Order', 'अर्डर ट्र्याक गर्नुहोस्')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowQuality(true)} className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Shield className="h-4 w-4 text-blue-600" />
                    {t('Quality Assurance', 'गुणस्तर आश्वासन')}
                  </DropdownMenuItem>

                  {/* Smart Tech & Social */}
                  <div className="border-t border-emerald-100 dark:border-emerald-700 my-1"></div>
                  <div className="px-2 py-1">
                    <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">
                      {t('Smart Tech & Social', 'स्मार्ट प्रविधि र सामाजिक')}
                    </p>
                  </div>
                  <DropdownMenuItem onClick={() => setShowSmartFarming(true)} className="gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <Cpu className="h-4 w-4 text-emerald-600" />
                    {t('Smart Farming', 'स्मार्ट खेती')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLiveStreaming(true)} className="gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <Video className="h-4 w-4 text-red-600" />
                    {t('Live Streaming', 'प्रत्यक्ष स्ट्रिमिङ')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowGamification(true)} className="gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                    {t('Achievements', 'उपलब्धिहरू')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowCommunity(true)} className="gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <Users className="h-4 w-4 text-blue-600" />
                    {t('Community', 'समुदाय')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowMessaging(true)} className="gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    {t('Messages', 'सन्देशहरू')}
                  </DropdownMenuItem>

                  {/* Accessibility & Settings */}
                  <div className="border-t border-emerald-100 dark:border-emerald-700 my-1"></div>
                  <DropdownMenuItem onClick={() => setShowAccessibilityCenter(true)} className="gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <Star className="h-4 w-4 text-indigo-600" />
                    {t('Accessibility', 'पहुँच सुविधा')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowIntegrationHub(true)} className="gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    {t('Integrations', 'एकीकरणहरू')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 h-10 px-3 py-2 text-xs font-medium border border-emerald-200 dark:border-emerald-700 bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-900/20 dark:to-orange-900/20 hover:from-emerald-100 hover:to-orange-100 dark:hover:from-emerald-900/30 dark:hover:to-orange-900/30 rounded-lg transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    >
                      <span className="text-sm">{getRoleIcon(user.currentRole)}</span>
                      <span className="text-xs max-w-16 truncate font-medium">{getRoleLabel(user.currentRole)}</span>
                      <ChevronDown className="h-3 w-3" />
                      {user.roles.length > 1 && (
                        <Badge className="ml-1 h-4 w-4 p-0 text-xs bg-emerald-500 text-white border-0">
                          {user.roles.length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200 dark:border-emerald-700">
                    {/* Current Roles Section */}
                    <div className="px-2 py-1">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {t('Your Roles', 'तपाईंका भूमिकाहरू')}
                      </p>
                    </div>
                    {user.roles.map((role) => (
                      <DropdownMenuItem
                        key={role}
                        onClick={() => switchRole(role)}
                        className="gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 mx-1 rounded-md"
                      >
                        <span className="text-base">{getRoleIcon(role)}</span>
                        <span className="text-sm font-medium flex-1">{getRoleLabel(role)}</span>
                        {role === user.currentRole && (
                          <Badge variant="secondary" className="text-xs bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200">
                            {t('Active', 'सक्रिय')}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    ))}
                    
                    {/* Available Roles Section */}
                    {(['farmer', 'consumer', 'driver'] as UserRole[]).filter(role => !user.roles.includes(role)).length > 0 && (
                      <>
                        <div className="border-t border-emerald-100 dark:border-emerald-700 my-1"></div>
                        <div className="px-2 py-1">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            {t('Add Role', 'भूमिका थप्नुहोस्')}
                          </p>
                        </div>
                        {(['farmer', 'consumer', 'driver'] as UserRole[]).filter(role => !user.roles.includes(role)).map((role) => (
                          <DropdownMenuItem
                            key={`add-${role}`}
                            onClick={() => addRole(role)}
                            className="gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 mx-1 rounded-md text-orange-600 dark:text-orange-400"
                          >
                            <Plus className="h-4 w-4" />
                            <span className="text-base">{getRoleIcon(role)}</span>
                            <span className="text-sm font-medium">{getRoleLabel(role)}</span>
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                    
                    {/* Manage Roles Section */}
                    <div className="border-t border-emerald-100 dark:border-emerald-700 my-1"></div>
                    <DropdownMenuItem
                      onClick={() => setShowRoleManagement(true)}
                      className="gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 mx-1 rounded-md"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="text-sm font-medium">{t('Manage Roles', 'भूमिकाहरू व्यवस्थापन गर्नुहोस्')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProfile(true)}
                className="h-10 w-10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto min-h-[calc(100vh-80px)]">
        {user?.currentRole === 'consumer' && (
          <ConsumerApp 
            user={user} 
            language={language} 
            accessToken={accessToken}
            supabase={supabase}
          />
        )}
        {user?.currentRole === 'farmer' && (
          <FarmerApp 
            user={user} 
            language={language} 
            accessToken={accessToken}
            supabase={supabase}
          />
        )}
        {user?.currentRole === 'driver' && (
          <DriverApp 
            user={user} 
            language={language} 
            accessToken={accessToken}
            supabase={supabase}
          />
        )}
      </main>

      {/* Enhanced 3D Floating Action Menu */}
      <div className="fixed bottom-6 right-4 z-40">
        {/* Primary Quick Actions Hub Button */}
        <Button
          onClick={() => setShowQuickActions(true)}
          className="w-18 h-18 rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-orange-500 hover:from-emerald-600 hover:via-green-600 hover:to-orange-600 shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-white dark:border-gray-800 mb-3 group relative overflow-hidden"
          size="icon"
          style={{
            transform: 'perspective(1000px) rotateX(15deg) rotateY(-15deg)',
            transformStyle: 'preserve-3d'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'perspective(1000px) rotateX(-5deg) rotateY(5deg) scale(1.1) translateZ(20px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'perspective(1000px) rotateX(15deg) rotateY(-15deg) scale(1) translateZ(0px)';
          }}
        >
          <div className="flex flex-col items-center relative z-10">
            <div className="flex items-center gap-1 mb-1">
              <Camera className="h-4 w-4 text-white group-hover:animate-bounce" />
              <Zap className="h-3 w-3 text-white group-hover:animate-pulse" />
            </div>
            <div className="text-xs text-white/90 font-medium group-hover:scale-110 transition-transform duration-200">
              {t('Quick Actions', 'द्रुत कार्यहरू')}
            </div>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/30 to-orange-400/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          <Plus className="absolute top-1 right-1 h-4 w-4 text-white/80 group-hover:rotate-90 transition-transform duration-300" />
        </Button>

        {/* Secondary Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Nepali Babu Chatbot */}
          <Button
            onClick={() => setShowChatbot(true)}
            className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white dark:border-gray-800 group"
            size="icon"
            style={{
              transform: 'perspective(1000px) rotateX(10deg) rotateY(-10deg)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(-5deg) rotateY(5deg) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(10deg) rotateY(-10deg) scale(1)';
            }}
          >
            <div className="text-lg group-hover:animate-bounce">🧑‍🌾</div>
          </Button>

          {/* Live Video */}
          <Button
            onClick={() => setShowLiveStreaming(true)}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white dark:border-gray-800 group"
            size="icon"
            style={{
              transform: 'perspective(1000px) rotateX(10deg) rotateY(-10deg)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(-5deg) rotateY(5deg) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(10deg) rotateY(-10deg) scale(1)';
            }}
          >
            <Video className="h-4 w-4 text-white group-hover:animate-pulse" />
          </Button>

          {/* Camera Upload */}
          <Button
            onClick={() => {
              setShowQuickActions(true);
              // Auto-trigger photo upload
              setTimeout(() => {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.multiple = true;
                fileInput.click();
              }, 100);
            }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white dark:border-gray-800 group"
            size="icon"
            style={{
              transform: 'perspective(1000px) rotateX(10deg) rotateY(-10deg)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(-5deg) rotateY(5deg) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(10deg) rotateY(-10deg) scale(1)';
            }}
          >
            <Camera className="h-4 w-4 text-white group-hover:animate-bounce" />
          </Button>

          {/* Voice Recording */}
          <Button
            onClick={() => {
              setShowQuickActions(true);
              // Auto-trigger voice recording
            }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white dark:border-gray-800 group"
            size="icon"
            style={{
              transform: 'perspective(1000px) rotateX(10deg) rotateY(-10deg)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(-5deg) rotateY(5deg) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(10deg) rotateY(-10deg) scale(1)';
            }}
          >
            <Mic className="h-4 w-4 text-white group-hover:animate-pulse" />
          </Button>
        </div>
      </div>

      {/* Floating Status Indicator */}
      {user && (
        <div className="fixed bottom-6 left-4 z-30">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg border border-emerald-200 dark:border-emerald-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {t('Online', 'अनलाइन')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Nepali Babu Chatbot */}
      {showChatbot && (
        <NepaliChatbot 
          onClose={() => setShowChatbot(false)} 
          language={language}
          user={user}
        />
      )}

        {/* Profile Settings */}
        {showProfile && (
          <ProfileSettings
            user={user}
            language={language}
            darkMode={darkMode}
            onLanguageChange={setLanguage}
            onDarkModeChange={setDarkMode}
            onClose={() => setShowProfile(false)}
            onUserUpdate={setUser}
          />
        )}

        {/* Advanced Feature Modals */}
        {showWallet && user && (
          <PaymentWalletSystem
            user={user}
            language={language}
            onClose={() => setShowWallet(false)}
            initialBalance={walletBalance}
          />
        )}

        {showAnalytics && user && (
          <AnalyticsDashboard
            user={user}
            language={language}
            role={user.currentRole}
          />
        )}

        {showOrderTracking && trackingOrderId && user && (
          <LiveOrderTracking
            orderId={trackingOrderId}
            user={user}
            language={language}
            onClose={() => setShowOrderTracking(false)}
            orderData={orderData}
          />
        )}

        {showMessaging && user && (
          <RealTimeMessaging
            user={user}
            language={language}
            onClose={() => setShowMessaging(false)}
          />
        )}

        {showQuality && user && (
          <QualityAssuranceSystem
            user={user}
            language={language}
            onClose={() => setShowQuality(false)}
          />
        )}

        {showSmartFarming && user && (
          <SmartFarmingHub
            user={user}
            language={language}
            onClose={() => setShowSmartFarming(false)}
          />
        )}

        {showAIAssistant && user && (
          <AIFarmingAssistant
            user={user}
            language={language}
            onClose={() => setShowAIAssistant(false)}
          />
        )}

        {showCommunity && user && (
          <CommunityKnowledgeHub
            user={user}
            language={language}
            onClose={() => setShowCommunity(false)}
          />
        )}

        {showRoleManagement && user && (
          <RoleManagement
            user={user}
            language={language}
            onClose={() => setShowRoleManagement(false)}
            onUpdateRoles={async (roles) => {
              try {
                if (accessToken) {
                  const updatedUser = await AuthService.updateUserRoles(accessToken, roles);
                  setUser(updatedUser);
                } else {
                  setUser({ ...user, roles });
                }
              } catch (error) {
                console.error('Error updating roles:', error);
                setUser({ ...user, roles });
              }
            }}
            onSwitchRole={switchRole}
          />
        )}

        {/* Next-Generation Features */}
        {showAdvancedSearch && user && (
          <AdvancedSearchDiscovery
            user={user}
            language={language}
            onClose={() => setShowAdvancedSearch(false)}
          />
        )}

        {showLiveStreaming && user && (
          <LiveVideoStreaming
            user={user}
            language={language}
            onClose={() => setShowLiveStreaming(false)}
          />
        )}

        {showSocialCommerce && user && (
          <SocialCommerce
            user={user}
            language={language}
            onClose={() => setShowSocialCommerce(false)}
          />
        )}

        {showAdvancedLogistics && user && (
          <AdvancedLogistics
            user={user}
            language={language}
            onClose={() => setShowAdvancedLogistics(false)}
          />
        )}

        {showFinancialHub && user && (
          <FinancialHub
            user={user}
            language={language}
            onClose={() => setShowFinancialHub(false)}
          />
        )}

        {showMarketIntelligence && user && (
          <MarketIntelligence
            user={user}
            language={language}
            onClose={() => setShowMarketIntelligence(false)}
          />
        )}

        {showGamification && user && (
          <GamificationSystem
            user={user}
            language={language}
            onClose={() => setShowGamification(false)}
          />
        )}

        {showOfflineSupport && user && (
          <OfflineSupport
            user={user}
            language={language}
            onClose={() => setShowOfflineSupport(false)}
          />
        )}

        {showAdvancedProfiles && user && (
          <AdvancedProfiles
            user={user}
            language={language}
            onClose={() => setShowAdvancedProfiles(false)}
          />
        )}

        {showIntegrationHub && user && (
          <IntegrationHub
            user={user}
            language={language}
            onClose={() => setShowIntegrationHub(false)}
          />
        )}

        {showAccessibilityCenter && user && (
          <AccessibilityCenter
            user={user}
            language={language}
            onClose={() => setShowAccessibilityCenter(false)}
          />
        )}

        {/* Quick Actions Hub */}
        {showQuickActions && user && (
          <QuickActionsHub
            user={user}
            language={language}
            onClose={() => setShowQuickActions(false)}
            onActionComplete={(action, data) => {
              console.log('Quick action completed:', action, data);
              // Handle completed actions here
              if (action === 'media-upload') {
                setWalletBalance(prev => prev + 10); // Reward for content sharing
                WalletManager.addTransaction(10, 'reward', 'Content sharing reward');
              }
            }}
          />
        )}
      </div>
    </RealTimeProvider>
  );
}