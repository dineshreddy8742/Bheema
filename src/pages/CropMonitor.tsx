import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Thermometer, Droplets, Wind, Sun, Lightbulb, Leaf, CloudRain, Waves } from 'lucide-react';

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

  const fetchSensorData = async () => {
    try {
      const response = await fetch('https://render-syo4.onrender.com/sensordata');
      const data = await response.json();
      setSensorData(data);
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

  const renderContent = () => {
    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={["visible", "shake"]}
          variants={{
            visible: { opacity: 1, y: 0 },
            shake: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4, repeat: 0 } }
          }}
          className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-background rounded-lg shadow-lg p-6 border-2 border-destructive"
        >
          <AlertCircle className="h-16 w-16 text-destructive animate-bounce" />
          <h2 className="text-2xl font-bold text-destructive">Error Fetching Data</h2>
          <p className="text-muted-foreground text-center max-w-md text-lg">{error}</p>
          <Button onClick={fetchSensorData} variant="outline" className="mt-4 animate-pulse">
            <RefreshCw className="h-5 w-5 mr-2" />
            Retry
          </Button>
        </motion.div>
      );
    }

    if (!sensorData) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-card-foreground">
                <CardHeader className="pb-3">
                  <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", repeatType: "reverse" }}
                    className="h-6 w-6 bg-muted rounded mb-2"
                  ></motion.div>
                  <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", repeatType: "reverse", delay: 0.1 }}
                    className="h-4 w-24 bg-muted rounded"
                  ></motion.div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", repeatType: "reverse", delay: 0.2 }}
                      className="h-8 w-16 bg-muted rounded mx-auto"
                    ></motion.div>
                    <motion.div
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", repeatType: "reverse", delay: 0.3 }}
                      className="h-6 w-20 bg-muted rounded mx-auto"
                    ></motion.div>
                    <motion.div
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", repeatType: "reverse", delay: 0.4 }}
                      className="h-2 w-full bg-muted rounded"
                    ></motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      );
    }

    const cardVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    };

    const textVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card className="h-full bg-gradient-to-br from-red-100 to-red-200 border-red-300 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-700">
                <Thermometer className="h-6 w-6 animate-pulse" />
                <motion.span variants={textVariants}>Temperature</motion.span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.p variants={textVariants} className="text-3xl font-extrabold text-red-800">
                {sensorData.temperature}°C
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card className="h-full bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700">
                <CloudRain className="h-6 w-6 animate-pulse" />
                <motion.span variants={textVariants}>Humidity</motion.span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.p variants={textVariants} className="text-3xl font-extrabold text-blue-800">
                {sensorData.humidity}%
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card className="h-full bg-gradient-to-br from-green-100 to-green-200 border-green-300 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <Leaf className="h-6 w-6" />
                <motion.span variants={textVariants}>Moisture</motion.span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.p variants={textVariants} className="text-3xl font-extrabold text-green-800">
                {sensorData.moisture}%
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card className="h-full bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-700">
                <Lightbulb className="h-6 w-6" />
                <motion.span variants={textVariants}>Light</motion.span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.p variants={textVariants} className="text-3xl font-extrabold text-yellow-800">
                {sensorData.light} lux
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <Layout>
      <div className="space-y-8 p-4 md:p-8 bg-gray-50 rounded-xl shadow-inner">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-5xl font-extrabold text-green-800 mb-4 tracking-tight leading-tight">
            <span className="inline-block animate-pulse">🌾</span> Crop Monitor
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Real-time insights for optimal crop health and yield.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          {renderContent()}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="mt-8"
        >
          <Card className="bg-white shadow-lg rounded-xl p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                <Waves className="h-6 w-6 mr-2 text-blue-500" /> Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <ul className="space-y-3">
                  {notifications.map((notification, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200"
                    >
                      <AlertCircle className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0" />
                      {notification}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent notifications.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CropMonitor;
