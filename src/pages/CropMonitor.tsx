import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind,
  Gauge,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const CropMonitor = () => {
  const sensorReadings = [
    {
      name: 'Soil Temperature',
      value: 24,
      unit: '°C',
      optimal: [18, 30],
      status: 'good',
      icon: Thermometer,
      description: 'Perfect for root development'
    },
    {
      name: 'Soil Moisture',
      value: 35,
      unit: '%',
      optimal: [40, 70],
      status: 'warning',
      icon: Droplets,
      description: 'Requires irrigation soon'
    },
    {
      name: 'Sunlight Hours',
      value: 8.5,
      unit: 'hrs',
      optimal: [6, 10],
      status: 'good',
      icon: Sun,
      description: 'Excellent photosynthesis'
    },
    {
      name: 'Wind Speed',
      value: 12,
      unit: 'km/h',
      optimal: [5, 15],
      status: 'good',
      icon: Wind,
      description: 'Good air circulation'
    }
  ];

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
            🌾 ಬೆಳೆ ಮೇಲ್ವಿಚಾರಣೆ
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time crop health monitoring
          </p>
        </motion.div>

        {/* Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {sensorReadings.map((sensor, index) => {
            const Icon = sensor.icon;
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
                        {sensor.status === 'good' ? 'Optimal' : 'Needs Attention'}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{sensor.optimal[0]}{sensor.unit}</span>
                        <span>Optimal Range</span>
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
                <span>Weekly Sensor Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sensorReadings.map((sensor, index) => (
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
                <span>AI Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded"
                >
                  <h4 className="font-medium text-orange-800">Irrigation Needed</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Soil moisture is below optimal. Recommend irrigation within next 12 hours.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-3 bg-green-50 border-l-4 border-green-400 rounded"
                >
                  <h4 className="font-medium text-green-800">Perfect Temperature</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Soil temperature is ideal for current crop growth stage.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded"
                >
                  <h4 className="font-medium text-blue-800">Weather Alert</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Light rain expected tomorrow. Adjust irrigation accordingly.
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CropMonitor;