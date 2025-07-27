import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Snowflake, 
  Thermometer, 
  Apple, 
  Carrot, 
  DollarSign,
  Clock,
  TrendingUp,
  Warehouse,
  CheckCircle,
  Phone,
  MapPin,
  Calendar
} from "lucide-react";

const ColdStorage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  };

  const benefits = [
    {
      icon: Clock,
      title: "Longer Shelf Life",
      description: "Store produce for weeks without damage",
      color: "text-blue-600"
    },
    {
      icon: DollarSign,
      title: "Better Market Prices",
      description: "Sell when rates are high, not immediately",
      color: "text-green-600"
    },
    {
      icon: TrendingUp,
      title: "Reduce Post-Harvest Loss",
      description: "Prevent 30–40% crop wastage",
      color: "text-purple-600"
    },
    {
      icon: Warehouse,
      title: "Direct Supply to Markets",
      description: "Fulfill bulk orders from cities, shops",
      color: "text-orange-600"
    }
  ];

  const storageTypes = [
    {
      type: "Mini Cold Rooms",
      details: "For small-scale farmers, solar-powered options",
      icon: Snowflake
    },
    {
      type: "Controlled Atmosphere",
      details: "Advanced control of humidity, gases, and temperature",
      icon: Thermometer
    },
    {
      type: "Ripening Chambers",
      details: "Ideal for mangoes, bananas, and other climacteric fruits",
      icon: Apple
    }
  ];

  const supportSchemes = [
    "NHB Subsidy (up to 50% for cold storage setup)",
    "PM Kisan Sampada Yojana",
    "State-level storage rent support"
  ];

  const steps = [
    "Register your farm and produce type",
    "Get assigned to a nearby cold storage facility", 
    "Pay only for the time and space you use",
    "Track your stored items with SMS alerts and digital receipts"
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-r from-green-200 via-blue-100 to-purple-100">
        {/* Header Section */}
        <motion.div 
          className="text-center py-16 px-4"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Snowflake className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
              Cold Storage Access
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 mb-2">
            🧺 Preserve Freshness. Reduce Waste. Increase Profits.
          </p>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            With modern cold storage facilities, farmers can now store their vegetables, fruits, and perishables safely for extended periods. This ensures better prices, less spoilage, and year-round market availability.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 pb-16 space-y-12">
          {/* What is Cold Storage */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white shadow-xl rounded-2xl p-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-green-600 flex items-center gap-2">
                  <span className="text-2xl">🟢</span> What is Cold Storage?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Cold storage is a temperature-controlled facility used to store perishable produce like:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <Carrot className="h-6 w-6 text-green-600" />
                    <span>🥦 Vegetables (tomatoes, potatoes, onions)</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                    <Apple className="h-6 w-6 text-red-600" />
                    <span>🍎 Fruits (mangoes, bananas, grapes)</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                    <span className="text-2xl">🌶️</span>
                    <span>Chillies, herbs, leafy greens</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-4">
                  It maintains freshness, prevents rot, and allows selling at the right time for better income.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Why Farmers Need Cold Storage */}
          <motion.div
            variants={slideInLeft}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white shadow-xl rounded-2xl p-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-yellow-600 flex items-center gap-2">
                  <span className="text-2xl">🟡</span> Why Farmers Need Cold Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <benefit.icon className={`h-8 w-8 ${benefit.color} flex-shrink-0`} />
                      <div>
                        <h3 className="font-semibold text-gray-800">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Types of Cold Storage */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-white shadow-xl rounded-2xl p-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-600 flex items-center gap-2">
                  <span className="text-2xl">🟣</span> Types of Cold Storage Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {storageTypes.map((storage, index) => (
                    <motion.div
                      key={index}
                      className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <storage.icon className="h-12 w-12 text-blue-600 mb-4" />
                      <h3 className="font-bold text-gray-800 mb-2">{storage.type}</h3>
                      <p className="text-gray-600">{storage.details}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* How to Get Access */}
          <motion.div
            variants={slideInLeft}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-white shadow-xl rounded-2xl p-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                  <Snowflake className="h-8 w-8" /> How to Get Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    {steps.map((step, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                      >
                        <Badge variant="default" className="min-w-fit">
                          {index + 1}
                        </Badge>
                        <p className="text-gray-700">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center">
                    <motion.div
                      className="text-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 text-lg">
                        Register for Cold Storage
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Government Support */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 1.0 }}
          >
            <Card className="bg-white shadow-xl rounded-2xl p-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-green-600 flex items-center gap-2">
                  <span className="text-2xl">💼</span> Government Support & Schemes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {supportSchemes.map((scheme, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                    >
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <span className="text-gray-700">{scheme}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-gray-700">
                    <strong>Contact Information:</strong> Reach out to your Agricultural Officer or nearby FPO to register for cold storage access.
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Helpline Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Local Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-600">24/7 Service</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ColdStorage;