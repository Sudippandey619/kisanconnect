import React, { useState } from 'react';
import { X, Trophy, Award, Star, Target, Crown, Zap, Gift, Medal, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import type { User, Language } from '../App';

interface GamificationSystemProps {
  user: User;
  language: Language;
  onClose: () => void;
}

export function GamificationSystem({ user, language, onClose }: GamificationSystemProps) {
  const [currentTab, setCurrentTab] = useState('achievements');

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  // Mock achievements data
  const achievements = [
    {
      id: 1,
      title: t('First Harvest', 'पहिलो फसल'),
      description: t('Complete your first crop harvest', 'आफ्नो पहिलो बाली फसल पूरा गर्नुहोस्'),
      icon: '🌾',
      points: 100,
      unlocked: true,
      date: '2024-01-10'
    },
    {
      id: 2,
      title: t('Quality Champion', 'गुणस्तर च्याम्पियन'),
      description: t('Maintain 5-star quality rating for 30 days', '३० दिनसम्म ५ स्टार गुणस्तर मूल्याङ्कन कायम राख्नुहोस्'),
      icon: '⭐',
      points: 250,
      unlocked: true,
      date: '2024-01-15'
    },
    {
      id: 3,
      title: t('Community Helper', 'समुदायिक सहायक'),
      description: t('Help 10 farmers with advice', '१० किसानहरूलाई सल्लाहको साथ मद्दत गर्नुहोस्'),
      icon: '🤝',
      points: 200,
      unlocked: false,
      progress: 6
    }
  ];

  const leaderboard = [
    { rank: 1, name: t('Ram Bahadur', 'राम बहादुर'), points: 2450, badge: 'Gold' },
    { rank: 2, name: t('Sita Devi', 'सीता देवी'), points: 2280, badge: 'Silver' },
    { rank: 3, name: t('Krishna Kumar', 'कृष्ण कुमार'), points: 2150, badge: 'Bronze' },
    { rank: 4, name: user.name, points: 1890, badge: 'Member' },
    { rank: 5, name: t('Maya Sharma', 'माया शर्मा'), points: 1750, badge: 'Member' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-emerald-200 dark:border-emerald-700 shadow-2xl"
            style={{
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-emerald-100 dark:border-emerald-700">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            {t('Achievements & Rewards', 'उपलब्धि र पुरस्कार')}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-yellow-50 dark:bg-yellow-900/20">
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                {t('Achievements', 'उपलब्धिहरू')}
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                {t('Leaderboard', 'लिडरबोर्ड')}
              </TabsTrigger>
              <TabsTrigger value="challenges" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                {t('Challenges', 'चुनौतीहरू')}
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                {t('Rewards', 'पुरस्कारहरू')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <Card key={achievement.id} className={`hover:shadow-lg transition-all duration-200 ${
                    achievement.unlocked ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20' : ''
                  }`}
                        style={{
                          transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '2deg' : '-2deg'})`,
                        }}>
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h3 className="font-semibold mb-2">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className={achievement.unlocked ? 'bg-yellow-500 text-white' : 'bg-gray-500 text-white'}>
                          {achievement.points} pts
                        </Badge>
                        {achievement.unlocked ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          achievement.progress && (
                            <div className="text-xs text-gray-500">
                              {achievement.progress}/10
                            </div>
                          )
                        )}
                      </div>
                      {achievement.progress && !achievement.unlocked && (
                        <Progress value={(achievement.progress / 10) * 100} className="mt-2" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <Card key={entry.rank} className={`hover:shadow-lg transition-all duration-200 ${
                    entry.name === user.name ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20' : ''
                  }`}
                        style={{
                          transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '1deg' : '-1deg'})`,
                        }}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          entry.rank === 1 ? 'bg-yellow-500' : 
                          entry.rank === 2 ? 'bg-gray-400' : 
                          entry.rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{entry.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{entry.points} points</p>
                        </div>
                        <Badge className={
                          entry.badge === 'Gold' ? 'bg-yellow-500 text-white' :
                          entry.badge === 'Silver' ? 'bg-gray-400 text-white' :
                          entry.badge === 'Bronze' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                        }>
                          {entry.badge}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="challenges" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <Target className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Weekly Challenges', 'साप्ताहिक चुनौतीहरू')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Complete challenges to earn extra points and rewards', 'अति���िक्त अंक र पुरस्कार कमाउन चुनौतीहरू पूरा गर्नुहोस्')}
                </p>
                <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200">
                  <Target className="h-4 w-4 mr-2" />
                  {t('View Challenges', 'चुनौतीहरू हेर्नुहोस्')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
                     style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
                  <Gift className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('Reward Store', 'पुरस्कार स्टोर')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('Redeem your points for farming tools and equipment', 'खेतीका औजार र उपकरणका लागि आफ्ना अंकहरू रिडिम गर्नुहोस्')}
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200">
                  <Gift className="h-4 w-4 mr-2" />
                  {t('Browse Rewards', 'पुरस्कारहरू ब्राउज गर्नुहोस्')}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}