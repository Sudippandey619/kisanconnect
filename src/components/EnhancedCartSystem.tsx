import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Shield, CreditCard, Wallet, CheckCircle, AlertCircle, Package, Eye, MapIcon, Phone, MessageSquare, Star, Clock, Truck, Search, Filter, Heart, Gift, Percent, Bell, Lock, Fingerprint, QrCode, RefreshCw, Calendar, Users, Zap, FileText, Download, History, TrendingUp, Banknote, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { User, Language } from '../App';
import OrderManager from '../utils/orderManagement';
import WalletManager from '../utils/walletManagement';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  nameNepali: string;
  farmer: string;
  farmerNepali: string;
  price: number;
  originalPrice: number;
  quantity: number;
  unit: string;
  image: string;
  maxQuantity: number;
  verified: boolean;
  fresh: boolean;
  organic: boolean;
  rating: number;
  distance: string;
  savedForLater?: boolean;
  subscriptionEligible?: boolean;
}

interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minOrder: number;
  description: string;
  descriptionNepali: string;
  expiryDate: string;
  isActive: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'wallet' | 'card' | 'bank' | 'digital';
  name: string;
  nameNepali: string;
  icon: string;
  balance?: number;
  lastFour?: string;
  isDefault: boolean;
  verified: boolean;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  statusNepali: string;
  createdAt: string;
  estimatedDelivery: string;
  trackingId: string;
  paymentMethod: string;
  deliveryAddress: string;
}

interface Props {
  user: User;
  language: Language;
  onClose: () => void;
  onCartUpdate?: (itemCount: number) => void;
}

