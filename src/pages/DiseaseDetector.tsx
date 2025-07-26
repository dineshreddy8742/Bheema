import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Image as ImageIcon, UploadCloud, XCircle, Camera as CameraIcon } from 'lucide-react';

const DiseaseDetector: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleCameraOpen = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (error: any) {
      console.error("Error accessing camera:", error);
      setCameraError(error.name === 'NotAllowedError' ? 'Camera access denied. Please allow camera permissions in your browser settings.' : 'Could not access camera. Please ensure you have a camera connected.');
      alert("Could not access camera. Please ensure you have a camera and have granted permissions.");
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured_image.png", { type: "image/png" });
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            handleCameraClose(); // Close camera after capturing
          }
        }, 'image/png');
      }
    }
  };

  const handleCameraClose = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('Please upload an image file (e.g., JPG, PNG, GIF).');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.gif'],
    },
    multiple: false,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('Please upload an image file (e.g., JPG, PNG, GIF).');
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleSubmit = () => {
    if (selectedImage) {
      console.log('Submitting image:', selectedImage.name);
      // Here you would typically send the image to a backend service
      // For now, we'll just log it.
      alert('Image submitted! (Check console for details)');
    } else {
      alert('Please select an image first.');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Upload Image for Disease Detection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-primary">Drop the image here ...</p>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <UploadCloud className="h-12 w-12 text-gray-400" />
                  <p className="text-gray-600">Drag 'n' drop an image here, or click to select one</p>
                  <p className="text-sm text-gray-500">(JPG, PNG, GIF)</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center space-x-2">
              <span className="text-gray-500">OR</span>
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
              <Label htmlFor="picture" className="sr-only">Picture</Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-foreground file:text-primary
                  hover:file:bg-primary/90 hover:file:text-white"
              />
            </div>

            <div className="flex items-center justify-center space-x-2">
              <span className="text-gray-500">OR</span>
            </div>

            <Button
              onClick={handleCameraOpen}
              className="w-full py-2 text-lg"
            >
              <CameraIcon className="mr-2 h-5 w-5" />
              Take Photo
            </Button>

            {cameraError && (
              <p className="text-red-500 text-center text-sm">{cameraError}</p>
            )}

            {isCameraOpen && (
              <div className="relative mt-6 p-4 border rounded-lg flex flex-col items-center">
                <video ref={videoRef} autoPlay playsInline className="w-full max-w-md h-64 object-cover rounded-md"></video>
                <Button
                  onClick={handleCapturePhoto}
                  className="mt-4 w-full py-2 text-lg"
                >
                  <CameraIcon className="mr-2 h-5 w-5" />
                  Capture Photo
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={handleCameraClose}
                >
                  <XCircle className="h-6 w-6" />
                </Button>
              </div>
            )
            }

            {previewUrl && (
              <div className="relative mt-6 p-4 border rounded-lg flex flex-col items-center">
                <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded-md max-h-64 object-contain" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={handleRemoveImage}
                >
                  <XCircle className="h-6 w-6" />
                </Button>
                <p className="mt-2 text-sm text-gray-600">{selectedImage?.name}</p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full py-2 text-lg"
              disabled={!selectedImage}
            >
              <ImageIcon className="mr-2 h-5 w-5" />
              Analyze Image
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DiseaseDetector;
