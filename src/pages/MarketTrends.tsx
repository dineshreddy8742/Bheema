import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Mic,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  MapPin
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const MarketTrends = () => {
  const { translateSync } = useLanguage();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  const marketData = [
    {
      crop: 'Tomato',
      currentPrice: 45,
      previousPrice: 40,
      unit: 'kg',
      change: 12.5,
      trend: 'up',
      market: 'Bangalore APMC',
      forecast: 'Expected to rise by 8% this week'
    },
    {
      crop: 'Onion',
      currentPrice: 32,
      previousPrice: 35,
      unit: 'kg',
      change: -8.6,
      trend: 'down',
      market: 'Mysore Market',
      forecast: 'Seasonal dip, recovery expected next month'
    },
    {
      crop: 'Potato',
      currentPrice: 28,
      previousPrice: 27,
      unit: 'kg',
      change: 3.7,
      trend: 'up',
      market: 'Hassan Market',
      forecast: 'Stable prices expected'
    },
    {
      crop: 'Rice',
      currentPrice: 52,
      previousPrice: 53,
      unit: 'kg',
      change: -1.9,
      trend: 'down',
      market: 'Mandya APMC',
      forecast: 'Minor fluctuation, overall stable'
    },
    {
      crop: 'Wheat',
      currentPrice: 38,
      previousPrice: 36,
      unit: 'kg',
      change: 5.6,
      trend: 'up',
      market: 'Belgaum Market',
      forecast: 'Strong demand driving prices up'
    },
    {
      crop: 'Sugarcane',
      currentPrice: 3500,
      previousPrice: 3400,
      unit: 'ton',
      change: 2.9,
      trend: 'up',
      market: 'Mandya Sugar Mill',
      forecast: 'Processing season boost'
    }
  ];

  const handleVoiceQuery = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setQuery('What is the price of tomatoes today?');
      setIsListening(false);
      setSelectedCrop('Tomato');
    }, 2000);
  };

  const handleCropSelect = (crop: string) => {
    setSelectedCrop(crop);
    setQuery(`${crop} price information`);
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
            📈 {translateSync('Market Trends')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {translateSync('Real-time market prices and trends')}
          </p>
        </motion.div>

        {/* Voice Query Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mic className="h-5 w-5 text-primary" />
                <span>{translateSync('Ask About Prices')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={translateSync("Ask: What is tomato price today?")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={handleVoiceQuery}
                  disabled={isListening}
                  className={`voice-button h-auto px-4 ${isListening ? 'animate-pulse-soft' : ''}`}
                >
                  {isListening ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <Mic className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Quick Query Buttons */}
              <div className="flex flex-wrap gap-2">
                {['Tomato', 'Onion', 'Rice', 'Wheat'].map((crop) => (
                  <Button
                    key={crop}
                    variant="outline"
                    size="sm"
                    onClick={() => handleCropSelect(crop)}
                    className="text-xs"
                  >
                    {crop} Price
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Selected Crop Details */}
        <AnimatePresence>
          {selectedCrop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border-accent shadow-glow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedCrop} {translateSync('Price Analysis')}</span>
                    <Badge variant="secondary" className="text-accent">
                      {translateSync('Live Data')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const crop = marketData.find(c => c.crop === selectedCrop);
                    if (!crop) return null;
                    
                    return (
                      <div className="space-y-6">
                        {/* Current Price */}
                        <div className="text-center">
                          <div className="text-4xl font-bold text-primary mb-2">
                            ₹{crop.currentPrice}
                            <span className="text-lg text-muted-foreground">/{crop.unit}</span>
                          </div>
                          <div className="flex items-center justify-center space-x-2">
                            {crop.trend === 'up' ? (
                              <ArrowUpRight className="h-5 w-5 text-green-500" />
                            ) : (
                              <ArrowDownRight className="h-5 w-5 text-red-500" />
                            )}
                            <span className={`font-medium ${
                              crop.trend === 'up' ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {crop.change > 0 ? '+' : ''}{crop.change}%
                            </span>
                            <span className="text-sm text-muted-foreground">
                              vs last week
                            </span>
                          </div>
                        </div>

                        {/* Market Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{translateSync('Market')}:</span>
                              <span>{crop.market}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{translateSync('Updated')}:</span>
                              <span>2 hours ago</span>
                            </div>
                          </div>
                          <div className="p-3 bg-accent/10 rounded-lg">
                            <h4 className="font-medium text-sm mb-1">{translateSync('AI Forecast')}</h4>
                            <p className="text-sm text-muted-foreground">
                              {crop.forecast}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Market Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {marketData.map((item, index) => (
            <motion.div
              key={item.crop}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => setSelectedCrop(item.crop)}
            >
              <Card className={`hover:shadow-soft transition-all ${
                selectedCrop === item.crop ? 'ring-2 ring-accent' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.crop}</CardTitle>
                    {item.trend === 'up' ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        ₹{item.currentPrice}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        per {item.unit}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        item.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {item.change > 0 ? '+' : ''}{item.change}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        change
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-1">
                      {item.market}
                    </div>
                    <div className="text-xs text-primary">
                      Previous: ₹{item.previousPrice}/{item.unit}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Market Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{translateSync('Market Insights')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-3 bg-green-50 border-l-4 border-green-400 rounded"
                >
                  <h4 className="font-medium text-green-800">{translateSync('Best Time to Sell')}</h4>
                  <p className="text-sm text-green-700 mt-1">
                    {translateSync('Tomato prices are trending upward. Consider selling within the next 2-3 days for maximum profit.')}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded"
                >
                  <h4 className="font-medium text-blue-800">{translateSync('Seasonal Trend')}</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {translateSync('Rice prices typically stabilize during this period. Good time for long-term planning.')}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded"
                >
                  <h4 className="font-medium text-orange-800">{translateSync('Weather Impact')}</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    {translateSync('Expected rainfall may affect onion prices. Monitor closely for the next week.')}
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

export default MarketTrends;