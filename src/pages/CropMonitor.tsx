import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSensor } from '@/hooks/useSensor';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind,
  Gauge,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

const CropMonitor = () => {
  const { sensorData, loading, error, refetch } = useSensor();
  const { translate, translateSync, currentLanguage } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});

  // Translate static texts when language changes
  useEffect(() => {
    const translateStaticTexts = async () => {
      if (currentLanguage.code === 'en') {
        setTranslatedTexts({});
        return;
      }

      const textsToTranslate = [
        'Crop Monitor',
        'Real-time crop health monitoring',
        'Weekly Sensor Trends',
        'AI Recommendations',
        'Optimal',
        'Needs Attention',
        'Optimal Range',
        'Refresh Data'
      ];

      const translated: Record<string, string> = {};
      
      for (const text of textsToTranslate) {
        try {
          translated[text] = await translate(text);
        } catch (error) {
          translated[text] = text;
        }
      }
      
      setTranslatedTexts(translated);
    };

    translateStaticTexts();
  }, [currentLanguage, translate]);

  const t = (text: string) => translatedTexts[text] || translateSync(text) || text;

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold">Sensor Connection Error</h2>
          <p className="text-muted-foreground text-center max-w-md">{error}</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressValue = (value: number, optimal: number[]) => {
    const [min, max] = optimal;
    if (value < min) return (value / min) * 50;
    if (value > max) return 50 + ((value - max) / max) * 50;
    return 50 + ((value - min) / (max - min)) * 40;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-hero text-primary font-indian mb-2">
            🌾 {t('Crop Monitor')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('Real-time crop health monitoring')}
          </p>
          <Button 
            onClick={refetch} 
            variant="outline" 
            size="sm" 
            className="mt-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('Refresh Data')}
          </Button>
        </motion.div>

        {/* Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="animate-pulse">
                      <div className="h-6 w-6 bg-muted rounded mb-2"></div>
                      <div className="h-4 w-24 bg-muted rounded"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 w-16 bg-muted rounded mx-auto"></div>
                      <div className="h-6 w-20 bg-muted rounded mx-auto"></div>
                      <div className="h-2 w-full bg-muted rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : sensorData?.sensors.map((sensor, index) => {
            const iconMap: Record<string, any> = {
              'thermometer': Thermometer,
              'droplets': Droplets,
              'sun': Sun,
              'wind': Wind
            };
            const Icon = iconMap[sensor.icon] || Gauge;
            const progressValue = getProgressValue(sensor.value, sensor.optimal);
            
            return (
              <motion.div
                key={sensor.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="hover:shadow-glow transition-all h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Icon className={`h-6 w-6 ${getStatusColor(sensor.status)}`} />
                      {sensor.status === 'good' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                      )}
                    </div>
                    <CardTitle className="text-sm text-muted-foreground">
                      {sensor.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Current Value */}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {sensor.value}
                        <span className="text-lg text-muted-foreground ml-1">
                          {sensor.unit}
                        </span>
                      </div>
                       <Badge variant={sensor.status === 'good' ? 'default' : 'destructive'} className="mt-2">
                         {sensor.status === 'good' ? t('Optimal') : t('Needs Attention')}
                       </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs text-muted-foreground">
                         <span>{sensor.optimal[0]}{sensor.unit}</span>
                         <span>{t('Optimal Range')}</span>
                         <span>{sensor.optimal[1]}{sensor.unit}</span>
                       </div>
                      <Progress 
                        value={progressValue} 
                        className="h-2"
                      />
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground text-center">
                      {sensor.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Detailed Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Weekly Trends */}
          <Card>
            <CardHeader>
               <CardTitle className="flex items-center space-x-2">
                 <Gauge className="h-5 w-5 text-primary" />
                 <span>{t('Weekly Sensor Trends')}</span>
               </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sensorData?.sensors.map((sensor, index) => (
                  <div key={sensor.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{sensor.name}</span>
                      <span className={getStatusColor(sensor.status)}>
                        {sensor.value}{sensor.unit}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          sensor.status === 'good' ? 'bg-green-500' :
                          sensor.status === 'warning' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(sensor.value / (sensor.optimal[1] * 1.2)) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
               <CardTitle className="flex items-center space-x-2">
                 <AlertCircle className="h-5 w-5 text-accent" />
                 <span>{t('AI Recommendations')}</span>
               </CardTitle>
            </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 {sensorData?.recommendations.map((recommendation, index) => (
                   <motion.div
                     key={recommendation.title}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.4 + index * 0.1 }}
                     className={`p-3 border-l-4 rounded ${
                       recommendation.severity === 'high' 
                         ? 'bg-red-50 border-red-400' 
                         : recommendation.severity === 'medium' 
                         ? 'bg-orange-50 border-orange-400' 
                         : 'bg-green-50 border-green-400'
                     }`}
                   >
                     <h4 className={`font-medium ${
                       recommendation.severity === 'high' 
                         ? 'text-red-800' 
                         : recommendation.severity === 'medium' 
                         ? 'text-orange-800' 
                         : 'text-green-800'
                     }`}>
                       {recommendation.title}
                     </h4>
                     <p className={`text-sm mt-1 ${
                       recommendation.severity === 'high' 
                         ? 'text-red-700' 
                         : recommendation.severity === 'medium' 
                         ? 'text-orange-700' 
                         : 'text-green-700'
                     }`}>
                       {recommendation.description}
                     </p>
                   </motion.div>
                 )) || (
                   <div className="text-center text-muted-foreground py-8">
                     No recommendations available. Configure your sensor API to get AI insights.
                   </div>
                 )}
               </div>
             </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CropMonitor;