import React, { useState } from 'react';
import { X, DollarSign, TrendingUp, PiggyBank, CreditCard, Shield, AlertTriangle, CheckCircle, Target, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import type { User, Language } from '../App';

interface FinancialHubProps {
  user: User;
  language: Language;
  onClose: () => void;
}

export function FinancialHub({ user, language, onClose }: FinancialHubProps) {
  const [currentTab, setCurrentTab] = useState('loans');

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200 dark:border-emerald-700 shadow-2xl"
            style={{
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-emerald-100 dark:border-emerald-700">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            {t('Financial Hub', 'वित्तीय केन्द्र')}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-green-50 dark:bg-green-900/20">
              <TabsTrigger value="loans" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {t('Micro Loans', 'सूक्ष्म ऋण')}
              </TabsTrigger>
              <TabsTrigger value="insurance" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t('Insurance', 'बीमा')}
              </TabsTrigger>
              <TabsTrigger value="savings" className="flex items-center gap-2">
                <PiggyBank className="h-4 w-4" />
                {t('Savings', 'बचत')}
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                {t('Invoices', 'बिलहरू')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="loans" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <DollarSign className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Micro Lending Program', 'सूक्ष्म ऋण कार्यक्रम')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Get small loans for farming equipment and seeds', 'खेतीका उपकरण र बीउका लागि सानो ऋण लिनुहोस्')}
                </p>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {t('Apply for Loan', 'ऋणका लागि आवेदन दिनुहोस्')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="insurance" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <Shield className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Crop Insurance', 'बाली बीमा')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Protect your crops from weather and other risks', 'आफ्ना बालीहरूलाई मौसम र अन्य जोखिमहरूबाट सुरक्षित गर्नुहोस्')}
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200">
                  <Shield className="h-4 w-4 mr-2" />
                  {t('Get Insurance', 'बीमा लिनुहोस्')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="savings" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <PiggyBank className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Savings Goals', 'बचत लक्ष्यहरू')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Save money for future farming investments', 'भविष्यका खेती लगानीका लागि पैसा बचत गर्नुहोस्')}
                </p>
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200">
                  <PiggyBank className="h-4 w-4 mr-2" />
                  {t('Start Saving', 'बचत सुरु गर्नुहोस्')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="invoices" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <BarChart3 className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Invoice Management', 'बिल व्यवस्थापन')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Manage digital receipts and tax compliance', 'डिजिटल रसिद र कर अनुपालन व्यवस्थापन गर्नुहोस्')}
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {t('Manage Invoices', 'बिलहरू व्यवस्थापन गर्नुहोस्')}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}