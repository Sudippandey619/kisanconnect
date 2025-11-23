import React, { useState } from 'react';
import { Phone, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Language } from '../App';

interface AuthScreenProps {
  onLogin: (phone: string, otp: string) => void;
  language: Language;
}

export function AuthScreen({ onLogin, language }: AuthScreenProps) {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  const handleSendOTP = async () => {
    setError('');
    
    if (authMethod === 'email' && !email) {
      setError(t('Please enter your email address', 'कृपया आफ्नो इमेल ठेगाना प्रविष्ट गर्नुहोस्'));
      return;
    }
    
    if (authMethod === 'phone' && !phone) {
      setError(t('Please enter your phone number', 'कृपया आफ्नो फोन नम्बर प्रविष्ट गर्नुहोस्'));
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setStep('verify');
      setLoading(false);
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError(t('Please enter the verification code', 'कृपया प्रमाणिकरण कोड प्रविष्ट गर्नुहोस्'));
      return;
    }

    setLoading(true);
    setError('');

    // Simulate verification
    setTimeout(() => {
      if (otp === '123456') {
        onLogin(authMethod === 'phone' ? phone : email, otp);
      } else {
        setError(t('Invalid verification code', 'अवैध प्रमाणिकरण कोड'));
      }
      setLoading(false);
    }, 1000);
  };

  const handleBack = () => {
    setStep('input');
    setOtp('');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-8 w-40 h-40 bg-emerald-200/20 dark:bg-emerald-800/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-12 w-36 h-36 bg-orange-200/20 dark:bg-orange-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-green-200/20 dark:bg-green-800/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-md w-full mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-500 via-green-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 via-green-600 to-orange-600 bg-clip-text text-transparent">
            {t('Welcome Back', 'स्वागत फिर्ता')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('Sign in to continue to KisanConnect', 'किसान कनेक्टमा जारी राख्न साइन इन गर्नुहोस्')}
          </p>
        </div>

        {/* Main Auth Card */}
        <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-2xl">
          {step === 'input' ? (
            <>
              {/* Auth Method Tabs */}
              <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as 'email' | 'phone')} className="mb-6">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700">
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('Email', 'इमेल')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="flex items-center gap-2 relative">
                    <Phone className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('Phone', 'फोन')}</span>
                    <Badge className="absolute -top-2 -right-2 text-xs bg-orange-500 text-white px-1 py-0.5">
                      {t('Soon', 'छिट्टै')}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      {t('Email Address', 'इमेल ठेगाना')}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('Enter your email', 'आफ्नो इमेल प्रविष्ट गर्नुहोस्')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <Alert className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-emerald-700 dark:text-emerald-300">
                      {t('We\'ll send you a one-time verification code', 'हामी तपाईंलाई एक पटकको प्रमाणिकरण कोड पठाउनेछौं')}
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="phone" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      {t('Phone Number', 'फोन नम्बर')}
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+977 98X-XXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500"
                        disabled
                      />
                    </div>
                  </div>

                  <Alert className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-700 dark:text-orange-300">
                      {t('Phone authentication coming soon via Sparrow SMS integration', 'Sparrow SMS एकीकरण मार्फत फोन प्रमाणीकरण चाँडै आउँदैछ')}
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>

              {error && (
                <Alert className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleSendOTP}
                disabled={loading || authMethod === 'phone'}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t('Sending...', 'पठाउँदै...')}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {t('Send Verification Code', 'प्रमाणिकरण कोड पठाउनुहोस्')}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* OTP Verification */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-orange-100 dark:from-emerald-900 dark:to-orange-900 rounded-2xl flex items-center justify-center">
                  <Lock className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold mb-2">
                  {t('Verify Your Account', 'आफ्नो खाता प्रमाणित गर्नुहोस्')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('Enter the 6-digit code sent to', '6-अंकको कोड प्रविष्ट गर्नुहोस् जुन पठाइएको थियो')}
                </p>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {authMethod === 'email' ? email : phone}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">
                    {t('Verification Code', 'प्रमाणिकरण कोड')}
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl font-mono tracking-widest h-14 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500"
                    maxLength={6}
                  />
                </div>

                {error && (
                  <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700 dark:text-red-300">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button 
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 h-12 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {t('Back', 'पछाडि')}
                  </Button>
                  <Button 
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {t('Verifying...', 'प्रमाणित गर्दै...')}
                      </div>
                    ) : (
                      t('Verify', 'प्रमाणित गर्नुहोस्')
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleSendOTP}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    {t('Resend Code', 'कोड फेरि पठाउनुहोस्')}
                  </Button>
                </div>
              </div>

              <Alert className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700 dark:text-blue-300 text-xs">
                  {t('Demo: Use code 123456 to continue', 'डेमो: जारी राख्न कोड 123456 प्रयोग गर्नुहोस्')}
                </AlertDescription>
              </Alert>
            </>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('By continuing, you agree to our Terms & Privacy Policy', 'जारी राखेर, तपाईं हाम्रो सर्त र गोपनीयता नीतिमा सहमत हुनुहुन्छ')}
          </p>
          <div className="flex justify-center items-center gap-2 text-xs text-gray-400">
            <span>🔒</span>
            <span>{t('Secured with end-to-end encryption', 'End-to-end encryption सँग सुरक्षित')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}