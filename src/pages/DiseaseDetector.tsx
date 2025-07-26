import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Upload,
  Clipboard,
  Bug,
  CheckCircle,
  AlertTriangle,
  Loader2,
  MapPin,
  ExternalLink
} from 'lucide-react';

const DiseaseDetector = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showCamera, setShowCamera] = useState(false); // New state for camera visibility
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
        setShowCamera(false); // Hide camera if an image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setShowCamera(true); // Show the video feed
        setSelectedImage(null); // Clear any previously selected image
        setAnalysisResult(null); // Clear any previous analysis result
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert("Could not access camera. Please ensure you have granted camera permissions.");
    }
  };

  const takePhotoFromStream = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        const imageData = canvasRef.current.toDataURL('image/png');
        setSelectedImage(imageData);
        setShowCamera(false); // Hide camera after capture
        if (videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop()); // Stop stream
        }
      }
    }
  };

  const handlePasteImage = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            const blob = await clipboardItem.getType(type);
            const reader = new FileReader();
            reader.onload = (e) => {
              setSelectedImage(e.target?.result as string);
              setAnalysisResult(null);
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const analyzeImage = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult({
        disease: 'Late Blight',
        confidence: 87,
        severity: 'Moderate',
        symptoms: [
          'Brown spots on leaves',
          'Yellowing around affected areas',
          'White fungal growth on undersides'
        ],
        treatment: [
          'Remove affected leaves immediately',
          'Apply copper-based fungicide',
          'Improve air circulation',
          'Reduce watering frequency'
        ],
        prevention: [
          'Avoid overhead watering',
          'Plant disease-resistant varieties',
          'Ensure proper spacing between plants'
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
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
            🦠 Disease Detector
          </h1>
          <p className="text-lg text-muted-foreground">
            AI-powered crop disease detection
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bug className="h-5 w-5 text-primary" />
                <span>Upload Plant Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col space-y-2 hover:bg-accent/10"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 text-primary" />
                    <span>Upload Image</span>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col space-y-2 hover:bg-accent/10"
                    onClick={handleCameraCapture}
                  >
                    <Camera className="h-8 w-8 text-primary" />
                    <span>Take Photo</span>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col space-y-2 hover:bg-accent/10"
                    onClick={handlePasteImage}
                  >
                    <Clipboard className="h-8 w-8 text-primary" />
                    <span>Paste Image</span>
                  </Button>
                </motion.div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Camera Feed or Image Preview */}
              <AnimatePresence mode="wait">
                {showCamera ? (
                  <motion.div
                    key="camera-feed"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-4 text-center"
                  >
                    <video ref={videoRef} className="w-full max-w-md mx-auto rounded-lg shadow-soft" autoPlay playsInline />
                    <canvas ref={canvasRef} className="hidden" />
                    <Button
                      onClick={takePhotoFromStream}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Capture Photo
                    </Button>
                  </motion.div>
                ) : selectedImage ? (
                  <motion.div
                    key="image-preview"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt="Selected plant"
                        className="w-full max-w-md mx-auto rounded-lg shadow-soft"
                      />
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <div className="text-center text-white">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                            <p>Analyzing image...</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <Button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="bg-accent hover:bg-accent/90"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          'Analyze for Diseases'
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Disease Detection Result */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <span>Disease Detected</span>
                    </div>
                    <Badge variant="destructive">
                      {analysisResult.confidence}% Confidence
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-destructive mb-2">
                        {analysisResult.disease}
                      </h3>
                      <Badge variant="outline" className="text-orange-600">
                        Severity: {analysisResult.severity}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Symptoms */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center space-x-2">
                          <Bug className="h-4 w-4" />
                          <span>Symptoms</span>
                        </h4>
                        <ul className="space-y-1">
                          {analysisResult.symptoms.map((symptom: string, index: number) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="text-sm flex items-start space-x-2"
                            >
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                              <span>{symptom}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Treatment */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Treatment</span>
                        </h4>
                        <ul className="space-y-1">
                          {analysisResult.treatment.map((treatment: string, index: number) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (index + 3) * 0.1 }}
                              className="text-sm flex items-start space-x-2"
                            >
                              <div className="w-3 h-3 bg-accent rounded-full mt-0.5" />
                              <span>{treatment}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Prevention */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Prevention</span>
                        </h4>
                        <ul className="space-y-1">
                          {analysisResult.prevention.map((prevention: string, index: number) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (index + 6) * 0.1 }}
                              className="text-sm flex items-start space-x-2"
                            >
                              <div className="w-3 h-3 bg-primary rounded-full mt-0.5" />
                              <span>{prevention}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Local Remedy Stores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>Nearby Agricultural Stores</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Karnataka Agri Store', distance: '2.3 km', rating: 4.5 },
                      { name: 'Farmer\'s Choice', distance: '3.1 km', rating: 4.2 },
                      { name: 'Green Valley Supplies', distance: '4.7 km', rating: 4.7 }
                    ].map((store, index) => (
                      <motion.div
                        key={store.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-accent/5 rounded-lg hover:bg-accent/10 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{store.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {store.distance} away • ⭐ {store.rating}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Directions
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default DiseaseDetector;
