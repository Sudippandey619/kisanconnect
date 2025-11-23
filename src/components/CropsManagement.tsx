import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Eye, Calendar, MapPin, TrendingUp, BarChart3, Camera, Save, X, Sprout, Droplets, Sun, Thermometer, DollarSign, Clock, Target, RefreshCw, Package, AlertTriangle, CheckCircle2, Package2, Search, Filter, Grid, List, Download, Upload, Share2, Bell, Activity, Zap, LineChart, PieChart, BarChart4, Map, CloudRain, Lightbulb, Award, Users, MessageSquare, Heart, Star, Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Alert, AlertDescription } from './ui/alert';
import { User, Language } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';

interface Crop {
  id: string;
  name: string;
  nameNepali: string;
  category: string;
  variety: string;
  plantedDate: string;
  expectedHarvest: string;
  actualHarvest?: string;
  status: 'planted' | 'growing' | 'flowering' | 'fruiting' | 'harvested' | 'sold';
  statusNepali: string;
  area: number;
  totalSeeds: number;
  currentStock: number;
  pricePerKg: number;
  marketPrice: number;
  image: string;
  description: string;
  location: {
    field: string;
    coordinates?: { lat: number; lng: number };
  };
  weather: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
  care: {
    lastWatered: string;
    lastFertilized: string;
    pestControl: string;
  };
  quality: {
    grade: 'A' | 'B' | 'C';
    organic: boolean;
    certified: boolean;
  };
  expenses: {
    seeds: number;
    fertilizer: number;
    pesticide: number;
    labor: number;
    other: number;
  };
  notes: string[];
  images: string[];
  buyers: string[];
  revenue: number;
  expectedYield?: number;
  actualYield?: number;
  diseaseHistory?: string[];
  fertilizationSchedule?: Array<{
    date: string;
    type: string;
    amount: string;
  }>;
  harvestSchedule?: Array<{
    date: string;
    expectedQuantity: number;
    notes: string;
  }>;
  soilData?: {
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  irrigation?: {
    method: string;
    frequency: string;
    lastIrrigation: string;
  };
  marketAnalysis?: {
    demandLevel: 'low' | 'medium' | 'high';
    priceProjection: number;
    competitors: number;
  };
}

interface CropsManagementProps {
  user: User;
  language: Language;
  onClose: () => void;
}

const cropCategories = [
  { value: 'vegetables', label: 'Vegetables', labelNepali: 'तरकारी' },
  { value: 'fruits', label: 'Fruits', labelNepali: 'फलफूल' },
  { value: 'grains', label: 'Grains', labelNepali: 'अनाज' },
  { value: 'spices', label: 'Spices', labelNepali: 'मसला' },
  { value: 'herbs', label: 'Herbs', labelNepali: 'जडिबुटी' }
];

const cropVarieties = {
  vegetables: ['Tomato', 'Potato', 'Onion', 'Cabbage', 'Cauliflower', 'Carrot', 'Radish', 'Spinach', 'Cucumber', 'Brinjal'],
  fruits: ['Apple', 'Banana', 'Orange', 'Mango', 'Papaya', 'Guava', 'Pomegranate', 'Grapes', 'Strawberry'],
  grains: ['Rice', 'Wheat', 'Maize', 'Barley', 'Millet', 'Sorghum'],
  spices: ['Turmeric', 'Ginger', 'Garlic', 'Chili', 'Coriander', 'Cumin', 'Cardamom'],
  herbs: ['Mint', 'Coriander', 'Basil', 'Thyme', 'Rosemary', 'Oregano']
};

const statusOptions = [
  { value: 'planted', label: 'Planted', labelNepali: 'रोपिएको' },
  { value: 'growing', label: 'Growing', labelNepali: 'बढ्दै' },
  { value: 'flowering', label: 'Flowering', labelNepali: 'फुल्दै' },
  { value: 'fruiting', label: 'Fruiting', labelNepali: 'फल लाग्दै' },
  { value: 'harvested', label: 'Harvested', labelNepali: 'कटनी भएको' },
  { value: 'sold', label: 'Sold', labelNepali: 'बिक्री भएको' }
];

const initialCrops: Crop[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    nameNepali: 'ताजा गोलभेंडा',
    category: 'vegetables',
    variety: 'Tomato',
    plantedDate: '2024-01-15',
    expectedHarvest: '2024-04-15',
    status: 'fruiting',
    statusNepali: 'फल लाग्दै',
    area: 2.5,
    totalSeeds: 500,
    currentStock: 150,
    pricePerKg: 80,
    marketPrice: 85,
    image: 'https://images.unsplash.com/photo-1546470427-e5869c9b1b0e?w=400',
    description: 'High quality tomatoes grown using organic methods',
    location: {
      field: 'Field A1'
    },
    weather: {
      temperature: 25,
      humidity: 65,
      rainfall: 120
    },
    care: {
      lastWatered: '2024-01-20',
      lastFertilized: '2024-01-18',
      pestControl: 'Neem oil spray'
    },
    quality: {
      grade: 'A',
      organic: true,
      certified: true
    },
    expenses: {
      seeds: 2000,
      fertilizer: 5000,
      pesticide: 1500,
      labor: 8000,
      other: 1000
    },
    notes: ['Good growth rate', 'Regular watering needed'],
    images: ['https://images.unsplash.com/photo-1546470427-e5869c9b1b0e?w=400'],
    buyers: ['Krishna Store', 'Local Market'],
    revenue: 12000,
    expectedYield: 300,
    actualYield: 280,
    soilData: {
      ph: 6.5,
      nitrogen: 45,
      phosphorus: 30,
      potassium: 35
    },
    irrigation: {
      method: 'Drip irrigation',
      frequency: 'Daily',
      lastIrrigation: '2024-01-20'
    },
    marketAnalysis: {
      demandLevel: 'high',
      priceProjection: 90,
      competitors: 5
    }
  },
  {
    id: '2',
    name: 'Organic Carrots',
    nameNepali: 'जैविक गाजर',
    category: 'vegetables',
    variety: 'Carrot',
    plantedDate: '2024-02-01',
    expectedHarvest: '2024-05-01',
    status: 'growing',
    statusNepali: 'बढ्दै',
    area: 1.5,
    totalSeeds: 300,
    currentStock: 0,
    pricePerKg: 60,
    marketPrice: 65,
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400',
    description: 'Organic carrots with natural farming methods',
    location: {
      field: 'Field B2'
    },
    weather: {
      temperature: 22,
      humidity: 70,
      rainfall: 80
    },
    care: {
      lastWatered: '2024-01-19',
      lastFertilized: '2024-01-15',
      pestControl: 'Organic neem'
    },
    quality: {
      grade: 'A',
      organic: true,
      certified: true
    },
    expenses: {
      seeds: 1500,
      fertilizer: 3000,
      pesticide: 500,
      labor: 4000,
      other: 500
    },
    notes: ['Soil pH adjusted', 'Growing well'],
    images: ['https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400'],
    buyers: [],
    revenue: 0,
    expectedYield: 180,
    soilData: {
      ph: 6.8,
      nitrogen: 40,
      phosphorus: 25,
      potassium: 30
    },
    irrigation: {
      method: 'Sprinkler',
      frequency: 'Alternate days',
      lastIrrigation: '2024-01-19'
    },
    marketAnalysis: {
      demandLevel: 'medium',
      priceProjection: 70,
      competitors: 3
    }
  }
];

