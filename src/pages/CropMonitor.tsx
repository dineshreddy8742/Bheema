import React, { useState, useEffect } from 'react';
import { motion, Variants, Transition } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Thermometer, Droplets, Wind, Sun, Lightbulb, Leaf, CloudRain, Waves, CheckCircle } from 'lucide-react';

interface SensorData {
  temperature: number;
  humidity: number;
  moisture: number;
  light: number;
}

const CropMonitor = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSensorData = async () => {
    try {
      const response = await fetch('https://render-syo4.onrender.com/sensordata');
      const data = await response.json();
      setSensorData(data);
      setLastUpdated(new Date());
      // Dummy notification generation for now
      if (data.temperature > 30) {
        setNotifications(prev => ["High temperature detected!", ...prev].slice(0, 5));
      }
      if (data.moisture < 20) {
        setNotifications(prev => ["Low moisture detected! Consider irrigation.", ...prev].slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching sensor data:', err);
      setError('Failed to fetch sensor data. Please try again.');
    }
  };

  useEffect(() => {
    fetchSensorData(); // initial fetch
    const interval = setInterval(fetchSensorData, 5000); // fetch every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const getSensorStatus = (type: keyof SensorData, value: number) => {
    switch (type) {
      case 'temperature':
        return value >= 20 && value <= 30 ? 'ideal' : value < 20 || value > 35 ? 'critical' : 'warning';
      case 'humidity':
        return value >= 60 && value <= 80 ? 'ideal' : value < 50 || value > 90 ? 'critical' : 'warning';
      case 'moisture':
        return value >= 40 && value <= 60 ? 'ideal' : value < 30 || value > 70 ? 'critical' : 'warning';
      default:
        return 'unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ideal':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          className="flex flex-col items-center justify-center min-h-[400px] space-y-6 bg-gradient-to-br from-red-50 to-red-100 rounded-3xl shadow-2xl p-8 border-4 border-red-300"
        >
          <AlertCircle className="h-24 w-24 text-red-500 animate-pulse-slow" />
          <h2 className="text-4xl font-extrabold text-red-700 text-center">Error Fetching Data</h2>
          <p className="text-xl text-red-600 text-center max-w-lg leading-relaxed">{error}</p>
          <Button
            onClick={fetchSensorData}
            variant="destructive"
            className="mt-6 text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <RefreshCw className="h-6 w-6 mr-3 animate-spin-slow" />
            Retry Data Fetch
          </Button>
        </motion.div>
      );
    }

    if (!sensorData) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.15, duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <Card className="h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-xl overflow-hidden animate-pulse-fast">
                <CardHeader className="pb-4 flex flex-col items-center justify-center h-32">
                  <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", repeatType: "reverse" }}
                    className="h-16 w-16 bg-gray-300 rounded-full mb-4"
                  ></motion.div>
                  <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", repeatType: "reverse", delay: 0.1 }}
                    className="h-6 w-3/4 bg-gray-300 rounded-md"
                  ></motion.div>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-32">
                  <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", repeatType: "reverse", delay: 0.2 }}
                    className="h-12 w-1/2 bg-gray-300 rounded-md mb-2"
                  ></motion.div>
                  <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", repeatType: "reverse", delay: 0.3 }}
                    className="h-8 w-2/3 bg-gray-300 rounded-md"
                  ></motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      );
    }

    const springTransition: Transition = { type: "spring", stiffness: 100, damping: 10 };

    const cardVariants: Variants = {
      hidden: { y: 50, opacity: 0, scale: 0.8 },
      visible: { y: 0, opacity: 1, scale: 1, transition: springTransition },
    };

    const valueVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
    };

    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.div variants={cardVariants} whileHover={{ scale: 1.03, rotate: 1 }} whileTap={{ scale: 0.98 }}>
          <Card className="h-full bg-gradient-to-br from-red-500 to-red-700 text-white rounded-3xl shadow-2xl transition-all duration-300 ease-in-out hover:shadow-red-400/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-2xl font-bold">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  <Thermometer className="h-10 w-10" />
                </motion.div>
                <span>Temperature</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.p variants={valueVariants} className="text-5xl font-extrabold">
                {sensorData.temperature}°C
              </motion.p>
              <p className="text-lg opacity-80 mt-2">Ideal: 20-30°C</p>
              <div className={`h-2 w-full rounded-full mt-4 ${getStatusColor(getSensorStatus('temperature', sensorData.temperature))}`} />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants} whileHover={{ scale: 1.03, rotate: -1 }} whileTap={{ scale: 0.98 }}>
          <Card className="h-full bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-3xl shadow-2xl transition-all duration-300 ease-in-out hover:shadow-blue-400/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-2xl font-bold">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  <Droplets className="h-10 w-10" />
                </motion.div>
                <span>Humidity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.p variants={valueVariants} className="text-5xl font-extrabold">
                {sensorData.humidity}%
              </motion.p>
              <p className="text-lg opacity-80 mt-2">Ideal: 60-80%</p>
              <div className={`h-2 w-full rounded-full mt-4 ${getStatusColor(getSensorStatus('humidity', sensorData.humidity))}`} />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants} whileHover={{ scale: 1.03, rotate: 1 }} whileTap={{ scale: 0.98 }}>
          <Card className="h-full bg-gradient-to-br from-green-500 to-green-700 text-white rounded-3xl shadow-2xl transition-all duration-300 ease-in-out hover:shadow-green-400/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-2xl font-bold">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  <Leaf className="h-10 w-10" />
                </motion.div>
                <span>Moisture</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.p variants={valueVariants} className="text-5xl font-extrabold">
                {sensorData.moisture}%
              </motion.p>
              <p className="text-lg opacity-80 mt-2">Ideal: 40-60%</p>
              <div className={`h-2 w-full rounded-full mt-4 ${getStatusColor(getSensorStatus('moisture', sensorData.moisture))}`} />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants} whileHover={{ scale: 1.03, rotate: -1 }} whileTap={{ scale: 0.98 }}>
          <Card className="h-full bg-gradient-to-br from-yellow-500 to-yellow-700 text-white rounded-3xl shadow-2xl transition-all duration-300 ease-in-out hover:shadow-yellow-400/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-2xl font-bold">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  <Sun className="h-10 w-10" />
                </motion.div>
                <span>Light</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.p variants={valueVariants} className="text-5xl font-extrabold">
                {sensorData.light} lux
              </motion.p>
              <p className="text-lg opacity-80 mt-2">Ideal: 5000-10000 lux</p>
              <div className={`h-2 w-full rounded-full mt-4 ${getStatusColor(getSensorStatus('light', sensorData.light))}`} />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <Layout>
      <div className="space-y-10 p-4 md:p-8 lg:p-12 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <h1 className="text-6xl font-extrabold text-green-700 mb-4 tracking-tight leading-tight drop-shadow-md">
            <span className="inline-block animate-pulse mr-3 text-7xl">🌱</span> Crop Monitor
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto">
            Real-time environmental insights for thriving crops and sustainable farming.
          </p>
          {lastUpdated && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-sm text-gray-500 mt-4"
            >
              Last updated: {lastUpdated.toLocaleTimeString()} on {lastUpdated.toLocaleDateString()}
            </motion.p>
          )}
        </motion.div>

        {/* Main Content - Sensor Data or Error/Loading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          {renderContent()}
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="mt-12"
        >
          <Card className="bg-white shadow-2xl rounded-3xl p-6 border border-gray-100 transform hover:scale-[1.005] transition-transform duration-300">
            <CardHeader className="pb-4 border-b border-gray-100 mb-4">
              <CardTitle className="text-3xl font-bold text-gray-800 flex items-center">
                <Waves className="h-8 w-8 mr-3 text-blue-600 animate-wave" /> Recent Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <ul className="space-y-4">
                  {notifications.map((notification, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
                      className="flex items-center text-gray-700 bg-yellow-50 p-4 rounded-xl border border-yellow-200 shadow-sm"
                    >
                      <AlertCircle className="h-6 w-6 mr-3 text-yellow-600 flex-shrink-0 animate-bounce-slow" />
                      <p className="text-lg font-medium">{notification}</p>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-8 text-lg font-medium">
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  All systems nominal. No recent notifications.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CropMonitor;