export const EnhancedCartSystem: React.FC<Props> = ({ user, language, onClose, onCartUpdate }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
    {
      code: 'FRESH20',
      discount: 20,
      type: 'percentage',
      minOrder: 500,
      description: '20% off on fresh vegetables',
      descriptionNepali: 'ताजा तरकारीमा २०% छुट',
      expiryDate: '2024-12-31',
      isActive: true
    },
    {
      code: 'WELCOME100',
      discount: 100,
      type: 'fixed',
      minOrder: 300,
      description: 'Rs. 100 off for new customers',
      descriptionNepali: 'नयाँ ग्राहकहरूको लागि रु. १०० छुट',
      expiryDate: '2024-12-31',
      isActive: true
    }
  ]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [autoReorder, setAutoReorder] = useState(false);
  const [securePayment, setSecurePayment] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [activeTab, setActiveTab] = useState('cart');
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [showWallet, setShowWallet] = useState(false);
  const [walletBalance, setWalletBalance] = useState(WalletManager.getBalance());
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'wallet',
      type: 'wallet',
      name: 'KisanConnect Wallet',
      nameNepali: 'किसान कनेक्ट वालेट',
      icon: '💰',
      balance: 2450,
      isDefault: true,
      verified: true
    },
    {
      id: 'esewa',
      type: 'digital',
      name: 'eSewa',
      nameNepali: 'इसेवा',
      icon: '📱',
      isDefault: false,
      verified: true
    },
    {
      id: 'khalti',
      type: 'digital',
      name: 'Khalti',
      nameNepali: 'खल्ती',
      icon: '💜',
      isDefault: false,
      verified: true
    },
    {
      id: 'bank',
      type: 'bank',
      name: 'Bank Transfer',
      nameNepali: 'बैंक स्थानान्तरण',
      icon: '🏦',
      isDefault: false,
      verified: true
    }
  ]);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Load recent orders from OrderManager
  useEffect(() => {
    const recentOrders = OrderManager.getRecentOrders(3);
    setOrders(recentOrders);
  }, []);

  // Sample cart items for demo
  useEffect(() => {
    const demoCartItems: CartItem[] = [
      {
        id: 'cart_1',
        productId: '1',
        name: 'Fresh Tomatoes',
        nameNepali: 'ताजा गोलभेंडा',
        farmer: 'Ram Bahadur',
        farmerNepali: 'राम बहादुर',
        price: 80,
        originalPrice: 100,
        quantity: 2,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1546470427-e5869c9b1b0e?w=300',
        maxQuantity: 10,
        verified: true,
        fresh: true,
        organic: false,
        rating: 4.8,
        distance: '2.5 km',
        subscriptionEligible: true
      },
      {
        id: 'cart_2',
        productId: '2',
        name: 'Organic Carrots',
        nameNepali: 'जैविक गाजर',
        farmer: 'Sita Devi',
        farmerNepali: 'सीता देवी',
        price: 60,
        originalPrice: 75,
        quantity: 1,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=300',
        maxQuantity: 15,
        verified: true,
        fresh: true,
        organic: true,
        rating: 4.9,
        distance: '1.8 km',
        subscriptionEligible: true
      }
    ];
    setCartItems(demoCartItems);
    onCartUpdate?.(demoCartItems.reduce((sum, item) => sum + item.quantity, 0));

    // Update wallet balance from payment method
    setPaymentMethods(prev => prev.map(p => 
      p.id === 'wallet' ? { ...p, balance: walletBalance } : p
    ));
  }, [walletBalance, onCartUpdate]);

  // Cart calculation functions
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    const itemDiscount = cartItems.reduce((total, item) => total + ((item.originalPrice - item.price) * item.quantity), 0);
    const promoDiscount = appliedPromo ? 
      (appliedPromo.type === 'percentage' ? 
        (calculateSubtotal() * appliedPromo.discount / 100) : 
        appliedPromo.discount) : 0;
    return itemDiscount + promoDiscount;
  };

  const calculateDeliveryFee = () => {
    return calculateSubtotal() > 500 ? 0 : 50;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const promoDiscount = appliedPromo ? 
      (appliedPromo.type === 'percentage' ? 
        (subtotal * appliedPromo.discount / 100) : 
        appliedPromo.discount) : 0;
    return subtotal - promoDiscount + calculateDeliveryFee();
  };

  // Cart actions
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    setCartItems(prev => {
      const updatedItems = prev.map(item => 
        item.id === itemId ? { ...item, quantity: Math.min(newQuantity, item.maxQuantity) } : item
      );
      onCartUpdate?.(updatedItems.reduce((sum, item) => sum + item.quantity, 0));
      return updatedItems;
    });
  };

  const removeItem = (itemId: string) => {
    setCartItems(prev => {
      const updatedItems = prev.filter(item => item.id !== itemId);
      onCartUpdate?.(updatedItems.reduce((sum, item) => sum + item.quantity, 0));
      return updatedItems;
    });
    toast.success(t('Item removed from cart', 'वस्तु कार्टबाट हटाइयो'));
  };

  const saveForLater = (itemId: string) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) {
      setSavedItems(prev => [...prev, { ...item, savedForLater: true }]);
      removeItem(itemId);
      toast.success(t('Saved for later', 'पछिको लागि सेभ गरियो'));
    }
  };

  const moveToCart = (itemId: string) => {
    const item = savedItems.find(i => i.id === itemId);
    if (item) {
      setCartItems(prev => {
        const updatedItems = [...prev, { ...item, savedForLater: false }];
        onCartUpdate?.(updatedItems.reduce((sum, item) => sum + item.quantity, 0));
        return updatedItems;
      });
      setSavedItems(prev => prev.filter(i => i.id !== itemId));
      toast.success(t('Moved to cart', 'कार्टमा सारियो'));
    }
  };

  const applyPromoCode = () => {
    const promo = promoCodes.find(p => 
      p.code.toLowerCase() === promoInput.toLowerCase() && 
      p.isActive && 
      calculateSubtotal() >= p.minOrder
    );
    
    if (promo) {
      setAppliedPromo(promo);
      setPromoInput('');
      setShowPromoDialog(false);
      toast.success(t('Promo code applied!', 'प्रोमो कोड लागू गरियो!'));
    } else {
      toast.error(t('Invalid or expired promo code', 'अमान्य वा म्याद सकिएको प्रोमो कोड'));
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    toast.success(t('Promo code removed', 'प्रोमो कोड हटाइयो'));
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error(t('Cart is empty', 'कार्ट खाली छ'));
      return;
    }
    setSelectedPaymentMethod(paymentMethods.find(p => p.isDefault) || paymentMethods[0]);
    setShowCheckout(true);
  };

  const processOrder = async () => {
    if (!selectedPaymentMethod || !deliveryAddress.trim()) {
      toast.error(t('Please fill all required fields', 'कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्'));
      return;
    }

    if (biometricAuth) {
      // Simulate biometric authentication
      toast.info(t('Authenticating with biometrics...', 'बायोमेट्रिक्सको साथ प्रमाणीकरण गर्दै...'));
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setIsProcessingPayment(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const orderId = 'ORD_' + Date.now();
      const newOrder: Order = {
        id: orderId,
        items: [...cartItems],
        total: calculateTotal(),
        status: 'confirmed',
        statusNepali: 'पुष्टि भएको',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        trackingId: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        paymentMethod: selectedPaymentMethod.name,
        deliveryAddress
      };

      setOrders(prev => [newOrder, ...prev]);
      setLastOrderId(orderId);
      
      // Process payment and create order
      let paymentSuccess = false;
      
      if (selectedPaymentMethod.type === 'wallet') {
        paymentSuccess = WalletManager.deductMoney(
          calculateTotal(), 
          orderId, 
          `Payment for order ${orderId}`
        );
        if (paymentSuccess) {
          setWalletBalance(WalletManager.getBalance());
        }
      } else {
        // For other payment methods, assume success for demo
        paymentSuccess = true;
      }

      if (!paymentSuccess) {
        throw new Error('Payment failed - insufficient balance');
      }

      // Create order in OrderManager
      const createdOrder = OrderManager.createOrder({
        id: orderId,
        items: cartItems.map(item => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          nameNepali: item.nameNepali,
          farmer: item.farmer,
          farmerNepali: item.farmerNepali,
          price: item.price * item.quantity,
          originalPrice: item.originalPrice * item.quantity,
          quantity: item.quantity,
          unit: item.unit,
          image: item.image,
          maxQuantity: item.maxQuantity,
          verified: item.verified,
          fresh: item.fresh,
          organic: item.organic,
          rating: item.rating,
          distance: item.distance
        })),
        total: calculateTotal(),
        paymentMethod: selectedPaymentMethod.name,
        deliveryAddress,
        customer: {
          name: user.name,
          nameNepali: user.nameNepali,
          phone: user.phone,
          address: deliveryAddress,
          addressNepali: deliveryAddress
        },
        deliveryFee: calculateDeliveryFee(),
        discount: calculateDiscount(),
        promoCode: appliedPromo?.code,
        specialInstructions: orderNotes
      });

      setOrders(prev => [createdOrder, ...prev]);

      // Clear cart
      setCartItems([]);
      setAppliedPromo(null);
      
      setShowCheckout(false);
      setShowOrderSuccess(true);
      
      toast.success(t('Order placed successfully!', 'अर्डर सफलतापूर्वक राखियो!'));
    } catch (error) {
      toast.error(t('Payment failed. Please try again.', 'भुक्तानी असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।'));
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const addMoneyToWallet = (amount: number) => {
    WalletManager.addMoney(amount, 'quick_topup', `Quick top-up of रु. ${amount}`);
    setWalletBalance(WalletManager.getBalance());
    toast.success(t(`रु. ${amount} added to wallet`, `वालेटमा रु. ${amount} थपियो`));
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-t-3xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6" />
              <h2 className="text-lg font-bold">
                {t('Smart Cart', 'स्मार्ट कार्ट')}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white">
                {cartItems.length} {t('items', 'वस्तुहरू')}
              </Badge>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                ×
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
              <TabsTrigger value="cart" className="text-xs">
                {t('Cart', 'कार्ट')} ({cartItems.length})
              </TabsTrigger>
              <TabsTrigger value="saved" className="text-xs">
                {t('Saved', 'सेभ गरिएको')} ({savedItems.length})
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-xs">
                {t('Orders', 'अर्डरहरू')} ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                {t('Settings', 'सेटिङहरू')}
              </TabsTrigger>
            </TabsList>

            {/* Cart Tab */}
            <TabsContent value="cart" className="p-4 space-y-4">
              {cartItems.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {t('Your cart is empty', 'तपाईंको कार्ट खाली छ')}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {t('Add some fresh products to get started!', 'सुरु गर्न केही ताजा उत्पादनहरू थप्नुहोस्!')}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm leading-tight">
                                    {language === 'en' ? item.name : item.nameNepali}
                                  </h4>
                                  <p className="text-xs text-gray-600 mt-1">
                                    👨‍🌾 {language === 'en' ? item.farmer : item.farmerNepali}
                                    {item.verified && <span className="ml-1">✅</span>}
                                  </p>
                                  <div className="flex items-center gap-1 mt-1">
                                    {item.fresh && (
                                      <Badge className="text-xs bg-green-100 text-green-800">
                                        {t('Fresh', 'ताजा')}
                                      </Badge>
                                    )}
                                    {item.organic && (
                                      <Badge className="text-xs bg-emerald-100 text-emerald-800">
                                        {t('Organic', 'जैविक')}
                                      </Badge>
                                    )}
                                    {item.subscriptionEligible && (
                                      <Badge className="text-xs bg-blue-100 text-blue-800">
                                        {t('Subscribe', 'सदस्यता')}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-gray-400 hover:text-red-500"
                                    onClick={() => removeItem(item.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-gray-400 hover:text-blue-500"
                                    onClick={() => saveForLater(item.id)}
                                  >
                                    <Heart className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm font-medium min-w-[2rem] text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.maxQuantity}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-xs text-gray-500">
                                    /{item.unit}
                                  </span>
                                </div>
                                
                                <div className="text-right">
                                  <div className="font-bold text-emerald-600">
                                    रु. {item.price * item.quantity}
                                  </div>
                                  {item.originalPrice > item.price && (
                                    <div className="text-xs text-gray-500 line-through">
                                      रु. {item.originalPrice * item.quantity}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Promo Code Section */}
                  <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-sm">
                            {t('Promo Codes', 'प्रोमो कोडहरू')}
                          </span>
                        </div>
                        <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              {t('Apply', 'लागू गर्नुहोस्')}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t('Apply Promo Code', 'प्रोमो कोड लागू गर्नुहोस्')}</DialogTitle>
                              <DialogDescription>
                                {t('Enter a promo code or select from available offers', 'प्रोमो कोड प्रविष्ट गर्नुहोस् वा उपलब्ध प्रस्तावहरूबाट चयन गर्नुहोस्')}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex gap-2">
                                <Input
                                  placeholder={t('Enter promo code', 'प्रोमो कोड प्रविष्ट गर्नुहोस्')}
                                  value={promoInput}
                                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                />
                                <Button onClick={applyPromoCode}>
                                  {t('Apply', 'लागू गर्नुहोस्')}
                                </Button>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="font-medium">{t('Available Codes', 'उपलब्ध कोडहरू')}</h4>
                                {promoCodes.filter(p => p.isActive && calculateSubtotal() >= p.minOrder).map((promo) => (
                                  <Card key={promo.code} className="cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={() => {
                                          setPromoInput(promo.code);
                                          applyPromoCode();
                                        }}>
                                    <CardContent className="p-3">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="font-medium text-sm">{promo.code}</p>
                                          <p className="text-xs text-gray-600">
                                            {language === 'en' ? promo.description : promo.descriptionNepali}
                                          </p>
                                        </div>
                                        <Badge className="bg-emerald-100 text-emerald-800">
                                          {promo.type === 'percentage' ? `${promo.discount}%` : `रु. ${promo.discount}`}
                                        </Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      {appliedPromo && (
                        <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-medium">{appliedPromo.code}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-emerald-600">
                              -{appliedPromo.type === 'percentage' ? 
                                `${appliedPromo.discount}%` : 
                                `रु. ${appliedPromo.discount}`}
                            </span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removePromoCode}>
                              ×
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Price Summary */}
                  <Card className="bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-900/20 dark:to-orange-900/20">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        {t('Order Summary', 'अर्डर सारांश')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>{t('Subtotal', 'उप-योग')}</span>
                        <span>रु. {calculateSubtotal()}</span>
                      </div>
                      {calculateDiscount() > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>{t('Total Savings', 'कुल बचत')}</span>
                          <span>-रु. {calculateDiscount()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1">
                          {t('Delivery Fee', 'डेलिभरी शुल्क')}
                          {calculateDeliveryFee() === 0 && (
                            <Badge className="text-xs bg-emerald-100 text-emerald-800">
                              {t('FREE', 'नि:शुल्क')}
                            </Badge>
                          )}
                        </span>
                        <span>{calculateDeliveryFee() === 0 ? t('FREE', 'नि:शुल्क') : `रु. ${calculateDeliveryFee()}`}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>{t('Total', 'जम्मा')}</span>
                        <span className="text-emerald-600">रु. {calculateTotal()}</span>
                      </div>
                      
                      {calculateSubtotal() < 500 && (
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                          <p className="text-xs text-orange-700 dark:text-orange-300">
                            {t('Add रु. ', 'रु. ')} {500 - calculateSubtotal()} {t(' more for free delivery!', ' थप गर्नुहोस् नि:शुल्क डेलिभरीको लागि!')}
                          </p>
                          <Progress 
                            value={(calculateSubtotal() / 500) * 100} 
                            className="h-2 mt-2"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Checkout Button */}
                  <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4">
                    <Button 
                      onClick={proceedToCheckout}
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600 text-white shadow-lg"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {t('Secure Checkout', 'सुरक्षित चेकआउट')} • रु. {calculateTotal()}
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Saved Items Tab */}
            <TabsContent value="saved" className="p-4 space-y-4">
              {savedItems.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {t('No saved items', 'कुनै सेभ गरिएको वस्तु छैन')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('Items you save for later will appear here', 'तपाईंले पछिको लागि सेभ गर्नुभएका वस्तुहरू यहाँ देखिनेछन्')}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {savedItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {language === 'en' ? item.name : item.nameNepali}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              👨‍🌾 {language === 'en' ? item.farmer : item.farmerNepali}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-bold text-emerald-600">
                                रु. {item.price}/{item.unit}
                              </span>
                              <Button size="sm" onClick={() => moveToCart(item.id)}>
                                {t('Move to Cart', 'कार्टमा सार्नुहोस्')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="p-4 space-y-4">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {t('No orders yet', 'अहिलेसम्म कुनै अर्डर छैन')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('Your order history will appear here', 'तपाईंको अर्डर इतिहास यहाँ देखिनेछ')}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-600" />
                            <span className="font-medium text-sm">{order.id}</span>
                          </div>
                          <Badge className={`text-xs ${getOrderStatusColor(order.status)}`}>
                            {language === 'en' ? order.status : order.statusNepali}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('Total Amount', 'कुल रकम')}</span>
                            <span className="font-medium">रु. {order.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('Payment Method', 'भुक्तानी विधि')}</span>
                            <span>{order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('Order Date', 'अर्डर मिति')}</span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          {order.trackingId && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">{t('Tracking ID', 'ट्र्याकिङ ID')}</span>
                              <span className="font-mono text-xs">{order.trackingId}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            {t('View Details', 'विवरण हेर्नुहोस्')}
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <MapIcon className="h-3 w-3 mr-1" />
                            {t('Track Order', 'ट्र्याक गर्नुहोस्')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="p-4 space-y-4">
              {/* Wallet Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    {t('Wallet & Payments', 'वालेट र भुक्तानी')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-900/20 dark:to-orange-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t('Wallet Balance', 'वालेट ब्यालेन्स')}</p>
                        <p className="text-xs text-gray-600">KisanConnect Wallet</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">रु. {walletBalance.toLocaleString()}</p>
                      <Button size="sm" variant="outline" className="mt-1" onClick={() => setShowWallet(true)}>
                        {t('Manage', 'व्यवस्थापन')}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => addMoneyToWallet(500)}>
                      <Plus className="h-3 w-3 mr-1" />
                      {t('Add रु. 500', 'रु. ५०० थप्नुहोस्')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addMoneyToWallet(1000)}>
                      <Plus className="h-3 w-3 mr-1" />
                      {t('Add रु. 1000', 'रु. १००० थप्नुहोस्')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Cart Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('Cart Preferences', 'कार्ट प्राथमिकताहरू')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{t('Auto Reorder', 'स्वचालित पुन: अर्डर')}</p>
                      <p className="text-xs text-gray-600">{t('Automatically reorder favorite items', 'मनपर्ने वस्तुहरू स्वचालित रूपमा पुन: अर्डर गर्नुहोस्')}</p>
                    </div>
                    <Switch checked={autoReorder} onCheckedChange={setAutoReorder} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{t('Push Notifications', 'पुश सूचनाहरू')}</p>
                      <p className="text-xs text-gray-600">{t('Get notified about price drops and offers', 'मूल्य घटाउने र अफरहरूको बारेमा सूचना पाउनुहोस्')}</p>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {t('Security Settings', 'सुरक्षा सेटिङहरू')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <div>
                        <p className="font-medium text-sm">{t('Secure Payment', 'सुरक्षित भुक्तानी')}</p>
                        <p className="text-xs text-gray-600">{t('Enhanced payment security', 'उन्नत भुक्तानी सुरक्षा')}</p>
                      </div>
                    </div>
                    <Switch checked={securePayment} onCheckedChange={setSecurePayment} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="h-4 w-4" />
                      <div>
                        <p className="font-medium text-sm">{t('Biometric Auth', 'बायोमेट्रिक प्रमाणीकरण')}</p>
                        <p className="text-xs text-gray-600">{t('Use fingerprint for checkout', 'चेकआउटको लागि फिंगरप्रिन्ट प्रयोग गर्नुहोस्')}</p>
                      </div>
                    </div>
                    <Switch checked={biometricAuth} onCheckedChange={setBiometricAuth} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">{t('Secure Checkout', 'सुरक्षित चेकआउट')}</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowCheckout(false)}>
                    ×
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Payment Methods */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      {t('Payment Method', 'भुक्तानी विधि')}
                    </Label>
                    <div className="space-y-2">
                      {paymentMethods.map((method) => (
                        <div key={method.id} 
                             className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                               selectedPaymentMethod?.id === method.id 
                                 ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                                 : 'border-gray-200 dark:border-gray-700'
                             }`}
                             onClick={() => setSelectedPaymentMethod(method)}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{method.icon}</span>
                              <div>
                                <p className="font-medium text-sm">
                                  {language === 'en' ? method.name : method.nameNepali}
                                </p>
                                {method.balance && (
                                  <p className="text-xs text-gray-600">
                                    {t('Balance: रु. ', 'ब्यालेन्स: रु. ')}{method.balance.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            {method.verified && (
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium mb-3 block">
                      {t('Delivery Address', 'डेलिभरी ठेगाना')}
                    </Label>
                    <Textarea
                      id="address"
                      placeholder={t('Enter your delivery address...', 'तपाईंको डेलिभरी ठेगाना प्रविष्ट गर्नुहोस्...')}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Order Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium mb-3 block">
                      {t('Order Notes (Optional)', 'अर्डर नोटहरू (वैकल्पिक)')}
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder={t('Any special instructions...', 'कुनै विशेष निर्देशनहरू...')}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      rows={2}
                    />
                  </div>

                  {/* Order Summary */}
                  <Card className="bg-gray-50 dark:bg-gray-800">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('Items', 'वस्तुहरू')}</span>
                        <span>{cartItems.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t('Subtotal', 'उप-योग')}</span>
                        <span>रु. {calculateSubtotal()}</span>
                      </div>
                      {calculateDiscount() > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600">
                          <span>{t('Discount', 'छुट')}</span>
                          <span>-रु. {calculateDiscount()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>{t('Delivery', 'डेलिभरी')}</span>
                        <span>{calculateDeliveryFee() === 0 ? t('FREE', 'नि:शुल्क') : `रु. ${calculateDeliveryFee()}`}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>{t('Total', 'जम्मा')}</span>
                        <span className="text-emerald-600">रु. {calculateTotal()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Place Order Button */}
                  <Button 
                    onClick={processOrder}
                    disabled={isProcessingPayment || !selectedPaymentMethod || !deliveryAddress.trim()}
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600 text-white"
                  >
                    {isProcessingPayment ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        {t('Processing...', 'प्रक्रिया गर्दै...')}
                      </>
                    ) : (
                      <>
                        {biometricAuth && <Fingerprint className="h-4 w-4 mr-2" />}
                        <Lock className="h-4 w-4 mr-2" />
                        {t('Place Order', 'अर्डर गर्नुहोस्')} • रु. {calculateTotal()}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Success Modal */}
        {showOrderSuccess && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">
                  {t('Order Placed Successfully!', 'अर्डर सफलतापूर्वक राखियो!')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('Your order has been confirmed and will be delivered soon.', 'तपाईंको अर्डर पुष्टि भएको छ र चाँडै डेलिभर गरिनेछ।')}
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                  <p className="text-sm font-medium">{t('Order ID:', 'अर्डर ID:')}</p>
                  <p className="text-lg font-mono">{lastOrderId}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => {
                    setShowOrderSuccess(false);
                    setActiveTab('orders');
                  }}>
                    {t('View Orders', 'अर्डरहरू हेर्नुहोस्')}
                  </Button>
                  <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600" onClick={() => {
                    setShowOrderSuccess(false);
                    onClose();
                  }}>
                    {t('Continue Shopping', 'किनमेल जारी राख्नुहोस्')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};