import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, History, TrendingUp, Shield, Zap, ArrowUpRight, ArrowDownLeft, QrCode, Smartphone, Globe, Eye, EyeOff, RefreshCw, Plus, Minus, Gift, Star, Lock, Bell, Download, Share2, Calendar, PieChart, Target, Award, Banknote, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { User, Language } from '../App';

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'payout' | 'topup' | 'transfer' | 'cashback' | 'reward';
  amount: number;
  currency: 'NPR' | 'USD';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  from?: string;
  to?: string;
  description: string;
  descriptionNepali: string;
  orderId?: string;
  paymentMethod: 'esewa' | 'khalti' | 'wallet' | 'bank' | 'cash' | 'card';
  fees: number;
  timestamp: string;
  category: 'food' | 'transport' | 'utility' | 'shopping' | 'transfer' | 'other';
  metadata?: any;
  receipt?: string;
}

interface PaymentMethod {
  id: string;
  type: 'esewa' | 'khalti' | 'bank' | 'card' | 'mobile';
  name: string;
  nameNepali: string;
  identifier: string; // Phone number, account number, etc.
  isDefault: boolean;
  verified: boolean;
  lastUsed: string;
  limits: {
    daily: number;
    monthly: number;
    transaction: number;
  };
  icon: string;
}

interface WalletData {
  balance: number;
  currency: 'NPR' | 'USD';
  frozenAmount: number;
  creditLimit: number;
  creditUsed: number;
  pendingPayouts: number;
  totalEarnings: number;
  totalSpent: number;
  loyaltyPoints: number;
  cashbackEarned: number;
  accountTier: 'basic' | 'silver' | 'gold' | 'platinum';
  monthlySpending: number;
  spendingLimit: number;
  autoReloadEnabled: boolean;
  autoReloadAmount: number;
  autoReloadThreshold: number;
}

interface Reward {
  id: string;
  title: string;
  titleNepali: string;
  description: string;
  descriptionNepali: string;
  points: number;
  value: number;
  category: string;
  expiryDate: string;
  isRedeemed: boolean;
  icon: string;
}

interface Props {
  user: User;
  language: Language;
  onClose: () => void;
  initialBalance?: number;
}

