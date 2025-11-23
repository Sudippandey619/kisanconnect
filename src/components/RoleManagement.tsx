import React, { useState } from 'react';
import { X, Plus, Minus, Check, AlertCircle, Users, Briefcase, Truck } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import type { User, UserRole, Language } from '../App';

interface RoleManagementProps {
  user: User;
  language: Language;
  onClose: () => void;
  onUpdateRoles: (roles: UserRole[]) => Promise<void>;
  onSwitchRole: (role: UserRole) => Promise<void>;
}

export function RoleManagement({ user, language, onClose, onUpdateRoles, onSwitchRole }: RoleManagementProps) {
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(user.roles);
  const [currentRole, setCurrentRole] = useState<UserRole>(user.currentRole);
  const [isUpdating, setIsUpdating] = useState(false);

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  const roleInfo = {
    farmer: {
      icon: '👨‍🌾',
      iconComponent: <Users className="h-5 w-5" />,
      title: t('Farmer', 'किसान'),
      description: t('Sell your crops, manage inventory, and track orders', 'आफ्ना बालीहरू बेच्नुहोस्, स्टक व्यवस्थापन गर्नुहोस्, र अर्डरहरू ट्र्याक गर्नुहोस्'),
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-700'
    },
    consumer: {
      icon: '🛒',
      iconComponent: <Briefcase className="h-5 w-5" />,
      title: t('Consumer', 'उपभोक्ता'),
      description: t('Browse and buy fresh produce directly from farmers', 'किसानहरूबाट सिधै ताजा उत्पादनहरू खोज्नुहोस् र किन्नुहोस्'),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700'
    },
    driver: {
      icon: '🚚',
      iconComponent: <Truck className="h-5 w-5" />,
      title: t('Driver', 'चालक'),
      description: t('Accept delivery requests and earn by transporting goods', 'डिलिभरी अनुरोधहरू स्वीकार गर्नुहोस् र सामान ढुवानी गरेर कमाउनुहोस्'),
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-700'
    }
  };

  const allRoles: UserRole[] = ['farmer', 'consumer', 'driver'];

  const toggleRole = (role: UserRole) => {
    if (selectedRoles.includes(role)) {
      // Don't allow removing the last role
      if (selectedRoles.length === 1) return;
      
      setSelectedRoles(prev => prev.filter(r => r !== role));
      
      // If removing current role, switch to another available role
      if (role === currentRole && selectedRoles.length > 1) {
        const newCurrentRole = selectedRoles.find(r => r !== role);
        if (newCurrentRole) {
          setCurrentRole(newCurrentRole);
        }
      }
    } else {
      setSelectedRoles(prev => [...prev, role]);
    }
  };

  const handleSave = async () => {
    if (selectedRoles.length === 0) return;
    
    setIsUpdating(true);
    try {
      // Update roles first
      await onUpdateRoles(selectedRoles);
      
      // Switch to current role if needed
      if (selectedRoles.includes(currentRole)) {
        await onSwitchRole(currentRole);
      } else {
        // If current role is not in selected roles, switch to first selected role
        await onSwitchRole(selectedRoles[0]);
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating roles:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges = JSON.stringify(selectedRoles.sort()) !== JSON.stringify(user.roles.sort()) || 
                   currentRole !== user.currentRole;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200 dark:border-emerald-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">
            {t('Manage Your Roles', 'आफ्ना भूमिकाहरू व्यवस्थापन गर्नुहोस्')}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t(
                'You can have multiple roles and switch between them anytime.',
                'तपाईं धेरै भूमिकाहरू राख्न सक्नुहुन्छ र कुनै पनि समयमा तिनीहरूको बीचमा स्विच गर्न सक्नुहुन्छ।'
              )}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">
              {t('Available Roles', 'उपलब्ध भूमिकाहरू')}
            </h3>
            
            {allRoles.map((role) => {
              const info = roleInfo[role];
              const isSelected = selectedRoles.includes(role);
              const isCurrent = role === currentRole;
              
              return (
                <div
                  key={role}
                  className={`relative border-2 rounded-xl p-4 transition-all duration-200 ${
                    isSelected 
                      ? `${info.borderColor} ${info.bgColor}` 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${isSelected ? info.bgColor : 'bg-gray-100 dark:bg-gray-700'}`}>
                        <span className="text-xl">{info.icon}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${isSelected ? info.color : 'text-gray-900 dark:text-gray-100'}`}>
                            {info.title}
                          </h4>
                          {isCurrent && isSelected && (
                            <Badge className="text-xs bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200">
                              {t('Current', 'हालको')}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {info.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Switch
                        checked={isSelected}
                        onCheckedChange={() => toggleRole(role)}
                        disabled={isSelected && selectedRoles.length === 1}
                      />
                      {isSelected && selectedRoles.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentRole(role)}
                          disabled={isCurrent}
                          className={`text-xs h-7 px-2 ${isCurrent ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
                        >
                          {isCurrent ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : null}
                          {t('Set as Primary', 'मुख्य बनाउनुहोस्')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedRoles.length === 0 && (
            <Alert className="border-red-200 dark:border-red-700">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-600 dark:text-red-400">
                {t('You must select at least one role.', 'तपाईंले कम्तिमा एक भूमिका छनोट गर्नुपर्छ।')}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t('Cancel', 'रद्द गर्नुहोस्')}
            </Button>
            <Button
              onClick={handleSave}
              disabled={selectedRoles.length === 0 || !hasChanges || isUpdating}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  {t('Updating...', 'अद्यावधिक गर्दै...')}
                </>
              ) : (
                t('Save Changes', 'परिवर्तनहरू सुरक्षित गर्नुहोस्')
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}