import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Users, Package, MapPin, Clock, Star, Zap, Target, Award, Calendar, RefreshCw, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { User, Language } from '../App';

interface AnalyticsData {
  sales: {
    total: number;
    growth: number;
    orders: number;
    averageOrderValue: number;
  };
  inventory: {
    totalProducts: number;
    lowStock: number;
    outOfStock: number;
    topSelling: string[];
  };
  customers: {
    total: number;
    new: number;
    retention: number;
    satisfaction: number;
  };
  delivery: {
    onTime: number;
    averageTime: number;
    customerRating: number;
    completedDeliveries: number;
  };
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    growth: number;
  };
}

interface ChartData {
  name: string;
  value: number;
  growth?: number;
  orders?: number;
  revenue?: number;
}

interface Props {
  user: User;
  language: Language;
  role: 'farmer' | 'consumer' | 'driver';
}

export const AnalyticsDashboard: React.FC<Props> = ({ user, language, role }) => {
  const [timeframe, setTimeframe] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    sales: {
      total: 125000,
      growth: 12.5,
      orders: 234,
      averageOrderValue: 534
    },
    inventory: {
      totalProducts: 45,
      lowStock: 8,
      outOfStock: 2,
      topSelling: ['Tomatoes', 'Rice', 'Potatoes', 'Onions']
    },
    customers: {
      total: 1250,
      new: 89,
      retention: 87.5,
      satisfaction: 4.6
    },
    delivery: {
      onTime: 94.2,
      averageTime: 25,
      customerRating: 4.8,
      completedDeliveries: 156
    },
    revenue: {
      today: 8500,
      thisWeek: 45000,
      thisMonth: 189000,
      growth: 18.7
    }
  });

  const [salesData] = useState<ChartData[]>([
    { name: 'Mon', value: 12000, orders: 25 },
    { name: 'Tue', value: 15000, orders: 32 },
    { name: 'Wed', value: 8000, orders: 18 },
    { name: 'Thu', value: 18000, orders: 41 },
    { name: 'Fri', value: 22000, orders: 52 },
    { name: 'Sat', value: 28000, orders: 68 },
    { name: 'Sun', value: 25000, orders: 58 }
  ]);

  const [categoryData] = useState<ChartData[]>([
    { name: 'Vegetables', value: 45000 },
    { name: 'Fruits', value: 32000 },
    { name: 'Grains', value: 28000 },
    { name: 'Dairy', value: 15000 },
    { name: 'Others', value: 8000 }
  ]);

  const [deliveryData] = useState<ChartData[]>([
    { name: 'On Time', value: 94 },
    { name: 'Delayed', value: 6 }
  ]);

  const [performanceData] = useState<ChartData[]>([
    { name: 'Jan', revenue: 120000, orders: 340 },
    { name: 'Feb', revenue: 135000, orders: 380 },
    { name: 'Mar', revenue: 148000, orders: 420 },
    { name: 'Apr', revenue: 162000, orders: 456 },
    { name: 'May', revenue: 178000, orders: 495 },
    { name: 'Jun', revenue: 189000, orders: 523 }
  ]);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? 'text-emerald-600' : 'text-red-600';
  };

  const COLORS = ['#27AE60', '#F2994A', '#16A34A', '#F59E0B', '#EF4444'];

  const renderFarmerAnalytics = () => (
    <>
      {/* Revenue Overview */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('Total Sales', 'कुल बिक्री')}</span>
              {getGrowthIcon(analyticsData.sales.growth)}
            </div>
            <p className="text-xl font-bold">{formatCurrency(analyticsData.sales.total)}</p>
            <p className={`text-xs ${getGrowthColor(analyticsData.sales.growth)}`}>
              +{analyticsData.sales.growth}% {t('vs last week', 'गत हप्ताको तुलनामा')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('Orders', 'अर्डरहरू')}</span>
              <Package className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-xl font-bold">{analyticsData.sales.orders}</p>
            <p className="text-xs text-gray-600">
              {t('Avg:', 'औसत:')} {formatCurrency(analyticsData.sales.averageOrderValue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            {t('Sales Trend', 'बिक्री प्रवृत्ति')}
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7D</SelectItem>
                <SelectItem value="30d">30D</SelectItem>
                <SelectItem value="90d">90D</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value as number), t('Sales', 'बिक्री')]} />
              <Area type="monotone" dataKey="value" stroke="#27AE60" fill="#27AE60" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">{t('Inventory Status', 'इन्भेन्टरी स्थिति')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">{t('Total Products', 'कुल उत्पादनहरू')}</span>
              <Badge variant="secondary">{analyticsData.inventory.totalProducts}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t('Low Stock', 'कम स्टक')}</span>
              <Badge className="bg-yellow-100 text-yellow-800">{analyticsData.inventory.lowStock}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t('Out of Stock', 'स्टक सकियो')}</span>
              <Badge className="bg-red-100 text-red-800">{analyticsData.inventory.outOfStock}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('Top Selling Products', 'धेरै बिकने उत्पादनहरू')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analyticsData.inventory.topSelling.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs">
                    {index + 1}
                  </Badge>
                  <span className="text-sm">{product}</span>
                </div>
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderConsumerAnalytics = () => (
    <>
      {/* Purchase Overview */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('Total Spent', 'कुल खर्च')}</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-xl font-bold">{formatCurrency(45000)}</p>
            <p className="text-xs text-emerald-600">
              +15% {t('vs last month', 'गत महिनाको तुलनामा')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('Orders', 'अर्डरहरू')}</span>
              <Package className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-xl font-bold">84</p>
            <p className="text-xs text-gray-600">
              {t('Avg:', 'औसत:')} {formatCurrency(536)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Spending */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">{t('Spending by Category', 'श्रेणी अनुसार खर्च')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Delivery Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('Delivery Experience', 'डेलिभरी अनुभव')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('On-time Delivery', 'समयमा डेलिभरी')}</span>
              <div className="flex items-center gap-2">
                <Progress value={96} className="w-16 h-2" />
                <span className="text-sm font-medium">96%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('Avg Delivery Time', 'औसत डेलिभरी समय')}</span>
              <span className="text-sm font-medium">23 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('Delivery Rating', 'डेलिभरी मूल्याङ्कन')}</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.8</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderDriverAnalytics = () => (
    <>
      {/* Delivery Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('Completed', 'सम्पन्न')}</span>
              <Target className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-xl font-bold">{analyticsData.delivery.completedDeliveries}</p>
            <p className="text-xs text-emerald-600">
              +12% {t('vs last week', 'गत हप्ताको तुलनामा')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('Rating', 'मूल्याङ्कन')}</span>
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-xl font-bold">{analyticsData.delivery.customerRating}</p>
            <p className="text-xs text-gray-600">
              {t('Customer Rating', 'ग्राहक मूल्याङ्कन')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">{t('Performance Metrics', 'प्रदर्शन मेट्रिक्स')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">{t('On-time Delivery', 'समयमा डेलिभरी')}</span>
                <span className="text-sm font-bold text-emerald-600">
                  {analyticsData.delivery.onTime}%
                </span>
              </div>
              <Progress value={analyticsData.delivery.onTime} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">{t('Average Delivery Time', 'औसत डेलिभरी समय')}</span>
                <span className="text-sm font-bold">{analyticsData.delivery.averageTime} min</span>
              </div>
              <Progress value={(60 - analyticsData.delivery.averageTime) / 60 * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Areas */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">{t('Delivery Areas', 'डेलिभरी क्षेत्रहरू')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { area: 'Kathmandu', deliveries: 45, rating: 4.9 },
              { area: 'Lalitpur', deliveries: 32, rating: 4.8 },
              { area: 'Bhaktapur', deliveries: 28, rating: 4.7 },
              { area: 'Kirtipur', deliveries: 15, rating: 4.6 }
            ].map((area, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium">{area.area}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{area.deliveries}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{area.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Earnings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('Earnings Overview', 'आम्दानी विवरण')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">{t('Today', 'आज')}</span>
              <span className="font-bold text-emerald-600">{formatCurrency(2500)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t('This Week', 'यो हप्ता')}</span>
              <span className="font-bold text-emerald-600">{formatCurrency(18500)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t('This Month', 'यो महिना')}</span>
              <span className="font-bold text-emerald-600">{formatCurrency(75000)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-900/20 dark:to-orange-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">{t('Analytics Dashboard', 'एनालिटिक्स ड्यासबोर्ड')}</h2>
              <p className="text-sm text-gray-600">
                {t('Track your performance and insights', 'तपाईंको प्रदर्शन र अन्तर्दृष्टि ट्र्याक गर्नुहोस्')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific Analytics */}
      {role === 'farmer' && renderFarmerAnalytics()}
      {role === 'consumer' && renderConsumerAnalytics()}
      {role === 'driver' && renderDriverAnalytics()}

      {/* Performance Insights (Common) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            {t('AI Insights', 'AI अन्तर्दृष्टि')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
                {role === 'farmer' && t('Your tomatoes are trending! Consider increasing production.', 'तपाईंका गोलभेडाहरू ट्रेन्डिङमा छन्! उत्पादन बढाउने विचार गर्नुहोस्।')}
                {role === 'consumer' && t('You save 15% more when ordering on weekdays.', 'हप्ताका दिनहरूमा अर्डर गर्दा तपाईं १५% बढी बचत गर्नुहुन्छ।')}
                {role === 'driver' && t('Peak delivery hours: 11 AM - 2 PM and 6 PM - 9 PM.', 'शिखर डेलिभरी समय: बिहान ११ बजे - दिउँसो २ बजे र साँझ ६ बजे - रात ९ बजे।')}
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-400">
                {role === 'farmer' && t('Weekend sales are 23% higher than weekdays.', 'सप्ताहन्तको बिक्री कार्यदिवसको तुलनामा २३% बढी छ।')}
                {role === 'consumer' && t('Bulk orders can save you up to 20% on vegetables.', 'बल्क अर्डरले तपाईंलाई तरकारीहरूमा २०% सम्म बचत गराउन सक्छ।')}
                {role === 'driver' && t('Your customer rating improved by 0.2 points this month!', 'यो महिना तपाईंको ग्राहक मूल्याङ्कन ०.२ अंकले सुधार भयो!')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};