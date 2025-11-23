import React, { useState } from 'react';
import { Search, Filter, ShoppingCart, Plus, Minus, Star, MapPin, Clock, Truck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ConsumerDashboardProps {
  user: User;
}

interface Product {
  id: string;
  name: string;
  nameNepali: string;
  farmer: string;
  farmerLocation: string;
  price: number;
  unit: string;
  image: string;
  rating: number;
  category: string;
  inStock: number;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'ordered' | 'accepted' | 'preparing' | 'shipped' | 'delivered';
  createdAt: string;
  estimatedDelivery: string;
  driver?: string;
}

export function ConsumerDashboard({ user }: ConsumerDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const categories = [
    { id: 'all', name: 'सबै', nameNepali: 'सबै' },
    { id: 'vegetables', name: 'Vegetables', nameNepali: 'तरकारी' },
    { id: 'fruits', name: 'Fruits', nameNepali: 'फलफूल' },
    { id: 'grains', name: 'Grains', nameNepali: 'अनाज' },
    { id: 'dairy', name: 'Dairy', nameNepali: 'दुग्ध' }
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Tomato',
      nameNepali: 'गोलभेंडा',
      farmer: 'राम बहादुर',
      farmerLocation: 'काभ्रे',
      price: 80,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1546470427-227f47e0ed63?w=200',
      rating: 4.5,
      category: 'vegetables',
      inStock: 50,
      description: 'ताजा र स्वस्थ गोलभेंडा'
    },
    {
      id: '2',
      name: 'Carrot',
      nameNepali: 'गाजर',
      farmer: 'श्याम शर्मा',
      farmerLocation: 'नुवाकोट',
      price: 60,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1556909114-3e7a5c4d7d13?w=200',
      rating: 4.8,
      category: 'vegetables',
      inStock: 30,
      description: 'मिठो र पोषणयुक्त गाजर'
    },
    {
      id: '3',
      name: 'Apple',
      nameNepali: 'स्याउ',
      farmer: 'गीता देवी',
      farmerLocation: 'मुस्ताङ',
      price: 200,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200',
      rating: 4.9,
      category: 'fruits',
      inStock: 25,
      description: 'हिमाली स्याउ'
    }
  ];

  const orders: Order[] = [
    {
      id: '1',
      items: [{ ...products[0], quantity: 2 }],
      total: 160,
      status: 'shipped',
      createdAt: '2024-01-14T10:00:00Z',
      estimatedDelivery: '2024-01-15T16:00:00Z',
      driver: 'हरि बहादुर'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nameNepali.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.inStock) }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(0, Math.min(item.quantity + change, item.inStock));
        return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ordered': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ordered': return 'अर्डर गरियो';
      case 'accepted': return 'स्वीकार गरियो';
      case 'preparing': return 'तयार गर्दै';
      case 'shipped': return 'पठाइयो';
      case 'delivered': return 'डेलिभर भयो';
      default: return status;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-4">
        <h2 className="text-xl font-bold mb-1">नमस्ते, {user.name} जी</h2>
        <p className="text-muted-foreground text-sm">आज के ताजा फसल चाहियो?</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="फसल खोज्नुहोस्..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.nameNepali}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="marketplace">बजार</TabsTrigger>
          <TabsTrigger value="orders">मेरा अर्डरहरू</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-4">
          {/* Shopping Cart Button */}
          {cartItemCount > 0 && (
            <div className="fixed bottom-20 right-4 z-30">
              <Dialog open={showCart} onOpenChange={setShowCart}>
                <DialogTrigger asChild>
                  <Button className="w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 relative">
                    <ShoppingCart className="h-6 w-6" />
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                      {cartItemCount}
                    </Badge>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>मेरो कार्ट</DialogTitle>
                    <DialogDescription>
                      तपाईंको कार्टमा भएका वस्तुहरू
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 pb-3 border-b">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.nameNepali}</h4>
                          <p className="text-xs text-muted-foreground">रु. {item.price}/{item.unit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium">कुल:</span>
                        <span className="font-bold text-lg">रु. {cartTotal}</span>
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        अर्डर गर्नुहोस्
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Products Grid */}
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{product.nameNepali}</h4>
                          <p className="text-sm text-muted-foreground">{product.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">रु. {product.price}</p>
                          <p className="text-xs text-muted-foreground">/{product.unit}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-green-100 text-green-800 text-xs">
                            {product.farmer.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{product.farmer}</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{product.farmerLocation}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{product.rating}</span>
                          <span className="text-xs text-muted-foreground">({product.inStock} उपलब्ध)</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product)}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          कार्टमा हाल्नुहोस्
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <h3 className="text-lg font-semibold">मेरा अर्डरहरू</h3>
          
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium">अर्डर #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('ne-NP')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.nameNepali} x {item.quantity}</span>
                        <span>रु. {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="text-sm">
                      <p className="font-medium">कुल: रु. {order.total}</p>
                      {order.driver && (
                        <div className="flex items-center gap-1 mt-1">
                          <Truck className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">चालक: {order.driver}</span>
                        </div>
                      )}
                    </div>
                    {order.status === 'shipped' && (
                      <div className="text-right text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>आज ४ बजे सम्म</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {orders.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">तपाईंले अहिलेसम्म कुनै अर्डर गर्नुभएको छैन</p>
                  <Button className="mt-4" onClick={() => setSelectedCategory('all')}>
                    किनमेल सुरु गर्नुहोस्
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}