export function CropsManagement({ user, language, onClose }: CropsManagementProps) {
  const [crops, setCrops] = useState<Crop[]>(initialCrops);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showCropDetails, setShowCropDetails] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Load crops from localStorage
  useEffect(() => {
    const savedCrops = localStorage.getItem('kisanconnect:crops');
    if (savedCrops) {
      setCrops(JSON.parse(savedCrops));
    }
  }, []);

  // Save crops to localStorage
  const saveCrops = (updatedCrops: Crop[]) => {
    setCrops(updatedCrops);
    localStorage.setItem('kisanconnect:crops', JSON.stringify(updatedCrops));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      growing: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      flowering: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      fruiting: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      harvested: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      sold: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getGrowthProgress = (crop: Crop) => {
    const planted = new Date(crop.plantedDate);
    const expected = new Date(crop.expectedHarvest);
    const now = new Date();
    
    const totalDays = Math.ceil((expected.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((now.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);
  };

  const getDaysToHarvest = (crop: Crop) => {
    const expected = new Date(crop.expectedHarvest);
    const now = new Date();
    const diff = Math.ceil((expected.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const addCrop = (newCrop: Omit<Crop, 'id'>) => {
    const crop: Crop = {
      ...newCrop,
      id: Date.now().toString()
    };
    const updatedCrops = [...crops, crop];
    saveCrops(updatedCrops);
    setShowAddCrop(false);
  };

  const updateCrop = (updatedCrop: Crop) => {
    const updatedCrops = crops.map(crop => 
      crop.id === updatedCrop.id ? updatedCrop : crop
    );
    saveCrops(updatedCrops);
    setEditingCrop(null);
  };

  const updateCropStatus = (cropId: string, newStatus: Crop['status']) => {
    const statusMap = {
      planted: 'रोपिएको',
      growing: 'बढ्दै',
      flowering: 'फुल्दै',
      fruiting: 'फल लाग्दै',
      harvested: 'कटनी भएको',
      sold: 'बिक्री भएको'
    };

    const updatedCrops = crops.map(crop => 
      crop.id === cropId 
        ? { ...crop, status: newStatus, statusNepali: statusMap[newStatus] }
        : crop
    );
    saveCrops(updatedCrops);
  };

  const deleteCrop = (cropId: string) => {
    const updatedCrops = crops.filter(crop => crop.id !== cropId);
    saveCrops(updatedCrops);
  };

  // Filter and sort crops
  const filteredCrops = crops
    .filter(crop => {
      const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           crop.nameNepali.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           crop.variety.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || crop.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'planted':
          return new Date(b.plantedDate).getTime() - new Date(a.plantedDate).getTime();
        case 'harvest':
          return new Date(a.expectedHarvest).getTime() - new Date(b.expectedHarvest).getTime();
        case 'revenue':
          return b.revenue - a.revenue;
        case 'area':
          return b.area - a.area;
        default:
          return 0;
      }
    });

  // Calculate enhanced statistics
  const stats = {
    totalCrops: crops.length,
    activeCrops: crops.filter(c => !['harvested', 'sold'].includes(c.status)).length,
    totalRevenue: crops.reduce((sum, crop) => sum + crop.revenue, 0),
    totalExpenses: crops.reduce((sum, crop) => 
      sum + Object.values(crop.expenses).reduce((expSum, exp) => expSum + exp, 0), 0),
    totalArea: crops.reduce((sum, crop) => sum + crop.area, 0),
    avgYield: crops.length > 0 ? crops.reduce((sum, crop) => sum + (crop.actualYield || crop.expectedYield || 0), 0) / crops.length : 0,
    organicCrops: crops.filter(c => c.quality.organic).length,
    certifiedCrops: crops.filter(c => c.quality.certified).length,
    cropsToHarvest: crops.filter(c => getDaysToHarvest(c) <= 30 && !['harvested', 'sold'].includes(c.status)).length
  };

  const totalProfit = stats.totalRevenue - stats.totalExpenses;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl max-h-[95vh] overflow-hidden bg-white dark:bg-gray-800 shadow-2xl">
        <CardHeader className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t('Advanced Crops Management', 'उन्नत बाली व्यवस्थापन')}</h2>
                <p className="text-sm text-muted-foreground">
                  {t('Complete crop lifecycle management from seed to sale', 'बीउदेखि बिक्रीसम्म सम्पूर्ण बाली जीवनचक्र व्यवस्थापन')}
                </p>
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="shadow-sm"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                {t('Export', 'निर्यात')}
              </Button>
              <Button 
                onClick={() => setShowAddCrop(true)} 
                className="bg-emerald-500 hover:bg-emerald-600 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('Add Crop', 'बाली थप्नुहोस्')}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="flex flex-1 overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-6 bg-gray-100 dark:bg-gray-700">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t('Overview', 'सिंहावलोकन')}
                </TabsTrigger>
                <TabsTrigger value="crops" className="flex items-center gap-2">
                  <Sprout className="h-4 w-4" />
                  {t('Crops', 'बालीहरू')}
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  {t('Analytics', 'विश्लेषण')}
                </TabsTrigger>
                <TabsTrigger value="planning" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('Planning', 'योजना')}
                </TabsTrigger>
                <TabsTrigger value="market" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t('Market', 'बजार')}
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  {t('Insights', 'अन्तर्दृष्टि')}
                </TabsTrigger>
              </TabsList>

              {/* Enhanced Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Alert for urgent actions */}
                {stats.cropsToHarvest > 0 && (
                  <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription>
                      <span className="font-medium text-orange-800 dark:text-orange-200">
                        {stats.cropsToHarvest} {t('crops need harvesting within 30 days', 'बालीहरू ३० दिनभित्र कटनी आवश्यक')}
                      </span>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Enhanced Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { 
                      label: t('Total Crops', 'कुल बालीहरू'), 
                      value: stats.totalCrops, 
                      icon: Sprout, 
                      color: 'emerald',
                      trend: '+2',
                      subtitle: t(`${stats.activeCrops} active`, `${stats.activeCrops} सक्रिय`)
                    },
                    { 
                      label: t('Total Area', 'कुल क्षेत्रफल'), 
                      value: `${stats.totalArea} ${t('ropani', 'रोपनी')}`, 
                      icon: MapPin, 
                      color: 'blue',
                      trend: '+0.5',
                      subtitle: t('farming area', 'खेती क्षेत्र')
                    },
                    { 
                      label: t('Revenue', 'आम्दानी'), 
                      value: `रु. ${stats.totalRevenue.toLocaleString()}`, 
                      icon: TrendingUp, 
                      color: 'green',
                      trend: '+12%',
                      subtitle: t('this season', 'यस सिजन')
                    },
                    { 
                      label: t('Net Profit', 'नेट नाफा'), 
                      value: `रु. ${totalProfit.toLocaleString()}`, 
                      icon: Target, 
                      color: totalProfit >= 0 ? 'emerald' : 'red',
                      trend: totalProfit >= 0 ? '+8%' : '-3%',
                      subtitle: t('profit margin', 'नाफा मार्जिन')
                    },
                    { 
                      label: t('Avg Yield', 'औसत उत्पादन'), 
                      value: `${Math.round(stats.avgYield)} kg`, 
                      icon: Award, 
                      color: 'orange',
                      trend: '+5kg',
                      subtitle: t('per crop', 'प्रति बाली')
                    },
                    { 
                      label: t('Organic Crops', 'जैविक बालीहरू'), 
                      value: stats.organicCrops, 
                      icon: Sprout, 
                      color: 'green',
                      trend: `${Math.round((stats.organicCrops/stats.totalCrops)*100)}%`,
                      subtitle: t('of total', 'कुलको')
                    },
                    { 
                      label: t('Certified', 'प्रमाणित'), 
                      value: stats.certifiedCrops, 
                      icon: CheckCircle2, 
                      color: 'purple',
                      trend: `${Math.round((stats.certifiedCrops/stats.totalCrops)*100)}%`,
                      subtitle: t('certified crops', 'प्रमाणित बालीहरू')
                    },
                    { 
                      label: t('Ready to Harvest', 'कटनी तयार'), 
                      value: stats.cropsToHarvest, 
                      icon: Clock, 
                      color: 'yellow',
                      trend: 'within 30d',
                      subtitle: t('needs attention', 'ध्यान आवश्यक')
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-xl flex items-center justify-center`}>
                              <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                            </div>
                            <Badge variant="outline" className={`text-${stat.color}-600 border-${stat.color}-200`}>
                              {stat.trend}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                            <p className={`text-xl font-bold text-${stat.color}-600 mb-1`}>{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      {t('Recent Activity', 'हालका गतिविधिहरू')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { type: 'harvest', text: t('Harvested 50kg tomatoes from Field A1', 'फिल्ड A1 बाट ५० के.जी. गोलभेंडा कटनी'), time: '2 hours ago', icon: CheckCircle2, color: 'green' },
                        { type: 'plant', text: t('Planted new carrot seeds in Field B2', 'फिल्ड B2 मा नयाँ गाजरको बीउ रोप्यो'), time: '1 day ago', icon: Sprout, color: 'blue' },
                        { type: 'fertilize', text: t('Applied organic fertilizer to tomato field', 'गोलभेंडा खेतमा जैविक मल प्रयोग गर्यो'), time: '3 days ago', icon: Droplets, color: 'orange' },
                        { type: 'water', text: t('Irrigation completed for all active crops', 'सबै सक्रिय बालीहरूको सिंचाई सम्पन्न'), time: '1 week ago', icon: CloudRain, color: 'blue' },
                      ].map((activity, index) => (
                        <motion.div 
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-all duration-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <div className={`w-10 h-10 bg-${activity.color}-100 dark:bg-${activity.color}-900/20 rounded-full flex items-center justify-center`}>
                            <activity.icon className={`h-4 w-4 text-${activity.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.text}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Active Crops with Enhanced Progress */}
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Sprout className="h-5 w-5 text-green-600" />
                        {t('Active Crops Progress', 'सक्रिय बालीहरूको प्रगति')}
                      </CardTitle>
                      <Button size="sm" variant="outline" onClick={() => setActiveTab('crops')}>
                        {t('View All', 'सबै हेर्नुहोस्')}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {crops.filter(crop => !['harvested', 'sold'].includes(crop.status)).slice(0, 4).map((crop, index) => (
                        <motion.div 
                          key={crop.id}
                          className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:shadow-md transition-all duration-200 border border-emerald-200 dark:border-emerald-700"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                        >
                          <img 
                            src={crop.image} 
                            alt={crop.name}
                            className="w-16 h-16 rounded-xl object-cover shadow-md"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="font-medium">{language === 'ne' ? crop.nameNepali : crop.name}</h5>
                              <Badge className={getStatusColor(crop.status)}>
                                {crop.statusNepali}
                              </Badge>
                              {getDaysToHarvest(crop) <= 7 && !['harvested', 'sold'].includes(crop.status) && (
                                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {getDaysToHarvest(crop)}d
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground mb-2">
                              <div>
                                <span className="font-medium">{t('Area:', 'क्षेत्र:')}</span> {crop.area} {t('ropani', 'रोपनी')}
                              </div>
                              <div>
                                <span className="font-medium">{t('Field:', 'खेत:')}</span> {crop.location.field}
                              </div>
                              <div>
                                <span className="font-medium">{t('Expected:', 'अपेक्षित:')}</span> {crop.expectedYield || 0}kg
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{t('Growth Progress', 'वृद्धि प्रगति')}</span>
                                <span className="font-medium">{Math.round(getGrowthProgress(crop))}%</span>
                              </div>
                              <Progress value={getGrowthProgress(crop)} className="h-2" />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedCrop(crop);
                                setShowCropDetails(true);
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              {t('View', 'हेर्नुहोस्')}
                            </Button>
                            <Select
                              value={crop.status}
                              onValueChange={(newStatus) => updateCropStatus(crop.id, newStatus as Crop['status'])}
                            >
                              <SelectTrigger className="w-28 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((status) => (
                                  <SelectItem key={status.value} value={status.value}>
                                    {language === 'ne' ? status.labelNepali : status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Crops Tab */}
              <TabsContent value="crops" className="space-y-4">
                {/* Advanced Filters */}
                <Card className="shadow-md border-0">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-64">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder={t('Search crops, varieties, fields...', 'बाली, किसिम, खेत खोज्नुहोस्...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder={t('Category', 'श्रेणी')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('All Categories', 'सबै श्रेणी')}</SelectItem>
                          {cropCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {language === 'ne' ? category.labelNepali : category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder={t('Status', 'स्थिति')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('All Status', 'सबै स्थिति')}</SelectItem>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {language === 'ne' ? status.labelNepali : status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder={t('Sort by', 'क्रमबद्ध गर्नुहोस्')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">{t('Name', 'नाम')}</SelectItem>
                          <SelectItem value="planted">{t('Date Planted', 'रोपेको मिति')}</SelectItem>
                          <SelectItem value="harvest">{t('Harvest Date', 'कटनी मिति')}</SelectItem>
                          <SelectItem value="revenue">{t('Revenue', 'आम्दानी')}</SelectItem>
                          <SelectItem value="area">{t('Area', 'क्षेत्रफल')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Results Summary */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t(`Showing ${filteredCrops.length} of ${crops.length} crops`, `${crops.length} मध्ये ${filteredCrops.length} बालीहरू देखाइँदै`)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {filteredCrops.length === 0 ? (
                  <Card className="shadow-lg border-0">
                    <CardContent className="p-12 text-center">
                      <Sprout className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="font-medium mb-2">
                        {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' ? 
                          t('No crops found', 'कुनै बाली फेला परेन') :
                          t('No crops yet', 'अहिलेसम्म कुनै बाली छैन')
                        }
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' ?
                          t('Try adjusting your search or filters', 'आफ्नो खोज वा फिल्टर परिवर्तन गर्ने प्रयास गर्नुहोस्') :
                          t('Start by adding your first crop to track and manage your farming activities', 'आफ्ना खेती गतिविधिहरू ट्र्याक र व्यवस्थापन गर्न पहिलो बाली थप्नुहोस्')
                        }
                      </p>
                      {!searchQuery && selectedCategory === 'all' && selectedStatus === 'all' && (
                        <Button 
                          onClick={() => setShowAddCrop(true)}
                          className="bg-emerald-500 hover:bg-emerald-600"
                        >
                          <Sprout className="h-4 w-4 mr-2" />
                          {t('Add First Crop', 'पहिलो बाली थप्नुहोस्')}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCrops.map((crop, index) => (
                        <motion.div
                          key={crop.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                            <div className="relative">
                              <img 
                                src={crop.image} 
                                alt={crop.name}
                                className="w-full h-48 object-cover"
                              />
                              <div className="absolute top-2 left-2 flex gap-2">
                                <Badge className={getStatusColor(crop.status)}>
                                  {crop.statusNepali}
                                </Badge>
                                {crop.quality.organic && (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                    {t('Organic', 'जैविक')}
                                  </Badge>
                                )}
                              </div>
                              <div className="absolute top-2 right-2">
                                {getDaysToHarvest(crop) <= 7 && !['harvested', 'sold'].includes(crop.status) && (
                                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {getDaysToHarvest(crop)}d
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <div className="mb-3">
                                <h4 className="font-semibold text-lg mb-1">{language === 'ne' ? crop.nameNepali : crop.name}</h4>
                                <p className="text-sm text-muted-foreground">{crop.variety} • {crop.location.field}</p>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span>{crop.area} {t('ropani', 'रोपनी')}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                                    <span>रु. {crop.pricePerKg}/kg</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Thermometer className="h-3 w-3 text-muted-foreground" />
                                    <span>{crop.weather.temperature}°C</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Droplets className="h-3 w-3 text-muted-foreground" />
                                    <span>{crop.weather.humidity}%</span>
                                  </div>
                                </div>

                                {!['harvested', 'sold'].includes(crop.status) && (
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                      <span>{t('Growth Progress', 'वृद्धि प्रगति')}</span>
                                      <span className="font-medium">{Math.round(getGrowthProgress(crop))}%</span>
                                    </div>
                                    <Progress value={getGrowthProgress(crop)} className="h-2" />
                                    <p className="text-xs text-muted-foreground">
                                      {getDaysToHarvest(crop) > 0 
                                        ? `${getDaysToHarvest(crop)} ${t('days to harvest', 'दिन कटनी बाकी')}`
                                        : t('Ready for harvest', 'कटनीको लागि तयार')
                                      }
                                    </p>
                                  </div>
                                )}

                                <div className="flex gap-2 pt-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => {
                                      setSelectedCrop(crop);
                                      setShowCropDetails(true);
                                    }}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    {t('View', 'हेर्नुहोस्')}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setEditingCrop(crop)}
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => deleteCrop(crop.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredCrops.map((crop, index) => (
                        <motion.div
                          key={crop.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <img 
                                  src={crop.image} 
                                  alt={crop.name}
                                  className="w-20 h-20 rounded-xl object-cover shadow-md"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium text-lg">{language === 'ne' ? crop.nameNepali : crop.name}</h4>
                                    <Badge className={getStatusColor(crop.status)}>
                                      {crop.statusNepali}
                                    </Badge>
                                    {crop.quality.organic && (
                                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                        {t('Organic', 'जैविक')}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-5 gap-4 text-sm text-muted-foreground">
                                    <div>
                                      <span className="font-medium">{t('Variety:', 'किसिम:')}</span> {crop.variety}
                                    </div>
                                    <div>
                                      <span className="font-medium">{t('Area:', 'क्षेत्र:')}</span> {crop.area} {t('ropani', 'रोपनी')}
                                    </div>
                                    <div>
                                      <span className="font-medium">{t('Price:', 'मूल्य:')}</span> रु. {crop.pricePerKg}/kg
                                    </div>
                                    <div>
                                      <span className="font-medium">{t('Revenue:', 'आम्दानी:')}</span> रु. {crop.revenue.toLocaleString()}
                                    </div>
                                    <div>
                                      <span className="font-medium">{t('Progress:', 'प्रगति:')}</span> {Math.round(getGrowthProgress(crop))}%
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedCrop(crop);
                                      setShowCropDetails(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    {t('View', 'हेर्नुहोस्')}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setEditingCrop(crop)}
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )
                )}
              </TabsContent>

              {/* Enhanced Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Performance Chart */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart4 className="h-5 w-5 text-blue-600" />
                        {t('Crop Performance', 'बाली प्रदर्शन')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {crops.slice(0, 5).map((crop) => (
                          <div key={crop.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <img src={crop.image} alt={crop.name} className="w-10 h-10 rounded-lg object-cover" />
                              <div>
                                <p className="font-medium">{language === 'ne' ? crop.nameNepali : crop.name}</p>
                                <p className="text-sm text-muted-foreground">{crop.area} {t('ropani', 'रोपनी')}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">रु. {crop.revenue.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">
                                {crop.actualYield || crop.expectedYield || 0}kg {t('yield', 'उत्पादन')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Financial Summary */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-green-600" />
                        {t('Financial Summary', 'वित्तीय सारांश')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <span className="font-medium">{t('Total Revenue', 'कुल आम्दानी')}</span>
                          <span className="font-bold text-green-600">रु. {stats.totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <span className="font-medium">{t('Total Expenses', 'कुल खर्च')}</span>
                          <span className="font-bold text-orange-600">रु. {stats.totalExpenses.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <span className="font-medium">{t('Net Profit', 'नेट नाफा')}</span>
                          <span className={`font-bold ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            रु. {totalProfit.toLocaleString()}
                          </span>
                        </div>
                        <div className="pt-3 border-t">
                          <div className="flex justify-between text-sm text-muted-foreground mb-2">
                            <span>{t('Profit Margin', 'नाफा मार्जिन')}</span>
                            <span>{Math.round((totalProfit / Math.max(stats.totalRevenue, 1)) * 100)}%</span>
                          </div>
                          <Progress 
                            value={Math.max(0, Math.min(100, (totalProfit / Math.max(stats.totalRevenue, 1)) * 100))} 
                            className="h-2" 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Yield Analysis */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-600" />
                        {t('Yield Analysis', 'उत्पादन विश्लेषण')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{Math.round(stats.avgYield)} kg</p>
                          <p className="text-sm text-muted-foreground">{t('Average yield per crop', 'प्रति बाली औसत उत्पादन')}</p>
                        </div>
                        <div className="space-y-2">
                          {crops.filter(c => c.actualYield || c.expectedYield).slice(0, 3).map((crop) => (
                            <div key={crop.id} className="flex justify-between items-center">
                              <span className="text-sm">{language === 'ne' ? crop.nameNepali : crop.name}</span>
                              <span className="font-medium">{crop.actualYield || crop.expectedYield}kg</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quality Distribution */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-600" />
                        {t('Quality Distribution', 'गुणस्तर वितरण')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <p className="text-xl font-bold text-yellow-600">
                              {crops.filter(c => c.quality.grade === 'A').length}
                            </p>
                            <p className="text-xs text-muted-foreground">{t('Grade A', 'ग्रेड A')}</p>
                          </div>
                          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <p className="text-xl font-bold text-orange-600">
                              {crops.filter(c => c.quality.grade === 'B').length}
                            </p>
                            <p className="text-xs text-muted-foreground">{t('Grade B', 'ग्रेड B')}</p>
                          </div>
                          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <p className="text-xl font-bold text-red-600">
                              {crops.filter(c => c.quality.grade === 'C').length}
                            </p>
                            <p className="text-xs text-muted-foreground">{t('Grade C', 'ग्रेड C')}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">{t('Organic crops', 'जैविक बालीहरू')}</span>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                              {stats.organicCrops}/{stats.totalCrops}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">{t('Certified crops', 'प्रमाणित बालीहरू')}</span>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                              {stats.certifiedCrops}/{stats.totalCrops}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Planning Tab */}
              <TabsContent value="planning" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      {t('Crop Planning & Calendar', 'बाली योजना र क्यालेन्डर')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="font-medium mb-2">
                        {t('Advanced Planning Features Coming Soon', 'उन्नत योजना सुविधाहरू चाँडै आउँदैछ')}
                      </h4>
                      <p className="text-muted-foreground mb-6">
                        {t('Crop rotation planning, seasonal calendars, and harvest scheduling will be available soon', 'बाली चक्रीकरण योजना, मौसमी क्यालेन्डर र कटनी तालिका चाँडै उपलब्ध हुनेछ')}
                      </p>
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        <Bell className="h-4 w-4 mr-2" />
                        {t('Notify Me', 'मलाई सूचना गर्नुहोस्')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Market Tab */}
              <TabsContent value="market" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      {t('Market Analysis & Pricing', 'बजार विश्लेषण र मूल्य निर्धारण')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="font-medium mb-2">
                        {t('Market Intelligence Coming Soon', 'बजार बुद्धिमत्ता चाँडै आउँदैछ')}
                      </h4>
                      <p className="text-muted-foreground mb-6">
                        {t('Real-time market prices, demand forecasting, and pricing optimization tools', 'वास्तविक समयको बजार मूल्य, माग पूर्वानुमान र मूल्य निर्धारण उपकरणहरू')}
                      </p>
                      <Button className="bg-green-500 hover:bg-green-600">
                        <Star className="h-4 w-4 mr-2" />
                        {t('Get Early Access', 'प्रारम्भिक पहुँच प्राप्त गर्नुहोस्')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      {t('AI-Powered Insights & Recommendations', 'AI-संचालित अन्तर्दृष्टि र सिफारिसहरू')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          type: 'success',
                          title: t('Great Performance!', 'उत्कृष्ट प्रदर्शन!'),
                          message: t('Your tomato crop is performing 15% better than average', 'तपाईंको गोलभेंडा बाली औसतभन्दा १५% राम्रो प्रदर्शन गरिरहेको छ'),
                          icon: CheckCircle2,
                          color: 'green'
                        },
                        {
                          type: 'warning',
                          title: t('Weather Alert', 'मौसम चेतावनी'),
                          message: t('Heavy rain expected next week. Consider protecting your flowering crops', 'अर्को हप्ता भारी वर्षाको सम्भावना। आफ्ना फूल फुलेका बालीहरूको सुरक्षा गर्ने विचार गर्नुहोस्'),
                          icon: CloudRain,
                          color: 'orange'
                        },
                        {
                          type: 'info',
                          title: t('Optimization Tip', 'अनुकूलन सुझाव'),
                          message: t('Plant carrots in Field B2 after current harvest for better soil rotation', 'मिट्टोको राम्रो चक्रीकरणका लागि हालको कटनी पछि फिल्ड B2 मा गाजर रोप्नुहोस्'),
                          icon: Lightbulb,
                          color: 'blue'
                        },
                        {
                          type: 'opportunity',
                          title: t('Market Opportunity', 'बजार अवसर'),
                          message: t('Tomato prices are 20% higher than usual. Good time to harvest and sell', 'गोलभेंडाको मूल्य सामान्यभन्दा २०% बढी छ। कटनी र बिक्रीको लागि राम्रो समय'),
                          icon: TrendingUp,
                          color: 'purple'
                        }
                      ].map((insight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Alert className={`border-${insight.color}-200 bg-${insight.color}-50 dark:bg-${insight.color}-900/20`}>
                            <insight.icon className={`h-4 w-4 text-${insight.color}-600`} />
                            <AlertDescription>
                              <div>
                                <p className={`font-medium text-${insight.color}-800 dark:text-${insight.color}-200 mb-1`}>
                                  {insight.title}
                                </p>
                                <p className={`text-sm text-${insight.color}-700 dark:text-${insight.color}-300`}>
                                  {insight.message}
                                </p>
                              </div>
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </div>
      </Card>

      {/* Add/Edit Crop Modal */}
      <CropFormModal
        isOpen={showAddCrop || !!editingCrop}
        onClose={() => {
          setShowAddCrop(false);
          setEditingCrop(null);
        }}
        onSave={editingCrop ? updateCrop : addCrop}
        crop={editingCrop}
        language={language}
      />

      {/* Crop Details Modal */}
      <CropDetailsModal
        isOpen={showCropDetails}
        onClose={() => {
          setShowCropDetails(false);
          setSelectedCrop(null);
        }}
        crop={selectedCrop}
        language={language}
        onEdit={(crop) => {
          setEditingCrop(crop);
          setShowCropDetails(false);
        }}
      />
    </div>
  );
}

// Enhanced Crop Form Modal Component
function CropFormModal({ isOpen, onClose, onSave, crop, language }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (crop: any) => void;
  crop?: Crop | null;
  language: Language;
}) {
  const [formData, setFormData] = useState<Partial<Crop>>(getInitialFormData());
  const [activeSection, setActiveSection] = useState('basic');

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  function getInitialFormData(): Partial<Crop> {
    return {
      name: '',
      nameNepali: '',
      category: 'vegetables',
      variety: '',
      plantedDate: new Date().toISOString().split('T')[0],
      expectedHarvest: '',
      status: 'planted',
      statusNepali: 'रोपिएको',
      area: 0,
      totalSeeds: 0,
      currentStock: 0,
      pricePerKg: 0,
      marketPrice: 0,
      image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400',
      description: '',
      location: { field: '' },
      weather: { temperature: 25, humidity: 65, rainfall: 100 },
      care: { lastWatered: '', lastFertilized: '', pestControl: '' },
      quality: { grade: 'A', organic: false, certified: false },
      expenses: { seeds: 0, fertilizer: 0, pesticide: 0, labor: 0, other: 0 },
      notes: [],
      images: [],
      buyers: [],
      revenue: 0,
      expectedYield: 0,
      soilData: { ph: 7.0, nitrogen: 50, phosphorus: 30, potassium: 40 },
      irrigation: { method: 'Manual', frequency: 'Daily', lastIrrigation: '' },
      marketAnalysis: { demandLevel: 'medium', priceProjection: 0, competitors: 0 }
    };
  }

  useEffect(() => {
    if (crop) {
      setFormData(crop);
    } else {
      setFormData(getInitialFormData());
    }
  }, [crop]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-hidden">
        <CardHeader className="sticky top-0 bg-white dark:bg-gray-800 border-b z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-emerald-600" />
              {crop ? t('Edit Crop', 'बाली सम्पादन गर्नुहोस्') : t('Add New Crop', 'नयाँ बाली थप्नुहोस्')}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <div className="flex overflow-hidden">
          {/* Section Navigation */}
          <div className="w-48 bg-gray-50 dark:bg-gray-800/50 p-4 border-r">
            <div className="space-y-2">
              {[
                { id: 'basic', label: t('Basic Info', 'आधारभूत जानकारी'), icon: Package },
                { id: 'location', label: t('Location & Area', 'स्थान र क्षेत्र'), icon: MapPin },
                { id: 'care', label: t('Care & Quality', 'हेरचाह र गुणस्तर'), icon: Sprout },
                { id: 'financial', label: t('Financial', 'वित्तीय'), icon: DollarSign },
                { id: 'advanced', label: t('Advanced', 'उन्नत'), icon: Zap },
              ].map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveSection(section.id)}
                >
                  <section.icon className="h-4 w-4 mr-2" />
                  {section.label}
                </Button>
              ))}
            </div>
          </div>

          <CardContent className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              {activeSection === 'basic' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('Basic Information', 'आधारभूत जानकारी')}</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t('Crop Name (English)', 'बालीको नाम (अंग्रेजी)')}</Label>
                      <Input
                        value={formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g., Fresh Tomatoes"
                        required
                      />
                    </div>
                    <div>
                      <Label>{t('Crop Name (Nepali)', 'बालीको नाम (नेपाली)')}</Label>
                      <Input
                        value={formData.nameNepali || ''}
                        onChange={(e) => setFormData({...formData, nameNepali: e.target.value})}
                        placeholder="जस्तै, ताजा गोलभेंडा"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t('Category', 'श्रेणी')}</Label>
                      <Select
                        value={formData.category || 'vegetables'}
                        onValueChange={(value) => setFormData({...formData, category: value, variety: ''})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cropCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {language === 'ne' ? category.labelNepali : category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{t('Variety', 'किसिम')}</Label>
                      <Select
                        value={formData.variety || ''}
                        onValueChange={(value) => setFormData({...formData, variety: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('Select variety', 'किसिम छान्नुहोस्')} />
                        </SelectTrigger>
                        <SelectContent>
                          {cropVarieties[formData.category as keyof typeof cropVarieties]?.map((variety) => (
                            <SelectItem key={variety} value={variety}>
                              {variety}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t('Planted Date', 'रोपेको मिति')}</Label>
                      <Input
                        type="date"
                        value={formData.plantedDate || ''}
                        onChange={(e) => setFormData({...formData, plantedDate: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label>{t('Expected Harvest Date', 'अपेक्षित कटनी मिति')}</Label>
                      <Input
                        type="date"
                        value={formData.expectedHarvest || ''}
                        onChange={(e) => setFormData({...formData, expectedHarvest: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>{t('Image URL', 'छविको लिङ्क')}</Label>
                    <Input
                      value={formData.image || ''}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <Label>{t('Description', 'विवरण')}</Label>
                    <Textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder={t('Describe your crop...', 'आफ्नो बालीको विवरण दिनुहोस्...')}
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Location & Area */}
              {activeSection === 'location' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('Location & Area', 'स्थान र क्षेत्र')}</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t('Field Name', 'खेतको नाम')}</Label>
                      <Input
                        value={formData.location?.field || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          location: {...formData.location, field: e.target.value}
                        })}
                        placeholder="e.g., Field A1"
                        required
                      />
                    </div>
                    <div>
                      <Label>{t('Area (Ropani)', 'क्षेत्रफल (रोपनी)')}</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.area || ''}
                        onChange={(e) => setFormData({...formData, area: parseFloat(e.target.value) || 0})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t('Total Seeds/Plants', 'कुल बीउ/बिरुवा')}</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.totalSeeds || ''}
                        onChange={(e) => setFormData({...formData, totalSeeds: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label>{t('Expected Yield (kg)', 'अपेक्षित उत्पादन (के.जी.)')}</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.expectedYield || ''}
                        onChange={(e) => setFormData({...formData, expectedYield: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Care & Quality */}
              {activeSection === 'care' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('Care & Quality', 'हेरचाह र गुणस्तर')}</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t('Status', 'स्थिति')}</Label>
                      <Select
                        value={formData.status || 'planted'}
                        onValueChange={(value) => {
                          const statusMap = {
                            planted: 'रोपिएको',
                            growing: 'बढ्दै',
                            flowering: 'फुल्दै',
                            fruiting: 'फल लाग्दै',
                            harvested: 'कटनी भएको',
                            sold: 'बिक्री भएको'
                          };
                          setFormData({
                            ...formData, 
                            status: value as Crop['status'],
                            statusNepali: statusMap[value as keyof typeof statusMap]
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {language === 'ne' ? status.labelNepali : status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{t('Quality Grade', 'गुणस्तर ग्रेड')}</Label>
                      <Select
                        value={formData.quality?.grade || 'A'}
                        onValueChange={(value) => setFormData({
                          ...formData,
                          quality: {...formData.quality, grade: value as 'A' | 'B' | 'C'}
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">Grade A</SelectItem>
                          <SelectItem value="B">Grade B</SelectItem>
                          <SelectItem value="C">Grade C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.quality?.organic || false}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          quality: {...formData.quality, organic: checked}
                        })}
                      />
                      <Label>{t('Organic', 'जैविक')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.quality?.certified || false}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          quality: {...formData.quality, certified: checked}
                        })}
                      />
                      <Label>{t('Certified', 'प्रमाणित')}</Label>
                    </div>
                  </div>

                  <div>
                    <Label>{t('Last Watered', 'अन्तिम पानी दिएको')}</Label>
                    <Input
                      type="date"
                      value={formData.care?.lastWatered || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        care: {...formData.care, lastWatered: e.target.value}
                      })}
                    />
                  </div>

                  <div>
                    <Label>{t('Pest Control Method', 'किराको नियन्त्रण विधि')}</Label>
                    <Input
                      value={formData.care?.pestControl || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        care: {...formData.care, pestControl: e.target.value}
                      })}
                      placeholder={t('e.g., Neem oil spray', 'जस्तै, निमको तेल स्प्रे')}
                    />
                  </div>
                </div>
              )}

              {/* Financial */}
              {activeSection === 'financial' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('Financial Information', 'वित्तीय जानकारी')}</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t('Price per kg (रु.)', 'प्रति के.जी. मूल्य (रु.)')}</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.pricePerKg || ''}
                        onChange={(e) => setFormData({...formData, pricePerKg: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label>{t('Market Price (रु.)', 'बजार मूल्य (रु.)')}</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.marketPrice || ''}
                        onChange={(e) => setFormData({...formData, marketPrice: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">{t('Expenses', 'खर्चहरू')}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{t('Seeds (रु.)', 'बीउ (रु.)')}</Label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.expenses?.seeds || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            expenses: {...formData.expenses, seeds: parseFloat(e.target.value) || 0}
                          })}
                        />
                      </div>
                      <div>
                        <Label>{t('Fertilizer (रु.)', 'मल (रु.)')}</Label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.expenses?.fertilizer || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            expenses: {...formData.expenses, fertilizer: parseFloat(e.target.value) || 0}
                          })}
                        />
                      </div>
                      <div>
                        <Label>{t('Labor (रु.)', 'श्रम (रु.)')}</Label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.expenses?.labor || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            expenses: {...formData.expenses, labor: parseFloat(e.target.value) || 0}
                          })}
                        />
                      </div>
                      <div>
                        <Label>{t('Other (रु.)', 'अन्य (रु.)')}</Label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.expenses?.other || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            expenses: {...formData.expenses, other: parseFloat(e.target.value) || 0}
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>{t('Current Revenue (रु.)', 'हालको आम्दानी (रु.)')}</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.revenue || ''}
                      onChange={(e) => setFormData({...formData, revenue: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
              )}

              {/* Advanced */}
              {activeSection === 'advanced' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('Advanced Settings', 'उन्नत सेटिङहरू')}</h3>
                  
                  <div>
                    <h4 className="font-medium mb-3">{t('Soil Data', 'माटोको तथ्याङ्क')}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{t('pH Level', 'पिएच स्तर')}</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="14"
                          value={formData.soilData?.ph || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            soilData: {...formData.soilData, ph: parseFloat(e.target.value) || 7.0}
                          })}
                        />
                      </div>
                      <div>
                        <Label>{t('Nitrogen %', 'नाइट्रोजन %')}</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.soilData?.nitrogen || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            soilData: {...formData.soilData, nitrogen: parseFloat(e.target.value) || 0}
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">{t('Irrigation', 'सिंचाई')}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{t('Method', 'विधि')}</Label>
                        <Select
                          value={formData.irrigation?.method || 'Manual'}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            irrigation: {...formData.irrigation, method: value}
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Manual">{t('Manual', 'म्यानुअल')}</SelectItem>
                            <SelectItem value="Drip irrigation">{t('Drip irrigation', 'ड्रिप सिंचाई')}</SelectItem>
                            <SelectItem value="Sprinkler">{t('Sprinkler', 'स्प्रिंकलर')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>{t('Frequency', 'आवृत्ति')}</Label>
                        <Select
                          value={formData.irrigation?.frequency || 'Daily'}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            irrigation: {...formData.irrigation, frequency: value}
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Daily">{t('Daily', 'दैनिक')}</SelectItem>
                            <SelectItem value="Alternate days">{t('Alternate days', 'वैकल्पिक दिन')}</SelectItem>
                            <SelectItem value="Weekly">{t('Weekly', 'साप्ताहिक')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  {t('Cancel', 'रद्द गर्नुहोस्')}
                </Button>
                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                  <Save className="h-4 w-4 mr-2" />
                  {crop ? t('Update Crop', 'बाली अपडेट गर्नुहोस्') : t('Add Crop', 'बाली थप्नुहोस्')}
                </Button>
              </div>
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

// Enhanced Crop Details Modal Component
function CropDetailsModal({ isOpen, onClose, crop, language, onEdit }: {
  isOpen: boolean;
  onClose: () => void;
  crop: Crop | null;
  language: Language;
  onEdit: (crop: Crop) => void;
}) {
  const [activeTab, setActiveTab] = useState('overview');

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  if (!isOpen || !crop) return null;

  const getGrowthProgress = (crop: Crop) => {
    const planted = new Date(crop.plantedDate);
    const expected = new Date(crop.expectedHarvest);
    const now = new Date();
    
    const totalDays = Math.ceil((expected.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((now.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);
  };

  const getDaysToHarvest = (crop: Crop) => {
    const expected = new Date(crop.expectedHarvest);
    const now = new Date();
    const diff = Math.ceil((expected.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const totalExpenses = Object.values(crop.expenses).reduce((sum, exp) => sum + exp, 0);
  const profit = crop.revenue - totalExpenses;

  return (
    <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-hidden">
        <CardHeader className="sticky top-0 bg-white dark:bg-gray-800 border-b z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={crop.image} 
                alt={crop.name}
                className="w-16 h-16 rounded-xl object-cover shadow-md"
              />
              <div>
                <CardTitle className="text-xl">{language === 'ne' ? crop.nameNepali : crop.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {crop.variety} • {crop.location.field} • {crop.area} {t('ropani', 'रोपनी')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => onEdit(crop)} className="bg-emerald-500 hover:bg-emerald-600">
                <Edit3 className="h-4 w-4 mr-2" />
                {t('Edit', 'सम्पादन गर्नुहोस्')}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">{t('Overview', 'सिंहावलोकन')}</TabsTrigger>
              <TabsTrigger value="progress">{t('Progress', 'प्रगति')}</TabsTrigger>
              <TabsTrigger value="care">{t('Care', 'हेरचाह')}</TabsTrigger>
              <TabsTrigger value="financial">{t('Financial', 'वित्तीय')}</TabsTrigger>
              <TabsTrigger value="data">{t('Data', 'तथ्याङ्क')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Sprout className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-lg font-bold">{Math.round(getGrowthProgress(crop))}%</p>
                    <p className="text-sm text-muted-foreground">{t('Growth', 'वृद्धि')}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-lg font-bold">{getDaysToHarvest(crop)}</p>
                    <p className="text-sm text-muted-foreground">{t('Days left', 'दिन बाकी')}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-lg font-bold">{crop.expectedYield || 0}kg</p>
                    <p className="text-sm text-muted-foreground">{t('Expected', 'अपेक्षित')}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-lg font-bold">रु. {profit.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{t('Profit', 'नाफा')}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{t('Description', 'विवरण')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{crop.description}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('Quality Information', 'गुणस्तर जानकारी')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>{t('Grade', 'ग्रेड')}</span>
                      <Badge>Grade {crop.quality.grade}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('Organic', 'जैविक')}</span>
                      <Badge variant={crop.quality.organic ? 'default' : 'secondary'}>
                        {crop.quality.organic ? t('Yes', 'छ') : t('No', 'छैन')}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('Certified', 'प्रमाणित')}</span>
                      <Badge variant={crop.quality.certified ? 'default' : 'secondary'}>
                        {crop.quality.certified ? t('Yes', 'छ') : t('No', 'छैन')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('Current Conditions', 'हालको अवस्था')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-red-500" />
                        <span>{t('Temperature', 'तापक्रम')}</span>
                      </div>
                      <span>{crop.weather.temperature}°C</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span>{t('Humidity', 'आर्द्रता')}</span>
                      </div>
                      <span>{crop.weather.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CloudRain className="h-4 w-4 text-gray-500" />
                        <span>{t('Rainfall', 'वर्षा')}</span>
                      </div>
                      <span>{crop.weather.rainfall}mm</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('Growth Progress', 'वृद्धि प्रगति')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>{t('Overall Progress', 'समग्र प्रगति')}</span>
                        <span className="font-medium">{Math.round(getGrowthProgress(crop))}%</span>
                      </div>
                      <Progress value={getGrowthProgress(crop)} className="h-3" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('Planted Date', 'रोपेको मिति')}</p>
                        <p className="font-medium">{new Date(crop.plantedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('Expected Harvest', 'अपेक्षित कटनी')}</p>
                        <p className="font-medium">{new Date(crop.expectedHarvest).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('Growth Stages', 'वृद्धि चरणहरू')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {statusOptions.map((status, index) => {
                      const isCompleted = statusOptions.findIndex(s => s.value === crop.status) >= index;
                      const isCurrent = crop.status === status.value;
                      
                      return (
                        <div key={status.value} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isCurrent
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-200 text-gray-500'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="h-3 w-3" /> : index + 1}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${isCurrent ? 'text-orange-600' : ''}`}>
                              {language === 'ne' ? status.labelNepali : status.label}
                            </p>
                            {isCurrent && (
                              <p className="text-sm text-muted-foreground">{t('Current stage', 'हालको चरण')}</p>
                            )}
                          </div>
                          {isCurrent && (
                            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                              {t('Active', 'सक्रिय')}
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="care" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('Care Schedule', 'हेरचाह तालिका')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium mb-1">{t('Last Watered', 'अन्तिम पानी दिएको')}</p>
                      <p className="text-muted-foreground">
                        {crop.care.lastWatered 
                          ? new Date(crop.care.lastWatered).toLocaleDateString()
                          : t('Not recorded', 'रेकर्ड गरिएको छैन')
                        }
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">{t('Last Fertilized', 'अन्तिम मल दिएको')}</p>
                      <p className="text-muted-foreground">
                        {crop.care.lastFertilized 
                          ? new Date(crop.care.lastFertilized).toLocaleDateString()
                          : t('Not recorded', 'रेकर्ड गरिएको छैन')
                        }
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">{t('Pest Control', 'किराको नियन्त्रण')}</p>
                      <p className="text-muted-foreground">
                        {crop.care.pestControl || t('None applied', 'कुनै प्रयोग गरिएको छैन')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('Irrigation System', 'सिंचाई प्रणाली')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium mb-1">{t('Method', 'विधि')}</p>
                      <p className="text-muted-foreground">{crop.irrigation?.method || 'Manual'}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">{t('Frequency', 'आवृत्ति')}</p>
                      <p className="text-muted-foreground">{crop.irrigation?.frequency || 'Daily'}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">{t('Last Irrigation', 'अन्तिम सिंचाई')}</p>
                      <p className="text-muted-foreground">
                        {crop.irrigation?.lastIrrigation 
                          ? new Date(crop.irrigation.lastIrrigation).toLocaleDateString()
                          : t('Not recorded', 'रेकर्ड गरिएको छैन')
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{t('Notes & Observations', 'टिप्पणी र अवलोकन')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {crop.notes.length > 0 ? (
                    <div className="space-y-2">
                      {crop.notes.map((note, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <p className="text-sm">{note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      {t('No notes recorded yet', 'अहिलेसम्म कुनै टिप्पणी रेकर्ड गरिएको छैन')}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-green-600">रु. {crop.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{t('Revenue', 'आम्दानी')}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-orange-600">रु. {totalExpenses.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{t('Expenses', 'खर्च')}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <p className={`text-lg font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      रु. {profit.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{t('Net Profit', 'नेट नाफा')}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-blue-600">रु. {crop.pricePerKg}/kg</p>
                    <p className="text-sm text-muted-foreground">{t('Price/kg', 'मूल्य/के.जी.')}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{t('Expense Breakdown', 'खर्च विवरण')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries({
                      seeds: t('Seeds', 'बीउ'),
                      fertilizer: t('Fertilizer', 'मल'),
                      pesticide: t('Pesticide', 'किटनाशक'),
                      labor: t('Labor', 'श्रम'),
                      other: t('Other', 'अन्य')
                    }).map(([key, label]) => {
                      const amount = crop.expenses[key as keyof typeof crop.expenses];
                      const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                      
                      return (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between">
                            <span>{label}</span>
                            <span className="font-medium">रु. {amount.toLocaleString()} ({Math.round(percentage)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('Market Analysis', 'बजार विश्लेषण')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium mb-1">{t('Market Price', 'बजार मूल्य')}</p>
                      <p className="text-lg font-bold text-blue-600">रु. {crop.marketPrice}/kg</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">{t('Your Price', 'तपाईंको मूल्य')}</p>
                      <p className={`text-lg font-bold ${crop.pricePerKg > crop.marketPrice ? 'text-green-600' : 'text-orange-600'}`}>
                        रु. {crop.pricePerKg}/kg
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">{t('Demand Level', 'माग स्तर')}</p>
                      <Badge className={
                        crop.marketAnalysis?.demandLevel === 'high' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : crop.marketAnalysis?.demandLevel === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      }>
                        {crop.marketAnalysis?.demandLevel || 'medium'}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium mb-1">{t('Competitors', 'प्रतिस्पर्धीहरू')}</p>
                      <p className="text-lg font-bold">{crop.marketAnalysis?.competitors || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('Soil Analysis', 'माटो विश्लेषण')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{crop.soilData?.ph || 7.0}</p>
                      <p className="text-sm text-muted-foreground">{t('pH Level', 'पिएच स्तर')}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{crop.soilData?.nitrogen || 0}%</p>
                      <p className="text-sm text-muted-foreground">{t('Nitrogen', 'नाइट्रोजन')}</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{crop.soilData?.phosphorus || 0}%</p>
                      <p className="text-sm text-muted-foreground">{t('Phosphorus', 'फस्फोरस')}</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{crop.soilData?.potassium || 0}%</p>
                      <p className="text-sm text-muted-foreground">{t('Potassium', 'पोटासियम')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('Yield Data', 'उत्पादन तथ्याङ्क')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>{t('Expected Yield', 'अपेक्षित उत्पादन')}</span>
                      <span className="font-medium">{crop.expectedYield || 0} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('Actual Yield', 'वास्तविक उत्पादन')}</span>
                      <span className="font-medium">{crop.actualYield || 0} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('Yield per Ropani', 'प्रति रोपनी उत्पादन')}</span>
                      <span className="font-medium">
                        {Math.round(((crop.actualYield || crop.expectedYield || 0) / crop.area))} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('Current Stock', 'हालको स्टक')}</span>
                      <span className="font-medium">{crop.currentStock} kg</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('Weather History', 'मौसम इतिहास')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-red-500" />
                        <span>{t('Avg Temperature', 'औसत तापक्रम')}</span>
                      </div>
                      <span>{crop.weather.temperature}°C</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span>{t('Avg Humidity', 'औसत आर्द्रता')}</span>
                      </div>
                      <span>{crop.weather.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CloudRain className="h-4 w-4 text-gray-500" />
                        <span>{t('Total Rainfall', 'कुल वर्षा')}</span>
                      </div>
                      <span>{crop.weather.rainfall}mm</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{t('Additional Information', 'थप जानकारी')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium mb-1">{t('Total Seeds Used', 'प्रयोग भएका कुल बीउ')}</p>
                      <p className="text-muted-foreground">{crop.totalSeeds}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">{t('Buyers', 'खरिदकर्ताहरू')}</p>
                      <p className="text-muted-foreground">
                        {crop.buyers.length > 0 ? crop.buyers.join(', ') : t('None yet', 'अहिलेसम्म कुनै छैन')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}