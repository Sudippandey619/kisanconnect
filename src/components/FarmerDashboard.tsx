import React, { useState } from 'react';
import { Plus, Camera, Package, TrendingUp, Clock, CheckCircle, XCircle, Wallet, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { User } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FarmerDashboardProps {
  user: User;
}

interface Crop {
  id: string;
  name: string;
  nameNepali: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  category: string;
  image: string;
  status: 'available' | 'sold_out' | 'pending';
  description: string;
}

interface Order {
  id: string;
  consumer: string;
  items: { crop: Crop; quantity: number }[];
  total: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
}

export function FarmerDashboard({ user }: FarmerDashboardProps) {
  const [crops, setCrops] = useState<Crop[]>([
    {
      id: '1',
      name: 'Tomato',
      nameNepali: 'गोलभेंडा',
      quantity: 50,
      unit: 'kg',
      pricePerUnit: 80,
      category: 'vegetables',
      image: 'https://images.unsplash.com/photo-1546470427-227f47e0ed63?w=200',
      status: 'available',
      description: 'ताजा र स्वस्थ गोलभेंडा'
    },
    {
      id: '2',
      name: 'Carrot',
      nameNepali: 'गाजर',
      quantity: 30,
      unit: 'kg',
      pricePerUnit: 60,
      category: 'vegetables',
      image: 'https://images.unsplash.com/photo-1556909114-3e7a5c4d7d13?w=200',
      status: 'available',
      description: 'मिठो र पोषणयुक्त गाजर'
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      consumer: 'श्याम शर्मा',
      items: [{ crop: crops[0], quantity: 5 }],
      total: 400,
      status: 'pending',
      createdAt: '2024-01-15T10:30:00Z'
    }
  ]);

  const [showAddCrop, setShowAddCrop] = useState(false);
  const [newCrop, setNewCrop] = useState({
    name: '',
    nameNepali: '',
    quantity: '',
    unit: 'kg',
    pricePerUnit: '',
    category: 'vegetables',
    description: ''
  });

  const totalEarnings = 15420;
  const monthlyEarnings = 5240;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const availableItems = crops.filter(c => c.status === 'available').length;

  const handleAddCrop = () => {
    const crop: Crop = {
      id: Date.now().toString(),
      name: newCrop.name,
      nameNepali: newCrop.nameNepali,
      quantity: parseInt(newCrop.quantity),
      unit: newCrop.unit,
      pricePerUnit: parseInt(newCrop.pricePerUnit),
      category: newCrop.category,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200',
      status: 'available',
      description: newCrop.description
    };
    setCrops([...crops, crop]);
    setNewCrop({
      name: '',
      nameNepali: '',
      quantity: '',
      unit: 'kg',
      pricePerUnit: '',
      category: 'vegetables',
      description: ''
    });
    setShowAddCrop(false);
  };

  const handleOrderAction = (orderId: string, action: 'accept' | 'reject') => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: action === 'accept' ? 'accepted' : 'rejected' }
        : order
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'sold_out': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-4">
        <h2 className="text-xl font-bold mb-1">नमस्ते, {user.name} जी</h2>
        <p className="text-muted-foreground text-sm">आजको दिन शुभ होस्! तपाईंको खेती कस्तो छ?</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-300">कुल आम्दानी</span>
            </div>
            <p className="text-xl font-bold text-green-800 dark:text-green-200">रु. {totalEarnings.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-700 dark:text-orange-300">यो महिना</span>
            </div>
            <p className="text-xl font-bold text-orange-800 dark:text-orange-200">रु. {monthlyEarnings.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">पेन्डिङ अर्डर</span>
            </div>
            <p className="text-xl font-bold">{pendingOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-muted-foreground">उपलब्ध वस्तु</span>
            </div>
            <p className="text-xl font-bold">{availableItems}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory">मेरो फसल</TabsTrigger>
          <TabsTrigger value="orders">अर्डरहरू ({pendingOrders})</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">मेरा फसलहरू</h3>
            <Dialog open={showAddCrop} onOpenChange={setShowAddCrop}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-1" />
                  थप्नुहोस्
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>नयाँ फसल थप्नुहोस्</DialogTitle>
                  <DialogDescription>
                    नयाँ फसलको जानकारी प्रविष्ट गर्नुहोस्
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Name (English)"
                      value={newCrop.name}
                      onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                    />
                    <Input
                      placeholder="नाम (नेपाली)"
                      value={newCrop.nameNepali}
                      onChange={(e) => setNewCrop({...newCrop, nameNepali: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="परिमाण"
                      value={newCrop.quantity}
                      onChange={(e) => setNewCrop({...newCrop, quantity: e.target.value})}
                    />
                    <Select value={newCrop.unit} onValueChange={(value) => setNewCrop({...newCrop, unit: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">किलो</SelectItem>
                        <SelectItem value="piece">थान</SelectItem>
                        <SelectItem value="bundle">बन्डल</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Input
                    type="number"
                    placeholder="प्रति इकाई मूल्य (���ु.)"
                    value={newCrop.pricePerUnit}
                    onChange={(e) => setNewCrop({...newCrop, pricePerUnit: e.target.value})}
                  />

                  <Select value={newCrop.category} onValueChange={(value) => setNewCrop({...newCrop, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="श्रेणी" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetables">तरकारी</SelectItem>
                      <SelectItem value="fruits">फलफूल</SelectItem>
                      <SelectItem value="grains">अनाज</SelectItem>
                      <SelectItem value="dairy">दुग्ध</SelectItem>
                    </SelectContent>
                  </Select>

                  <Textarea
                    placeholder="विवरण"
                    value={newCrop.description}
                    onChange={(e) => setNewCrop({...newCrop, description: e.target.value})}
                  />

                  <Button 
                    onClick={handleAddCrop}
                    className="w-full"
                    disabled={!newCrop.name || !newCrop.quantity || !newCrop.pricePerUnit}
                  >
                    फसल थप्नुहोस्
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {crops.map((crop) => (
              <Card key={crop.id}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <ImageWithFallback
                      src={crop.image}
                      alt={crop.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="font-medium">{crop.nameNepali}</h4>
                          <p className="text-sm text-muted-foreground">{crop.name}</p>
                        </div>
                        <Badge className={getStatusColor(crop.status)}>
                          {crop.status === 'available' ? 'उपलब्ध' : 
                           crop.status === 'sold_out' ? 'सकियो' : 'पेन्डिङ'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="font-medium">रु. {crop.pricePerUnit}</span>
                          <span className="text-muted-foreground">/{crop.unit}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {crop.quantity} {crop.unit} बाँकी
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <h3 className="text-lg font-semibold">नयाँ अर्डरहरू</h3>
          
          <div className="space-y-3">
            {orders.filter(o => o.status === 'pending').map((order) => (
              <Card key={order.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                          {order.consumer.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{order.consumer}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('ne-NP')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      रु. {order.total}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.crop.nameNepali}</span>
                        <span>{item.quantity} {item.crop.unit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleOrderAction(order.id, 'accept')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      स्वीकार
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOrderAction(order.id, 'reject')}
                      className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      अस्वीकार
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {orders.filter(o => o.status === 'pending').length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">कुनै नयाँ अर्डर छैन</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}