export const PaymentWalletSystem: React.FC<Props> = ({ user, language, onClose, initialBalance }) => {
  const [walletData, setWalletData] = useState<WalletData>({
    balance: initialBalance || 2450.50,
    currency: 'NPR',
    frozenAmount: 500,
    creditLimit: 50000,
    creditUsed: 12500,
    pendingPayouts: 8950,
    totalEarnings: 125000,
    totalSpent: 45000,
    loyaltyPoints: 2450,
    cashbackEarned: 1200,
    accountTier: 'gold',
    monthlySpending: 15000,
    spendingLimit: 30000,
    autoReloadEnabled: true,
    autoReloadAmount: 1000,
    autoReloadThreshold: 500
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'txn_001',
      type: 'payment',
      amount: 220,
      currency: 'NPR',
      status: 'completed',
      to: 'Fresh Vegetables Order',
      description: 'Payment for tomatoes and carrots',
      descriptionNepali: 'गोलभेंडा र गाजरको भुक्तानी',
      orderId: 'ORD_12345',
      paymentMethod: 'wallet',
      fees: 0,
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      category: 'food'
    },
    {
      id: 'txn_002',
      type: 'cashback',
      amount: 44,
      currency: 'NPR',
      status: 'completed',
      description: 'Cashback from vegetable purchase',
      descriptionNepali: 'तरकारी किन्दाको क्यासब्याक',
      orderId: 'ORD_12345',
      paymentMethod: 'wallet',
      fees: 0,
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      category: 'food'
    },
    {
      id: 'txn_003',
      type: 'topup',
      amount: 1000,
      currency: 'NPR',
      status: 'completed',
      description: 'Wallet top-up via eSewa',
      descriptionNepali: 'इसेवा मार्फत वालेट टप-अप',
      paymentMethod: 'esewa',
      fees: 20,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      category: 'transfer'
    },
    {
      id: 'txn_004',
      type: 'payout',
      amount: 2300,
      currency: 'NPR',
      status: 'pending',
      from: 'Vegetable Sales',
      description: 'Weekly payout for vegetable sales',
      descriptionNepali: 'तरकारी बिक्रीको साप्ताहिक भुक्तानी',
      paymentMethod: 'bank',
      fees: 46,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      category: 'transfer'
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1',
      type: 'esewa',
      name: 'eSewa',
      nameNepali: 'इसेवा',
      identifier: '98********45',
      isDefault: true,
      verified: true,
      lastUsed: new Date().toISOString(),
      limits: { daily: 100000, monthly: 500000, transaction: 50000 },
      icon: '💚'
    },
    {
      id: 'pm_2',
      type: 'khalti',
      name: 'Khalti',
      nameNepali: 'खल्ती',
      identifier: '98********67',
      isDefault: false,
      verified: true,
      lastUsed: new Date(Date.now() - 86400000).toISOString(),
      limits: { daily: 50000, monthly: 300000, transaction: 25000 },
      icon: '💜'
    },
    {
      id: 'pm_3',
      type: 'bank',
      name: 'Nepal Bank Limited',
      nameNepali: 'नेपाल बैंक लिमिटेड',
      identifier: '****-****-**45',
      isDefault: false,
      verified: true,
      lastUsed: new Date(Date.now() - 172800000).toISOString(),
      limits: { daily: 200000, monthly: 1000000, transaction: 100000 },
      icon: '🏦'
    }
  ]);

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: 'reward_1',
      title: 'Free Delivery Voucher',
      titleNepali: 'नि:शुल्क डेलिभरी भाउचर',
      description: 'Get free delivery on your next order',
      descriptionNepali: 'तपाईंको अर्को अर्डरमा नि:शुल्क डेलिभरी पाउनुहोस्',
      points: 500,
      value: 50,
      category: 'delivery',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isRedeemed: false,
      icon: '🚚'
    },
    {
      id: 'reward_2',
      title: '10% Discount Coupon',
      titleNepali: '१०% छुट कुपन',
      description: '10% off on organic vegetables',
      descriptionNepali: 'जैविक तरकारीमा १०% छुट',
      points: 1000,
      value: 100,
      category: 'discount',
      expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      isRedeemed: false,
      icon: '🎁'
    }
  ]);

  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('wallet');
  const [topupAmount, setTopupAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedTopupMethod, setSelectedTopupMethod] = useState('');
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Update balance from props
  useEffect(() => {
    if (initialBalance !== undefined) {
      setWalletData(prev => ({ ...prev, balance: initialBalance }));
    }
  }, [initialBalance]);

  const formatCurrency = (amount: number, currency: string = 'NPR') => {
    return `रु. ${amount.toLocaleString()}`;
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum': return '💎';
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      default: return '🥉';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'from-purple-500 to-pink-500';
      case 'gold': return 'from-yellow-500 to-orange-500';
      case 'silver': return 'from-gray-400 to-gray-600';
      default: return 'from-orange-600 to-red-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return '🍅';
      case 'transport': return '🚗';
      case 'utility': return '💡';
      case 'shopping': return '🛒';
      case 'transfer': return '💰';
      default: return '📄';
    }
  };

  const handleTopUp = async () => {
    if (!topupAmount || !selectedTopupMethod) {
      toast.error(t('Please fill all fields', 'कृपया सबै फिल्डहरू भर्नुहोस्'));
      return;
    }

    const amount = parseFloat(topupAmount);
    if (amount <= 0) {
      toast.error(t('Please enter valid amount', 'कृपया मान्य रकम प्रविष्ट गर्नुहोस्'));
      return;
    }

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedMethod = paymentMethods.find(m => m.id === selectedTopupMethod);
      const fees = selectedMethod?.type === 'khalti' ? 0 : amount * 0.02;

      const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        type: 'topup',
        amount,
        currency: 'NPR',
        status: 'completed',
        description: `Wallet top-up via ${selectedMethod?.name}`,
        descriptionNepali: `${selectedMethod?.nameNepali} मार्फत वालेट टप-अप`,
        paymentMethod: selectedMethod?.type as any,
        fees,
        timestamp: new Date().toISOString(),
        category: 'transfer'
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setWalletData(prev => ({ 
        ...prev, 
        balance: prev.balance + amount,
        totalEarnings: prev.totalEarnings + amount 
      }));
      
      // Add loyalty points (1 point per 100 NPR)
      const pointsEarned = Math.floor(amount / 100);
      if (pointsEarned > 0) {
        setWalletData(prev => ({ 
          ...prev, 
          loyaltyPoints: prev.loyaltyPoints + pointsEarned 
        }));
      }

      setTopupAmount('');
      setSelectedTopupMethod('');
      toast.success(t(`Top-up successful! ${pointsEarned > 0 ? `+${pointsEarned} points` : ''}`, `टप-अप सफल भयो! ${pointsEarned > 0 ? `+${pointsEarned} अंक` : ''}`));
    } catch (error) {
      toast.error(t('Top-up failed', 'टप-अप असफल भयो'));
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !selectedWithdrawMethod) {
      toast.error(t('Please fill all fields', 'कृपया सबै फिल्डहरू भर्नुहोस्'));
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount <= 0) {
      toast.error(t('Please enter valid amount', 'कृपया मान्य रकम प्रविष्ट गर्नुहोस्'));
      return;
    }

    if (amount > walletData.balance - walletData.frozenAmount) {
      toast.error(t('Insufficient balance', 'अपर्याप्त मौज्दात'));
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedMethod = paymentMethods.find(m => m.id === selectedWithdrawMethod);
      const fees = amount * 0.015;

      const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        type: 'payout',
        amount,
        currency: 'NPR',
        status: 'pending',
        description: `Withdrawal to ${selectedMethod?.name}`,
        descriptionNepali: `${selectedMethod?.nameNepali} मा झिकावट`,
        paymentMethod: selectedMethod?.type as any,
        fees,
        timestamp: new Date().toISOString(),
        category: 'transfer'
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setWalletData(prev => ({ 
        ...prev, 
        balance: prev.balance - amount,
        pendingPayouts: prev.pendingPayouts + amount
      }));
      
      setWithdrawAmount('');
      setSelectedWithdrawMethod('');
      toast.success(t('Withdrawal initiated!', 'झिकावट सुरु गरियो!'));
    } catch (error) {
      toast.error(t('Withdrawal failed', 'झिकावट असफल भयो'));
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || reward.isRedeemed) return;

    if (walletData.loyaltyPoints < reward.points) {
      toast.error(t('Insufficient points', 'अपर्याप्त अंकहरू'));
      return;
    }

    setRewards(prev => prev.map(r => 
      r.id === rewardId ? { ...r, isRedeemed: true } : r
    ));
    setWalletData(prev => ({ 
      ...prev, 
      loyaltyPoints: prev.loyaltyPoints - reward.points 
    }));

    toast.success(t('Reward redeemed successfully!', 'पुरस्कार सफलतापूर्वक रिडिम गरियो!'));
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  const availableBalance = walletData.balance - walletData.frozenAmount;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-t-3xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Wallet className="h-6 w-6" />
              <h2 className="text-lg font-bold">
                {t('Smart Wallet', 'स्मार्ट वालेट')}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              ×
            </Button>
          </div>

          {/* Enhanced Wallet Balance Card */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-90">
                    {t('Available Balance', 'उपलब्ध मौज्दात')}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowBalance(!showBalance)}
                    className="h-5 w-5 text-white hover:bg-white/20"
                  >
                    {showBalance ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </Button>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20">
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="text-3xl font-bold mb-2">
                {showBalance ? formatCurrency(availableBalance) : '••••••'}
              </div>
              
              {walletData.frozenAmount > 0 && showBalance && (
                <div className="text-xs opacity-80 mb-3">
                  {t('Frozen:', 'फ्रिज:')} {formatCurrency(walletData.frozenAmount)}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getTierColor(walletData.accountTier)} flex items-center justify-center`}>
                    <span className="text-xs">{getTierIcon(walletData.accountTier)}</span>
                  </div>
                  <span className="text-sm capitalize font-medium">{walletData.accountTier} Member</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs bg-white/20 text-white flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {walletData.loyaltyPoints}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                    💰 {formatCurrency(walletData.cashbackEarned)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mx-4 mt-4">
              <TabsTrigger value="wallet" className="text-xs">
                {t('Home', 'होम')}
              </TabsTrigger>
              <TabsTrigger value="transactions" className="text-xs">
                {t('History', 'इतिहास')}
              </TabsTrigger>
              <TabsTrigger value="methods" className="text-xs">
                {t('Cards', 'कार्डहरू')}
              </TabsTrigger>
              <TabsTrigger value="rewards" className="text-xs">
                {t('Rewards', 'पुरस्कारहरू')}
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-xs">
                {t('Stats', 'तथ्याङ्क')}
              </TabsTrigger>
            </TabsList>

            {/* Wallet Home Tab */}
            <TabsContent value="wallet" className="p-4 space-y-4">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <ArrowDownLeft className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">{t('Add Money', 'पैसा थप्नुहोस्')}</p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('Add Money to Wallet', 'वालेटमा पैसा थप्नुहोस्')}</DialogTitle>
                      <DialogDescription>
                        {t('Add funds to your wallet using various payment methods', 'विभिन्न भुक्तानी विधिहरू प्रयोग गरेर आफ्नो वालेटमा रकम थप्नुहोस्')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>{t('Amount (NPR)', 'रकम (नेरू)')}</Label>
                        <Input 
                          type="number" 
                          placeholder="1000"
                          value={topupAmount}
                          onChange={(e) => setTopupAmount(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {quickAmounts.map(amount => (
                            <Button 
                              key={amount}
                              variant="outline" 
                              size="sm" 
                              onClick={() => setTopupAmount(amount.toString())}
                            >
                              {amount}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>{t('Payment Method', 'भुक्तानी विधि')}</Label>
                        <Select value={selectedTopupMethod} onValueChange={setSelectedTopupMethod}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('Choose method', 'विधि छान्नुहोस्')} />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map(method => (
                              <SelectItem key={method.id} value={method.id}>
                                {method.icon} {language === 'en' ? method.name : method.nameNepali}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={handleTopUp}
                        disabled={loading || !topupAmount || !selectedTopupMethod}
                      >
                        {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        {t('Add Money', 'पैसा थप्नुहोस्')}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <ArrowUpRight className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">{t('Withdraw', 'झिकावट')}</p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('Withdraw Money', 'पैसा झिकावट')}</DialogTitle>
                      <DialogDescription>
                        {t('Withdraw funds from your wallet to your bank account', 'आफ्नो वालेटबाट बैंक खातामा रकम झिकावट गर्नुहोस्')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>{t('Amount (NPR)', 'रकम (नेरू)')}</Label>
                        <Input 
                          type="number" 
                          placeholder="500"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          {t('Available:', 'उपलब्ध:')} {formatCurrency(availableBalance)}
                        </p>
                      </div>
                      <div>
                        <Label>{t('Withdraw to', 'कहाँ झिकावट गर्ने')}</Label>
                        <Select value={selectedWithdrawMethod} onValueChange={setSelectedWithdrawMethod}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('Choose method', 'विधि छान्नुहोस्')} />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map(method => (
                              <SelectItem key={method.id} value={method.id}>
                                {method.icon} {language === 'en' ? method.name : method.nameNepali}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={handleWithdraw}
                        disabled={loading || !withdrawAmount || !selectedWithdrawMethod}
                      >
                        {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Minus className="h-4 w-4 mr-2" />}
                        {t('Withdraw', 'झिकावट')}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Send Money & Pay Bills */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <QrCode className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">{t('QR Pay', 'QR भुक्तानी')}</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Smartphone className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">{t('Send Money', 'पैसा पठाउनुहोस्')}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs text-gray-600">
                        {t('Total Earned', 'कुल आम्दानी')}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-emerald-600">
                      {formatCurrency(walletData.totalEarnings)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="h-4 w-4 text-orange-600" />
                      <span className="text-xs text-gray-600">
                        {t('Total Spent', 'कुल खर्च')}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-orange-600">
                      {formatCurrency(walletData.totalSpent)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Spending Progress */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{t('Monthly Spending', 'मासिक खर्च')}</span>
                    <span className="text-sm text-gray-600">
                      {formatCurrency(walletData.monthlySpending)} / {formatCurrency(walletData.spendingLimit)}
                    </span>
                  </div>
                  <Progress 
                    value={(walletData.monthlySpending / walletData.spendingLimit) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    {t('Reset on 1st of next month', 'अर्को महिनाको १ गतेमा रिसेट हुनेछ')}
                  </p>
                </CardContent>
              </Card>

              {/* Auto Reload Settings */}
              {walletData.autoReloadEnabled && (
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Zap className="h-4 w-4 text-blue-600" />
                          {t('Auto Reload Active', 'स्वचालित रिलोड सक्रिय')}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {t('Reload', 'रिलोड')} {formatCurrency(walletData.autoReloadAmount)} {t('when below', 'जब')} {formatCurrency(walletData.autoReloadThreshold)}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {t('ON', 'चालु')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pending Payouts for Farmers */}
              {user.currentRole === 'farmer' && walletData.pendingPayouts > 0 && (
                <Card className="bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-900/20 dark:to-orange-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{t('Pending Payouts', 'बाँकी भुक्तानी')}</p>
                        <p className="text-lg font-bold text-emerald-600">
                          {formatCurrency(walletData.pendingPayouts)}
                        </p>
                      </div>
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {t('Processing time: 2-3 business days', 'प्रक्रिया समय: २-३ व्यापारिक दिन')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="p-4">
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <span className="text-lg">{getCategoryIcon(transaction.category)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {language === 'en' ? transaction.description : transaction.descriptionNepali}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-600">
                                {new Date(transaction.timestamp).toLocaleString()}
                              </p>
                              {transaction.orderId && (
                                <Badge variant="outline" className="text-xs">
                                  {transaction.orderId}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            ['payment', 'transfer'].includes(transaction.type) ? 'text-red-600' : 'text-emerald-600'
                          }`}>
                            {['payment', 'transfer'].includes(transaction.type) ? '-' : '+'}
                            {formatCurrency(transaction.amount)}
                          </p>
                          <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {t('Download Statement', 'विवरण डाउनलोड गर्नुहोस्')}
                </Button>
              </div>
            </TabsContent>

            {/* Payment Methods Tab */}
            <TabsContent value="methods" className="p-4">
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <Card key={method.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {method.icon}
                          </div>
                          <div>
                            <p className="font-medium">
                              {language === 'en' ? method.name : method.nameNepali}
                            </p>
                            <p className="text-sm text-gray-600">{method.identifier}</p>
                            <p className="text-xs text-gray-500">
                              {t('Daily limit:', 'दैनिक सीमा:')} {formatCurrency(method.limits.daily)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {method.verified && (
                            <Badge className="bg-emerald-100 text-emerald-800">
                              <Shield className="h-3 w-3 mr-1" />
                              {t('Verified', 'प्रमाणित')}
                            </Badge>
                          )}
                          {method.isDefault && (
                            <Badge variant="secondary">{t('Default', 'मुख्य')}</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('Add Payment Method', 'भुक्तानी विधि थप्नुहोस्')}
                </Button>
              </div>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="p-4 space-y-4">
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{t('Loyalty Points', 'लोयल्टी अंकहरू')}</p>
                      <p className="text-2xl font-bold text-purple-600">{walletData.loyaltyPoints}</p>
                    </div>
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {t('Earn 1 point for every रु. 100 spent', 'प्रत्येक रु. १०० खर्चमा १ अंक पाउनुहोस्')}
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {rewards.map((reward) => (
                  <Card key={reward.id} className={reward.isRedeemed ? 'opacity-50' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{reward.icon}</div>
                          <div>
                            <p className="font-medium text-sm">
                              {language === 'en' ? reward.title : reward.titleNepali}
                            </p>
                            <p className="text-xs text-gray-600">
                              {language === 'en' ? reward.description : reward.descriptionNepali}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {t('Worth:', 'मूल्य:')} {formatCurrency(reward.value)} • {t('Expires:', 'म्याद:')} {new Date(reward.expiryDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-purple-100 text-purple-800 mb-2">
                            {reward.points} pts
                          </Badge>
                          <br />
                          <Button 
                            size="sm" 
                            disabled={reward.isRedeemed || walletData.loyaltyPoints < reward.points}
                            onClick={() => handleRedeemReward(reward.id)}
                          >
                            {reward.isRedeemed ? t('Redeemed', 'रिडिम गरिएको') : t('Redeem', 'रिडिम गर्नुहोस्')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    {t('Spending Overview', 'खर्च सिंहावलोकन')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">{t('This Month', 'यो महिना')}</span>
                      <span className="font-medium">{formatCurrency(walletData.monthlySpending)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t('Average/Month', 'औसत/महिना')}</span>
                      <span className="font-medium">{formatCurrency(walletData.totalSpent / 12)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t('Total Cashback', 'कुल क्यासब्याक')}</span>
                      <span className="font-medium text-emerald-600">{formatCurrency(walletData.cashbackEarned)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {t('Savings Goals', 'बचत लक्ष्यहरू')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm font-medium">{t('Emergency Fund', 'आपातकालीन कोष')}</p>
                      <div className="flex justify-between text-sm mt-1">
                        <span>{formatCurrency(5000)} / {formatCurrency(10000)}</span>
                        <span>50%</span>
                      </div>
                      <Progress value={50} className="h-2 mt-2" />
                    </div>
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Savings Goal', 'बचत लक्ष्य थप्नुहोस्')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    {t('Achievements', 'उपलब्धिहरू')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl mb-1">🏆</div>
                      <p className="text-xs font-medium">{t('First Purchase', 'पहिलो खरिद')}</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl mb-1">💰</div>
                      <p className="text-xs font-medium">{t('सेभर', 'Saver')}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg opacity-50">
                      <div className="text-2xl mb-1">🌟</div>
                      <p className="text-xs font-medium">{t('VIP Member', 'VIP सदस्य')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};