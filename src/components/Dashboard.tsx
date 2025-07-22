import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const sensorData = [
    {
      label: 'Temperature',
      value: '28°C',
      icon: Thermometer,
      status: 'good',
      description: 'Optimal for crops'
    },
    {
      label: 'Soil Moisture',
      value: '45%',
      icon: Droplets,
      status: 'warning',
      description: 'Needs irrigation'
    },
    {
      label: 'Sunlight',
      value: '8.5 hrs',
      icon: Sun,
      status: 'good',
      description: 'Excellent exposure'
    },
    {
      label: 'Wind Speed',
      value: '12 km/h',
      icon: Wind,
      status: 'good',
      description: 'Light breeze'
    }
  ];

  const marketData = [
    {
      crop: 'Tomato',
      price: '₹45/kg',
      change: '+12%',
      trend: 'up'
    },
    {
      crop: 'Onion',
      price: '₹32/kg',
      change: '-8%',
      trend: 'down'
    },
    {
      crop: 'Potato',
      price: '₹28/kg',
      change: '+5%',
      trend: 'up'
    }
  ];

  const alerts = [
    {
      type: 'warning',
      title: 'Low Soil Moisture',
      description: 'Field 2 requires irrigation within 24 hours',
      time: '2 hours ago'
    },
    {
      type: 'info',
      title: 'Weather Forecast',
      description: 'Light rain expected tomorrow afternoon',
      time: '4 hours ago'
    },
    {
      type: 'success',
      title: 'Harvest Ready',
      description: 'Wheat crop in Field 1 is ready for harvest',
      time: '6 hours ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-8"
      >
        <h1 className="text-hero text-primary font-indian mb-4">
          ನಮಸ್ಕಾರ, ಕಿಸಾನ್! 
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome to your Digital Farming Assistant
        </p>
        <p className="text-sm text-secondary mt-2">
          Monitor your crops • Get AI insights • Maximize your harvest
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { title: 'Crop Monitor', emoji: '🌾', color: 'bg-primary' },
          { title: 'Disease Check', emoji: '🦠', color: 'bg-secondary' },
          { title: 'Market Price', emoji: '📈', color: 'bg-accent' },
          { title: 'Gov Schemes', emoji: '🏛️', color: 'bg-farm-leaf' }
        ].map((action, index) => (
          <motion.div
            key={action.title}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
          >
            <Card className="text-center p-4 hover:shadow-glow transition-all">
              <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-2 text-white text-xl`}>
                {action.emoji}
              </div>
              <p className="text-sm font-medium">{action.title}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Sensor Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-section-title text-primary mb-4 font-indian">
          🌾 Crop Health Monitor
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sensorData.map((sensor, index) => {
            const Icon = sensor.icon;
            return (
              <motion.div
                key={sensor.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-soft transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Icon className={`h-5 w-5 ${
                        sensor.status === 'good' ? 'text-green-500' :
                        sensor.status === 'warning' ? 'text-orange-500' :
                        'text-red-500'
                      }`} />
                      {sensor.status === 'good' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <CardTitle className="text-sm text-muted-foreground">
                      {sensor.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {sensor.value}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {sensor.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Market Prices & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Prices */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-card-title text-primary font-indian">
                📈 Today's Market Prices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {marketData.map((item, index) => (
                <motion.div
                  key={item.crop}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="flex items-center justify-between p-3 bg-accent/5 rounded-lg hover:bg-accent/10 transition-colors"
                >
                  <div>
                    <p className="font-medium">{item.crop}</p>
                    <p className="text-sm text-muted-foreground">
                      Current Price
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{item.price}</p>
                    <div className="flex items-center space-x-1">
                      {item.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm ${
                        item.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              <Button className="w-full mt-4 bg-accent hover:bg-accent/90">
                View All Prices
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-card-title text-primary font-indian">
                🔔 Farm Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'warning' ? 'bg-orange-50 border-orange-400' :
                    alert.type === 'success' ? 'bg-green-50 border-green-400' :
                    'bg-blue-50 border-blue-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.description}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {alert.time}
                    </span>
                  </div>
                </motion.div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                View All Alerts
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};