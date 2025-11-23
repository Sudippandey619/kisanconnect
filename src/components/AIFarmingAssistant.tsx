import React, { useState, useRef } from 'react';
import { Camera, Upload, Brain, Bug, Leaf, TrendingUp, Calendar, Target, Zap, AlertTriangle, CheckCircle, Sparkles, Eye, BookOpen, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { User, Language } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DiseaseDetection {
  disease: string;
  diseaseNepali: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  affectedArea: number;
  symptoms: string[];
  symptomsNepali: string[];
  treatment: string[];
  treatmentNepali: string[];
  prevention: string[];
  preventionNepali: string[];
  estimatedLoss: number;
}

interface PestIdentification {
  pest: string;
  pestNepali: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  lifecycle: string;
  damage: string[];
  damageNepali: string[];
  treatment: string[];
  treatmentNepali: string[];
  biologicalControl: string[];
  biologicalControlNepali: string[];
}

interface CropRotationPlan {
  season: string;
  crops: Array<{
    name: string;
    nameNepali: string;
    duration: number;
    yield: number;
    profit: number;
    soilBenefit: string;
    soilBenefitNepali: string;
  }>;
  benefits: string[];
  benefitsNepali: string[];
}

interface YieldPrediction {
  crop: string;
  currentSeason: {
    predicted: number;
    confidence: number;
    factors: string[];
    factorsNepali: string[];
  };
  optimization: {
    potential: number;
    improvements: string[];
    improvementsNepali: string[];
    investment: number;
    roi: number;
  };
}

interface Props {
  user: User;
  language: Language;
  onClose: () => void;
}

export const AIFarmingAssistant: React.FC<Props> = ({ user, language, onClose }) => {
  const [activeTab, setActiveTab] = useState('disease');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diseaseResult, setDiseaseResult] = useState<DiseaseDetection | null>(null);
  const [pestResult, setPestResult] = useState<PestIdentification | null>(null);
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cropRotationPlan] = useState<CropRotationPlan>({
    season: 'Spring 2024',
    crops: [
      {
        name: 'Tomatoes',
        nameNepali: 'गोलभेडा',
        duration: 120,
        yield: 25,
        profit: 180000,
        soilBenefit: 'High potassium uptake',
        soilBenefitNepali: 'उच्च पोटासियम ग्रहण'
      },
      {
        name: 'Beans',
        nameNepali: 'सिमी',
        duration: 90,
        yield: 12,
        profit: 85000,
        soilBenefit: 'Nitrogen fixation',
        soilBenefitNepali: 'नाइट्रोजन स्थिरीकरण'
      },
      {
        name: 'Spinach',
        nameNepali: 'पालुंगो',
        duration: 45,
        yield: 8,
        profit: 45000,
        soilBenefit: 'Soil aeration',
        soilBenefitNepali: 'माटो वायवीकरण'
      }
    ],
    benefits: [
      'Improved soil fertility',
      'Reduced pest pressure',
      'Better nutrient cycling',
      'Increased biodiversity'
    ],
    benefitsNepali: [
      'सुधारिएको माटो उर्वरता',
      'कम कीरा दबाब',
      'राम्रो पोषक तत्व चक्रीकरण',
      'बढेको जैविक विविधता'
    ]
  });

  const [yieldPrediction] = useState<YieldPrediction>({
    crop: 'Tomatoes',
    currentSeason: {
      predicted: 24.5,
      confidence: 87,
      factors: [
        'Favorable weather conditions',
        'Good soil moisture levels',
        'Optimal planting density',
        'Proper fertilization'
      ],
      factorsNepali: [
        'अनुकूल मौसमी अवस्था',
        'राम्रो माटो आर्द्रता स्तर',
        'उत्तम रोपण घनत्व',
        'उचित मल प्रयोग'
      ]
    },
    optimization: {
      potential: 28.2,
      improvements: [
        'Install drip irrigation system',
        'Use disease-resistant varieties',
        'Implement integrated pest management',
        'Apply organic fertilizers'
      ],
      improvementsNepali: [
        'ड्रिप सिंचाई प्रणाली स्थापना',
        'रोग प्रतिरोधी किस्महरू प्रयोग',
        'एकीकृत कीरा व्यवस्थापन लागू',
        'जैविक मल प्रयोग'
      ],
      investment: 45000,
      roi: 185
    }
  });

  const t = (en: string, ne: string) => language === 'en' ? en : ne;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePlantHealth = async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockDiseaseResult: DiseaseDetection = {
      disease: 'Early Blight',
      diseaseNepali: 'प्रारम्भिक ब्लाइट',
      confidence: 89,
      severity: 'medium',
      affectedArea: 15,
      symptoms: [
        'Dark spots with concentric rings on leaves',
        'Yellowing of lower leaves',
        'Premature leaf drop'
      ],
      symptomsNepali: [
        'पातहरूमा केन्द्रित वृत्त भएका कालो दागहरू',
        'तल्लो पातहरूको पहेंलो हुनु',
        'समयअघि पात झर्नु'
      ],
      treatment: [
        'Apply copper-based fungicide',
        'Remove affected leaves',
        'Improve air circulation',
        'Reduce watering frequency'
      ],
      treatmentNepali: [
        'तामा आधारित फङ्गिसाइड प्रयोग गर्नुहोस्',
        'प्रभावित पातहरू हटाउनुहोस्',
        'हावा चलाचल सुधार गर्नुहोस्',
        'पानी दिने आवृत्ति कम गर्नुहोस्'
      ],
      prevention: [
        'Rotate crops annually',
        'Water at soil level',
        'Apply preventive fungicide',
        'Remove plant debris'
      ],
      preventionNepali: [
        'वार्षिक बाली फेरबदल गर्नुहोस्',
        'माटोको स्तरमा पानी दिनुहोस्',
        'रोकथाम फङ्गिसाइड प्रयोग गर्नुहोस्',
        'बिरुवाको फोहर हटाउनुहोस्'
      ],
      estimatedLoss: 25
    };

    setDiseaseResult(mockDiseaseResult);
    setIsAnalyzing(false);
    toast.success(t('Analysis complete!', 'विश्लेषण पूरा भयो!'));
  };

  const analyzePest = async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockPestResult: PestIdentification = {
      pest: 'Aphids',
      pestNepali: 'माहुरी',
      confidence: 94,
      riskLevel: 'medium',
      lifecycle: '7-10 days',
      damage: [
        'Yellowing and curling of leaves',
        'Stunted plant growth',
        'Honeydew secretion',
        'Virus transmission'
      ],
      damageNepali: [
        'पातहरू पहेंलो र बाङ्गो हुनु',
        'बिरुवाको वृद्धि रोकिनु',
        'मह शिशिर स्राव',
        'भाइरस सर्ने'
      ],
      treatment: [
        'Spray neem oil solution',
        'Use insecticidal soap',
        'Apply systemic insecticide',
        'Increase beneficial insects'
      ],
      treatmentNepali: [
        'नीमको तेल घोल छर्कनुहोस्',
        'कीड़ानाशक साबुन प्रयोग गर्नुहोस्',
        'प्रणालीगत कीड़ानाशक लगाउनुहोस्',
        'फाइदाजनक कीराहरू बढाउनुहोस्'
      ],
      biologicalControl: [
        'Release ladybugs',
        'Attract lacewings',
        'Plant companion herbs',
        'Use sticky traps'
      ],
      biologicalControlNepali: [
        'लेडीबगहरू ���ोड्नुहोस्',
        'लेसविङहरू आकर्षित गर्नुहोस्',
        'साथी जडीबुटीहरू रोप्नुहोस्',
        'चिपचिपाहट जालहरू प्रयोग गर्नुहोस्'
      ]
    };

    setPestResult(mockPestResult);
    setIsAnalyzing(false);
    toast.success(t('Pest identified!', 'कीरा पहिचान भयो!'));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-t-3xl h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6" />
              <h2 className="text-lg font-bold">{t('AI Farming Assistant', 'AI कृषि सहायक')}</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              ×
            </Button>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8" />
                <div>
                  <h3 className="font-bold">{t('Intelligent Crop Management', 'बुद्धिमान बाली व्यवस्थापन')}</h3>
                  <p className="text-sm opacity-90">
                    {t('AI-powered insights for better farming', 'राम्रो खेतीका लागि AI-संचालित अन्तर्दृष्टि')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
              <TabsTrigger value="disease" className="text-xs">
                {t('Disease', 'रोग')}
              </TabsTrigger>
              <TabsTrigger value="pest" className="text-xs">
                {t('Pest', 'कीरा')}
              </TabsTrigger>
              <TabsTrigger value="rotation" className="text-xs">
                {t('Rotation', 'फेरबदल')}
              </TabsTrigger>
              <TabsTrigger value="yield" className="text-xs">
                {t('Yield', 'उत्पादन')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="disease" className="p-4 space-y-4">
              {/* Image Upload for Disease Detection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-emerald-600" />
                    {t('Disease Detection', 'रोग पहिचान')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!uploadedImage ? (
                    <div className="space-y-3">
                      <div 
                        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm font-medium">{t('Upload plant photo', 'बिरुवाको फोटो अपलोड गर्नुहोस्')}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {t('Take a clear photo of affected leaves', 'प्रभावित पातहरूको स्पष्ट फोटो लिनुहोस्')}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="h-4 w-4 mr-2" />
                          {t('Upload', 'अपलोड')}
                        </Button>
                        <Button variant="outline">
                          <Camera className="h-4 w-4 mr-2" />
                          {t('Camera', 'क्यामेरा')}
                        </Button>
                      </div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <img 
                          src={uploadedImage} 
                          alt="Plant" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setUploadedImage(null);
                            setDiseaseResult(null);
                          }}
                          className="absolute top-2 right-2"
                        >
                          ×
                        </Button>
                      </div>
                      
                      <Button 
                        onClick={analyzePlantHealth}
                        disabled={isAnalyzing}
                        className="w-full bg-gradient-to-r from-emerald-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {t('Analyzing...', 'विश्लेषण गर्दै...')}
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            {t('Analyze Plant Health', 'बिरुवा स्वास्थ्य विश्लेषण गर्नुहोस्')}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Disease Analysis Results */}
              {diseaseResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      {t('Disease Identified', 'रोग पहिचान गरियो')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">
                        {language === 'en' ? diseaseResult.disease : diseaseResult.diseaseNepali}
                      </h3>
                      <div className="text-right">
                        <Badge className={getSeverityColor(diseaseResult.severity)}>
                          {t(diseaseResult.severity, diseaseResult.severity === 'low' ? 'कम' : diseaseResult.severity === 'medium' ? 'मध्यम' : 'उच्च')}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-1">
                          {diseaseResult.confidence}% {t('confidence', 'विश्वसनीयता')}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{t('Affected Area', 'प्रभावित क्षेत्र')}</p>
                        <p className="font-bold text-orange-600">{diseaseResult.affectedArea}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('Est. Loss', 'अनुमानित हानि')}</p>
                        <p className="font-bold text-red-600">{diseaseResult.estimatedLoss}%</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">{t('Symptoms', 'लक्षणहरू')}</h4>
                        <ul className="text-xs space-y-1">
                          {(language === 'en' ? diseaseResult.symptoms : diseaseResult.symptomsNepali).map((symptom, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{symptom}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">{t('Treatment', 'उपचार')}</h4>
                        <ul className="text-xs space-y-1">
                          {(language === 'en' ? diseaseResult.treatment : diseaseResult.treatmentNepali).map((treatment, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span>{treatment}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">{t('Prevention', 'रोकथाम')}</h4>
                        <ul className="text-xs space-y-1">
                          {(language === 'en' ? diseaseResult.prevention : diseaseResult.preventionNepali).map((prevention, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{prevention}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pest" className="p-4 space-y-4">
              {/* Pest Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bug className="h-5 w-5 text-red-600" />
                    {t('Pest Identification', 'कीरा पहिचान')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!uploadedImage ? (
                    <div className="text-center py-8">
                      <Bug className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600">
                        {t('Upload an image to identify pests', 'कीराहरू पहिचान गर्न छवि अपलोड गर्नुहोस्')}
                      </p>
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-3"
                        variant="outline"
                      >
                        {t('Upload Photo', 'फोटो अपलोड गर्नुहोस्')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <img 
                        src={uploadedImage} 
                        alt="Pest" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button 
                        onClick={analyzePest}
                        disabled={isAnalyzing}
                        className="w-full"
                        variant="outline"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            {t('Identifying...', 'पहिचान गर्दै...')}
                          </>
                        ) : (
                          <>
                            <Bug className="h-4 w-4 mr-2" />
                            {t('Identify Pest', 'कीरा पहिचान गर्नुहोस्')}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pest Results */}
              {pestResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bug className="h-5 w-5 text-red-600" />
                      {t('Pest Identified', 'कीरा पहिचान गरियो')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">
                        {language === 'en' ? pestResult.pest : pestResult.pestNepali}
                      </h3>
                      <Badge className={getSeverityColor(pestResult.riskLevel)}>
                        {t(pestResult.riskLevel, pestResult.riskLevel === 'low' ? 'कम' : pestResult.riskLevel === 'medium' ? 'मध्यम' : 'उच्च')} {t('risk', 'जोखिम')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{t('Confidence', 'विश्वसनीयता')}</p>
                        <p className="font-bold text-emerald-600">{pestResult.confidence}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('Lifecycle', 'जीवनचक्र')}</p>
                        <p className="font-bold">{pestResult.lifecycle}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">{t('Damage', 'क्षति')}</h4>
                        <ul className="text-xs space-y-1">
                          {(language === 'en' ? pestResult.damage : pestResult.damageNepali).map((damage, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{damage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">{t('Treatment', 'उपचार')}</h4>
                        <ul className="text-xs space-y-1">
                          {(language === 'en' ? pestResult.treatment : pestResult.treatmentNepali).map((treatment, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span>{treatment}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">{t('Biological Control', 'जैविक नियन्त्रण')}</h4>
                        <ul className="text-xs space-y-1">
                          {(language === 'en' ? pestResult.biologicalControl : pestResult.biologicalControlNepali).map((control, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Leaf className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{control}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="rotation" className="p-4 space-y-4">
              {/* Crop Rotation Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    {t('AI Crop Rotation Plan', 'AI बाली फेरबदल योजना')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{cropRotationPlan.season}</h3>
                      <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tomato">{t('Tomato', 'गोलभेडा')}</SelectItem>
                          <SelectItem value="potato">{t('Potato', 'आलु')}</SelectItem>
                          <SelectItem value="cabbage">{t('Cabbage', 'बन्दाकोपी')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {cropRotationPlan.crops.map((crop, index) => (
                      <Card key={index} className="bg-gray-50 dark:bg-gray-800">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">
                              {language === 'en' ? crop.name : crop.nameNepali}
                            </h4>
                            <Badge variant="secondary">{crop.duration} {t('days', 'दिन')}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <p className="text-gray-600">{t('Yield', 'उत्पादन')}</p>
                              <p className="font-medium">{crop.yield} {t('tons', 'टन')}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">{t('Profit', 'नाफा')}</p>
                              <p className="font-medium text-emerald-600">{formatCurrency(crop.profit)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">{t('Soil Benefit', 'माटो फाइदा')}</p>
                              <p className="font-medium text-xs">
                                {language === 'en' ? crop.soilBenefit : crop.soilBenefitNepali}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-2 text-emerald-800 dark:text-emerald-400">
                        {t('Rotation Benefits', 'फेरबदल फाइदाहरू')}
                      </h4>
                      <ul className="text-xs space-y-1">
                        {(language === 'en' ? cropRotationPlan.benefits : cropRotationPlan.benefitsNepali).map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2 text-emerald-700 dark:text-emerald-300">
                            <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="yield" className="p-4 space-y-4">
              {/* Yield Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    {t('Yield Prediction', 'उत्पादन पूर्वानुमान')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-emerald-600">
                        {yieldPrediction.currentSeason.predicted} {t('tons/hectare', 'टन/हेक्टर')}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {yieldPrediction.currentSeason.confidence}% {t('confidence', 'विश्वसनीयता')}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">{t('Key Factors', 'मुख्य कारकहरू')}</h4>
                      <ul className="text-xs space-y-1">
                        {(language === 'en' ? yieldPrediction.currentSeason.factors : yieldPrediction.currentSeason.factorsNepali).map((factor, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Optimization Recommendations */}
              <Card className="bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-900/20 dark:to-orange-900/20">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    {t('Optimization Potential', 'अनुकूलन सम्भावना')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{t('Potential Yield', 'सम्भावित उत्पादन')}</p>
                        <p className="text-xl font-bold text-orange-600">
                          {yieldPrediction.optimization.potential} {t('tons/hectare', 'टन/हेक्टर')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{t('Investment', 'लगानी')}</p>
                        <p className="font-bold">{formatCurrency(yieldPrediction.optimization.investment)}</p>
                        <p className="text-xs text-emerald-600">{yieldPrediction.optimization.roi}% ROI</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">{t('Recommended Improvements', 'सिफारिस गरिएका सुधारहरू')}</h4>
                      <ul className="text-xs space-y-1">
                        {(language === 'en' ? yieldPrediction.optimization.improvements : yieldPrediction.optimization.improvementsNepali).map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Zap className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm font-medium">{t('Potential Increase', 'सम्भावित वृद्धि')}</span>
                      <span className="text-lg font-bold text-emerald-600">
                        +{((yieldPrediction.optimization.potential - yieldPrediction.currentSeason.predicted) / yieldPrediction.currentSeason.predicted * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Educational Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    {t('Learning Resources', 'सिकाइ स्रोतहरू')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      {t('Watch: Advanced Tomato Farming', 'हेर्नुहोस्: उन्नत टमाटर खेती')}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {t('Read: Disease Prevention Guide', 'पढ्नुहोस्: रोग रोकथाम गाइड')}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="h-4 w-4 mr-2" />
                      {t('Quiz: Test Your Knowledge', 'प्रश्नोत्तर: आफ्नो ज्ञान परीक्षण गर्नुहोस्')}
                    </Button>
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